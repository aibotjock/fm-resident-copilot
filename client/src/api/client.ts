// API base URL. For web builds served alongside the backend (or via the Vite
// dev proxy), leave VITE_API_BASE_URL unset so relative "/api" paths are used.
// For native (Capacitor/Android) builds, set VITE_API_BASE_URL to the full
// backend origin, e.g. "https://my-server.example.com".
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
const API_BASE = `${API_ORIGIN}/api`;

export type ClinicalMode = "point_of_care" | "documentation" | "board_prep" | "flashcards";

export interface StreamEvent {
  type: "transcript" | "sources" | "user_transcript" | "audio" | "error";
  data: unknown;
}

export async function* streamClinicalQuery(
  query: string,
  mode: ClinicalMode,
  condition?: string
): AsyncGenerator<StreamEvent | { done: true }> {
  const response = await fetch(`${API_BASE}/clinical/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ query, mode, condition }),
  });

  if (!response.ok) {
    throw new Error(`Query failed: ${response.status}`);
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
        yield JSON.parse(line);
      } catch {
        continue;
      }
    }
  }
}

export interface Vignette {
  question: string;
  options: { a: string; b: string; c: string; d: string };
  answer: string;
  explanation: string;
  domain: string;
  source: string;
}

export async function fetchVignette(domain?: string): Promise<Vignette> {
  const res = await fetch(`${API_BASE}/clinical/vignette`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: domain ?? "random" }),
  });
  if (!res.ok) throw new Error("Failed to generate vignette");
  return res.json();
}

export async function checkHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/healthz`);
  return res.json();
}
