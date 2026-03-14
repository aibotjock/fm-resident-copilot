import { pool } from "@workspace/db";

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
}

export async function insertChunksBatch(
  chunks: GuidelineChunk[]
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const c of chunks) {
      await client.query(
        `INSERT INTO guideline_chunks
           (source, tier, guideline_title, guideline_year, abfm_domain, section, content, url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          c.source,
          c.tier,
          c.guideline_title,
          c.guideline_year,
          c.abfm_domain,
          c.section,
          c.content,
          c.url ?? null,
        ]
      );
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function searchByText(
  query: string,
  limit = 10
): Promise<SearchResult[]> {
  const { rows } = await pool.query<SearchResult>(
    `SELECT
       id, source, tier, guideline_title, guideline_year,
       abfm_domain, section, content, url,
       ts_rank(content_tsv, websearch_to_tsquery('english', $1)) AS rank
     FROM guideline_chunks
     WHERE content_tsv @@ websearch_to_tsquery('english', $1)
     ORDER BY rank DESC
     LIMIT $2`,
    [query, limit]
  );
  return rows;
}

export async function searchByTextFallback(
  query: string,
  limit = 10
): Promise<SearchResult[]> {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) return [];

  const tsQuery = words.join(" | ");

  const { rows } = await pool.query<SearchResult>(
    `SELECT
       id, source, tier, guideline_title, guideline_year,
       abfm_domain, section, content, url,
       ts_rank(content_tsv, to_tsquery('english', $1)) AS rank
     FROM guideline_chunks
     WHERE content_tsv @@ to_tsquery('english', $1)
     ORDER BY rank DESC
     LIMIT $2`,
    [tsQuery, limit]
  );
  return rows;
}

export async function clearChunks(): Promise<void> {
  await pool.query("TRUNCATE TABLE guideline_chunks RESTART IDENTITY CASCADE");
}

export async function getChunkCount(): Promise<number> {
  const { rows } = await pool.query<{ count: string }>(
    "SELECT COUNT(*) AS count FROM guideline_chunks"
  );
  return parseInt(rows[0].count, 10);
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
