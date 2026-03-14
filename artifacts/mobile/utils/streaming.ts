import { fetch } from "expo/fetch";
import type { ClinicalMode, CitationMetadata } from "@/types";

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onCitation: (metadata: CitationMetadata) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

const CITE_START = "%%FM_CITE%%";
const CITE_END = "%%/FM_CITE%%";

function processCitationBuffer(
  buffer: string,
  callbacks: StreamCallbacks
): string {
  let remaining = buffer;

  while (true) {
    const startIdx = remaining.indexOf(CITE_START);
    if (startIdx === -1) break;

    const textBefore = remaining.slice(0, startIdx);
    if (textBefore) callbacks.onChunk(textBefore);

    const endIdx = remaining.indexOf(CITE_END, startIdx);
    if (endIdx === -1) {
      remaining = remaining.slice(startIdx);
      break;
    }

    const jsonStr = remaining.slice(startIdx + CITE_START.length, endIdx).trim();
    try {
      const meta = JSON.parse(jsonStr) as CitationMetadata;
      callbacks.onCitation(meta);
    } catch {
    }

    remaining = remaining.slice(endIdx + CITE_END.length);
  }

  return remaining;
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
    let lineBuffer = "";
    let citationBuffer = "";
    let inCitation = false;
    let doneCalled = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      lineBuffer += decoder.decode(value, { stream: true });
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              if (inCitation) {
                citationBuffer += data.content;
                const endIdx = citationBuffer.indexOf(CITE_END);
                if (endIdx !== -1) {
                  const jsonStr = citationBuffer.slice(0, endIdx).trim();
                  try {
                    const meta = JSON.parse(jsonStr) as CitationMetadata;
                    callbacks.onCitation(meta);
                  } catch {}
                  const after = citationBuffer.slice(endIdx + CITE_END.length);
                  if (after.trim()) callbacks.onChunk(after);
                  citationBuffer = "";
                  inCitation = false;
                }
              } else {
                const chunk = data.content;
                const startIdx = chunk.indexOf(CITE_START);
                if (startIdx !== -1) {
                  const before = chunk.slice(0, startIdx);
                  if (before) callbacks.onChunk(before);
                  const afterStart = chunk.slice(startIdx + CITE_START.length);
                  const endIdx = afterStart.indexOf(CITE_END);
                  if (endIdx !== -1) {
                    const jsonStr = afterStart.slice(0, endIdx).trim();
                    try {
                      const meta = JSON.parse(jsonStr) as CitationMetadata;
                      callbacks.onCitation(meta);
                    } catch {}
                    const after = afterStart.slice(endIdx + CITE_END.length);
                    if (after.trim()) callbacks.onChunk(after);
                  } else {
                    citationBuffer = afterStart;
                    inCitation = true;
                  }
                } else {
                  callbacks.onChunk(chunk);
                }
              }
            } else if (data.done) {
              doneCalled = true;
              callbacks.onDone();
            } else if (data.error) {
              doneCalled = true;
              callbacks.onError(data.error);
            }
          } catch {}
        }
      }
    }

    if (!doneCalled) {
      callbacks.onDone();
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
