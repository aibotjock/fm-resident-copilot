# Expanded tutor content — 2026-10-17

Version: antibiotic-conditions-2026-10-17-v7. The expanded educational syllabus is implemented for user testing. It is **not complete all-scenario prescribing verification or independent clinical/pharmacy validation**.

```json
{
  "originalTopics": 156,
  "originalSupplementalConditions": 12,
  "additionalDecisionLessons": 26,
  "totalLessons": 277,
  "flaggedOriginalTopics": 28,
  "flaggedOriginalWithRegimens": 28,
  "antibioticRegimens": 162,
  "totalMedicationRegimens": 169,
  "antimicrobialNamedEntries": 52,
  "safetyProfiles": 61,
  "searchableNames": 508
}
```

## Current release

Adds 39 antimicrobial courses, 15 formulation-specific safety profiles and 26 case-based decision lessons. New material includes congenital syphilis, recurrent BV, HIV PCP/toxoplasma/MAC alternatives, renal/HD examples, endocarditis, pediatric Lyme carditis, complicated pneumonia, diabetic foot/osteomyelitis, sickle-cell acute chest, recurrent/pediatric CDI, H pylori alternatives, chronic prostatitis, severe COPD and otic alternatives.

Every previously recorded condition branch now has linked decision teaching. It distinguishes a representative source-supported course from cases needing cultures, source control, therapeutic monitoring, neonatal or pregnancy assessment, or a specialist-selected protocol. The prior ledger text is retained in scenarioLedger.previously_recorded_scope; actual remaining source/patient limits remain visible. No arbitrary fixed dose is supplied for individualized vancomycin AUC/CRRT or resistant/culture-negative disease.

The sepsis pathway now uses SSC 2026 source-specific guidance. The exact six-month pertussis boundary is corrected from the original CDC table. Recurrent BV teaching includes ACOG's 2025 partner-treatment update. H pylori uses the corrected ACG highlights with levofloxacin once daily and names the earlier source conflict. Original topics load the new cases; selecting a new case also loads its relevant medication courses and sources.

All 28 antibiotic-relevant original topics retain scoped medication lessons. All 156 original topics remain available. Medication names without checked regimens remain reference-only. The 57 criteria entries retain their declared scope, including 18 overviews that do not contain full calculation tables. Existing advanced cases, spaced review, progress compatibility and assessment isolation are preserved. Nonvoice code/thumbnail and frozen assessment items are unchanged.

## Verification

62 automated tests pass, including exhaustive search/selection of all 156 original topics and 277 specialist lessons. Isolated tutor TypeScript, tutor bundle and whitespace checks pass. These are software checks, not independent clinical validation. Real-device microphone/audio and model-generated medical answers remain unverified.

## Scenario coverage and limits

