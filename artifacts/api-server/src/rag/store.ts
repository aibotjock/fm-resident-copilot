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
  review_status?: "verified_excerpt" | "unreviewed";
  reviewed_at?: string;
  publication_date?: string;
  review_note?: string;
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
  review_status: "verified_excerpt" | "unreviewed";
  reviewed_at: string | null;
  publication_date: string | null;
  review_note: string | null;
  rank: number;
}

export async function insertChunksBatch(
  chunks: GuidelineChunk[],
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const c of chunks) {
      await client.query(
        `INSERT INTO guideline_chunks
           (source, tier, guideline_title, guideline_year, abfm_domain, section, content, url, review_status, reviewed_at, publication_date, review_note)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          c.source,
          c.tier,
          c.guideline_title,
          c.guideline_year,
          c.abfm_domain,
          c.section,
          c.content,
          c.url ?? null,
          c.review_status ?? "unreviewed",
          c.reviewed_at ?? null,
          c.publication_date ?? null,
          c.review_note ?? null,
        ],
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
  limit = 10,
): Promise<SearchResult[]> {
  const { rows } = await pool.query<SearchResult>(
    `SELECT
       id, source, tier, guideline_title, guideline_year,
       abfm_domain, section, content, url, review_status, reviewed_at::text, publication_date, review_note,
       ts_rank(reviewed_tsv, websearch_to_tsquery('english', $1)) AS rank
     FROM guideline_chunks
     WHERE review_status = 'verified_excerpt'
       AND reviewed_at <= CURRENT_DATE
       AND reviewed_at >= CURRENT_DATE - INTERVAL '90 days'
       AND reviewed_tsv @@ websearch_to_tsquery('english', $1)
     ORDER BY rank DESC
     LIMIT $2`,
    [query, limit],
  );
  return rows;
}

export async function searchByTextFallback(
  query: string,
  limit = 10,
): Promise<SearchResult[]> {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 2 &&
        !new Set([
          "what",
          "which",
          "when",
          "where",
          "does",
          "with",
          "the",
          "and",
          "for",
          "from",
          "that",
          "this",
          "how",
          "are",
          "should",
          "would",
          "could",
          "give",
          "tell",
          "about",
          "patient",
          "treatment",
          "first",
          "second",
          "third",
          "line",
          "presentation",
          "diagnosis",
          "differential",
          "best",
          "test",
          "overview",
          "management",
        ]).has(w),
    );

  if (words.length === 0) return [];

  const tsQuery = words.join(" | ");

  const { rows } = await pool.query<SearchResult>(
    `SELECT
       id, source, tier, guideline_title, guideline_year,
       abfm_domain, section, content, url, review_status, reviewed_at::text, publication_date, review_note,
       ts_rank(reviewed_tsv, to_tsquery('english', $1)) AS rank
     FROM guideline_chunks
     WHERE review_status = 'verified_excerpt'
       AND reviewed_at <= CURRENT_DATE
       AND reviewed_at >= CURRENT_DATE - INTERVAL '90 days'
       AND reviewed_tsv @@ to_tsquery('english', $1)
     ORDER BY rank DESC
     LIMIT $2`,
    [tsQuery, limit],
  );
  return rows;
}

export async function clearChunks(): Promise<void> {
  await pool.query("TRUNCATE TABLE guideline_chunks RESTART IDENTITY CASCADE");
}

export async function getChunkCount(): Promise<number> {
  const { rows } = await pool.query<{ count: string }>(
    "SELECT COUNT(*) AS count FROM guideline_chunks",
  );
  return parseInt(rows[0].count, 10);
}

export async function getMetadata(key: string): Promise<string | null> {
  const { rows } = await pool.query<{ value: string }>(
    "SELECT value FROM rag_metadata WHERE key = $1",
    [key],
  );
  return rows[0]?.value ?? null;
}

export async function setMetadata(key: string, value: string): Promise<void> {
  await pool.query(
    `INSERT INTO rag_metadata (key, value, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, value],
  );
}

/** Swap the active index and version atomically; never expose a half-ingested set. */
export async function replaceReviewedIndex(
  chunks: GuidelineChunk[],
  version: string,
): Promise<void> {
  if (
    !chunks.length ||
    chunks.some(
      (c) => c.review_status !== "verified_excerpt" || !c.reviewed_at || !c.url,
    )
  ) {
    throw new Error(
      "Refusing to publish an empty or unreviewed reference index",
    );
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(61394015)");
    await client.query("DELETE FROM guideline_chunks");
    for (const c of chunks) {
      await client.query(
        `INSERT INTO guideline_chunks
        (source,tier,guideline_title,guideline_year,abfm_domain,section,content,url,review_status,reviewed_at,publication_date,review_note)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          c.source,
          c.tier,
          c.guideline_title,
          c.guideline_year,
          c.abfm_domain,
          c.section,
          c.content,
          c.url,
          c.review_status,
          c.reviewed_at,
          c.publication_date ?? null,
          c.review_note ?? null,
        ],
      );
    }
    for (const [key, value] of Object.entries({
      ingest_version: version,
      ingest_timestamp: new Date().toISOString(),
      total_chunks: String(chunks.length),
    })) {
      await client.query(
        `INSERT INTO rag_metadata(key,value,updated_at) VALUES($1,$2,now())
        ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`,
        [key, value],
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
