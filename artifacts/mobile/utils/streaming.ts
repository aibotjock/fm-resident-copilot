import { fetch } from "expo/fetch";
import type { ClinicalMode } from "@/types";

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export async function streamClinicalQuery(
  query: string,
  mode: ClinicalMode,
  condition: string | undefined,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  const baseUrl = domain ? `https://${domain}` : "";

  try {
    const response = await fetch(`${baseUrl}/api/clinical/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ query, mode, condition }),
      signal,
    });

    if (!response.ok) {
      callbacks.onError(`Server error: ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError("No response stream");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              callbacks.onChunk(data.content);
            } else if (data.done) {
              callbacks.onDone();
            } else if (data.error) {
              callbacks.onError(data.error);
            }
          } catch {
          }
        }
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") return;
    callbacks.onError("Network error. Please check your connection.");
  }
}

export function parseFlashcards(
  text: string
): Array<{ front: string; back: string }> {
  const cards: Array<{ front: string; back: string }> = [];
  const cardBlocks = text.split("---CARD---");

  for (const block of cardBlocks) {
    const frontMatch = block.match(/FRONT:\s*(.+?)(?=BACK:|---END---|$)/s);
    const backMatch = block.match(/BACK:\s*(.+?)(?=---END---|$)/s);

    if (frontMatch && backMatch) {
      cards.push({
        front: frontMatch[1].trim(),
        back: backMatch[1].trim(),
      });
    }
  }

  return cards;
}
