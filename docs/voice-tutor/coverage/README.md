# Medication and criteria expansion — 2026-10-17

This report describes the local implementation. It is not a deployment record or an independent clinical validation. The original 156-topic corpus and reviewed-question bank are preserved. Existing entries retain their original review limitations; additions do not certify the rest of the corpus as current.

## Scope and counting

`audit.json` is generated from the actual curriculum, medication inventory and original corpus. Reproduce it from repository root:

```sh
pnpm --filter @workspace/api-server exec node --import tsx ../../docs/voice-tutor/coverage/audit.mts --write
pnpm test:tutor
pnpm exec tsc -p artifacts/api-server/voice-tutor/tsconfig.json --noEmit
```

The inventory contains 489 named medication entities. It is a lexicon-assisted audit, not a comprehensive formulary, a unique-active-ingredient count, or 489 verified dosing monographs. Combination entities and component ingredients can coexist; brand aliases are collapsed. All inventory entries can be traced to original topic text or stored regimen lessons. The audit is reproducible for the saved inventory; it does not prove that the lexicon found every drug mention.

There are 11 stored selective safety profiles across 13 regimen lessons. The six antibiotics are amoxicillin, penicillin V, cephalexin, doxycycline, azithromycin and ceftriaxone; the others are metformin, sertraline, lisinopril, spironolactone and apixaban. These profiles are source-checked within their stated scope, not exhaustive medication safety reviews. In particular, absence of a hepatic dose rule is not a claim that no adjustment or precaution exists. The initial profile report is `../MEDICATION_ORGAN_SAFETY_2026-10-17.md`.

The expanded criteria section contains source-specific facts and gaps for every entry. Some are rule summaries, while purpose-and-interpretation entries explicitly withhold calculation because full tables, eligibility or instrument items are absent. Neither category is a validated calculator. `audit.json` records the exact counts and per-entry source sections. General AAFP curriculum pointers were replaced with rule-specific evidence; no discovery placeholder is counted as complete rule coverage.

There are 12 supplemental condition lessons, each explicitly limited to loaded facts: ankle/foot injury; minor head injury; cervical trauma; allergic rhinitis; acute otitis externa; chronic idiopathic constipation; vulvovaginal candidiasis; anaphylaxis; suspected endocarditis; acute rheumatic fever; upper GI bleeding; and new acute severe headache. Condition lessons link applicable criteria into the same guided flow. These are selective educational additions, not complete treatment protocols for each condition.

## Medication teaching and lookup

All medication-containing guided teaching follows the dosing, contraindication, renal, hepatic, interaction and monitoring flow. It asks the learner before explaining, uses the exact drug/formulation/population/indication, and leaves unsupported decisions as gaps. This does not inject teaching into reviewed assessments.

The broader inventory supports explicit DailyMed product-label lookup. A session must select a returned product and confirm ingredients, formulation, strength and route before loading it. The UI displays source URL, reported publication date, XML version, label effective date when present, access time and omitted sections. Loaded source is session-only teaching evidence and does not become canonical checked content or persist as a monograph. Product listing alone does not prove availability or approval.

Lookup is bounded to DailyMed endpoints, human drug-label documents, NDA/ANDA/BLA search categories, a maximum response size and timeout. It rejects unsafe XML declarations and preserves table cells/units; oversized sections are omitted whole and flagged. Search is limited to the first 100 products per category, so it does not guarantee a complete product list or the newest labeling. A failed lookup never generates fallback medication facts.

Disease-specific CDC guidance determines the loaded antibiotic regimens. Manufacturer labeling through DailyMed supports scoped safety; UCSF supplies doxycycline renal/dialysis guidance. Older ceftriaxone label STI doses do not override loaded CDC guidance. Nebraska/UNMC, IDSA and AAFP links remain available where applicable; no claim is made that every accepted source was ingested. Lexidrug and Sanford are not connected.

## Criteria, version differences and recognition practice

Standalone criteria and condition-integrated prompts distinguish diagnostic criteria, imaging rules, screening, prognosis, classification and disposition support. No claimed per-rule or per-drug ABFM exam frequency is assigned. A positive Ottawa imaging rule is not a fracture diagnosis. Unknown inputs do not count as negative findings. Source summaries do not authorize reconstruction of missing point tables or diagnostic checklists from model memory.

