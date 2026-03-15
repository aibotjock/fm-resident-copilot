import {
  insertChunksBatch,
  clearChunks,
  getChunkCount,
  setMetadata,
  getMetadata,
  type GuidelineChunk,
} from "./store";
import { SEED_CHUNKS } from "./sources/seed-data";
import { fetchUSPSTFChunks } from "./sources/uspstf-ingest";

const INGEST_VERSION = "v8";
const BATCH_SIZE = 100;

async function ingestChunks(
  chunks: GuidelineChunk[],
  label: string
): Promise<number> {
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    await insertChunksBatch(batch);
    console.log(
      `[RAG] ${label}: ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length} chunks stored`
    );
  }
  return chunks.length;
}

export async function runIngestion(force = false): Promise<void> {
  const existingVersion = await getMetadata("ingest_version");
  if (!force && existingVersion === INGEST_VERSION) {
    console.log("[RAG] Already ingested at version", INGEST_VERSION);
    return;
  }

  console.log("[RAG] Clearing previous index...");
  await clearChunks();

  console.log("[RAG] Starting full guideline ingestion (FTS mode)...");
  const start = Date.now();

  let totalChunks = 0;

  totalChunks += await ingestChunks(SEED_CHUNKS, "Seed guidelines");

  try {
    console.log("[RAG] Fetching live USPSTF recommendations...");
    const uspstfChunks = await fetchUSPSTFChunks();
    console.log(`[RAG] Fetched ${uspstfChunks.length} USPSTF chunks`);
    totalChunks += await ingestChunks(uspstfChunks, "USPSTF");
  } catch (err) {
    console.error("[RAG] USPSTF fetch failed, continuing without:", err);
  }

  await setMetadata("ingest_version", INGEST_VERSION);
  await setMetadata("ingest_timestamp", new Date().toISOString());
  await setMetadata("total_chunks", totalChunks.toString());

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `[RAG] Ingestion complete: ${totalChunks} chunks in ${elapsed}s`
  );
}

export async function ensureIngested(): Promise<void> {
  try {
    const existingVersion = await getMetadata("ingest_version");
    if (existingVersion === INGEST_VERSION) {
      const count = await getChunkCount();
      if (count > 0) {
        console.log(
          `[RAG] Index ready: ${count} chunks at version ${INGEST_VERSION}`
        );
        return;
      }
    }
    await runIngestion();
  } catch (err) {
    console.error("[RAG] Failed to ensure ingestion:", err);
  }
}
