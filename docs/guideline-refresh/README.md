# Guideline refresh: review checkpoint

Status: **incomplete clinical review; do not merge or deploy to production**.

Branch: `content/guideline-refresh-2026-10-15`.
Baseline: `e3e494eb158907355b873aa0f8c8d412bd8cfb4c` (exact application tree from `5a4db479257788a7cc1b886ae309ecaffca721a5`).
Review access date: October 15, 2026, America/New_York. Individual publications retain their actual dates.

## What is preserved

- 156 baseline reference entries and 156 candidate entries, with every section identity retained.
- 21 distinct legacy reference-domain strings. The interface historically uses 16 organ-system study categories; these are not the five official ABFM exam domains.
- 96 actual condition-browser entries, with no missing retrieval matches before or after. Matching does not prove clinical relevance.
- Original navigation, five response modes, practice questions, flashcards, read-aloud controls and local study-data storage.
- Baseline text 270,428 characters; candidate text 277,006. Length preservation is not an accuracy measure.

## What changed

51 targeted reference edits across 32 entries; 34 official-source evidence records. None of the 156 complete entries is certified fully verified. The original seed file remains untouched. Corrections apply as anchored changes rather than replacement topic summaries.

Engineering changes: immutable reference versions, additive historical snapshot, atomic activation/rollback, failure-safe staging, preview schema isolation, server-controlled evidence footer, clickable source links, accurate ABFM weight labels, and required clinical-response sections. The candidate no longer calls unverified USPSTF endpoints or describes them as a working live feed.

## Review files

- [Architecture](ARCHITECTURE.md)
- [Before/after reference changes](changes.md)
- [Interactive reference comparison](review.html) (download/open locally; no server or external scripts)
- [Evidence records](../../artifacts/api-server/src/rag/sources/evidence.json)
- [All-entry issue inventory](../../artifacts/api-server/src/rag/sources/review-backlog.json)
- [Six actual production-baseline responses](baseline-responses.json)
- [Retrieval comparison](retrieval-coverage.json)
- [Database and streaming checks](validation.json)
- [API transport checks](api-smoke.json)
- [Validation limits and remaining work](VALIDATION.md)
- [Activation/rollback procedure](OPERATIONS.md)
- [Reusable subject-neutral blueprint](STUDY_APP_BLUEPRINT.md)

## Approval status

Not requesting production approval. Full claim-level verification, publisher access/reuse questions, generated candidate-answer review, and end-to-end browser tests remain incomplete. There is no deployed candidate app preview. The review HTML is a reference comparison, not an AI app or a medical certification.

The existing Railway app remains on the approved restored version. No production database, environment variables, service configuration or deployment was changed by this branch work.
