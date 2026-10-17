# Outstanding build acceptance test — October 17, 2026

Tested deployment: `bbbfbb5a0f8534c7fd193d3543e946cfddc6dba4` (curriculum v6).

**Software checks pass within the tested scope. The full clinical curriculum and real-device voice validation remain incomplete.** This test release changes tests, test configuration and documentation only; no application runtime/content, deployed credentials, main branch or non-voice app changes were required.

## Results

- 60 automated tests passed, zero failed; tutor TypeScript check, bundle build and whitespace checks passed.
- Every one of the 156 original topics was searched by its title and selected through the authenticated in-process HTTP API. Selected evidence was checked against the voice-only teaching reconciliations.
- Every one of the 212 specialist lessons was searched and selected through the authenticated in-process HTTP API. Its own source IDs loaded, and assessment mode excluded specialist teaching.
- 38 live HTTP checks passed against the pinned deployed commit. The deployed HTML matched the locally tested HTML byte for byte.
- A real provider-backed Realtime SDP exchange returned HTTP 200 using the deployed server-side key. The local WebRTC transport then failed with `PermissionError: [Errno 1] Operation not permitted`. No generated response or speech was received, and no microphone recording was used.
- The browser rendered the public login screen. Secure browser unlock was not completed, so signed-in real-browser interaction/layout tests were not run. No alternate credential-entry method was used.

## Original requirements and evidence

| Requirement | What was verified | Status and limit |
|---|---|---|
| Library discovery and topic switching | All 156 title searches and selections; live pyelonephritis, inpatient-pneumonia alias and sinusitis search/selection; stale context/handshake tests | Software pass; actual spoken model tool choice unverified |
| Guided cases | Ordered vignette, differential, testing, diagnosis, treatment, dosing and conclusion contract; default unscored conversation; stale scored-block cleanup | Instruction/handler tests pass; generated full-case progression unverified |
| Medication regimens | 130 medication lessons, including 123 antibiotic lessons; all lesson fields, component profiles, provenance, population/route distinctions and medication search | Software/data structure pass; indication-wide coverage remains partial |
| Safety and prescribing pitfalls | Nine exercises; contraindication, precaution, adverse-effect and prescribing-pitfall categories; SIADH distinction and organ-safety scope checks | Software/contract pass; not independent clinical validation |
| Advanced synthesis | All four case selections live; staged reveals, nine stages, eight-dimension qualitative rubric, patient constraints, uncertainty, retry and oral synthesis contract | Software/contract pass; model delivery of a complete advanced conversation unverified |
| Essential versus optional depth | Explicit concise-essential/optional-depth instructions are loaded | Instruction contract present; generated behavior unverified |
| Criteria and decision rules | 57 entries all have scoped facts; all load through the API; GCS recognition cases and untestable-response safeguards load live | 39 rule summaries and 18 purpose/interpretation entries; overviews intentionally lack full calculation tables |
| Reviews and progress | Existing executing UI tests cover lesson checkpoints, self-assessed scheduling, old-file import compatibility, export/import, local persistence and separation from scored events | Simulated DOM-handler tests pass; signed-in browser/device persistence unverified |
| Reviewed practice | Immutable keys, hint/retry, assisted-credit limits, delayed assessment feedback, timeout/exhaustion and explicit-end feedback | Automated pass; live assistance, delayed-feedback and stale-block checks pass |
| ITE comparisons | Same-year/metric/domain comparisons, PGY context, blank/decimal values and no fabricated conversions | Automated pass; no live national data feed or practice-to-ITE validation claimed |
| Source registry and lookup | Loaded versus reference-only/commercial-unconfigured boundaries; approval and exact-product/URL gates; invalid inputs rejected | Automated pass; live negative approval/product checks pass; no commercial database access claimed |
| Voice controls | Mocked handshake, microphone mute/release, interrupted/stale sessions and navigation tools | Automated pass; real SDP exchange passes; actual audio, barge-in, mobile autoplay and microphone performance unverified |
| Private access and deployment | Unauthorized APIs denied; secure HttpOnly SameSite cookie; no-store responses; exact release identity and HTML | Live pass; application deployment remains pinned to the tested commit |
| Rollback | Existing approved-baseline backup and rollback instructions retained | Documentation present; no destructive rollback drill performed |

## Clinical content that tests do not complete

The current coverage ledger records remaining scenarios in 31 condition pathways. Examples include resistant/specialist infection courses, pediatric/pregnancy branches and complete kidney/liver/dialysis protocols. A mapped regimen is not proof that every scenario is covered. All four advanced cases explicitly name clinical protocols outside their loaded evidence.

The 18 purpose-and-interpretation rule entries are intentionally constrained, not broken calculators. Full calculation teaching would require additional verified source material. This acceptance test does not add clinical claims or clear those evidence limits. Independent clinician/pharmacist review remains pending.

## Reproduce

The standard `pnpm test:tutor` command now includes `build-acceptance.test.ts`. In this workspace, pnpm's recursive task runner rejects the pre-existing shared `node_modules` symlink. The same underlying test command was run directly from `artifacts/api-server`:

```sh
FM_TUTOR_TEST=1 node --import tsx --test voice-tutor/tutor.test.ts voice-tutor/learning.test.ts voice-tutor/library.test.ts voice-tutor/curriculum.test.ts voice-tutor/antibiotic-expansion.test.ts voice-tutor/build-acceptance.test.ts
```

From repository root:

```sh
pnpm exec tsc -p artifacts/api-server/voice-tutor/tsconfig.json --noEmit
node artifacts/api-server/voice-tutor/build.mjs
git diff --check
```

Machine-readable check outcomes are recorded in `BUILD_ACCEPTANCE_2026-10-17.json`. Content/source coverage remains in `antibiotic-expansion-2026-10-17/coverage.json`. Historical starter-build validation below is not the current test count.
