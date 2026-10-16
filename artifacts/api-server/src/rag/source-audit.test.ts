import { test } from "node:test";
import assert from "node:assert/strict";
import audit from "./sources/source-audit-2026-10-15.json";
import { SEED_CHUNKS } from "./sources/seed-data";
import {
  buildReviewedExcerpts,
  REVIEW_AS_OF,
  type AuditRecord,
} from "./review-policy";

test("every historical summary has exactly one explicit audit decision", () => {
  const records = audit.records as AuditRecord[];
  assert.equal(records.length, SEED_CHUNKS.length);
  assert.deepEqual(
    records.map((r) => r.index).sort((a, b) => a - b),
    SEED_CHUNKS.map((_, i) => i),
  );
  assert.ok(
    records.every((r) => r.reason.trim() && r.lastChecked === REVIEW_AS_OF),
  );
  assert.equal(records.filter((r) => r.status === "verified").length, 0);
});

test("active index contains checked replacements, never historical or unresolved-rights content", () => {
  const records = audit.records as AuditRecord[];
  const active = buildReviewedExcerpts(records, SEED_CHUNKS);
  assert.ok(active.length > 0);
  assert.ok(
    active.every(
      (c) =>
        c.review_status === "verified_excerpt" &&
        c.reviewed_at === REVIEW_AS_OF &&
        /^https:\/\//.test(c.url ?? ""),
    ),
  );
  const historical = new Set(SEED_CHUNKS.map((c) => c.content));
  assert.ok(active.every((c) => !historical.has(c.content)));
  assert.equal(
    buildReviewedExcerpts(
      records.filter((r) =>
        ["unknown", "restricted_ai"].includes(r.rightsStatus ?? "unknown"),
      ),
      SEED_CHUNKS,
    ).length,
    0,
  );
});
