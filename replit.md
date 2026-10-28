# Current conversational preview branch

See `docs/conversational-upgrade/README.md` for the shared evidence service, Android preview, tested commands, source limits, and staged deployment. This preview uses `pnpm build:conversation` and `FM_COMBINED_APP=1 pnpm start:tutor`. Notes below retain historical baseline architecture and must not override current user authorization or describe the preview as indexed-only.

# Candidate branch status

This branch preserves the approved restored app and stages a partial guideline refresh. Production and main are unchanged. Read `docs/guideline-refresh/README.md` for actual coverage, evidence, blockers, checks and rollback. The historical notes below describe the original architecture and are not current clinical verification.

# FM Resident Copilot

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

**App**: FM Resident Copilot — an Expo React Native mobile app for family medicine residents. A fact-based, evidence-based, guideline-based RAG tool restricted to indexed sources only. Provides guideline-directed clinical practice (Point of Care, Documentation, DDx) and ABFM board exam preparation (Board Prep, Flashcards, Progress) organized around the ABFM Content Blueprint. Prompts request source grounding; this does not guarantee that generated statements are correct.

### Key Architecture Decisions
- RAG restricted to **Tier 1** (ABFM Blueprint, USPSTF live feed, AAFP, CDC/ACIP) + **Tier 2** (ADA, ACC/AHA, GINA, GOLD, IDSA, AAP, ACOG, KDIGO, ATS, Endocrine, ACR, APA, AAN)
- Pharmacy questions restricted to ACPE-only sources
- Citation block format: `%%FM_CITE%%{...}%%/FM_CITE%%` emitted by API at end of every response; parsed by streaming.ts, displayed via SourceCitation component
- Retained organ-system study topics keep their storage identities. Official ABFM activity-domain weights are separate; internal topic weights are not exam percentages.
- The historical USPSTF API paths failed during restoration. This candidate does not present them as a functioning live feed; verified bundled recommendations are distinguished from historical content.
- **True RAG pipeline**: 156 historical reference entries (baseline v10) using historical topic labels (not the current five-domain ABFM blueprint) stored in PostgreSQL with FTS (`tsvector`/GIN index); every clinical query retrieves the top 10 most relevant chunks using `websearch_to_tsquery` + `ts_rank`, injected as `[REF N]` formatted context blocks into the LLM system prompt before generation
- RAG retrieval uses PostgreSQL Full-Text Search (FTS) — no external embedding API required; `content_tsv` generated column indexes source + title + section + content for each chunk
- Guideline chunks cover all 16 ABFM domains from ACC/AHA, ADA, APA, GINA, GOLD, IDSA, ACOG, AAP, KDIGO, USPSTF, CDC/ACIP, AAFP, Endocrine Society, ACR, AAN
- Candidate ingestion uses immutable versions and an atomic active pointer. It never clears the previous library. Incomplete versions activate only in an explicitly isolated preview; normal startup does not promote a candidate.
- Admin endpoints: `GET /api/admin/rag/status` (chunk count, version, timestamp), `POST /api/admin/rag/reindex` (force re-ingest)
- SRS (Spaced Repetition System) using SM-2 algorithm, persisted locally via AsyncStorage
- Domain coverage tracked per-session and per-domain against ABFM blueprint weights
- ITE (In-Training Exam) scores stored locally; low-scoring domains surfaced as study priorities

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

#### RAG Infrastructure (`src/rag/`)
- `store.ts` — PostgreSQL FTS search (`searchByText` using `websearch_to_tsquery`), batch insert without embeddings, metadata CRUD
- `retrieval.ts` — retrieves top 10 relevant chunks for any query using FTS; falls back to OR-based `to_tsquery`
- `ingest.ts` — version-gated orchestrator (`ensureIngested()`, `runIngestion(force?)`); auto-runs at startup
- `sources/seed-data.ts` — 156 historical reference entries (baseline v10) covering all 16 ABFM domains (AASM, ACR, ADA, ACC/AHA, AGS, AAD, ACG, AASLD, IDSA, KDIGO, AUA, AAN, ACOG, AAP, CDC, DHHS, SAMHSA, APA, AAFP, BTS, CHEST, ATS, ESC/ERS, NAEPP, Endocrine Society, NHLBI, ASH, ACCP, SCCM, AAOS)
- `sources/uspstf-ingest.ts` — live USPSTF API → chunks with domain inference
- `embeddings.ts` — reserved for future vector embedding upgrade

#### Database Tables
- `guideline_chunks` — id (uuid), source, tier, guideline_title, guideline_year, abfm_domain, section, content, url, embedding (vector 1536, reserved), content_tsv (tsvector, GIN indexed, generated)
- `rag_metadata` — key/value store for ingest version, timestamp, chunk count

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /healthz` (full path: `/api/healthz`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

## Key Mobile Features (v6)

### Vignette Practice Mode (Board Tab)
- `POST /api/clinical/vignette` — non-streaming endpoint that returns structured JSON MCQ `{question, options:{a,b,c,d}, answer, explanation, domain, source}`; weighted random ABFM domain selection; RAG context injected into vignette prompt
- `components/VignetteCard.tsx` — interactive MCQ component: tap answer, see green/red feedback, reveal explanation, session score tracker, "Next Question" flow
- Board tab has `Study` / `Practice MCQs` mode toggle; Practice mode includes domain selector (random or any of 16 ABFM domains), session score tracker, and reset

### Bookmark Notes
- `AppContext.tsx` → `updateBookmark(id, note)` — persists personal annotation to any saved bookmark via AsyncStorage
- `bookmarks.tsx` — "Add note" / "Edit note" button on each card; Modal with TextInput + 500 char limit; note text shown inline below query

### Onboarding Screen
- `components/OnboardingModal.tsx` — 3-panel first-launch carousel (Guideline-Grounded Answers, Five Clinical Modes, Important Disclaimer); paginated with dot indicators; "Get Started" saves `@fm_copilot_onboarded` flag; Skip available
- `app/_layout.tsx` — checks AsyncStorage on mount; shows OnboardingModal as fullScreen modal on first launch only
