# Reusable reference and study app blueprint

This is the starting guide for rebuilding the app's format for another subject.
The branch preserves the complete working source, not just a screenshot or prompt.

- Repository: `aibotjock/fm-resident-copilot`
- Blueprint branch: `blueprint/reusable-reference-study-app`
- Frozen application baseline: `68506810181f2b6d945b07bd698bda34f8691a10`
- Recorded: October 16, 2026
- Scope: interface, reference library, source provenance, study tools, API, testing and deployment.

**Accuracy status:** the baseline is a user-approved functional app, not a medically certified corpus. It retains 156 reference entries and 96 browsable conditions. The review includes 64 scoped corrections across 35 entries and 42 official-source evidence records. No complete entry is certified fully verified. Live answer and question testing found unsupported details and invalid or ambiguous questions. Copy the useful architecture and source-review discipline; do not treat every inherited claim or generated answer as validated.

## 1. What to preserve

The successful format combines a simple question box, topic browser, clear mode selection, structured explanations, visible source information and optional study tools. A learner can ask a question, browse a topic, read an answer, save useful material and practice it later without a complex setup.

Keep the design hierarchy: one primary action, readable sections, consistent navigation, restrained colors, responsive spacing and persistent saved work. Preserve the useful breadth of an established library while correcting specific errors. Do not substitute a tiny verified excerpt collection and imply the original coverage remains.

The same structure can serve engineering, science, languages or professional education. Replace the taxonomy and learning tasks, then select authoritative resources appropriate to that subject. Guidelines are appropriate for clinical recommendations; other fields may need official specifications, standards, textbooks, primary research or original documentation.

## 2. Actual implementation map

Paths below are relative to the repository root.

| Responsibility | Current implementation |
| --- | --- |
| Workspace and release commands | [package.json](package.json), pnpm workspace, TypeScript |
| Responsive client | [artifacts/mobile](artifacts/mobile): Expo / React Native, Expo Router, web export |
| Root providers and review banner | [artifacts/mobile/app/_layout.tsx](artifacts/mobile/app/_layout.tsx) |
| Main navigation and screens | [artifacts/mobile/app/(tabs)](artifacts/mobile/app/(tabs)) |
| Streamed answer screen | [artifacts/mobile/app/response.tsx](artifacts/mobile/app/response.tsx) |
| Topic browser | [artifacts/mobile/components/ConditionGrid.tsx](artifacts/mobile/components/ConditionGrid.tsx) |
| Answer and source rendering | [ResponseView.tsx](artifacts/mobile/components/ResponseView.tsx), [SourceCitation.tsx](artifacts/mobile/components/SourceCitation.tsx) |
| Practice and cards | [VignetteCard.tsx](artifacts/mobile/components/VignetteCard.tsx), [FlashcardView.tsx](artifacts/mobile/components/FlashcardView.tsx) |
| Local state and review scheduling | [artifacts/mobile/context/AppContext.tsx](artifacts/mobile/context/AppContext.tsx) |
| Client stream transport | [artifacts/mobile/utils/streaming.ts](artifacts/mobile/utils/streaming.ts) |
| Single-origin web and API server | [artifacts/api-server/src/app.ts](artifacts/api-server/src/app.ts) |
| Mode prompts, queries and practice API | [artifacts/api-server/src/routes/clinical.ts](artifacts/api-server/src/routes/clinical.ts) |
| PostgreSQL setup and schema isolation | [lib/db/src/index.ts](lib/db/src/index.ts) |
| Reference search and fallback | [store.ts](artifacts/api-server/src/rag/store.ts), [retrieval.ts](artifacts/api-server/src/rag/retrieval.ts) |
| Evidence context and server citation metadata | [artifacts/api-server/src/rag/evidence-context.ts](artifacts/api-server/src/rag/evidence-context.ts) |
| Reference staging, activation and rollback | [versions.ts](artifacts/api-server/src/rag/versions.ts), [ingest.ts](artifacts/api-server/src/rag/ingest.ts) |
| Original summaries and scoped updates | [artifacts/api-server/src/rag/sources](artifacts/api-server/src/rag/sources) |
| Status and guarded administration | [artifacts/api-server/src/routes/admin.ts](artifacts/api-server/src/routes/admin.ts) |
| Server model connection | [lib/integrations-openai-ai-server/src/client.ts](lib/integrations-openai-ai-server/src/client.ts) |
| Reproducible checks and review outputs | [scripts/guideline-refresh](scripts/guideline-refresh), [docs/guideline-refresh](docs/guideline-refresh) |

