import { createHash } from "node:crypto";
import { getChunkCount, getMetadata, replaceReviewedIndex } from "./store";
import { SEED_CHUNKS } from "./sources/seed-data";
import audit from "./sources/source-audit-2026-10-15.json";
import {
  buildReviewedExcerpts,
  isReviewedCurrent,
  REVIEW_AS_OF,
  type AuditRecord,
} from "./review-policy";

const records = audit.records as AuditRecord[];
const REVIEWED_EXCERPTS = buildReviewedExcerpts(records, SEED_CHUNKS);
const INGEST_VERSION =
  "review-" +
  REVIEW_AS_OF +
  "-" +
  createHash("sha256")
    .update(JSON.stringify(REVIEWED_EXCERPTS))
    .digest("hex")
    .slice(0, 10);
let ingestion: Promise<void> | null = null;

export function getContentReviewStatus() {
  const current = REVIEWED_EXCERPTS.filter((c) => isReviewedCurrent(c));
  return {
    status: "partial_review" as const,
    asOf: REVIEW_AS_OF,
    originalEntries: SEED_CHUNKS.length,
    checkedExcerpts: current.length,
    pendingEntries: records.filter((r) => r.status !== "verified").length,
    supersededEntries: records.filter((r) => r.status === "superseded").length,
    quarantinedEntries: records.filter((r) => r.status !== "verified").length,
    latestReviewAt: REVIEW_AS_OF,
    liveUpdates: false,
    reviewWindowDays: 90,
    limitation:
      "Source checks cover only the listed excerpts. Full topic reviews and independent clinical review of generated answers are incomplete. Historical saved answers and flashcards are not automatically reverified.",
  };
}

export async function isReviewedIndexReady(): Promise<boolean> {
  return (
    (await getMetadata("ingest_version")) === INGEST_VERSION &&
    (await getChunkCount()) === REVIEWED_EXCERPTS.length
  );
}

export async function runIngestion(force = false): Promise<void> {
  if (ingestion) return ingestion;
  ingestion = (async () => {
    if (!force && (await isReviewedIndexReady())) return;
    await replaceReviewedIndex(REVIEWED_EXCERPTS, INGEST_VERSION);
    console.log(
      `[references] Published ${REVIEWED_EXCERPTS.length} checked excerpts; historical unverified text is inactive.`,
    );
  })();
  try {
    await ingestion;
  } finally {
    ingestion = null;
  }
}

export async function ensureIngested(): Promise<void> {
  // Fail startup when publication fails rather than advertising a current index.
  await runIngestion();
}
