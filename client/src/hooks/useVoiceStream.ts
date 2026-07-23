import { useCallback, useEffect, useRef } from "react";
import { useAudioPlayback } from "./useAudioPlayback";
import { getAuthHeaders } from "../lib/settings";

interface StreamCallbacks {
  workletPath?: string;
  onUserTranscript?: (text: string) => void;
  onTranscript?: (text: string, full: string) => void;
  onComplete?: (transcript: string) => void;
  onError?: (error: Error) => void;
}

type VoiceStreamEvent =
  | { type: "user_transcript"; data: string }
  | { type: "transcript"; data: string }
  | { type: "audio"; data: string }
  | { type: "error"; error: string }
  | { done: true };

type PlaybackHandle = ReturnType<typeof useAudioPlayback>;

export function useVoiceStream({ workletPath = "/audio-playback-worklet.js", ...callbacks }: StreamCallbacks) {
  const playback = useAudioPlayback(workletPath);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;
  const playbackRef = useRef<PlaybackHandle>(playback);
  playbackRef.current = playback;
  const activeRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => { activeRequestRef.current?.abort(); };
  }, []);

  const streamVoiceResponse = useCallback(async (url: string, audioBlob: Blob): Promise<void> => {
    activeRequestRef.current?.abort();
    const ac = new AbortController();
    activeRequestRef.current = ac;

    let fullTranscript = "";

    try {
      await playbackRef.current.init();
      playbackRef.current.clear();

      // Convert blob to base64
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const idx = result.indexOf(",");
          resolve(idx !== -1 ? result.slice(idx + 1) : result);
        };
        reader.onerror = () => reject(new Error("Failed to read audio blob"));
        reader.readAsDataURL(audioBlob);
      });

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream", ...getAuthHeaders() },
        body: JSON.stringify({ audio: base64Audio }),
        signal: ac.signal,
      });

      if (!response.ok) {
        throw new Error(`Voice request failed (${response.status})`);
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const blocks = buffer.split(/\n\n/);
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          const line = block.replace(/^data:\s*/, "").trim();
          if (!line) continue;
          try {
            const event: VoiceStreamEvent = JSON.parse(line);
            if ("done" in event) {
              playbackRef.current.signalComplete();
              callbacksRef.current.onComplete?.(fullTranscript);
            } else if (event.type === "user_transcript") {
              callbacksRef.current.onUserTranscript?.(event.data);
            } else if (event.type === "transcript") {
              fullTranscript += event.data;
              callbacksRef.current.onTranscript?.(event.data, fullTranscript);
            } else if (event.type === "audio") {
              playbackRef.current.pushAudio(event.data);
            } else if (event.type === "error") {
              throw new Error(event.error);
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      const err = error instanceof Error ? error : new Error(String(error));
      callbacksRef.current.onError?.(err);
    } finally {
      if (activeRequestRef.current === ac) activeRequestRef.current = null;
    }
  }, []);

  return { streamVoiceResponse, playbackState: playback.state };
}
