# Validation and unresolved work

## Observed passes

- Production-style API build plus Expo web export (`pnpm run build:railway`).
- Mobile TypeScript (`pnpm --filter @workspace/mobile exec tsc --noEmit`).
- Actual PostgreSQL SQL through local PGlite: legacy snapshot, 156-entry preservation, immutable IDs, duplicate/empty rejection, idempotent staging, failed-write rollback, production activation rejection, isolated preview activation, rollback and version-filtered full-text search.
- Streaming-footer filter across every split boundary, ordinary-prose preservation, and server evidence-metadata scope.
- Actual Express routes with a deterministic OpenAI test fixture: five SSE modes, practice-MCQ JSON, reference status, and denied unauthenticated administration. These are transport tests, not AI-content tests.
- Baseline and candidate retrieval matched all 96 named browser conditions; no new missing matches. Semantic relevance and full topic completeness were not established by that check.
- Six real baseline AI responses captured before edits, with no reported errors.

## Checks that do not pass or have not been performed

The root typecheck fails in inherited shared packages: duplicate ClinicalQueryBody exports, missing type/dependency declarations, p-retry AbortError typing and image-response nullability. API project checking is consequently blocked by missing shared declaration outputs. The new missing-pg type import found during development was removed; the API build succeeds. Root typecheck is not reported as passing.

There are no real candidate-model responses in this package: this local runtime has no configured OpenAI credential. No key was copied from Railway or exposed. API tests use explicitly labeled fixtures. The saved baseline responses must not be presented as candidate output.

No full browser regression of the candidate, audio test, device-to-device storage test, or cloud PostgreSQL concurrency test has been completed. The built UI's storage implementation and keys were preserved, but that alone does not prove all UI behavior. No candidate Railway service was provisioned or deployed.

## Medical release blockers

All 156 complete reference entries still contain unverified retained claims, even where an individual correction is verified. Read the per-entry issue inventory. Publication metadata, numeric thresholds, drug labeling, pediatric/pregnancy pathways and contraindications require continued claim-level review. Explicitly tagged corrections do not certify the rest of a topic.

Some ADA journal pages returned 403; NIH PMC pages presented browser verification. A legitimate jointly published Diabetologia consensus was accessible for DKA, but that does not establish full ADA 2026 coverage. Do not claim to have read blocked material.

GINA explicitly requires approval for commercial use of its reports; no permission was obtained or implied. Other society source/reuse requirements and historically attributed summaries need review. The original corpus remains historical research material in this isolated branch, not a commercially cleared current guideline corpus.

Full 2026 GOLD treatment algorithms, newer ACOG guidance, current labels for all drugs, complete diagnoses/differentials, and exact first/second/third-line pathways are not certified. No blanket treatment ladder should be invented to fill gaps.

## Next work in order

1. Continue claim review from the per-entry inventory, prioritizing unresolved unsafe doses, withdrawn products and obsolete acute-care rules.
2. Obtain legitimate full-source access/permissions where needed, or independently support the specific facts from other applicable official guidance.
3. Reconcile duplicate-topic recommendations and source metadata after verification.
4. Capture real candidate responses for the saved baseline scenarios plus prevention, pregnancy/pediatrics, renal dosing, conflicts and unknown-evidence cases.
5. Review the answers against their exact supporting claims; inspect all eight tabs and exercise local save/review/read-aloud functions.
6. Resolve required typecheck failures, finish a reviewed activation manifest and database migration rehearsal, then prepare an isolated app preview.
7. Request production approval only after release blockers are resolved.
