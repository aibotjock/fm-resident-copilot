# Antibiotic condition expansion — 2026-10-17

Version: antibiotic-conditions-2026-10-17-v6. Selected source-scoped teaching is implemented; **all-scenario clinical coverage and independent clinical/pharmacy validation remain incomplete**.

```json
{
  "originalTopics": 156,
  "supplementalConditions": 12,
  "flaggedOriginalTopics": 28,
  "flaggedOriginalWithRegimens": 28,
  "antibioticRegimens": 123,
  "totalMedicationRegimens": 130,
  "antibacterialNamedEntries": 39,
  "safetyProfiles": 46,
  "searchableNames": 501
}
```

## Current release

This continuation adds 36 regimens and nine medication safety profiles: pediatric sinusitis/pneumonia, additional pediatric/adult Lyme branches, pertussis, GAS allergy alternatives, recurrent trichomoniasis, acute prostatitis, systemic acne treatment, GBS allergy pathways, HIV toxoplasmosis/MAC, and selected inpatient perianal abscess care. There are now 123 antibiotic regimen lessons (130 medication lessons overall), 46 safety profiles and 501 searchable medication names. Names without checked regimens remain explicitly marked as reference-only.

All 28 original topics flagged for conditional antibiotic teaching now link at least one scoped regimen. This does not mean every scenario within those topics is complete. Duplicate broad gap descriptions were replaced with condition-specific remaining scope. SBP albumin/prophylaxis thresholds, diabetic-foot duration decisions and serious-MRSA IV vancomycin monitoring were added to their scoped condition pathways.

IV vancomycin, clindamycin and metronidazole use distinct safety profiles and support both route-before-drug and route-after-drug searches. Existing mixed-route PID/fulminant CDI lessons now load IV metronidazole evidence. Shared nonvoice source, thumbnail, deployment and frozen assessment items are preserved.

## Verification

56 automated tests, isolated tutor TypeScript check and tutor bundle build pass. These are software checks, not independent clinical validation. Model-generated medical answers and real-device microphone/audio remain unverified.

The checks cover component safety/source links, pediatric daily versus per-dose units, prevention versus active/maintenance treatment, route matching, medication/topic search, authenticated selection, assessment isolation and existing browser persistence flows.

## Remaining scenario ledger