Although historical folders say `rag`, the active path uses PostgreSQL full-text reference lookup. It does not use a vector database or embeddings. An embedding helper exists but is not part of this query path. There is no need to add vector infrastructure just to reuse this format.

## 3. Request and response lifecycle

1. The learner selects a topic or submits a question and mode.
2. The client posts to `/api/clinical/query` with `query`, `mode` and optional `condition`.
3. The server prefers the specific condition name over generic instruction text for lookup.
4. Full-text search retrieves up to ten reference entries from the active immutable version. If necessary, a fallback search removes generic request words and numeric-only tokens.
5. Retrieved text includes source context, review limitations and scoped evidence records. Empty results return a limitation instead of an unsupported answer.
6. A mode-specific prompt asks the model to teach from that context. The answer streams through server-sent events.
7. A streaming filter suppresses model-authored footer metadata. The server adds its stored source metadata and reference version.
8. The client renders the answer and supports saving, cards, history and practice.

The five mode identifiers are `point_of_care`, `board_prep`, `documentation`, `flashcards` and `ddx`. Practice questions use a separate `POST /api/clinical/vignette` endpoint.

For a new subject, map these to reference explanation, exam/curriculum study, worked documentation, recall cards and comparison/problem solving. Remove a mode only when it has no useful equivalent.

The baseline model client selects `gpt-4o` for a direct OpenAI key and `gpt-5.2` for the older integration route. These are implementation facts at the frozen commit, not recommendations about which model to use for a future build. Configure and evaluate the chosen model explicitly.

## 4. Source quality is a core requirement

A legitimate publisher is a starting point; it does not establish that a stored summary is accurate, current, applicable or available for redistribution. A citation footer also does not prove every generated sentence follows that source.

Use this review workflow for each subject:

1. Define the audience, jurisdiction, scope and applicable curriculum or exam framework.
2. Inventory authoritative source organizations and original documents. Prefer the original issuer for recommendations or specifications.
3. Read the relevant source passage. Record the actual publication/revision date separately from the access date, plus the exact section, table or page.
4. Write faithful summaries in original wording. Record scope, exceptions and any numerical constraints precisely.
5. Trace each checked claim to evidence. Mark inaccessible, outdated, conflicting and unsupported material explicitly.
6. Check use permissions for the intended product. Record the terms or license actually examined and any unresolved permission question. Public access is not permission to copy.
7. Validate generated answers against the supporting passages, including paraphrases, comparisons, quantities and exceptions.
8. Publish an honest coverage and review status. Preserve supported teaching and identify exact gaps.

For medicine, review indication, population, dose, units, route, frequency, duration, maximum, titration, contraindications, monitoring and renal/hepatic adjustments where applicable. Do not let a prompt heading authorize a missing clinical fact.

For other subjects, check the equivalent constraints: version compatibility, units, assumptions, governing rules, edge cases and conditions under which a method fails.

### Evidence contract: implemented versus recommended

The current reference entries carry stable keys, source/title/year/domain/section/content/URL, a review status, evidence IDs, evidence records and limitations. Evidence records include an ID, organization, title, publication date, access date, URL, locator and checked claim. References and evidence are stored together in immutable versions.

For a new subject, extend this with explicit audience, applicability, exceptions, supersession and reuse-permission fields as needed. That richer contract is a design requirement for the new build, not a claim that all fields or reviews already exist here.

The server controls footer titles and URLs, but the baseline does **not** independently validate each generated sentence. Prompt instructions have failed in live samples. A reusable version must retain that limitation until stronger claim validation and subject-matter review pass.

## 5. Study data and user experience

The baseline uses AsyncStorage for history, bookmarks/annotations, cards, mode preference, topic coverage, exam/topic scores and question performance. Card scheduling is an SM-2-style rating algorithm.

