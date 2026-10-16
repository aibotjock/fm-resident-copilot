# Restored FM Resident Copilot on Railway

Primary branch: `main`. The restoration checkpoint remains on `restore/full-expo-copilot-2026-10-15`.

This branch restores the original Expo interface, including differential diagnosis,
saved answers, history, spaced repetition, progress, ITE scores, and read-aloud controls.
The Express service serves the Expo web export and API at the same address.

## Existing Railway service

Open the existing `fm-resident-copilot` service:
https://railway.com/project/3d314e6c-8def-4947-949a-eef7ce930e63/service/adcc25fc-c754-4630-8d67-7878c1b5a070?environmentId=05fb154d-1946-4db0-bf4e-786727e505df

Apply the staged source/configuration changes in Railway to deploy this branch.
No new service or database is needed.

If configuring manually:

- Repository: `aibotjock/fm-resident-copilot`
- Branch: `main`
- Root directory: repository root (leave blank)
- Builder: Railpack
- Build command: `pnpm run build:railway`
- Start command: `pnpm run start:railway`
- Pre-deploy command: none (remove the old `npm run db:push --prefix server`)
- Health check: `/api/healthz`
- Node: 22 (`RAILPACK_NODE_VERSION=22`)
- Preserve the existing `DATABASE_URL` and `OPENAI_API_KEY` variables.
- Do not set `EXPO_PUBLIC_DOMAIN` for the hosted web app; requests use the same origin.
- Keep the current domain pointed at port 8080 (Railway supplies `PORT`).

Startup creates the separate `fm_copilot_restored` PostgreSQL schema and ingests
this version's bundled reference set. It does not alter the current app's public-schema
tables. The first reference ingestion continues in the background after health checks pass.

The restored AI code uses OpenAI; `AI_PROVIDER`, `TYPESAFE_API_KEY`,
and `TYPESAFE_MODEL` do not switch this version's provider.
No `STUDY_ACCESS_TOKEN` login gate exists in the historical app.
Do not put credentials in `EXPO_PUBLIC_*` variables: those are shipped to browsers.

Progress, bookmarks, history, flashcards and ITE scores are stored on the current
browser/device, not in the PostgreSQL database. Their presence does not imply cloud sync.

## Validation and rollback

After Railway reports SUCCESS, open:
https://fm-resident-copilot-private-test.up.railway.app

Check onboarding and all eight tabs. AI queries additionally require a valid funded
OpenAI key. Restoring the interface does not verify the currency of historical medical content.

To return to the simple web app, reconnect `backup/simple-web-before-restoration-2026-10-15`, restore the previous build
command and start command, and deploy. Its reference tables remain intact.
