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

The root typecheck now passes across shared packages, API, mobile, mockup sandbox and scripts. Repairs explicitly export the request schema/interface, declare development types, align React types with the Expo React 19.1 dependency, use the installed p-retry named AbortError/context API, and reject missing image bytes. No production model or credential was changed. The production-style build also passed.

Twelve real isolated candidate answer scenarios and two practice-question requests completed using the approved direct-API model, gpt-4o. An explicitly authorized new key was saved to ignored .env.local and is not part of this review package. No key was copied from Railway. Saved baseline requests lacked their original query text, so comparisons use reconstructed queries and are not controlled prompt-identical experiments. See LIVE-REVIEW.md for failed medical acceptance cases; successful transport does not establish medical correctness.

No full browser regression, audio test, device-to-device storage test, or cloud PostgreSQL concurrency test has been completed. A local isolated preview server ran, but Chromium was absent and its download failed. No browser pass is claimed. Storage keys remain unchanged. No candidate Railway service was provisioned or deployed.

## Medical release blockers

All 156 complete reference entries still contain unverified retained claims, even where an individual correction is verified. Read the per-entry issue inventory. Publication metadata, numeric thresholds, drug labeling, pediatric/pregnancy pathways and contraindications require continued claim-level review. Explicitly tagged corrections do not certify the rest of a topic.

Some ADA journal pages returned 403; NIH PMC pages presented browser verification. A legitimate jointly published Diabetologia consensus was accessible for DKA, but that does not establish full ADA 2026 coverage. Do not claim to have read blocked material.

GINA explicitly requires approval for commercial use of its reports; no permission was obtained or implied. Other society source/reuse requirements and historically attributed summaries need review. The original corpus remains historical research material in this isolated branch, not a commercially cleared current guideline corpus.

Full 2026 GOLD treatment algorithms, newer ACOG guidance, current labels for all drugs, complete diagnoses/differentials, and exact first/second/third-line pathways are not certified. No blanket treatment ladder should be invented to fill gaps.

## Next work in order

1. Continue claim review from the per-entry inventory, prioritizing unresolved unsafe doses, withdrawn products and obsolete acute-care rules.
2. Obtain legitimate full-source access/permissions where needed, or independently support the specific facts from other applicable official guidance.
3. Reconcile duplicate-topic recommendations and source metadata after verification.
4. Remediate the saved live-model failures, then expand real candidate testing to pediatrics, exact dosing, conflicts and repeated question-quality checks.
5. Review the answers against their exact supporting claims; inspect all eight tabs and exercise local save/review/read-aloud functions.
6. Resolve required typecheck failures, finish a reviewed activation manifest and database migration rehearsal, then prepare an isolated app preview.
7. Request production approval only after release blockers are resolved.
