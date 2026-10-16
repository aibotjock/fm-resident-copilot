# FM Copilot — preserved application build blueprint

Captured October 16, 2026 from main commit `68506810181f2b6d945b07bd698bda34f8691a10`.
Branch: `blueprint/app-build-2026-10-16`.

This branch preserves the entire source tree at the captured commit and adds this guide. It is a reusable code-and-design reference, not a sanitized starter kit or a database backup. Credentials, hosted service configuration, browser progress, and database contents are not copied by a Git branch.

## Start here

Use this guide for the implementation that exists. Use [the general study-app brief](../guideline-refresh/STUDY_APP_BLUEPRINT.md) for broader design goals. Earlier restoration/candidate documents describe historical checkpoints; statements there such as “main unchanged” are historical, not a current deployment report. Source code at the captured commit governs when notes conflict.

The user approved the preview and its promotion to main in the preceding work. This documentation task did not repeat deployment or clinical validation. The app retains incomplete clinical review; preservation of the build does not certify medical content.

## 1. What to preserve

The recognizable format combines:
- Eight task-oriented tabs, a condition browser, quick entry points, and a shared answer screen.
- Five response modes: point of care, documentation, differential diagnosis, board study, and flashcards.
- Practice MCQs with immediate answer feedback and explanations.
- Saved answers with personal notes, searchable history, spaced review, and progress.
- Shared cards, consistent mode colors, light/dark themes, first-launch onboarding, source citations, and read-aloud controls.
- One web origin serving the exported interface and streaming API.

These are implemented features, not a requirement to add more frameworks. Mobile source exists; this capture does not establish App Store or Play Store release readiness.

## 2. Source map

Paths below are relative to the repository root.

| Responsibility | Source |
| --- | --- |
| Workspace commands and pinned package manager | `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` |
| App providers, fonts, onboarding, review banner | `artifacts/mobile/app/_layout.tsx` |
| Eight-tab navigation | `artifacts/mobile/app/(tabs)/_layout.tsx` |
| Tab bar | `artifacts/mobile/components/AppTabBar.tsx` |
| Condition browser | `artifacts/mobile/components/ConditionGrid.tsx` |
| Mode entry cards | `artifacts/mobile/components/ModeCard.tsx` |
| Shared response screen | `artifacts/mobile/app/response.tsx` |
| Answer rendering and citations | `artifacts/mobile/components/ResponseView.tsx`, `SourceCitation.tsx` in the same directory |
| Practice and flashcards | `artifacts/mobile/components/VignetteCard.tsx`, `FlashcardView.tsx` in the same directory |
| Themes and types | `artifacts/mobile/constants/colors.ts`, `artifacts/mobile/types/index.ts` |
| Local learner data and review scheduling | `artifacts/mobile/context/AppContext.tsx` |
| Streaming client and flashcard parsing | `artifacts/mobile/utils/streaming.ts` |
| API startup and static web hosting | `artifacts/api-server/src/index.ts`, `app.ts` in the same directory |
| Mode prompts and generation endpoints | `artifacts/api-server/src/routes/clinical.ts` |
| Reference retrieval | `artifacts/api-server/src/rag/retrieval.ts`, `store.ts` in the same directory |
| Evidence context and citation filtering | `artifacts/api-server/src/rag/evidence-context.ts` |
| Reference staging and activation | `artifacts/api-server/src/rag/ingest.ts`, `versions.ts` in the same directory |
| Bundled content and review records | `artifacts/api-server/src/rag/sources/` |
| Database connection and schema initialization | `lib/db/src/index.ts` |
| Model client selection | `lib/integrations-openai-ai-server/src/client.ts` |
| Reference administration | `artifacts/api-server/src/routes/admin.ts` |
| API contracts and generated clients | `lib/api-spec/`, `lib/api-zod/`, `lib/api-client-react/` |
| Regression and review tools | `scripts/guideline-refresh/` |

## 3. Screen and interaction blueprint

