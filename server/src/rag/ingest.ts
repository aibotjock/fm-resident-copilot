import { SEED_CHUNKS, INGEST_VERSION } from "./seed-data.js";
import { insertChunks, clearChunks, chunkCount, getMeta, setMeta } from "./store.js";

export async function ensureIngested(): Promise<void> {
  const currentVersion = await getMeta("ingest_version").catch(() => null);
  if (currentVersion === INGEST_VERSION) {
    const count = await chunkCount();
    console.log(`[RAG] Already ingested v${INGEST_VERSION} (${count} chunks). Skipping.`);
    return;
  }
  await runIngestion(true);
}

export async function runIngestion(force = false): Promise<{ inserted: number }> {
  if (!force) {
    const currentVersion = await getMeta("ingest_version").catch(() => null);
    if (currentVersion === INGEST_VERSION) {
      return { inserted: 0 };
    }
  }

  console.log(`[RAG] Starting ingestion v${INGEST_VERSION}...`);
  await clearChunks();
  const inserted = await insertChunks(SEED_CHUNKS);
  await setMeta("ingest_version", INGEST_VERSION);
  await setMeta("ingest_timestamp", new Date().toISOString());
  await setMeta("chunk_count", String(inserted));
  console.log(`[RAG] Ingested ${inserted} chunks (v${INGEST_VERSION}).`);
  return { inserted };
}
