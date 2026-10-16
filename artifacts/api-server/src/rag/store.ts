import { pool } from "@workspace/db";
import type { EvidenceRecord } from "./versions";

export interface GuidelineChunk {
  source: string;
  tier: number;
  guideline_title: string;
  guideline_year: string;
  abfm_domain: string;
  section: string;
  content: string;
  url?: string;
}

export interface SearchResult {
  id: string;
  source: string;
  tier: number;
  guideline_title: string;
  guideline_year: string;
  abfm_domain: string;
  section: string;
  content: string;
  url: string | null;
  rank: number;
  review: "unresolved" | "partially_corrected" | "verified";
  evidence: string[];
  limitations: string;
  version_id: string;
  evidence_records: EvidenceRecord[];
}

// Search only the atomically selected version. No mutation truncates reference data.
export async function searchByText(query: string, limit = 10): Promise<SearchResult[]> {
  const {rows}=await pool.query<SearchResult>(`
    SELECT e.key AS id,e.*,
      ts_rank(e.content_tsv,websearch_to_tsquery('english',$1)) AS rank
    FROM reference_entries e JOIN reference_state s ON e.version_id=s.active_version
    WHERE e.content_tsv @@ websearch_to_tsquery('english',$1)
    ORDER BY rank DESC,e.key LIMIT $2`,[query,limit]);
  return rows;
}
export async function searchByTextFallback(query: string, limit = 10): Promise<SearchResult[]> {
  const words=query.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>2);
  if(!words.length) return [];
  const {rows}=await pool.query<SearchResult>(`
    SELECT e.key AS id,e.*,
      ts_rank(e.content_tsv,to_tsquery('english',$1)) AS rank
    FROM reference_entries e JOIN reference_state s ON e.version_id=s.active_version
    WHERE e.content_tsv @@ to_tsquery('english',$1)
    ORDER BY rank DESC,e.key LIMIT $2`,[words.join(" | "),limit]);
  return rows;
}
export async function getChunkCount(): Promise<number> {
  const {rows}=await pool.query<{count:string}>(`SELECT count(*) AS count FROM reference_entries e
    JOIN reference_state s ON e.version_id=s.active_version`);
  return Number(rows[0].count);
}

export async function getMetadata(key: string): Promise<string | null> {
  const { rows } = await pool.query<{ value: string }>(
    "SELECT value FROM rag_metadata WHERE key = $1",
    [key]
  );
  return rows[0]?.value ?? null;
}

export async function setMetadata(key: string, value: string): Promise<void> {
  await pool.query(
    `INSERT INTO rag_metadata (key, value, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, value]
  );
}