| Condition | Regimen lessons | Decision teaching | Remaining source/patient limits |
|---|---:|---|---|
| COPD Pharmacological Management | 4 | completion-copd | Resistant-pathogen therapy requires the current isolate/local antibiogram; no single universal ventilator-associated regimen applies to every COPD exacerbation. |
| CAP Severity Assessment and Treatment | 13 | completion-cap | Do not extrapolate adult renal or CAP doses to neonates; pathogen-specific therapy and duration depend on cultures and complications. |
| UTI Diagnosis and Treatment | 12 | completion-uti | Chronic prostatitis and excluded complicated-UTI populations need their own duration; a short-course study result is not a universal rule. |
| STI Treatment Recommendations | 25 | completion-sti | Resistance and desensitization are supervised protocols; pregnancy and congenital cases cannot use the nonpregnant adult alternatives by default. |
| Cellulitis, Abscess, and Necrotizing Fasciitis | 6 | completion-ssti | The tutor teaches AUC targets and monitoring decisions, not an unvalidated patient-specific Bayesian calculator or a universal culture-directed osteomyelitis prescription. |
| HIV Testing, Initiation, and Monitoring | 15 | completion-hiv | Refractory OI and other dialysis modalities require a measured, specialist-selected regimen; the loaded alternative courses are not universal salvage therapy. |
| Routine Prenatal Screening and Care | 7 | completion-prenatal | Exact severe delayed allergy and dialysis prescriptions require specialist/local protocols; lack of a fixed table is not permission to guess. |
| H. pylori Testing and Eradication | 5 | completion-hp | Organ-impaired or multiply failed courses require susceptibility and specialist reconciliation; proprietary kit dosing cannot be freely substituted between products. |
| IBS Diagnosis and Treatment | 1 | Existing regimen teaching | No additional scope limit recorded. |
| Acute Otitis Media Diagnosis and Treatment | 4 | completion-aom | Young-infant sepsis evaluation and severe-allergy/organ-impaired prescriptions need pediatric clinician input; no unsupported infant dose is generated. |
| Acne Classification and Stepwise Treatment | 2 | completion-acne | Pregnancy-specific product selection and isotretinoin eligibility are clinician decisions with their own safety requirements; this lesson is the antibiotic-selection boundary. |
| Atopic Dermatitis Diagnosis and Stepwise Treatment | 1 | completion-eczema | Severe pediatric infection uses culture/severity-specific treatment; adult eczema antibiotic doses do not establish child doses. |
| Cellulitis, Erysipelas, and Abscess Management | 6 | completion-ssti | The tutor teaches AUC targets and monitoring decisions, not an unvalidated patient-specific Bayesian calculator or a universal culture-directed osteomyelitis prescription. |
| Crohn's Disease and Ulcerative Colitis Diagnosis and Management | 1 | completion-ibd | Complex Crohn fistula biologic/seton plans and resistant isolates require multidisciplinary care; the antibiotic lesson does not substitute for a fistula-management protocol. |
| Acute Pancreatitis Diagnosis and Management | 1 | completion-pancreas | Specialist-selected resistant-organism therapy and procedural timing cannot be replaced with one default antibiotic duration. |
| Lyme Disease Diagnosis and Treatment | 24 | completion-lyme | Pregnancy selection and refractory arthritis need clinical assessment; extended antibiotics do not follow merely from persistent nonspecific symptoms. |
| Pleural Effusion Evaluation and Management | 2 | completion-pleura | A fixed community-CAP course cannot be imposed on empyema; oral drug and duration depend on organism, drainage and response. |
| CAP Severity Assessment and Antibiotic Therapy | 13 | completion-cap | Do not extrapolate adult renal or CAP doses to neonates; pathogen-specific therapy and duration depend on cultures and complications. |
| AOM Diagnosis and Antibiotic Management | 4 | completion-aom | Young-infant sepsis evaluation and severe-allergy/organ-impaired prescriptions need pediatric clinician input; no unsupported infant dose is generated. |
| HIV Diagnosis, ART Initiation, and Initial Regimen | 15 | completion-hiv | Refractory OI and other dialysis modalities require a measured, specialist-selected regimen; the loaded alternative courses are not universal salvage therapy. |
| C. difficile Classification and Antibiotic Treatment | 7 | completion-cdi | Do not extrapolate adult microbiota-product indications to children or compound a retention enema without a validated local protocol. |
| Gonorrhea, Chlamydia, and Syphilis Treatment | 25 | completion-sti | Resistance and desensitization are supervised protocols; pregnancy and congenital cases cannot use the nonpregnant adult alternatives by default. |
| Sickle Cell Disease Complications, Hydroxyurea, and Acute Management | 2 | completion-scd | Site-specific acute-chest duration and allergy prophylaxis require hematology/local protocol; do not reuse a one-time fever dose as the complete ACS course. |
| Sepsis-3 Definition, Diagnosis, and 1-Hour Bundle | 8 | completion-sepsis | No single universal sepsis cocktail or fixed dialysis dose is appropriate; learn the source-specific regimen and patient-specific monitoring plan. |
| Acute Bacterial Rhinosinusitis Diagnosis and Management | 5 | completion-sinus | High-dose formulation and duration must be selected from the named label/guideline; complications need procedural/specialist assessment. |
| Acute Pharyngitis — Group A Streptococcus Diagnosis and Treatment | 9 | completion-gas | Special carrier eradication and complex organ-impaired cases require indication-specific selection; no blanket prophylaxis for every recurrent sore throat. |
| Cirrhosis Complications — Varices, SBP, Hepatic Encephalopathy, and HCC Surveillance | 5 | completion-cirrhosis | Nosocomial spectrum and prophylaxis cessation are individualized; do not automatically continue an antibiotic indefinitely after the risk/indication changes. |
| Acute Bronchitis — Diagnosis and Antibiotic Avoidance | 5 | completion-pertussis | Macrolide-allergic pregnancy and rare resistance require supervised selection; ordinary bronchitis is not a substitute indication. |
| Acute otitis externa | 3 | completion-otic | Suspected necrotizing disease requires urgent ENT/ID assessment, cultures/imaging and prolonged culture-directed systemic treatment; not an ordinary ear-drop course. |
| Suspected infective endocarditis — diagnostic classification | 5 | completion-endocarditis | Prosthetic, resistant and culture-negative IE need a team-selected protocol; the tutor must not fill in a missing multidrug course from model memory. |
| Acute rheumatic fever — diagnostic assessment | 3 | completion-rheumatic | Child weight cutoffs and shortened injection intervals vary across protocols; use the named population-specific protocol rather than merging thresholds. |
| Upper GI bleeding — risk assessment | 1 | completion-ugib | Severe allergy or resistant/nosocomial infection requires targeted treatment selection; prophylaxis is not a substitute for active-infection therapy. |

The export includes exact merged regimen fields, source IDs/URLs/sections/access dates and explicit gaps. Counts describe content, not medical completeness. No commercial subscription reference is represented as connected.
