# Antibiotic condition expansion — 2026-10-17

Status: substantial implementation, **not completion of every applicable scenario**. Private teaching only; independent clinical/pharmacy validation pending.

{
  "originalTopics": 156,
  "supplementalConditions": 12,
  "flaggedOriginalTopics": 28,
  "flaggedOriginalWithRegimens": 27,
  "antibioticRegimens": 87,
  "totalMedicationRegimens": 94,
  "antibacterialNamedEntries": 30,
  "safetyProfiles": 37,
  "searchableNames": 495
}

## Changes

Added 60 indication-specific regimen lessons (87 antibiotic-tagged lessons total), 14 formulation-specific safety profiles, explicit relevance for all 156 original and 12 supplemental conditions, and 32 treatment/stewardship pathways. Supplemental condition teaching now loads linked regimen and component safety evidence. Medication navigation derives from stored lessons. Ten exact voice-only reconciliations address the audited SSTI, Lyme, AOM, UTI and SBP statements. Shared nonvoice library and frozen assessment items are preserved. Assessment mode excludes expansion teaching even if a client mistakenly requests guided mode.

## Verification

51 automated checks pass, including actual topic/supplemental prompt loading, all component safety/source links, route and population separation, medication search, legacy reconciliation, private APIs, assessment isolation and browser persistence flows. Tutor TypeScript check and bundle build pass. No actual model-generated clinical answer or real-device microphone/audio validation is claimed.

## Remaining scope

One flagged original topic (perianal abscess in the IBD topic) has sourced antibiotic eligibility/source-control teaching but no fully established dosing lesson. The ledger below lists additional unresolved branches even where a selected regimen is available. A regimen count is not condition-wide completion.

| Condition | Linked regimen lessons | Unresolved scope |
|---|---:|---|
| COPD Pharmacological Management | 1 | Severe/ventilated and resistant-pathogen exacerbations; complete alternatives. |
| CAP Severity Assessment and Treatment | 8 | Complete short-course stability/exclusion checklist; all pediatric, allergy and resistant-pathogen definitive courses. |
| UTI Diagnosis and Treatment | 10 | Bacterial prostatitis, obstructed infection, resistant pathogens, catheter-specific exclusions, dialysis and complete GBS allergy algorithm. |
| STI Treatment Recommendations | 18 | Gonorrhea aminoglycoside allergy option; recurrent/resistant trichomoniasis/BV; congenital syphilis, full pregnancy follow-up and all allergy protocols. |
| Cellulitis, Abscess, and Necrotizing Fasciitis | 4 | Diabetic-foot/osteomyelitis and chronic suppression; all severe allergy alternatives; IV vancomycin AUC protocols. |
| HIV Testing, Initiation, and Monitoring | 3 | MAC prophylaxis/treatment; Toxoplasma active treatment, alternatives/G6PD, full high-dose renal/dialysis tables. |
| Routine Prenatal Screening and Care | 4 | Bacterial prostatitis, obstructed infection, resistant pathogens, catheter-specific exclusions, dialysis and complete GBS allergy algorithm. |
| H. pylori Testing and Eradication | 2 | Susceptibility-guided clarithromycin/levofloxacin and all prior-treatment rescue branches; organ-impaired regimens. |
| IBS Diagnosis and Treatment | 1 | No additional branch recorded here; independent review still pending. |
| Acute Otitis Media Diagnosis and Treatment | 4 | Infants <6 months; high-risk allergy/failure beyond loaded options; pediatric kidney/liver dysfunction. |
| Acne Classification and Stepwise Treatment | 1 | Systemic antibiotic dose/duration and pregnancy alternatives. |
| Atopic Dermatitis Diagnosis and Stepwise Treatment | 1 | Diabetic-foot/osteomyelitis and chronic suppression; all severe allergy alternatives; IV vancomycin AUC protocols. |
| Cellulitis, Erysipelas, and Abscess Management | 4 | Diabetic-foot/osteomyelitis and chronic suppression; all severe allergy alternatives; IV vancomycin AUC protocols. |
| Crohn's Disease and Ulcerative Colitis Diagnosis and Management | 0 | Fully sourced perianal-abscess antibiotic selection/doses/duration; fistula biologic combination scope. |
| Acute Pancreatitis Diagnosis and Management | 1 | Carbapenem-sparing/resistant-pathogen alternatives; intervention timing and full organ-specific pathways. |
| Lyme Disease Diagnosis and Treatment | 9 | Full cefuroxime and pediatric neurologic/arthritis branches; refractory arthritis response thresholds; pregnancy selection. |
| Pleural Effusion Evaluation and Management | 1 | Hospital-acquired/resistant pathogens, oral step-down and individualized duration. |
| CAP Severity Assessment and Antibiotic Therapy | 8 | Complete short-course stability/exclusion checklist; all pediatric, allergy and resistant-pathogen definitive courses. |
| AOM Diagnosis and Antibiotic Management | 4 | Infants <6 months; high-risk allergy/failure beyond loaded options; pediatric kidney/liver dysfunction. |
| HIV Diagnosis, ART Initiation, and Initial Regimen | 3 | MAC prophylaxis/treatment; Toxoplasma active treatment, alternatives/G6PD, full high-dose renal/dialysis tables. |
| C. difficile Classification and Antibiotic Treatment | 5 | Pediatric CDI, microbiota-based therapies and extended-pulsed fidaxomicin; rectal administration protocol. |
| Gonorrhea, Chlamydia, and Syphilis Treatment | 18 | Gonorrhea aminoglycoside allergy option; recurrent/resistant trichomoniasis/BV; congenital syphilis, full pregnancy follow-up and all allergy protocols. |
| Sickle Cell Disease Complications, Hydroxyurea, and Acute Management | 1 | Full pediatric acute-chest combination dosing, febrile sepsis and penicillin-allergy prophylaxis. |
| Sepsis-3 Definition, Diagnosis, and 1-Hour Bundle | 8 | Carbapenem-sparing/resistant-pathogen alternatives; intervention timing and full organ-specific pathways. |
| Acute Bacterial Rhinosinusitis Diagnosis and Management | 2 | Pediatric treatment; high-dose resistance risk; severe allergy/complication and failure branches. |
| Acute Pharyngitis — Group A Streptococcus Diagnosis and Treatment | 7 | Cefadroxil/clarithromycin branches; full pediatric organ guidance. |
| Cirrhosis Complications — Varices, SBP, Hepatic Encephalopathy, and HCC Surveillance | 4 | Nosocomial/resistant SBP; complete albumin eligibility/dosing and primary-prophylaxis thresholds. |
| Acute Bronchitis — Diagnosis and Antibiotic Avoidance | 1 | Complete infant/pediatric and nonmacrolide regimens; current timing/PEP eligibility. |
| Acute otitis externa | 1 | Necrotizing otitis externa; wick/aural toilet details and all alternative drops. |
| Suspected infective endocarditis — diagnostic classification | 1 | Current native/prosthetic-valve, enterococcal, staphylococcal and culture-negative pathways. |
| Acute rheumatic fever — diagnostic assessment | 2 | Secondary benzathine dose/interval/duration by age, carditis and residual valve disease; alternatives. |
| Upper GI bleeding — risk assessment | 1 | Fully structured SBP treatment plus albumin, resistant/nosocomial SBP and full high-risk primary prophylaxis eligibility. |

Full original/supplemental relevance decisions, individual regimen fields, source URLs/sections/dates and component profiles are in coverage.json.
