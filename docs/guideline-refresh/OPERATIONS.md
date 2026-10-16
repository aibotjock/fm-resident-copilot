# Candidate activation and rollback

Production has not been modified. Do not merge this checkpoint as a release.

## Local checks

Additional continuation checks:

```
pnpm run typecheck
# From artifacts/api-server (uses node loader, avoiding tsx CLI IPC):
node --import tsx ../../scripts/guideline-refresh/batch-check.ts
# From repository root; billable, requires an authorized local key:
FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/live-answers.cjs
FM_LIVE_VIGNETTES=1 FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/live-answers.cjs
```

The live harness uses disposable local PGlite, not DATABASE_URL. Its outputs are unverified generated material for review. It records reconstructed baseline prompts as a limitation. Set FM_LOCAL_PREVIEW=1 and FM_LOCAL_PORT=8766 to serve an isolated local app without executing the sample batch; bind is loopback only. This is not a hosted preview link.

Use the repository's existing pnpm workspace. The SQL regression harness requires `@electric-sql/pglite` as a test-only dependency, installed outside the app or provided through `FM_TEST_PGLITE_MODULE`. This dependency is not added to the deployed app.

```
FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/test.cjs
FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/coverage.cjs
FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/api-smoke.cjs
pnpm --filter @workspace/mobile exec tsc --noEmit
pnpm run build:railway
```

Run scripts from the repository root. Test database data is local and temporary. Fixture transport tests make no OpenAI request.

## Isolated app preview when credentials and infrastructure are available

Use this branch and a preview-only PostgreSQL schema, e.g. `fm_guideline_preview_20261015`. Set `FM_REFERENCE_SCHEMA` to that value and `FM_REFERENCE_PREVIEW=1`. Supply an authorized existing `DATABASE_URL` and OpenAI credential through the hosting service's secure variable system. Do not put credentials in browser-visible variables or files. Do not point preview writes at the production schema.

Build with `pnpm run build:railway`; start with `pnpm run start:railway`; health route `/api/healthz`. Initialization stages the baseline and candidate and activates the candidate only in that isolated schema. For a same-origin web deployment leave `EXPO_PUBLIC_DOMAIN` unset.

Production schema migration is additive: original `guideline_chunks` and `rag_metadata` are retained. Before any actual production migration, take a provider-supported database backup and verify restoration. No production backup was taken here because no production database writes were performed.

`GET /api/admin/rag/status` exposes active/candidate version IDs and honest review status. Mutating routes are disabled unless `FM_REFERENCE_ADMIN_TOKEN` is configured and the bearer token matches.

The reindex route stages immutable bundled content. It never truncates active references. The activation route rejects a new unapproved candidate; it permits restoration of the immediately prior active version. Preview activation is isolated and explicit. Every activation records its reason and old/new version IDs.

A reviewed release manifest and production approval are still pending. No ready flag should be manually flipped to bypass this review.

## Rollback rehearsal

The SQL harness activates an isolated candidate, verifies the prior version pointer, restores that previous snapshot, and verifies the restored active ID and entry count. It also injects an insertion failure and confirms no partial version or active-pointer change survives. This is tested PostgreSQL behavior in PGlite, not a production restoration rehearsal.

For a future approved deployment, code rollback must use the recorded prior Git commit, and content rollback must restore the recorded prior reference version. Keep both IDs in the deployment record. Do not discard old snapshots or user data.

## Future review cadence (proposal only)

Review official-source change notices monthly, prioritize FDA withdrawals/safety alerts as soon as detected, and perform broader topic reviews on a documented schedule. Build a candidate, produce a claim/coverage diff, validate, review, then activate. No schedule or automation was created.