This data is local to the browser/device. The deployed app does not establish cross-device account synchronization simply because database conversation tables exist. Changing the website origin may leave prior browser-local data on the old origin.

When adapting the app, preserve existing storage keys for upgrades to the same product. Give a separate product its own namespace. Add explicit migrations before changing saved structures, and test saved work after every update.

Retain loading, completion, empty-evidence and error states. Verify long answers, citations, tables/cards, interrupted streams, mobile keyboard behavior and history navigation. Keep review status visible without overwhelming the learning interface.

## 6. Versioned content and safe updates

The library uses `reference_versions`, `reference_entries`, `reference_state` and `reference_activations`. A content digest prevents changing material under an existing immutable version ID. A single state row points to active and previous versions. Transactions and advisory locks protect staging and activation.

Legacy tables remain intact. Staging does not truncate active references. New versions begin unapproved. Normal activation rejects a new unapproved version; restoring the prior active snapshot is allowed.

Incomplete candidate activation is restricted to an explicitly named isolated schema with `FM_REFERENCE_PREVIEW=1`. On a fresh isolated schema, startup stages baseline and candidate and selects the candidate. A later restart must not override a selected rollback.

The main app approved on October 16 deliberately retains this study-testing configuration and review notice. That user approval changed the functional baseline; it did not change content review flags or certify clinical accuracy. A complete reviewed-release manifest and production approval workflow remain unfinished.

For future updates: branch from the approved code, stage content separately, compare coverage and claims, test, review, preview, then promote with explicit approval. Record both code and active content IDs. Never flip readiness flags merely to avoid the review process.

## 7. Build and deployment recipe

