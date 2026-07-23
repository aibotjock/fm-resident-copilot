import { searchByText, searchByTextFallback } from "./store.js";

export interface RetrievedChunk {
  id: number;
  source: string;
  guideline_title: string;
  section: string;
  content: string;
  abfm_domain: string;
  url: string | null;
}

export async function retrieveContext(
  query: string,
  limit = 10
): Promise<RetrievedChunk[]> {
  // Try FTS first, fall back to ILIKE
  let rows = await searchByText(query, limit);
  if (!rows || rows.length === 0) {
    rows = await searchByTextFallback(query, limit);
  }
  return (rows as unknown as RetrievedChunk[]) ?? [];
}

export function formatContextForPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";
  
  return chunks
    .map(
      (c, i) =>
        `[REF ${i + 1}] ${c.source} — ${c.guideline_title} (${c.section}):\n${c.content}`
    )
    .join("\n\n");
}