| Tab | Route file under artifacts/mobile/app/(tabs) | Primary purpose |
| --- | --- | --- |
| Point of Care | `index.tsx` | Browse a condition or ask for a structured explanation |
| Documentation | `documentation.tsx` | Enter a documentation study request |
| DDx | `ddx.tsx` | Explore differential reasoning |
| Saved | `bookmarks.tsx` | Revisit saved answers and add/edit notes |
| Board Prep | `board.tsx` | Switch between study answers and practice MCQs |
| Flashcards | `flashcards.tsx` | Generate and review cards |
| Progress | `progress.tsx` | Review coverage, practice performance, and entered ITE scores |
| History | `history.tsx` | Search and reopen prior queries |

Reuse the existing component styles rather than approximating the design from text.
Mode colors are blue `#3B82F6`, amber `#F59E0B`, cyan `#0891B2`,
green `#10B981`, and violet `#8B5CF6`. Theme background colors are
`#F8FAFC` (light) and `#0A0F1E` (dark); the full theme includes surfaces,
text, borders, and selected states. Preserve loading, failure, cancellation,
empty-state, and onboarding behavior when adapting screens.

## 4. Runtime and answer flow

The stack is a pnpm/TypeScript workspace, Expo/React Native with Expo Router,
an Express API, PostgreSQL with pg/Drizzle, and server-side OpenAI integration.
The web build is an Expo export served by Express, not the historical replacement
Vite app. Supporting workspace packages do not all belong in the active request path.

1. A screen supplies query, mode, and optionally a condition.
2. The streaming client posts to `/api/clinical/query` on the same origin for hosted web.
3. The server retrieves reference text using PostgreSQL full-text search, with a fallback search.
4. Retrieved references, review limitations, and the selected mode prompt supply generation context.
5. The API streams text through SSE and supplies citation metadata.
6. The client renders the answer and sources and supports saving, history, cards, and read-aloud.

MCQs use the separate `POST /api/clinical/vignette` JSON endpoint.
The citation protocol uses `%%FM_CITE%%` and `%%/FM_CITE%%` markers.
Flashcard parsing expects FRONT/BACK fields and card delimiters.
Keep client/server protocols aligned when changing either side.

Retrieval uses text search; an embeddings helper is not evidence that vector retrieval
is active. Citation metadata and grounding prompts do not independently verify every sentence.
The bundled reference set contains 156 historical summaries with scoped corrections,
not full copies of all guidelines or a complete current clinical review.

## 5. State and persistence

Reference data lives in PostgreSQL. Learner data lives in AsyncStorage on the current
browser/device: history, saved answers/notes, flashcards, selected app mode, coverage,
ITE scores, and vignette performance. There is no established cross-device progress sync
in this path. Read-aloud is not a hands-free conversational voice agent.

Storage keys in `AppContext.tsx` start with `@fm_copilot_`.
Preserve them for updates to the same app; use a new namespace for an unrelated product.
History and bookmarks each have a 200-entry limit. Review scheduling is an SM-2-style
implementation in `applyRating`; preserve its actual behavior rather than substituting
a different algorithm under the same name.

## 6. Reference lifecycle

Initialization creates the selected schema and retains legacy tables. Version staging
records immutable content, and the active/previous pointers support transactional activation
and rollback. Read `versions.ts` before changing activation policy.

A fresh schema without active references does not automatically become a reviewed production
library. The existing code initializes a fresh isolated preview when
`FM_REFERENCE_PREVIEW=1`; otherwise it requires an existing active library.
Preview status is a technical activation mode and is independent of whether a service
is named “main.” Do not remove that distinction or manually mark content reviewed.

The status endpoint is `GET /api/admin/rag/status`. Reindex, activate, and preview
mutations require the configured bearer token. The historical USPSTF live-feed code
is not proof of a working live feed; current ingestion uses bundled content.
Clinical currency review and a complete reviewed-release workflow remain open work.

## 7. Rebuilding an isolated copy

Use the preserved branch as the source. Do not point a new copy at the existing service
or reference schema by accident.

1. Check out this branch; install using the package manager recorded in `package.json`
   (pnpm 11.25.0 in this capture), respecting the lockfile.