Use Node.js 22 and the pnpm version pinned in `package.json`. Keep the workspace root available because shared packages are required.

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build:railway
pnpm run start:railway
```

The build compiles the API and exports the Expo web client. Express serves the client build and `/api` from the same origin. Use `/api/healthz` as the health check.

| Setting | Purpose |
| --- | --- |
| `DATABASE_URL` | Server-only authorized PostgreSQL connection |
| `OPENAI_API_KEY` | Server-only authorized model credential |
| `NODE_ENV=production` | Server runtime mode |
| `PORT=8080` | Example hosting port |
| `RAILPACK_NODE_VERSION=22` | Hosting Node runtime |
| `FM_REFERENCE_SCHEMA` | Separate valid schema for each isolated deployment |
| `FM_REFERENCE_PREVIEW=1` | Explicit incomplete-review study-testing mode |
| `EXPO_PUBLIC_REFERENCE_PREVIEW=1` | Compiles the visible incomplete-review banner |
| `FM_REFERENCE_ADMIN_TOKEN` | Optional server-only bearer token for mutations; absent means disabled |

For same-origin web hosting leave `EXPO_PUBLIC_DOMAIN` unset. Browser-visible `EXPO_PUBLIC_*` variables must never contain secrets. The public review flag must be present during the web build.

Deploy from a Git branch and record the exact commit. Wait for hosting SUCCESS, then verify the public page, health endpoint, active version/count and one live question. A queued deployment or successful compilation is not a successful live release.

Keep the previous deployment and reference state available. An isolated schema preserves separation of reference tables, but it is not a database backup or separate database access control boundary. Plan and verify backups before destructive migrations. Do not introduce purchases or additional hosting resources without authorization.

## 8. Test gates and known limits

| Gate | Evidence required |
| --- | --- |
| Build | Full workspace typecheck and production-style build pass |
| Reference integrity | Stable entry keys, immutable versions, evidence IDs resolve, no accidental topic loss |
| Lookup | Representative topics retrieve relevant material; unknown and generic requests do not match unrelated content |
| Update safety | Failed staging rolls back; active selection persists across restart; rollback restores prior content |
| Transport | All modes, stream parsing, cancellation/error handling and practice response parsing work |
| Learning quality | Explanations are useful, question answers unambiguous, distractors valid, cards meaningful |
| Factual support | Each substantive generated claim is supported within its scope; dates, quantities and source conflicts are handled correctly |
| Browser | Mobile/desktop layout, readable answers, citations, saved work, history and navigation work |
| Hosted release | Correct commit, successful deployment, healthy API and intended active content version |

Existing checks live in `scripts/guideline-refresh`. The SQL harness uses disposable PGlite supplied via `FM_TEST_PGLITE_MODULE`; it does not establish Railway connection-pool or disaster-recovery behavior. Fixture transport checks do not establish model accuracy. The live-answer harness is billable and requires an authorized credential; never run it against an unapproved account.

Recorded baseline evidence: workspace typecheck/build passed, 16 SQL/streaming checks passed, all 96 listed conditions matched retrieval, and three batch abort/retry checks passed. Cloud-browser smoke tests passed on the preview and primary app. Medical acceptance did not pass; full browser regression and a verified reusable release process remain incomplete. See [LIVE-REVIEW.md](docs/guideline-refresh/LIVE-REVIEW.md) and [VALIDATION.md](docs/guideline-refresh/VALIDATION.md).

## 9. Rebuild sequence for another subject

1. Create a new working branch or repository from this baseline; leave this blueprint branch as the reference copy.
2. Define audience, learning outcomes, taxonomy and authoritative sources.
3. Reuse the shell, navigation, answer components and study storage. Replace branding and subject labels consistently.
4. Build a reviewed source/evidence inventory before generating substantive lessons. Port no clinical content into an unrelated subject.
5. Replace the topic browser, reference corpus, prompts, practice schemas and scoring framework with subject-appropriate equivalents.
6. Preserve reference versioning and rollback; keep subject content outside interface code where practical.
7. Evaluate a small representative set for factual support and learning quality before expanding coverage.
8. Complete engineering checks, review useful breadth, deploy an isolated preview and record limitations.
9. Promote only the approved version. Do not label the new subject, source library or model verified on the strength of this app's engineering tests.

## 10. Copyable implementation brief

> Build a reference and study app for [SUBJECT] and [AUDIENCE], using the interface and architecture preserved at commit 68506810181f2b6d945b07bd698bda34f8691a10 in aibotjock/fm-resident-copilot.
>
> Preserve the simple question-and-topic workflow, structured explanations, traceable sources, useful study modes, saved work and versioned reference library. Use the simplest architecture that meets the learning goals.
>
> Select legitimate primary resources appropriate to this subject. Read and record supporting passages, actual dates, exact locators, applicability and reuse status. Separate checked claims from unresolved material. Never invent support or imply the whole source library is certified.
>
> Keep subject content and taxonomy separate from reusable UI, transport and storage. Reuse full-text lookup unless measured failures justify added infrastructure. Do not add model calls to deterministic tasks. Keep credentials server-side.
>
> Work on a separate branch. Preserve approved code, content and saved data. Test reference integrity, retrieval relevance, streamed answers, question validity, factual support, persistence and rollback. Provide a live preview, evidence inventory, test results, unresolved issues and exact release IDs. Obtain authorization before replacing the approved live app.
>
> Treat this blueprint as a functional reference, not a guarantee of factual accuracy, commercial readiness or medical certification.

## 11. Release provenance and historical documents

The main promotion is PR #1, merge commit `68506810181f2b6d945b07bd698bda34f8691a10`, deployed by Railway as `c465b928-d916-4a05-8bb9-2151ffa856b5`. The active reference version verified at promotion was `refresh-2026-10-15-ae430fbadf7a` with 156 entries. The preceding restored code baseline was `e3e494eb158907355b873aa0f8c8d412bd8cfb4c`.

The documents in [docs/guideline-refresh](docs/guideline-refresh) preserve the earlier review checkpoint, raw model outputs and engineering findings. Statements there saying no preview was deployed or main was unchanged describe that earlier checkpoint and are superseded for deployment status by this provenance record. Their unresolved clinical findings remain applicable. The earlier [subject-neutral brief](docs/guideline-refresh/STUDY_APP_BLUEPRINT.md) is retained.

Creating this blueprint branch does not change main, the deployed app, its database or hosting configuration. It is a reusable copy and guide, not a sanitized standalone template; review inherited dependencies, branding, source permissions and content before adapting it.
