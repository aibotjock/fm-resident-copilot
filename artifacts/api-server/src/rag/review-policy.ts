import type { GuidelineChunk } from "./store";

export const REVIEW_AS_OF = "2026-10-15";
export const MAX_REVIEW_AGE_DAYS = 90;
export const ALLOWED_RIGHTS = new Set(["public_federal", "public_summary"]);
// Explicit official publishers currently reviewed in this catalog. Adding a
// publisher requires a policy change; being discoverable on the web is insufficient.
const OFFICIAL_PUBLISHER_DOMAINS = [
  "aafp.org",
  "acc.org",
  "professional.heart.org",
  "cpr.heart.org",
  "cdc.gov",
  "fda.gov",
  "dailymed.nlm.nih.gov",
  "nhlbi.nih.gov",
  "niddk.nih.gov",
  "clinicalinfo.hiv.gov",
  "healthquality.va.gov",
  "ptsd.va.gov",
  "uspreventiveservicestaskforce.org",
  "gi.org",
  "kdigo.org",
  "endocrine.org",
];

export function isOfficialSourceUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (!url.port || url.port === "443") &&
      OFFICIAL_PUBLISHER_DOMAINS.includes(url.hostname.replace(/^www\./, ""))
    );
  } catch {
    return false;
  }
}

type CheckedCandidate = GuidelineChunk & { rightsStatus?: string };

export interface AuditRecord {
  index: number;
  status: "verified" | "superseded" | "unverified";
  reason: string;
  sourceUrl?: string;
  sourceTitle?: string;
  publicationDate?: string;
  lastChecked: string;
  rightsStatus?: string;
  replacement?: CheckedCandidate;
  additionalExcerpts?: CheckedCandidate[];
}

export function isReviewedCurrent(
  chunk: GuidelineChunk,
  now = new Date(),
): boolean {
  if (
    chunk.review_status !== "verified_excerpt" ||
    !chunk.reviewed_at ||
    !isOfficialSourceUrl(chunk.url)
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
    const primary: CheckedCandidate | undefined =
      row.replacement ??
      (row.status === "verified" ? originals[row.index] : undefined);
    for (const replacement of [primary, ...(row.additionalExcerpts ?? [])]) {
      if (!replacement || !isOfficialSourceUrl(replacement.url)) continue;
      if (
        replacement.rightsStatus &&
        !ALLOWED_RIGHTS.has(replacement.rightsStatus)
      )
        continue;
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
