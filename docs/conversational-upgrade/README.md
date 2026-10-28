# FM Copilot conversational evidence and Android preview

This branch adds a shared evidence service and a signed Android host for the existing study interface and expanded voice tutor. **The preview backend is staged, not activated.** Automatic approval review requires the user's explicit confirmation of the environment-scoped deployment.

## Run and build

```sh
pnpm install --frozen-lockfile
pnpm build:conversation
# Reuse the existing server-side OPENAI_API_KEY. Also configure FM_TUTOR_ACCESS_TOKEN.
FM_COMBINED_APP=1 pnpm start:tutor
```

The combined server provides the original Expo web interface at `/`, the tutor at `/tutor`, and their authenticated APIs on one origin. The legacy `start:railway` entrypoint is retained for the original deployment; the new preview explicitly uses `start:tutor` with `FM_COMBINED_APP=1`.

The Android host requires a JDK, Android SDK platform 35 and build-tools 35.0.0:

```sh
ANDROID_SDK_ROOT=/path/to/android-sdk \
FM_ANDROID_BASE_URL=https://fm-copilot-android-preview-private-test.up.railway.app \
python scripts/build-android-preview.py
```

Output: `android-preview/build/FM-Copilot-Preview.apk`. Package: `org.fmresidentcopilot.preview`. Minimum Android API 26; target API 35. This is a WebView host for the preserved interfaces, not a newly rewritten native Expo UI. It needs internet access for the hosted app and AI functions. No OpenAI key or tutor access code is embedded. It installs separately and does not migrate another app's or browser's local storage automatically.

## Architecture and implemented behavior

- `source-registry.ts`: configurable society/agency registry and explicit journal publication domains. Registry inclusion is not a claim of clinical review, universal coverage or cleared redistribution rights.
- `evidence.ts`: official-domain discovery using Responses web search, followed by actual bounded HTML/plain-text/PDF reads. Search snippets do not become clinical evidence. Redirects and DNS addresses are checked; executable HTML is removed; table headings are retained. Source-body caching is bounded and holds no patient query text.
- Claims link to literal supporting quotations. Numerical statements must match quoted numbers. Medication records separately represent indication, population, dose, units, basis, route, frequency, duration, maximum, formulation, adjustments and precautions. Unsupported fields or statements are omitted with explicit gaps. These are structural checks, not proof of semantic entailment or medical correctness.
- `dose-arithmetic.ts`: deterministic arithmetic only for a supported numerical mg/kg regimen with an explicit dose basis, frequency and scoped maximum. No volume/concentration conversion, renal calculator or undocumented population rule is inferred.
- `presentation.ts`: shared source-code removal and speech formatting. Treatment table contents, digits, units, negations and qualifications remain present. Long speech is chunked rather than silently truncated.
- `server.ts`: authenticated conversation, scenario, speech, calculation and evidence-status APIs. Conversation is transient within the private session. Obsolete results are rejected after cancellation or case changes. Original clinical screens use compatibility adapters to this service. Legacy guided cases retain their existing practice flow and gain a shared evidence lookup tool.
- Evidence voice uses Realtime for microphone transcription with automatic answer generation disabled. Transcripts are sent through the same answer service as text; the canonical answer is displayed and supplied to speech. Spoken medication questions are held for confirmation/correction of recognized wording. Original guided voice practice remains available separately.
- Quick answers, teaching explanations and unscored one-question-at-a-time quizzes are available. Generated quiz answers/explanations are suppressed before the learner responds. Existing reviewed-bank grading remains separate and is not relabeled clinically validated.
- Confirmed case details and hypothetical changes are separate. Supported spoken modifiers such as pregnancy or a named renal-function measure are reflected in that state. Restore removes a variation; new case clears prior conversation context.
- Existing confidence-aware review, concept tracking, practice performance, curriculum reviews and ITE records remain. Explicitly saved evidence answers have source versions and self-assessed review intervals. Changed document versions pause affected items; previous/new passages can be compared, and replacing a study copy preserves its previous version and review history.
- Device backup/import controls preserve existing storage key names. Prior tutor storage is backed up before applying the new conversation-retention preference. Conversation and case checkpoints are temporary by default; remembering them is opt-in. Explicitly saved study material should contain no patient identifiers.
- Android requests microphone permission only for the configured HTTPS app origin, opens external source links outside the app, supports JSON import/export and provides device speech fallback. Backgrounding ends capture.

## Evidence freshness and limits

The registry and historical curriculum are not independently clinically certified. Original summaries remain labeled with their limitations. A new access date does not establish a new publication date. Missing dates stay unknown. Source document classification is model-assisted, not independently adjudicated. Partial updates, conflicting recommendations and unresolved scope must remain explicit.

Document versions reflect content hashes; a changed page can reflect editorial changes rather than a changed recommendation. The app flags possible changes and supports comparison rather than automatically declaring a clinical recommendation superseded. Detection occurs when sources are fetched again; no recurring monitoring task was created.

Paywalls, inaccessible PDFs, robots/challenge pages and provider failures remain possible. Full guideline access, licensing clearance, qualified clinical review and comprehensive off-label dosing coverage are not claimed. GINA/GOLD and journal reuse terms require particular attention before commercial redistribution.

Defaults reuse the existing Realtime model and use configurable `FM_EVIDENCE_SEARCH_MODEL` / `FM_EVIDENCE_ANSWER_MODEL` (default `gpt-4.1`) and `FM_SPEECH_MODEL` (default `gpt-4o-mini-tts`). Provider availability and clinical output must be checked after activation.

## Validation

```sh
pnpm run typecheck
pnpm --filter @workspace/api-server exec tsc -p voice-tutor/tsconfig.json --noEmit
pnpm test:tutor
pnpm test:evidence
```

The browser harness starts a local combined server when `FM_BROWSER_SPAWN_LOCAL=1`. Set `FM_CHROME_PATH` to an installed headless browser. It uses synthetic responses for interface checks; it does not certify live clinical output. The optional Android emulator harness is `scripts/test-android-preview.py`.

Observed results are recorded in the handoff. The software emulator did not finish booting, so no install/launch or physical microphone pass is claimed. Live provider/search/speech checks are pending preview activation. A bounded release smoke routine can run after activation with `FM_PREVIEW_RELEASE_SMOKE=1`; its results report transport, passage linkage and limitations, never medical approval.

## Deployment boundary and rollback

Only the new `fm-copilot-android-preview` service in `private-test` is staged. Its OpenAI key and access code reference the existing voice-tutor service without exposing values. The existing application services and main branch were not repointed or merged.

Activate the inspected, non-destructive staged source patch only after explicit user confirmation. Do not substitute a project-wide live connect. Rollback consists of stopping the new preview service or selecting its previous reviewed commit; the original services, curriculum and local study data are independent. There are no database migrations or ingestion changes in this preview.

## Outstanding review

1. User confirmation to activate the staged preview backend.
2. Live source/model/speech smoke checks after activation, followed by fixes if those checks fail.
3. Installation and voice checks on a real Android device; no emulator pass was obtained here.
4. Qualified clinical review across representative adult, pediatric, pregnancy, renal, hepatic and conflicting-guideline cases. Existing tests use synthetic engineering fixtures and historical source-scoped bank cases, not a newly clinically reviewed release.
