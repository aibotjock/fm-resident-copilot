import { pool } from "@workspace/db";
import { initializeVersions, stageVersion, activateVersion, entryKey, versionDigest, type ReferenceEntry } from "./versions";
import { CANDIDATE_ENTRIES,CANDIDATE_VERSION } from "./sources/candidate";
import { SEED_CHUNKS } from "./sources/seed-data";

async function ingestUnlocked(_force=false): Promise<void> {
  await initializeVersions(pool);
  // An empty isolated database needs a historical baseline for before/after review.
  const baseline:ReferenceEntry[]=SEED_CHUNKS.map(e=>({...e,key:entryKey(e),review:"unresolved",
    evidence:[],limitations:"Historical baseline; full claim-level currency review pending."}));
  const baselineId=`baseline-v10-${versionDigest(baseline).slice(0,12)}`;
  await stageVersion(pool,baselineId,baseline);
  await stageVersion(pool,CANDIDATE_VERSION,CANDIDATE_ENTRIES);
  const state=await pool.query("SELECT active_version FROM reference_state");
  if(!state.rows.length && process.env.FM_REFERENCE_PREVIEW==="1") {
    // Initialize only a fresh isolated preview. A restart must not undo rollback.
    await activateVersion(pool,baselineId,"Initialize isolated preview baseline",true);
    await activateVersion(pool,CANDIDATE_VERSION,"Preview candidate; clinical review incomplete",true);
  } else if(!state.rows.length) {
    throw new Error("No existing active library. Initialize an isolated preview; production activation requires reviewed migration.");
  }
  console.log(`[References] Staged ${CANDIDATE_VERSION}; ${CANDIDATE_ENTRIES.length} entries. Production activation is never automatic.`);
}
export async function ensureIngested():Promise<void> {
  try { await runIngestion(); }
  catch(err) {
    const state=await pool.query("SELECT active_version FROM reference_state");
    if(!state.rows.length) throw err;
    console.error("[References] Candidate staging failed; serving the unchanged active version.");
  }
}

export async function runIngestion(force = false): Promise<void> {
  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT pg_try_advisory_lock(1984632, 3) AS locked");
    if (!rows[0].locked) throw new Error("Reference ingestion is already running");
    await ingestUnlocked(force);
  } finally {
    await client.query("SELECT pg_advisory_unlock(1984632, 3)").catch(() => {});
    client.release(true);
  }
}