HEART has its specific 2018 AFP article and ACC 2022 pathway, rather than a general AAFP link. The original five-domain score and modified HEART/HEAR pathway remain distinct. Age-boundary and ECG/troponin differences are disclosed; versions must not be silently blended. Current assay-specific protocols are not replaced by old conventional-troponin timings. McIsaac age-45 wording differs across the displayed IDSA table and AFP; that exact boundary remains flagged instead of being guessed.

The Ottawa SAH age boundary was resolved against original JAMA Box 2 (at least 40) after a later indexed PDF rendering omitted the equality sign. CCHR equality symbols were checked against the publisher abstract and ACEP policy rather than relying on a lossy indexed abstract. PECARN uses separate under-2 and older-child branches; failing a very-low-risk rule does not mandate CT in every case.

GCS has a separate recognition/scoring lesson using the official structured assessment aid and FAQ. Three original simulated exercises distinguish spontaneous opening/confused speech/commands, pressure/sounds/normal flexion, and intubation with a non-testable verbal response. The tutor asks components and a testable total before showing feedback, preserves case premises, and excludes these exercises from exam statistics. The standard scale is not presented as a complete pediatric adaptation or a universal airway rule.

## Relevance and source policy

ABFM's published blueprint supports the general acute, chronic and urgent/emergent coverage; its domain-weighting research considers frequency of clinical activities and risk of harm. These sources justify broad family-medicine study domains, not a specific drug's or rule's exam frequency. Supplemental topic selection is an educational judgment based on gaps and the AAFP curriculum's breadth, not an assertion of ABFM approval.

- ABFM blueprint: https://www.theabfm.org/family-medicine-exam-blueprint/
- ABFM weighting methods: https://www.theabfm.org/research/research-library/developing-content-domain-weights-for-the-2025-family-medicine-certification-scale/
- AAFP curriculum discovery: https://www.aafp.org/residency-program-directors/leadership-and-training-resources/curriculum-guidelines

Clinical facts instead cite their specific guideline/article/label URL, section, source date when known and access date. Routine spoken citations remain brief; exact provenance is retained. Access date is not publication date or proof of the latest available recommendation. New final sources discovered during this work include IDSA's 2025 pharyngitis risk-assessment update, SCCM's 2026 sepsis guideline, GINA 2026 and GOLD 2026. Draft KDIGO updates were not promoted to final guidance. Classic rule derivation dates remain explicit. Source conflicts and missing data are not silently resolved.

Only original concise factual paraphrases and links are stored. Proprietary calculators, charts, questionnaire text, full monographs and paid databases have not been copied. Source access and reuse limitations remain explicit; this is not blanket licensing clearance or an AAFP/ABFM endorsement claim.

## Validation and remaining limits

- Tutor build and 41 automated checks pass after the GCS addition.
- Dedicated voice-tutor TypeScript configuration passes.
- Executed browser-handler tests cover criteria search/navigation, scope notes, source display, medication name search, exact product confirmation, label provenance, clearing stale context and avoiding source-text persistence.
- API tests cover authentication, explicit source loading, returned-product restrictions, context invalidation and assessment isolation.
- XML tests cover complete table cells/units, nested-section handling, unsafe declarations, nonhuman labels and omitted oversized sections.
- Live DailyMed lookups were exercised for metformin, cephalexin and apixaban during implementation. These samples do not validate every indexed product.
- No provider-backed voice call, real-device audio QA, independent clinician/pharmacist review or comprehensive external-source freshness surveillance was performed. Passing software checks does not establish clinical accuracy of all generated teaching.

Publication of this update to the public repository was rejected by automatic approval review pending explicit authorization. No alternative publishing route is used. Finish and commit locally for review, then obtain that authorization before pushing or changing the deployed source. The original live source pin is `211d3db4a1f51e2f741e2df9445af377ebb0f044`; preserve it for a reversible source-pin rollback if needed. No rollback is needed merely to add these features.
