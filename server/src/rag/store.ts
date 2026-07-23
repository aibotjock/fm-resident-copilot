import { db } from "../db/index.js";
import { guidelineChunks, ragMetadata } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";
import type { GuidelineChunk } from "./seed-data.js";

export async function insertChunks(chunks: GuidelineChunk[]): Promise<number> {
  if (chunks.length === 0) return 0;
  const rows = chunks.map((c) => ({
    source: c.source,
    tier: c.tier,
    guidelineTitle: c.guidelineTitle,
    guidelineYear: c.guidelineYear,
    abfmDomain: c.abfmDomain,
    section: c.section,
    content: c.content,
    url: c.url,
  }));
  await db.insert(guidelineChunks).values(rows);
  return rows.length;
}

export async function clearChunks(): Promise<void> {
  await db.delete(guidelineChunks);
}

export async function chunkCount(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(guidelineChunks);
  return result[0]?.count ?? 0;
}

export async function searchByText(query: string, limit = 10) {
  // Use PostgreSQL full-text search with websearch_to_tsquery
  const results = await db.execute(sql`
    SELECT
      id, source, tier, guideline_title, guideline_year,
      abfm_domain, section, content, url,
      ts_rank(
        to_tsvector('english', coalesce(source,'') || ' ' || coalesce(guideline_title,'') || ' ' || coalesce(section,'') || ' ' || content),
        websearch_to_tsquery('english', ${query})
      ) AS rank
    FROM guideline_chunks
    WHERE to_tsvector('english', coalesce(source,'') || ' ' || coalesce(guideline_title,'') || ' ' || coalesce(section,'') || ' ' || content)
      @@ websearch_to_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit}
  `);
  return results.rows;
}

export async function searchByTextFallback(query: string, limit = 10) {
  // Fallback: ILIKE search when FTS returns nothing
  const terms = query.split(/\s+/).filter(Boolean).slice(0, 5);
  if (terms.length === 0) return [];
  
  const ilikeConditions = terms
    .map((t) => `content ILIKE '%' || '${t.replace(/'/g, "''")}' || '%'`)
    .join(" OR ");

  const results = await db.execute(sql.raw(`
    SELECT id, source, tier, guideline_title, guideline_year,
           abfm_domain, section, content, url
    FROM guideline_chunks
    WHERE ${ilikeConditions}
    LIMIT ${limit}
  `));
  return results.rows;
}

export async function getMeta(key: string): Promise<string | null> {
  const rows = await db
    .select()
    .from(ragMetadata)
    .where(eq(ragMetadata.key, key));
  return rows[0]?.value ?? null;
}

export async function setMeta(key: string, value: string): Promise<void> {
  await db
    .insert(ragMetadata)
    .values({ key, value })
    .onConflictDoUpdate({ target: ragMetadata.key, set: { value } });
}
