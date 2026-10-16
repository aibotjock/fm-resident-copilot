import type { GuidelineChunk } from "./store";

export const REVIEW_AS_OF = "2026-10-15";
export const MAX_REVIEW_AGE_DAYS = 90;
export const ALLOWED_RIGHTS = new Set(["public_federal", "public_summary"]);

export interface AuditRecord {
  index: number;
  status: "verified" | "superseded" | "unverified";
  reason: string;
  sourceUrl?: string;
  sourceTitle?: string;
  publicationDate?: string;
  lastChecked: string;
  rightsStatus?: string;
  replacement?: GuidelineChunk;
  additionalExcerpts?: GuidelineChunk[];
}

export function isReviewedCurrent(
  chunk: GuidelineChunk,
  now = new Date(),
): boolean {
  if (
    chunk.review_status !== "verified_excerpt" ||
    !chunk.reviewed_at ||
    !chunk.url
  )
    return false;
  const checked = Date.parse(chunk.reviewed_at + "T00:00:00Z");
  const today = Date.parse(now.toISOString().slice(0, 10) + "T00:00:00Z");
  return (
    Number.isFinite(checked) &&
    checked <= today &&
    today - checked <= MAX_REVIEW_AGE_DAYS * 86400000
  );
}

export function buildReviewedExcerpts(
  records: AuditRecord[],
  originals: GuidelineChunk[],
): GuidelineChunk[] {
  const checked = new Map<string, GuidelineChunk>();
  for (const row of records) {
    if (!ALLOWED_RIGHTS.has(row.rightsStatus ?? "unknown")) continue;
    const primary =
      row.replacement ??
      (row.status === "verified" ? originals[row.index] : undefined);
    for (const replacement of [primary, ...(row.additionalExcerpts ?? [])]) {
      if (!replacement?.url || !/^https:\/\//.test(replacement.url)) continue;
      const chunk: GuidelineChunk = {
        ...replacement,
        review_status: "verified_excerpt",
        reviewed_at: row.lastChecked,
        publication_date: replacement.publication_date || row.publicationDate,
        // Audit reasons may quote obsolete recommendations. Keep that historical
        // material in the ledger, outside the model's clinical evidence context.
        review_note:
          "Narrow source-checked excerpt only; other aspects of this condition remain unverified. This is not a complete guideline or an independent clinical review of generated answers.",
      };
      if (!isReviewedCurrent(chunk, new Date(REVIEW_AS_OF + "T12:00:00Z")))
        continue;
      // Multiple stale originals may be replaced by the same concise checked source.
      checked.set([chunk.url, chunk.section, chunk.content].join("|"), chunk);
    }
  }
  return [...checked.values()];
}
