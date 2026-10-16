import { createHash } from "node:crypto";
interface QueryResult { rows: any[]; }
interface PoolClient { query(sql:string,args?:any[]):Promise<QueryResult>; release():void; }
interface Pool { query(sql:string,args?:any[]):Promise<QueryResult>; connect():Promise<PoolClient>; }
import type { GuidelineChunk } from "./store";

export interface EvidenceRecord {
  id:string; organization:string; title:string; publicationDate:string|null;
  accessDate:string; url:string; locator:string; claim:string; [key:string]:unknown;
}
export interface ReferenceEntry extends GuidelineChunk {
  key: string;
  review: "unresolved" | "partially_corrected" | "verified";
  evidence: string[];
  limitations: string;
  evidence_records?: EvidenceRecord[];
}
export function entryKey(c: GuidelineChunk): string {
  return createHash("sha256").update(`${c.abfm_domain}|${c.section}`).digest("hex").slice(0, 24);
}
export function versionDigest(entries: ReferenceEntry[]): string {
  return createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}
export function validateEntries(entries: ReferenceEntry[]): void {
  if (!entries.length) throw new Error("Empty reference version");
  const keys = new Set<string>();
  for (const entry of entries) {
    if (keys.has(entry.key)) throw new Error(`Duplicate reference key: ${entry.key}`);
    keys.add(entry.key);
    if (!entry.content.trim() || !entry.section || !entry.abfm_domain) throw new Error("Incomplete reference entry");
    if (entry.review === "verified" && (!entry.evidence.length || entry.limitations)) throw new Error("Verified entry requires evidence and no unresolved limitations");
  }
}
async function transaction<T>(pool: Pool, fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const c = await pool.connect();
  try { await c.query("BEGIN"); const result = await fn(c); await c.query("COMMIT"); return result; }
  catch (err) { await c.query("ROLLBACK"); throw err; }
  finally { c.release(); }
}
// Additive migration: legacy tables remain intact as the original database backup.
export async function initializeVersions(pool: Pool): Promise<void> {
  await transaction(pool, async c => {
    await c.query("SELECT pg_advisory_xact_lock(hashtext(current_schema() || ':reference-migration'))");
    await c.query(`
      CREATE TABLE IF NOT EXISTS reference_versions (
        id text PRIMARY KEY, digest text NOT NULL, entry_count integer NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(), ready boolean NOT NULL DEFAULT false
      );
      CREATE TABLE IF NOT EXISTS reference_entries (
        version_id text NOT NULL REFERENCES reference_versions(id), key text NOT NULL,
        source text NOT NULL, tier integer NOT NULL, guideline_title text NOT NULL,
        guideline_year text, abfm_domain text NOT NULL, section text NOT NULL,
        content text NOT NULL, url text, review text NOT NULL,
        evidence jsonb NOT NULL DEFAULT '[]', evidence_records jsonb NOT NULL DEFAULT '[]', limitations text NOT NULL DEFAULT '',
        content_tsv tsvector GENERATED ALWAYS AS
          (to_tsvector('english', coalesce(guideline_title,'') || ' ' || coalesce(section,'') || ' ' || coalesce(content,''))) STORED,
        PRIMARY KEY(version_id, key)
      );
      ALTER TABLE reference_entries ADD COLUMN IF NOT EXISTS evidence_records jsonb NOT NULL DEFAULT '[]';
      CREATE INDEX IF NOT EXISTS reference_entries_fts_idx ON reference_entries USING gin(content_tsv);
      CREATE TABLE IF NOT EXISTS reference_state (
        singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
        active_version text NOT NULL REFERENCES reference_versions(id),
        previous_version text REFERENCES reference_versions(id), changed_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS reference_activations (
        id bigserial PRIMARY KEY, from_version text, to_version text NOT NULL,
        reason text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
      );
    `);
    const { rows } = await c.query("SELECT active_version FROM reference_state");
    if (rows.length) return;
    const legacy = await c.query("SELECT * FROM guideline_chunks ORDER BY id");
    if (!legacy.rows.length) return;
    const entries: ReferenceEntry[] = legacy.rows.map(row => ({
      source: row.source, tier: row.tier, guideline_title: row.guideline_title,
      guideline_year: row.guideline_year, abfm_domain: row.abfm_domain,
      section: row.section, content: row.content, url: row.url ?? undefined,
      key: entryKey(row), review: "unresolved", evidence: [],
      limitations: "Historical reference text; full claim-level currency review pending.",
    }));
    // Some old databases may contain repeated ingestion rows. Preserve all rows in
    // the untouched legacy table; snapshot the last row of each logical section.
    const unique = [...new Map(entries.map(e => [e.key, e])).values()];
    const id = `legacy-${versionDigest(unique).slice(0, 16)}`;
    await insertVersion(c, id, unique, false);
    await c.query("INSERT INTO reference_state(singleton,active_version) VALUES(true,$1)", [id]);
    await c.query("INSERT INTO reference_activations(from_version,to_version,reason) VALUES(NULL,$1,'Snapshot existing library; no clinical certification')", [id]);
  });
}
async function insertVersion(c: PoolClient, id: string, entries: ReferenceEntry[], ready: boolean): Promise<void> {
  validateEntries(entries);
  const digest = versionDigest(entries);
  const existing = await c.query("SELECT digest FROM reference_versions WHERE id=$1", [id]);
  if (existing.rows.length) {
    if (existing.rows[0].digest !== digest) throw new Error("Immutable version ID already has different content");
    return;
  }
  await c.query("INSERT INTO reference_versions(id,digest,entry_count,ready) VALUES($1,$2,$3,$4)", [id,digest,entries.length,ready]);
  for (const e of entries) await c.query(`INSERT INTO reference_entries
    (version_id,key,source,tier,guideline_title,guideline_year,abfm_domain,section,content,url,review,evidence,limitations,evidence_records)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14::jsonb)`,
    [id,e.key,e.source,e.tier,e.guideline_title,e.guideline_year,e.abfm_domain,e.section,e.content,e.url ?? null,e.review,JSON.stringify(e.evidence),e.limitations,JSON.stringify(e.evidence_records ?? [])]);
}
export async function stageVersion(pool: Pool, id: string, entries: ReferenceEntry[]): Promise<void> {
  await transaction(pool, async c => {
    await c.query("SELECT pg_advisory_xact_lock(hashtext(current_schema() || ':reference-stage'))");
    // Evidence completeness alone is not clinical sign-off. New versions always
    // start unapproved; readiness requires an explicit reviewed release manifest.
    await insertVersion(c,id,entries,false);
  });
}
export async function activateVersion(pool: Pool, id: string, reason: string, preview = false): Promise<void> {
  if (preview && (process.env.FM_REFERENCE_PREVIEW !== "1" || !process.env.FM_REFERENCE_SCHEMA || process.env.FM_REFERENCE_SCHEMA === "fm_copilot_restored")) {
    throw new Error("Incomplete preview activation requires an explicitly isolated schema");
  }
  await transaction(pool, async c => {
    await c.query("SELECT pg_advisory_xact_lock(hashtext(current_schema() || ':reference-activation'))");
    const result = await c.query("SELECT * FROM reference_versions WHERE id=$1",[id]);
    const v=result.rows[0];
    if (!v) throw new Error("Reference version not found");
    const count=await c.query("SELECT count(*)::int AS count FROM reference_entries WHERE version_id=$1",[id]);
    if (count.rows[0].count !== v.entry_count || !v.entry_count) throw new Error("Incomplete candidate version");
    const state=await c.query("SELECT active_version,previous_version FROM reference_state WHERE singleton=true FOR UPDATE");
    const current=state.rows[0]?.active_version ?? null;
    if(current===id) return;
    const prior=state.rows[0]?.previous_version;
    // Restoring the prior active snapshot is always allowed. Activating a new,
    // medically incomplete version is limited to an isolated preview.
    if(!v.ready && id!==prior && !preview) throw new Error("Candidate is not approved for activation");
    await c.query(`INSERT INTO reference_state(singleton,active_version,previous_version) VALUES(true,$1,$2)
      ON CONFLICT(singleton) DO UPDATE SET active_version=$1,previous_version=$2,changed_at=now()`,[id,current]);
    await c.query("INSERT INTO reference_activations(from_version,to_version,reason) VALUES($1,$2,$3)",[current,id,reason]);
  });
}
export async function referenceStatus(pool: Pool) {
  const state=await pool.query("SELECT * FROM reference_state");
  const versions=await pool.query(`SELECT v.*,count(e.key) FILTER(WHERE e.review<>'verified')::int AS unresolved_entries
    FROM reference_versions v LEFT JOIN reference_entries e ON e.version_id=v.id GROUP BY v.id ORDER BY v.created_at DESC`);
  return {state:state.rows[0] ?? null,versions:versions.rows};
}
