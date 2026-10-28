# Conversational evidence upgrade — 2026-10-28

## Baseline established

- Main: `6850681`; live tutor source: `4206104` on `feature/antibiotic-condition-expansion-2026-10-17`.
- Original full interface live service uses `experiment/socratic-voice-tutor-2026-10-16`, deployed commit `32a86d3`.
- Baseline tutor suite: 65/65 engineering tests pass. These are not independent clinical validation.
- Work branch: `feature/evidence-conversation-android-2026-10-28`, based on the expanded tutor.
- User explicitly authorized reuse of existing server-side OpenAI configuration.
- No local OpenAI key; Railway OAuth exposes names only. Use Railway reference variables, never copy keys into an APK or source.

## Delivery sequence

1. Shared source registry, safe retrieval, claim/passage contracts, presentation and medication validators.
2. Authenticated conversation API; Realtime evidence function; modes, transient context and cancellation.
3. Study interface compatibility, evidence inspection and adaptive/evidence-aware saved learning.
4. Isolated preview backend; no repointing existing services or main merge.
5. Signed Android preview APK wrapping the preserved web interfaces with microphone permission, trusted-origin navigation and device-local storage.
6. Engineering regression, browser flows, live-source/provider checks where access permits, honest clinical-review limitations and reproducible handoff.

## Clinical readiness

Retrieved passages, machine-linked claims and qualified clinical review are separate states. No qualified clinical review is established by this implementation. Do not certify corpus currency or generated recommendations based on passing tests.
