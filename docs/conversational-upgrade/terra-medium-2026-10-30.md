# Terra medium and longer evidence conversations

The owner selected GPT-6.1 Terra at **medium reasoning**, stopped the model-comparison work, and prioritized speed, brief accurate answers, longer sessions, and reliable memory. This update targets the existing evidence conversation and evidence-voice path. It preserves the existing study screens, reviewed question bank, assessment grading, source registry, and the separate legacy guided Realtime path.

## Resulting behavior

- Evidence search and answer generation default to `gpt-6.1-terra`. Both Responses requests explicitly send `reasoning.effort: medium`; the setting is configurable through `FM_EVIDENCE_REASONING_EFFORT`. Compatible older model overrides omit unsupported reasoning parameters.
- Quick answers target 2–5 short sentences. Required medication units, contraindications, organ adjustments, qualifications and uncertainty take precedence over brevity. Clinical claims still require the existing supporting-passage checks, and old conversation content is explicitly not a clinical source.
- The client no longer ends a voice session after 20 minutes. It renews the Realtime transport after 45 minutes, retaining evidence-conversation state and microphone mute state. Manual End cancels renewal and releases capture. Network/provider failures still require a reconnect; uninterrupted transport and medical equivalence are not claimed.
- Authenticated activity extends the one-hour **idle** expiry. An active voice connection sends a keepalive every two minutes. Idle sessions still expire; credentials and authorization protections remain.
- Cumulative study-call limits are disabled by default. `FM_EVIDENCE_SESSION_LIMIT`, `FM_REFERENCE_SESSION_LIMIT`, and `FM_VOICE_SESSION_LIMIT` accept a positive optional cap; `0` disables that cap. These settings do not remove provider rate limits or billing.
- Evidence conversation memory retains verbatim messages rather than making an unverified medical summary. Each request includes recent context and matching older exchanges, with opening case context retained. Selection is bounded to 384,000 serialized UTF-8 bytes, and the rolling transcript is bounded to 1,800,000 bytes and 5,000 messages. These are application byte budgets, **not token counts** and not a promise of perfect recall. The archive can roll over, with a visible notice.
- Device conversation retention uses the existing checkbox and storage/export mechanism. New profiles enable retention, while a previous explicit preference is preserved. Disabled retention excludes the evidence transcript and case checkpoint from persistence. Resume rehydrates explicit confirmed/hypothetical facts after a new server session; a new case clears active prior-case context.

## Deployment settings

Apply only to `fm-copilot-android-preview` in the project's `private-test` environment:

```
FM_EVIDENCE_ANSWER_MODEL=gpt-6.1-terra
FM_EVIDENCE_SEARCH_MODEL=gpt-6.1-terra
FM_EVIDENCE_REASONING_EFFORT=medium
FM_EVIDENCE_SESSION_LIMIT=0
FM_REFERENCE_SESSION_LIMIT=0
FM_VOICE_SESSION_LIMIT=0
```

Keep the existing server-side OpenAI credential and private access code. Terra is the text reasoning backend, not an audio model; speech generation and transcription remain separate. The runtime health endpoint reports the configured model, reasoning effort and memory budgets. Configuration alone does not establish provider access or clinical accuracy.

The prior preview source is branch `feature/evidence-conversation-android-2026-10-28`, commit `1c2ba8f102ab52df50cbea79b83f55f6e7a1f90d`. Reverting requires restoring that source and its prior variable settings together; in particular the old code interprets a zero evidence-call limit differently.

## Verification and limits

## Local performance records

The existing device Backup/export also includes `performanceMetrics`: the last 500 timing samples plus daily UTC aggregates, separated by reported model and reasoning effort. These records include answer round trips, speech-request duration, detected speech-stop-event to playback-event delay, evidence-voice connection duration, source support status, context/archive message counts, and provider-reported input/output/cache/reasoning token counts and web-search calls. They contain no added question/answer text, access codes or source contents. They are stored on the device, not sent to a new analytics service.

The speech-stop timestamp is when the browser receives that event; playback is the browser's playback event, not a physical acoustic measurement. Medical transcription confirmation time is not labeled as model processing. Unknown provider usage is recorded as unknown, not zero. Clinical accuracy remains explicitly unmeasured. Token/search usage is not a complete bill: speech, hosting, cache-write and other provider charges still require billing reconciliation. Daily aggregates retain prior measurements when the detailed sample window rolls over. No verified historic GPT-6.1 Sol timing record was found in the inspected FM preview; records must not be invented or borrowed from another project.

The existing signed Android installer is a thin HTTPS host for this same preview origin. Hosted changes do not require a differently signed APK or uninstalling the existing preview. Its installation package should be reused only after its origin, package and signature have been verified.

## Engineering checks

Tests cover source and dosage guards, old-fact retention beyond six exchanges, verbatim retrieval, byte budgets with multibyte text, role filtering, explicit model/effort in provider requests, active-session renewal, checkpoint restoration, new-case isolation, and simulated browser voice renewal/mute/manual-stop behavior. The existing study-app export is built as part of `pnpm build:conversation`.

Commands:

```
pnpm typecheck:libs
pnpm --filter @workspace/api-server exec tsc -p voice-tutor/tsconfig.json --noEmit
pnpm test:evidence
pnpm test:tutor
pnpm build:conversation
```

These are engineering checks, not the cancelled 300-question model benchmark or independent clinical validation. Real Galaxy microphone/audio timing, long-duration physical-device renewal, battery, heat and perfect long-term recall are not established here. Deployment status and bounded live smoke results must be reported separately after deployment.

Official API references checked October 30, 2026:

- https://developers.openai.com/api/docs/models/gpt-6.1-terra
- https://developers.openai.com/api/docs/guides/realtime-conversations
