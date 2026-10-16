import { searchByText, searchByTextFallback, type SearchResult } from "./store";

export interface RetrievalContext {
  chunks: SearchResult[];
  formattedContext: string;
  sourceList: string;
  empty: boolean;
}

export async function retrieveContext(
  query: string,
  limit = 10
): Promise<RetrievalContext> {
  try {
    let chunks = await searchByText(query, limit);

    if (chunks.length === 0) {
      chunks = await searchByTextFallback(query, limit);
    }

    if (chunks.length === 0) {
      return { chunks: [], formattedContext: "", sourceList: "", empty: true };
    }

    const formatted = chunks
      .map(
        (c, i) =>
          `[REF ${i + 1}] ${c.source} — ${c.guideline_title} (${c.guideline_year})\n` +
          `Study topic category: ${c.abfm_domain} | Section: ${c.section}\n` +
          `Review status: ${c.review_status} | Source checked: ${c.reviewed_at} | Publication date: ${c.publication_date ?? c.guideline_year ?? "not established"}\n` +
          `Scope: ${c.review_note ?? "Checked excerpt only; not a complete clinical guideline or proof of currentness after the check date."}\n` +
          (c.url ? `URL: ${c.url}\n` : "") +
          `\n${c.content}`
      )
      .join("\n\n---\n\n");

    const uniqueSources = [
      ...new Set(chunks.map((c) => `${c.source} (${c.guideline_year})`)),
    ];

    return {
      chunks,
      formattedContext: formatted,
      sourceList: uniqueSources.join(", "),
      empty: false,
    };
  } catch (err) {
    console.error("[RAG] Retrieval failed:", err);
    return { chunks: [], formattedContext: "", sourceList: "", empty: true };
  }
}