2. Provision an authorized PostgreSQL connection and server-side model credentials.
   A branch contains neither resource. Review Node/package-manager compatibility for
   the chosen build environment; the recorded Railway deployment instructions specify Node 22.
3. Choose a new, valid `FM_REFERENCE_SCHEMA` matching
   `^[a-z][a-z0-9_]{0,62}$`. Use an isolated test schema for initial testing.
4. For that fresh isolated study preview, explicitly set `FM_REFERENCE_PREVIEW=1`.
   Set `EXPO_PUBLIC_REFERENCE_PREVIEW=1` at web build time to retain the review notice.
5. Run `pnpm run build:railway`: bundles the API and exports Expo web.
6. Set `PORT` for the environment and run `pnpm run start:railway`.
7. Check `/api/healthz`, reference status, a streamed answer, and MCQ generation.
   Then verify all tabs and local persistence across reloads.

Server-only variables include `DATABASE_URL`, `OPENAI_API_KEY`,
`FM_REFERENCE_SCHEMA`, and optional `FM_REFERENCE_ADMIN_TOKEN`.
`PORT` is required; `WEB_DIST` optionally overrides the exported web directory.
Keep secrets out of all `EXPO_PUBLIC_*` values. For same-origin web leave
`EXPO_PUBLIC_DOMAIN` unset. Native or separate-host development requires a reachable
API host and separate verification. Inspect the model client before changing providers;
the presence of unrelated provider variables does not implement provider switching.

This is a source reconstruction procedure. Hosted variables, service permissions,
custom domains, and database backups must be handled separately and are not captured here.

## 8. Adapting the format to another subject

Keep the navigation shell, answer renderer, streaming transport, saved-answer flow,
notes, flashcard review, and progress patterns. Replace the subject-specific condition
list, taxonomy, labels, prompt structures, evidence catalog, review limitations, and
exam framework together. Clinical fields are currently spread across types, prompts,
and screens; this is a reference implementation, not an existing generic configuration engine.

Build in this order:
1. Copy the preserved source to an isolated working branch/project.
2. Change product identity and learner-storage namespace for an unrelated app.
3. Define the target audience, subject taxonomy, supported modes, and trustworthy sources.
4. Replace content and prompts while keeping answer/citation and card/MCQ contracts consistent.
5. Adapt topic weights and progress labels; do not portray internal weights as official exam weights.
6. Validate normal, missing-evidence, conflicting-source, and failed-request cases.
7. Verify persistence, streaming, practice grading, due cards, and rollback.
8. Deploy an isolated preview for review before replacing an approved app.

### Reusable implementation brief

> Use the preserved FM Copilot branch as the UI and architecture reference for [APP NAME],
> a study tool for [AUDIENCE] learning [SUBJECT]. Preserve the useful depth, responsive
> eight-tab interaction pattern where applicable, shared answer view, citations, bookmarks
> with notes, history, MCQs, flashcards, spaced review, progress, onboarding, and themes.
> Adapt labels and modes to the subject rather than retaining irrelevant clinical concepts.
> Keep the simplest existing architecture that meets the requirements. Separate subject
> material from learner state. Use traceable sources with honest review status; never invent
> facts, citations, dates, or completion claims. Keep credentials server-side, use isolated
> storage/resources, and make content updates reversible. Inspect the source first and provide
> a concise implementation plan identifying concrete changes before building. Deliver an
> isolated testable preview with recorded validation and unresolved limitations.

## 9. Verification and maintenance

This capture adds documentation only. It does not rerun or certify historical build,
clinical, model, or deployment tests. The branch should differ from its captured parent
only by this guide.

For future code changes use the root typecheck, the mobile typecheck, and the Railway
build command in `package.json`. The reference test scripts document their PGlite setup
in [OPERATIONS.md](../guideline-refresh/OPERATIONS.md); live-answer tests require separate
authorization and funded credentials. Test passing is distinct from clinical review.

Keep the branch as a dated reference. Make future builds on separate branches, record
the starting commit, and deliberately update the blueprint when the architecture changes.
