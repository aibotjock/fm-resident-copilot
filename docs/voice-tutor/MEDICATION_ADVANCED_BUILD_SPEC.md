# Medication safety and advanced synthesis build

Authorized scope: the FM Copilot voice-tutor additions agreed October 17, 2026.
Implementation branch: `feature/medication-safety-advanced-2026-10-17`.
Approved baseline: `04d3cbe499752e3a60db959edfcd177c92fcf790`.
Fixed recovery branch: `backup/approved-voice-tutor-2026-10-17`.

## Preserve the approved experience

Keep the independent voice tutor, its topic catalog, voice handshake, interruption,
start/end/mute, original guided cases, reviewed teaching and assessment modes,
ITE entry/comparisons, existing progress and import/export. Keep the non-voice app
and its thumbnail unchanged. Do not merge this branch into main as a side effect.
Keep the deployed service pinned to the intended commit rather than a moving ref.
Use the existing deployed API configuration; no credentials are copied into git,
no new account or subscription is purchased, and no proprietary content is scraped.

## Four learning paths

1. Original guided topic: vignette → differential → next test → diagnosis → initial
   treatment → supported alternatives → dosing → conclusion. One question per turn.
2. Medication regimens and antibiotics: indication/population, drug/formulation,
   dose/units, route/frequency, duration or titration, maximum where supported,
   patient adjustments, safety checkpoint, monitoring and supported alternatives.
   Distinguish starting/target/maximum, IR/ER and mg/kg/dose versus mg/kg/day.
3. Medication safety and common pitfalls: true contraindications, avoid-use warnings,
   precautions/interactions requiring monitoring, adverse effects and prescription
   errors. Index by drug and consequence. Elicit risk, susceptibility, corrective
   action, monitoring and alternatives when evidence exists. SIADH-associated
   hyponatremia is not automatically a drug interaction or a confirmed diagnosis.
4. Advanced synthesis: complex simulated cases with multimorbidity/polypharmacy.
   Learner summarizes first, prioritizes urgent issues and level of care, ranks
   a differential with evidence for/against, considers medication contribution and
   multiple causes, selects discriminating tests, revises with evolving findings,
   and gives a problem-based plan. Include reconciliation/OTC use, potential
   deprescribing, treatment tradeoffs, preferences, affordability, function,
   adherence, support, monitoring, follow-up, escalation and uncertainty.
   Finish with a 30–60 second oral synthesis and specific qualitative feedback
   using an eight-dimension rubric; accept multiple defensible answers and allow
   a retry. Do not fabricate numerical clinical-reasoning scores or mastery.

## Source architecture and content lifecycle

`curriculum.json` is an original, scoped educational snapshot. Each lesson links
explicit source IDs with official URLs, relevant sections, source/access dates,
review status and gaps. Doses are source-specific and indication-specific.
The source registry differentiates loaded evidence from reference links and
commercial products with no configured access. A URL or publication date alone
never establishes that a database is integrated or every claim is current.

Initial set: 13 regimen lessons, nine safety lessons, four advanced cases.
Checked public-source scope: CDC strep/chlamydia/gonorrhea and selected DailyMed
product labels. These are not a complete formulary, full antibiotic coverage,
independent clinical validation, or an expansion of subscription content.

Planned reference roles remain: disease guidelines/CDC for selection; Lexidrug
or alternatives (Micromedex, AHFS, Clinical Pharmacology) for drug details;
Sanford/Hopkins for infections; AAP Red Book for pediatric infections; UCSF for
institution-specific renal/antimicrobial support; LactMed for breastfeeding;
FDA Drugs@FDA for approved labeling. Access and integration permissions for
commercial products must be confirmed before loading their content. Public pages
also require source-specific rights review before broader copying/ingestion.
No personal subscription is assumed to authorize redistribution.

A coverage ledger includes every stored topic, highlights antimicrobial signals,
and links only explicitly mapped regimen lessons. A mention of antibiotics is
not an indication to prescribe. The STI umbrella remains partial (e.g. syphilis
is not covered by chlamydia/gonorrhea lessons). Keep all topics studyable.

Existing study-time official-page lookup remains explicit, exact-URL allowlisted,
read-only and separated from the checked snapshot. A retrieved page is not
silently promoted to a verified regimen. Explain source disagreements by
population, formulation, indication and date. Missing evidence is named;
unsupported dosing and protocols are withheld while supported teaching continues.

For each subsequent content release: select a scope, read the exact authoritative
sections, record evidence and contradictions, check units/populations/formulations,
obtain qualified clinical/pharmacy review where available, run data and behavior
checks, document gaps, version the snapshot and publish a reviewable change.
Monthly content review is a maintenance target; this build does not create a
scheduled background updater or claim automatic currentness. Independent
clinician/pharmacist review of this starter set remains pending.

## Progress and privacy

Specialist lessons use learner-selected Again/Hard/Good/Easy intervals and resumable
per-lesson checkpoints. These are self-assessed practice, separate from server-
graded question events, first-attempt metrics and ITE comparisons. Hints and an
immediate answer do not establish mastery. Export/import includes the new fields;
old progress files remain compatible. No real patient identifiers or audio
recordings are stored. Preserve existing browser-local progress limitations.

## Acceptance checks

- All 156 original topics remain searchable and selectable; no-match is explicit.
- All three specialist sections can be searched by drug, condition or consequence.
- A selected lesson loads only its source-backed evidence; malformed IDs fail
  before an API call. Voice navigation loads the lesson before teaching it.
- Every regimen has all required fields; missing details are explicit gaps.
- Safety category distinctions and pediatric dose units/caps are preserved.
- Advanced cases retain coherent premises, stage/reveal ordering, uncertainty,
  patient constraints and qualitative oral-synthesis feedback instructions.
- Topic/lesson switches stop local old sessions, clear stale history/practice,
  and reject delayed handshakes or stale tool results. Navigation remains usable.
- Self-assessed reviews never add reviewed-question scores. Import/export and
  clear-history preserve the expected boundaries.
- No commercial database is presented as connected. All 156 topics receive a
  transparent antibiotic coverage status; partial scopes remain labeled partial.
- Existing automated tests, focused new tests, TypeScript and build pass. Test
  browser controls and a mocked Realtime handshake; distinguish these from actual
  microphone and generated medical-output validation in the release report.
- Verify deployed commit/status and public health/page assets after release.

## Rollback

Use the existing voice service in project `AI-FM-STUDYCHAT`, environment
`private-test`. Return its source to the approved backup commit above (original
branch `experiment/socratic-voice-tutor-2026-10-16`), retaining `pnpm build:tutor`
and `pnpm start:tutor`. Confirm terminal deployment SUCCESS and health afterward.
Do not roll back databases or the non-voice service as part of this operation.
The additive browser progress fields can remain; old code ignores them. Export
progress before manual data changes. Do not claim rollback is complete from a
queued build alone.
