# Clinical content review — October 15, 2026

The content review is incomplete. This release replaces the active historical index with **59 narrow, source-checked excerpts from 51 source URLs**. It does not certify complete conditions, every generated sentence, or the full app as current clinical guidance.

## Audit outcome

All 156 historical summaries received an audit classification: 58 superseded and 98 unverified. None passed complete verification. The entire historical set is inactive for new answers. A replacement excerpt does not validate the rest of its original summary. The detailed [source audit](../artifacts/api-server/src/rag/sources/source-audit-2026-10-15.json) records each decision, source, publication date, check date, limitations and rights status.

Some publisher content is restricted for AI use or could not be fully retrieved. Those items remain inactive or link-only; a newer document title is not treated as evidence for its contents. Federal education pages, society public summaries, full guidelines and FDA labels are identified separately. Older publication dates are preserved when no newer checked document was established.

## Answer structure

Complete condition overviews request presentation, differential diagnosis, diagnosis, next best test, first-line, second-line and third-line treatment, dosing/special populations, follow-up/monitoring/escalation, and sources/currentness. Focused questions use the relevant sections. Missing sections remain explicit evidence gaps. Simultaneous foundational therapy and alternatives must not be converted into invented treatment ladders.

Dosing requires source support for the indication/population, units, route, frequency, duration, titration and maximum where applicable. Pediatric mg/kg/day and mg/kg/dose are distinguished. Missing renal, hepatic or pregnancy instructions are disclosed rather than assumed normal. Source links and check dates come from retrieval rather than model-generated citation identities. A real citation number does not itself prove that every generated claim is supported.

## Currentness and limitations

- Source check date: October 15, 2026; publication dates are separate.
- There is no automatic or live guideline-update feed. The prior broken USPSTF ingestion path is no longer used to claim current coverage.
- Checked excerpts expire from retrieval 90 days after review, and future review dates are rejected. This is an expiry safeguard, not a guarantee that guidance cannot change earlier.
- Startup waits for an atomic publication of the checked index. Unreviewed legacy database rows are ineligible for retrieval.
- With no relevant evidence, clinical query returns a coverage gap without calling the model; practice questions decline insufficient evidence.
- Required headings, claim relevance and medication completeness are prompt instructions, not a clinical reasoning proof. Model synthesis has not received independent clinician review.
- Historical saved answers and flashcards are not automatically reverified. Their content should be checked directly against current sources.
- Full presentation/differential/testing/treatment coverage remains pending across the historical catalog. This release deliberately answers fewer facts rather than presenting unchecked facts as verified.

## Checked excerpt coverage

This table identifies the scope of the active excerpts; it is not a list of fully validated conditions.