| Condition | Linked regimen lessons | Unresolved scope |
|---|---:|---|
| COPD Pharmacological Management | 1 | Severe/ventilated and resistant-pathogen exacerbations; complete alternatives. |
| CAP Severity Assessment and Treatment | 11 | Neonatal disease, complicated pediatric CAP, high-risk allergy, and complete culture-directed resistant-pathogen courses; adult short-course exclusions. |
| UTI Diagnosis and Treatment | 11 | Obstructed infection/source control, resistant pathogens, catheter-specific exclusions, chronic prostatitis and complete dialysis tables. |
| STI Treatment Recommendations | 20 | Gonorrhea aminoglycoside alternative, suppressive recurrent BV, resistant trichomoniasis, congenital syphilis and complete pregnancy/allergy protocols. |
| Cellulitis, Abscess, and Necrotizing Fasciitis | 4 | Full culture-directed diabetic-foot/osteomyelitis drug courses, severe allergy alternatives and patient-specific IV vancomycin AUC/dialysis calculation. |
| HIV Testing, Initiation, and Monitoring | 7 | Toxoplasma and PCP alternative combinations/G6PD screening, severe/resistant MAC courses, and full high-dose renal/dialysis tables. |
| Routine Prenatal Screening and Care | 7 | Pregnancy-specific resistant UTI, severe delayed allergy/desensitization, and individualized GBS dosing in renal impairment. |
| H. pylori Testing and Eradication | 2 | Susceptibility-guided clarithromycin/levofloxacin and all prior-treatment rescue branches; organ-impaired regimens. |
| IBS Diagnosis and Treatment | 1 | No additional branch recorded; independent review remains pending. |
| Acute Otitis Media Diagnosis and Treatment | 4 | Infants <6 months; high-risk allergy/failure beyond loaded options; pediatric kidney/liver dysfunction. |
| Acne Classification and Stepwise Treatment | 2 | Pregnancy-specific nonantibiotic selection and refractory acne/escalation assessment. |
| Atopic Dermatitis Diagnosis and Stepwise Treatment | 1 | Distinguish colonization from clinically infected eczema; culture-directed severe infection and pediatric dosing. |
| Cellulitis, Erysipelas, and Abscess Management | 4 | Full culture-directed diabetic-foot/osteomyelitis drug courses, severe allergy alternatives and patient-specific IV vancomycin AUC/dialysis calculation. |
| Crohn's Disease and Ulcerative Colitis Diagnosis and Management | 1 | Outpatient abscess antibiotic formulation and step-down selection; complex Crohn fistula, seton/biologic combination and resistant-pathogen courses. |
| Acute Pancreatitis Diagnosis and Management | 1 | Carbapenem-sparing/resistant-pathogen alternatives; intervention timing and full organ-specific pathways. |
| Lyme Disease Diagnosis and Treatment | 22 | Pregnancy-specific selection, pediatric carditis alternatives and refractory arthritis specialist management; pediatric renal dysfunction. |
| Pleural Effusion Evaluation and Management | 1 | Hospital-acquired/resistant pathogens, oral step-down and individualized duration. |
| CAP Severity Assessment and Antibiotic Therapy | 11 | Neonatal disease, complicated pediatric CAP, high-risk allergy, and complete culture-directed resistant-pathogen courses; adult short-course exclusions. |
| AOM Diagnosis and Antibiotic Management | 4 | Infants <6 months; high-risk allergy/failure beyond loaded options; pediatric kidney/liver dysfunction. |
| HIV Diagnosis, ART Initiation, and Initial Regimen | 7 | Toxoplasma and PCP alternative combinations/G6PD screening, severe/resistant MAC courses, and full high-dose renal/dialysis tables. |
| C. difficile Classification and Antibiotic Treatment | 5 | Pediatric CDI, microbiota-based therapies and extended-pulsed fidaxomicin; rectal administration protocol. |
| Gonorrhea, Chlamydia, and Syphilis Treatment | 20 | Gonorrhea aminoglycoside alternative, suppressive recurrent BV, resistant trichomoniasis, congenital syphilis and complete pregnancy/allergy protocols. |
| Sickle Cell Disease Complications, Hydroxyurea, and Acute Management | 1 | Full pediatric acute-chest combination dosing, febrile sepsis and penicillin-allergy prophylaxis. |
| Sepsis-3 Definition, Diagnosis, and 1-Hour Bundle | 8 | Source-specific empiric selection, resistant-pathogen coverage, source control and patient-specific organ/dialysis dosing. |
| Acute Bacterial Rhinosinusitis Diagnosis and Management | 4 | Adult high-dose resistance-risk formulation; severe allergy, complications and treatment-failure pathways. |
| Acute Pharyngitis — Group A Streptococcus Diagnosis and Treatment | 9 | Pediatric organ dysfunction and recurrent/carrier-state assessment. |
| Cirrhosis Complications — Varices, SBP, Hepatic Encephalopathy, and HCC Surveillance | 4 | Nosocomial/resistant SBP drug regimens and individualized albumin monitoring; complete prophylaxis contraindication/cessation assessment. |
| Acute Bronchitis — Diagnosis and Antibiotic Avoidance | 5 | Exact 6-month pertussis dosing boundary, pregnancy/nonmacrolide selection and uncommon resistant isolates. |
| Acute otitis externa | 1 | Necrotizing otitis externa; wick/aural toilet details and all alternative drops. |
| Suspected infective endocarditis — diagnostic classification | 1 | Current native/prosthetic-valve, enterococcal, staphylococcal and culture-negative pathways. |
| Acute rheumatic fever — diagnostic assessment | 2 | Secondary benzathine dose/interval/duration by age, carditis and residual valve disease; alternatives. |
| Upper GI bleeding — risk assessment | 1 | Resistant/nosocomial infection, oral prophylaxis step-down and severe beta-lactam allergy protocols; SBP treatment belongs to the cirrhosis pathway. |

coverage.json includes the original/supplemental relevance decisions, actual merged regimen fields, safety profiles and source URL/section/date records. Regenerate both reports from export.mts after curriculum changes; keep historical audit reports unchanged.
