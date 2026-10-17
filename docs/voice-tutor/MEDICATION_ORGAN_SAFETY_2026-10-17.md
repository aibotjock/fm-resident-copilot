# Medication organ safety update — October 17, 2026

The existing 13 medication-regimen lessons now include scoped contraindication,
renal, hepatic, interaction and monitoring practice. Eleven generic drugs are
covered: amoxicillin, penicillin V, cephalexin, doxycycline, azithromycin,
ceftriaxone, metformin (IR/ER), sertraline, lisinopril, spironolactone and apixaban
(AF/VTE). Existing safety lessons receive matching profiles. Ordinary guided
library lessons load safety evidence only for these drugs when explicitly named
in the selected topic's content. Uncovered medicines remain evidence gaps.

The tutor asks for the learner's decision before explaining, one question per
turn, then revisits a supported decision with changed simulated context. This
is unscored practice and does not alter reviewed assessment answers or scores.
Notes display contraindications, organ rules, interactions, monitoring, sources
and gaps. Spoken citations are not routinely read; exact source IDs remain in
the transcript and full provenance can be supplied on request.

## Evidence and currency

`artifacts/api-server/voice-tutor/curriculum.json` retains each exact source URL,
section, available source date and access date (2026-10-17). Each medication
profile identifies its supporting source IDs. Only original concise factual
paraphrases are stored, not copied proprietary monographs or institutional
reference tables. Source snapshots are not a connected, continuously updated
formulary. Null publication dates mean unavailable in this record, not today's
date. A successful page access does not prove that no newer evidence exists.
No claim of blanket AAFP/ABFM endorsement or independent clinical validation is
made. Formal contraindications remain distinct from avoid-use warnings,
precautions, dose changes, explicit no-adjustment guidance and absent guidance.

- CDC current public pages were rechecked for strep, chlamydia and gonorrhea
  regimens, including the weight-dependent gonorrhea dose.
- DailyMed's exact product labels were checked for drug-specific contraindications,
  organ impairment and other selected safety rules. Manufacturer labeling can
  contain older indication regimens: the ceftriaxone label's older gonorrhea dose
  is explicitly excluded from teaching in favor of the loaded CDC regimen.
- UCSF's adult doxycycline page supplies renal/dialysis adjustment guidance.
  Do not extrapolate adult institutional tables to children.
- Nebraska Medicine/UNMC and IDSA remain supplementary public reference links;
  their full protocols have not been ingested. No new Nebraska-specific dose is
  represented as loaded evidence. Public reading access does not establish
  permission to redistribute complete reference tables in a commercial app.
- Lexidrug, Sanford and other commercial databases remain unconnected.

Known limits are explicit: penicillin V quantitative organ adjustments are not
established in the loaded profile; azithromycin's profile does not supply a
complete renal/dialysis schedule; several drugs lack a quantitative hepatic
schedule. Contraindication examples and interactions are selective, not an
exhaustive interaction checker. Dialysis and child renal regimens are taught
only where explicitly supported. Apixaban AF reduction criteria must not be
transferred to VTE. CrCl must not be silently substituted for indexed eGFR.

## Verification

- `pnpm test:tutor`: 35/35 pass (including existing regression coverage).
- `pnpm run typecheck:libs`: pass.
- `pnpm exec tsc -p artifacts/api-server/voice-tutor/tsconfig.json --noEmit`: pass.
- Tutor build and executing UI-control tests pass. Tests verify all 13 regimens
  expose organ-safety evidence and contraindications, exact source linkage,
  population/indication limits, missing guidance, scoped evidence selection,
  assessment isolation, and actual rendering of safety notes and source IDs.
- No live provider generation or real-device microphone/audio validation is
  claimed; instruction tests do not independently validate model adherence or
  clinical correctness. Independent clinician/pharmacist review remains pending.

## Release and rollback

Only the existing `fm-socratic-voice-tutor` private-test service is targeted.
Keep the current branch `feature/medication-safety-advanced-2026-10-17` and the
approved backup branch. The immediately preceding working medication release is
`211d3db4a1f51e2f741e2df9445af377ebb0f044`; reconnect the tutor service to that
commit to roll back this update. No database or learner-progress migration is
required. Non-voice services are outside this change.