| Topic excerpt | Source | Published/updated | Checked |
| --- | --- | --- | --- |
| Blood Pressure Classification and Thresholds | [ACC/AHA](https://professional.heart.org/en/science-news/2025-high-blood-pressure-guideline/top-things-to-know) | 2025-08-14 | 2026-10-15 |
| Stage 2 Hypertension and Home Monitoring | [ACC/AHA](https://professional.heart.org/en/science-news/2025-high-blood-pressure-guideline/top-things-to-know) | 2025-08-14 | 2026-10-15 |
| HFrEF Guideline-Directed Medical Therapy | [ACC](https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2024/03/06/19/22/2024-acc-expert-consensus-hfref) | 2024-03-08 | 2026-10-15 |
| HFpEF Management | [ACC](https://www.acc.org/latest-in-cardiology/journal-scans/2026/07/22/17/25/updated-acc-ecdp-addresses-management-of-hfpef) | 2026-07-23 | 2026-10-15 |
| AF Anticoagulation — Selected Checked Principles | [ACC/AHA/ACCP/HRS](https://www.acc.org/Latest-in-Cardiology/ten-points-to-remember/2023/11/27/19/46/2023-acc-guideline-for-af-gl-af) | 2023-11-30 | 2026-10-15 |
| 2026 Lipid Risk Assessment and Targets | [ACC/AHA](https://www.acc.org/About-ACC/Press-Releases/2026/03/13/18/01/ACCAHA-Issue-UpDated-Guideline-for-Managing-Lipids-Cholesterol) | 2026-03-13 | 2026-10-15 |
| Diabetes Diagnosis — Federal Reference | [NIDDK](https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis) | 2022-07 | 2026-10-15 |
| Type 2 Diabetes — Cardiorenal Drug Selection (VA/DoD) | [VA/DoD](https://www.healthquality.va.gov/guidelines/CD/diabetes/VADOD-Diabetes-CPG_Final_508.pdf) | 2023-05 | 2026-10-15 |
| Hypothyroidism Diagnosis and Treatment | [AAFP](https://www.aafp.org/afp/2021/0515/p605) | 2021-05-15 | 2026-10-15 |
| Postmenopausal Osteoporosis — Selected Checked Treatment Principles | [Endocrine Society](https://www.endocrine.org/clinical-practice-guidelines/osteoporosis-in-postmenopausal-women) | 2020-02-18 | 2026-10-15 |
| Major Depression: Initial Treatment, Escalation, and Adult Dose Examples | [VA/DoD](https://www.healthquality.va.gov/HEALTHQUALITY/guidelines/MH/mdd/VADODMDDCPGFinal508.pdf) | 2022-02 | 2026-10-15 |
| Clozapine Safety Update: REMS Removal and ANC Monitoring | [FDA](https://www.fda.gov/drugs/drug-safety-communications/fda-removes-risk-evaluation-and-mitigation-strategy-rems-program-antipsychotic-drug-clozapine) | 2025-08-27 | 2026-10-15 |
| Adult Immunization: Pneumococcal Schedule and Live Source | [CDC/ACIP](https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html) | 2025-07-02 | 2026-10-15 |
| Child Immunization: Product-Specific Hib and Live Schedule | [CDC/ACIP](https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html) | 2025-07-02 | 2026-10-15 |
| Colorectal Cancer Screening Recommendations | [USPSTF](https://www.uspreventiveservicestaskforce.org/uspstf/document/ClinicalSummaryFinal/colorectal-cancer-screening) | 2021-05-18 | 2026-10-15 |
| Breast Cancer Screening Recommendations | [USPSTF](https://www.uspreventiveservicestaskforce.org/uspstf/document/ClinicalSummaryFinal/breast-cancer-screening) | 2024-04-30 | 2026-10-15 |
| Lung Cancer Screening Recommendations | [USPSTF](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening) | 2021-03-09 | 2026-10-15 |
| Acute uncomplicated cystitis — healthy nonpregnant premenopausal adult women | [CDC](https://www.cdc.gov/antibiotic-use/hcp/clinical-care/adult-outpatient.html) | 2024-04-16 | 2026-10-15 |
| Chlamydia — diagnosis, treatment and follow-up | [CDC](https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm) | 2021-07-22 | 2026-10-15 |
| HIV — MAC primary prophylaxis | [NIH/DHHS](https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-opportunistic-infections/disseminated) | 2026-05-27 | 2026-10-15 |
| Prenatal Care: GBS Screening | [CDC](https://www.cdc.gov/group-b-strep/testing/index.html) | 2025-05-01 | 2026-10-15 |
| Contraception: Combined Hormonal Eligibility | [CDC](https://www.cdc.gov/contraception/hcp/usmec/combined-hormonal-contraceptives.html) | 2024-11-19 | 2026-10-15 |
| H. pylori: Optimized Bismuth Quadruple Therapy and Test of Cure | [ACG](https://gi.org/wp-content/uploads/2025/01/ACG-Hpylori-Guidelines-Highlights-2024-FINAL.pdf.pdf) | 2024-09 | 2026-10-15 |
| H. pylori eradication confirmation and acid-suppression washout | [ACG](https://gi.org/journals-publications/ebgi/schoenfeld_sep2024/) | 2024-09-17 | 2026-10-15 |
| CKD — Selected Checked Principles | [KDIGO](https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf) | 2024-03 | 2026-10-15 |
| Developmental and Autism Screening | [CDC](https://www.cdc.gov/autism/hcp/diagnosis/screening.html) | 2025-04-15 | 2026-10-15 |
| Pediatric Asthma: NAEPP Focused Updates | [NIH/NHLBI](https://www.nhlbi.nih.gov/sites/default/files/publications/Asthma%20Clinicians%20Guide%20508_02-03-21.pdf) | 2020-12 | 2026-10-15 |
| Acute Otitis Media: Diagnosis and Antibiotic Selection | [CDC](https://www.cdc.gov/antibiotic-use/hcp/clinical-care/pediatric-outpatient.html) | 2024-04-22 | 2026-10-15 |
| Falls Prevention Interventions | [USPSTF](https://www.uspreventiveservicestaskforce.org/uspstf/index.php/recommendation/falls-prevention-community-dwelling-older-adults-interventions) | 2024-06-04 | 2026-10-15 |
| Anticoagulant Reversal Safety Update: Andexxa US Sales Ended | [FDA](https://www.fda.gov/vaccines-blood-biologics/safety-availability-biologics/update-safety-andexxa) | 2025-12-18 | 2026-10-15 |
| Opioid Stewardship: Individualized Decisions and Follow-Up | [CDC](https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm) | 2022-11-04 | 2026-10-15 |
| Tobacco Cessation Counseling and Pharmacotherapy | [USPSTF](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/tobacco-use-in-adults-and-pregnant-women-counseling-and-interventions) | 2021-01-19 | 2026-10-15 |
| Obesity Medication Eligibility — Federal Reference | [NIDDK](https://www.niddk.nih.gov/health-information/weight-management/prescription-medications-treat-overweight-obesity) | 2024-06 | 2026-10-15 |
| PAD — Selected Checked Management Principles | [ACC/AHA](https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2024/05/09/15/00/2024-guideline-for-lower-extremity-pad) | 2024-05-14 | 2026-10-15 |
| CKD Metabolic Acidosis — Selected Checked Practice Points | [KDIGO](https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf) | 2024-03 | 2026-10-15 |
| AF Rhythm Control — Selected Checked Principles | [ACC/AHA/ACCP/HRS](https://www.acc.org/Latest-in-Cardiology/ten-points-to-remember/2023/11/27/19/46/2023-acc-guideline-for-af-gl-af) | 2023-11-30 | 2026-10-15 |
| Statin Prescribing for Primary Prevention | [USPSTF](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/statin-use-in-adults-preventive-medication) | 2022-08-23 | 2026-10-15 |
| Menopause: Fezolinetant Liver Safety | [FDA](https://www.fda.gov/drugs/drug-safety-communications/fda-adds-warning-about-rare-occurrence-serious-liver-injury-use-veozah-fezolinetant-hot-flashes-due) | 2024-12-16 | 2026-10-15 |
| Early localized Lyme disease — erythema migrans | [CDC](https://www.cdc.gov/lyme/hcp/clinical-care/erythema-migrans-rash.html) | 2026-03-27 | 2026-10-15 |
| Contraception: Progestin-Only Pill Missed Doses | [CDC](https://www.cdc.gov/contraception/hcp/usspr/progestin-only-pills.html) | 2024-11-19 | 2026-10-15 |
| Prenatal Infection Screening | [CDC](https://www.cdc.gov/pregnancy-hiv-std-tb-hepatitis/about/) | 2024-01-25 | 2026-10-15 |
| PTSD: Preferred Therapy, Medication Ranges, and Evidence Limits | [VA/DoD](https://www.ptsd.va.gov/professional/treat/txessentials/clinician_guide_meds.asp) | 2023 | 2026-10-15 |
| HIV — initial ART regimen selection | [NIH/DHHS](https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-arv/what-start-initial-combination-regimens) | 2026-09-24 | 2026-10-15 |
| C. difficile — testing and infection prevention | [CDC](https://www.cdc.gov/c-diff/hcp/clinical-guidance/index.html) | 2026-05-13 | 2026-10-15 |
| Gonorrhea — diagnosis, treatment and follow-up | [CDC](https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm) | 2021 | 2026-10-15 |
| Sickle Cell Safety Update: Voxelotor Withdrawn | [FDA](https://www.fda.gov/drugs/drug-alerts-and-statements/fda-alerting-patients-and-health-care-professionals-about-voluntary-withdrawal-oxbryta-market-due) | 2024-09-26 | 2026-10-15 |
| ACS — Selected Checked 2025 Recommendations | [ACC/AHA/ACEP/NAEMSP/SCAI](https://www.acc.org/About-ACC/Press-Releases/2025/02/28/17/51/ACC-AHA-Issue-New-Acute-Coronary-Syndromes-Guideline) | 2025-02-27 guideline; 2025-02-28 page | 2026-10-15 |
| Acute bacterial rhinosinusitis — adult decision points | [CDC](https://www.cdc.gov/antibiotic-use/hcp/clinical-care/adult-outpatient.html) | 2024-04-16 | 2026-10-15 |
| Group A streptococcal pharyngitis — diagnosis and treatment | [CDC](https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html) | 2025-11-18 | 2026-10-15 |
| Influenza — antiviral selection and adult renal dosing | [CDC](https://www.cdc.gov/flu/hcp/antivirals/summary-clinicians.html) | 2026-03-10 | 2026-10-15 |
| Hyperthyroidism — Federal Overview | [NIDDK](https://www.niddk.nih.gov/health-information/endocrine-diseases/hyperthyroidism) | 2021-08 | 2026-10-15 |
| Tirzepatide — Adult Indications and Label Dosing | [FDA label / DailyMed](https://www.dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=487cd7e7-434c-4925-99fa-aa80b1cc776b&type=display) | 2026-08-28 effective label | 2026-10-15 |
| Prediabetes Prevention — VA/DoD Selected Principle | [VA/DoD](https://www.healthquality.va.gov/guidelines/CD/diabetes/VADOD-Diabetes-CPG_Final_508.pdf) | 2023-05 | 2026-10-15 |
| Uncomplicated acute bronchitis — adult antibiotic stewardship | [CDC](https://www.cdc.gov/antibiotic-use/hcp/clinical-care/adult-outpatient.html) | 2024-04-16 | 2026-10-15 |
| Intimate Partner Violence Screening and Referral | [USPSTF](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/intimate-partner-violence-and-abuse-of-elderly-and-vulnerable-adults-screening) | 2025-06-24 | 2026-10-15 |
| Hypertriglyceridemia — Selected 2026 Principle | [ACC/AHA](https://www.acc.org/About-ACC/Press-Releases/2026/03/13/18/01/ACCAHA-Issue-UpDated-Guideline-for-Managing-Lipids-Cholesterol) | 2026-03-13 | 2026-10-15 |
| Electrolyte Emergencies — Checked Safety Principles | [AAFP](https://www.aafp.org/afp/2023/1100/sodium-disorders-hyponatremia-hypernatremia) | 2023-11 | 2026-10-15 |
| Diabetes and Lipid Risk — Selected 2026 Principle | [ACC/AHA](https://www.acc.org/About-ACC/Press-Releases/2026/03/13/18/01/ACCAHA-Issue-UpDated-Guideline-for-Managing-Lipids-Cholesterol) | 2026-03-13 | 2026-10-15 |
| Adult Bradycardia With a Pulse — Acute Algorithm | [AHA](https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Accessible/Algorithm-ACLS-Bradycardia-LngDscrp-250725-Ed.pdf) | 2025 | 2026-10-15 |

## Further curation

Before a historical topic is marked complete, verify every requested section against the actual applicable documents, obtain permitted access where necessary, check safety alerts and newer replacements, document population/setting and source disagreements, review dosing against current labels, and obtain independent clinical review. A document metadata check alone is insufficient. Update the ledger and checked excerpts together, then run the source-policy tests and production build before publishing.
