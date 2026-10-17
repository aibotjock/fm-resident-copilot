# Validation — medication safety and advanced synthesis

## Confirmed locally

- `pnpm test:tutor`: 32 tests pass, including all original tests and seven new
  curriculum/source/coverage/review tests. Existing UI execution tests also cover
  specialist search/no-match, staged case findings, review scheduling,
  per-lesson checkpoints, spoken module selection, context replacement,
  import/export and exclusion of self-assessment from reviewed scores.
- `pnpm run typecheck:libs` followed by
  `pnpm exec tsc -p artifacts/api-server/voice-tutor/tsconfig.json --noEmit`: pass.
- `pnpm build:tutor`: pass.
- `git diff --check`: pass.
- The data set has 13 medication regimens, nine safety exercises, four advanced
  cases, eight loaded source records, eleven reference-registry entries, and a
  coverage ledger for every original library topic.

## Limits

Realtime transport is mocked in automated checks. Actual microphone capture,
provider-generated lessons and audio on the user's device are not retested.
Clinical content was checked against the cited source sections, but no independent
clinician/pharmacist review is claimed. The advanced case feedback/stage behavior
is a model instruction contract, not a validated clinical-reasoning assessment.

A local Chromium rendering attempt could not run: no browser executable was
installed and the official download returned an invalid archive. This does not
invalidate the executing DOM-control tests, but those do not establish mobile
layout or actual browser/audio behavior. Live deployment status and endpoint
checks are recorded separately after release.

## Coverage limitations

The checked antibiotic starter lessons cover strep pharyngitis and uncomplicated
chlamydia/gonorrhea within their stated populations. Other infection topics remain
studyable using their existing evidence and explicit official-page lookup.
No complete antibiotic formulary, connected commercial database, automatic
monthly refresh, full special-population coverage or independently validated
scoring is claimed. A new lookup is separate unverified page content, not a
silent snapshot update. See the build specification for the content lifecycle.
