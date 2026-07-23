/**
 * Curated guideline chunks for RAG — a representative subset covering
 * all 16 ABFM domains. In production you'd have 148+ chunks.
 * Version: v8
 */
export const INGEST_VERSION = "v8";

export interface GuidelineChunk {
  source: string;
  tier: number;
  guidelineTitle: string;
  guidelineYear: number | null;
  abfmDomain: string;
  section: string;
  content: string;
  url: string | null;
}

export const SEED_CHUNKS: GuidelineChunk[] = [
  // ── Cardiovascular ──
  {
    source: "ACC/AHA",
    tier: 1,
    guidelineTitle: "Guideline for Management of Heart Failure",
    guidelineYear: 2022,
    abfmDomain: "Cardiovascular",
    section: "Pharmacotherapy",
    content: "GDMT for HFrEF (EF ≤40%): Start all four pillars simultaneously when possible — ACEi/ARB/ARNI, beta-blocker, MRA, and SGLT2i. Target doses: sacubitril/valsartan 97/103 mg BID, carvedilol 25 mg BID, spironolactone 25-50 mg daily, dapagliflozin 10 mg or empagliflozin 10 mg daily. Titrate every 2 weeks as tolerated. Check renal function and potassium within 1-2 weeks of MRA initiation.",
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001063",
  },
  {
    source: "ACC/AHA",
    tier: 1,
    guidelineTitle: "Guideline on Chronic Coronary Disease",
    guidelineYear: 2023,
    abfmDomain: "Cardiovascular",
    section: "Stable Angina Management",
    content: "First-line therapy for chronic stable angina: beta-blockers or calcium channel blockers for symptom relief. Long-acting nitrates as second-line. Ranolazine for refractory symptoms. All patients need antiplatelet (aspirin 75-100 mg or clopidogrel if aspirin-intolerant), high-intensity statin, and BP control (<130/80 mmHg). Consider stress testing before invasive angiography.",
    url: null,
  },
  {
    source: "AHA/ACC",
    tier: 1,
    guidelineTitle: "Hypertension Clinical Practice Guidelines",
    guidelineYear: 2017,
    abfmDomain: "Cardiovascular",
    section: "Blood Pressure Targets",
    content: "BP target <130/80 mmHg for adults with confirmed hypertension and CVD risk ≥10% or existing CVD. Stage 1 HTN (130-139/80-89): lifestyle for 3-6 months if CVD risk <10%; medication if risk ≥10%. Stage 2 HTN (≥140/90): start medication plus lifestyle. First-line: thiazide, ACEi/ARB, or CCB. Black patients without CKD: thiazide or CCB preferred.",
    url: null,
  },
  // ── Endocrine / Metabolic ──
  {
    source: "ADA",
    tier: 1,
    guidelineTitle: "Standards of Care in Diabetes",
    guidelineYear: 2024,
    abfmDomain: "Endocrine",
    section: "Type 2 Diabetes Pharmacotherapy",
    content: "Metformin remains first-line for T2DM. For patients with ASCVD, HF, or CKD: add GLP-1 RA or SGLT2i with proven cardiovascular or renal benefit regardless of A1C. A1C target <7% for most adults; <8% acceptable for elderly/complex comorbidities. If A1C >1.5% above target, consider early combination therapy or insulin. Screen for CKD annually (eGFR + UACR).",
    url: "https://diabetesjournals.org/care",
  },
  {
    source: "Endocrine Society",
    tier: 2,
    guidelineTitle: "Hypothyroidism in Adults",
    guidelineYear: 2023,
    abfmDomain: "Endocrine",
    section: "Diagnosis and Treatment",
    content: "Diagnose primary hypothyroidism with elevated TSH and low free T4. Subclinical hypothyroidism (elevated TSH, normal free T4): treat if TSH >10, or if symptomatic with TSH 5-10 and risk factors. Levothyroxine 1.6 mcg/kg/day is typical full replacement. Take on empty stomach 30-60 min before breakfast. Recheck TSH in 6-8 weeks after dose changes.",
    url: null,
  },
  // ── Respiratory ──
  {
    source: "GINA",
    tier: 1,
    guidelineTitle: "Global Strategy for Asthma Management",
    guidelineYear: 2024,
    abfmDomain: "Respiratory",
    section: "Stepwise Therapy",
    content: "Track 1 (preferred): Step 1-2: PRN low-dose ICS-formoterol. Step 3: daily low-dose ICS-formoterol maintenance + reliever (MART). Step 4: medium-dose ICS-formoterol MART. Step 5: add LAMA, refer for biologics. Track 2 (alternative): SABA reliever with daily ICS at each step. Avoid SABA-only treatment. Always assess inhaler technique and adherence before stepping up.",
    url: "https://ginasthma.org",
  },
  {
    source: "GOLD",
    tier: 1,
    guidelineTitle: "Global Strategy for COPD",
    guidelineYear: 2024,
    abfmDomain: "Respiratory",
    section: "Initial Pharmacotherapy",
    content: "Group A (low symptoms, low exacerbation risk): bronchodilator PRN. Group B (more symptoms): LABA + LAMA. Group E (exacerbation history): LABA + LAMA ± ICS if eosinophils ≥300. Smoking cessation is the single most effective intervention. Annual influenza and pneumococcal vaccines for all COPD patients. Pulmonary rehab for mMRC ≥2 or post-exacerbation.",
    url: "https://goldcopd.org",
  },
  // ── Infectious Disease ──
  {
    source: "IDSA",
    tier: 1,
    guidelineTitle: "Community-Acquired Pneumonia",
    guidelineYear: 2019,
    abfmDomain: "Infectious Disease",
    section: "Treatment",
    content: "Outpatient healthy adults without comorbidities: amoxicillin 1g TID or doxycycline 100 mg BID or azithromycin (if resistance <25%). Outpatient with comorbidities: amoxicillin/clavulanate or cephalosporin PLUS macrolide or doxycycline; OR respiratory fluoroquinolone monotherapy. Inpatient non-severe: beta-lactam PLUS macrolide or fluoroquinolone alone. Inpatient severe/ICU: beta-lactam PLUS macrolide.",
    url: null,
  },
  {
    source: "CDC/ACIP",
    tier: 1,
    guidelineTitle: "Adult Immunization Schedule",
    guidelineYear: 2024,
    abfmDomain: "Infectious Disease",
    section: "Routine Vaccinations",
    content: "Annual influenza for all adults. Td/Tdap every 10 years (Tdap once if not previously given). PCV20 or PCV15+PPSV23 for adults ≥65 or at-risk 19-64. Shingrix 2 doses for adults ≥50. HPV catch-up through age 26 (shared decision 27-45). COVID-19 updated formulation annually. Hepatitis B for all adults through age 59; risk-based ≥60.",
    url: "https://www.cdc.gov/vaccines/schedules",
  },
  // ── Women's Health ──
  {
    source: "ACOG",
    tier: 2,
    guidelineTitle: "Gestational Diabetes Mellitus",
    guidelineYear: 2018,
    abfmDomain: "Maternity Care",
    section: "Screening and Management",
    content: "Screen all pregnant patients at 24-28 weeks. Early screening if high risk (obesity, prior GDM, family history, PCOS). One-step 75g OGTT or two-step approach (50g GCT then 100g OGTT). Management: MNT + glucose monitoring first. Insulin if fasting >95 or 2hr postprandial >120 despite diet. Metformin or glyburide if patient declines insulin. Postpartum: screen with 75g OGTT at 4-12 weeks.",
    url: null,
  },
  // ── Pediatrics ──
  {
    source: "AAP",
    tier: 2,
    guidelineTitle: "ADHD Clinical Practice Guideline",
    guidelineYear: 2019,
    abfmDomain: "Pediatrics",
    section: "Diagnosis and Treatment",
    content: "Diagnose ADHD ages 4-18 using DSM-5 criteria with evidence from multiple settings. Preschool (4-5): behavioral therapy first-line; methylphenidate if inadequate response. School-age (6-11): FDA-approved medication AND behavioral therapy. Adolescents (12-18): medication with or without behavioral therapy. Stimulants (methylphenidate, amphetamine) are first-line. Monitor height, weight, HR, BP. Non-stimulants: atomoxetine, guanfacine ER, clonidine ER.",
    url: null,
  },
  // ── Renal ──
  {
    source: "KDIGO",
    tier: 2,
    guidelineTitle: "CKD Evaluation and Management",
    guidelineYear: 2024,
    abfmDomain: "Renal",
    section: "CKD Staging and Treatment",
    content: "Stage CKD by eGFR and albuminuria (UACR). G1-G2 (eGFR ≥60): manage risk factors. G3a (45-59): monitor q6 months, refer nephrology if rapid decline. G3b-G4: nephrology co-management, prep for RRT if progressive. SGLT2i for CKD with albuminuria (UACR ≥200) regardless of diabetes. Target BP <120 systolic in CKD. ACEi/ARB for proteinuric CKD. Avoid NSAIDs. Adjust medications for GFR.",
    url: null,
  },
  // ── Mental Health ──
  {
    source: "APA",
    tier: 2,
    guidelineTitle: "Major Depressive Disorder",
    guidelineYear: 2023,
    abfmDomain: "Behavioral Health",
    section: "Treatment",
    content: "Mild depression: psychotherapy alone may be sufficient. Moderate-severe: combination pharmacotherapy + psychotherapy. First-line: SSRIs (sertraline, escitalopram) or SNRIs (duloxetine, venlafaxine). Adequate trial = 4-6 weeks at therapeutic dose. If partial response, augment with bupropion, buspirone, or atypical antipsychotic. Screen for suicidality at every visit using PHQ-9 item 9. Continue medication ≥6 months after remission for first episode.",
    url: null,
  },
  // ── Preventive Medicine / USPSTF ──
  {
    source: "USPSTF",
    tier: 1,
    guidelineTitle: "Screening Recommendations",
    guidelineYear: 2024,
    abfmDomain: "Preventive Medicine",
    section: "Cancer Screening",
    content: "Breast: mammography every 2 years age 40-74 (B grade). Cervical: Pap every 3 years age 21-29; Pap+HPV co-test every 5 years or HPV primary every 5 years age 30-65. Colorectal: multiple options age 45-75 (colonoscopy q10yr, FIT annually, Cologuard q1-3yr, CT colonography q5yr). Lung: low-dose CT annually for adults 50-80 with ≥20 pack-year history, currently smoking or quit within 15 years.",
    url: "https://www.uspreventiveservicestaskforce.org",
  },
  // ── Musculoskeletal ──
  {
    source: "ACR",
    tier: 2,
    guidelineTitle: "Rheumatoid Arthritis",
    guidelineYear: 2021,
    abfmDomain: "Musculoskeletal",
    section: "Treatment",
    content: "Early RA: start DMARD within 3 months of symptom onset. Methotrexate is first-line DMARD. Start 7.5-15 mg weekly, titrate to 25 mg. Supplement with folic acid 1 mg daily. If inadequate response at 3 months, add or switch to biologic (TNFi preferred) or JAK inhibitor. Short course glucocorticoids (≤3 months) as bridge to DMARD effect. Monitor CBC, LFTs, CRP/ESR.",
    url: null,
  },
  // ── Neurology ──
  {
    source: "AAN",
    tier: 2,
    guidelineTitle: "Epilepsy and Seizures",
    guidelineYear: 2022,
    abfmDomain: "Neurology",
    section: "Initial Management",
    content: "After first unprovoked seizure: risk of recurrence ~40%. Treatment after first seizure reduces recurrence but does not affect long-term remission. Start ASD after second unprovoked seizure or if high recurrence risk (EEG abnormalities, structural lesion, nocturnal seizure). First-line focal: levetiracetam, lamotrigine, oxcarbazepine. First-line generalized: valproate (not in women of childbearing age), levetiracetam, lamotrigine.",
    url: null,
  },
  // ── GI / Hepatology ──
  {
    source: "ACG",
    tier: 2,
    guidelineTitle: "GERD Management",
    guidelineYear: 2022,
    abfmDomain: "Gastroenterology",
    section: "Treatment",
    content: "Empiric PPI trial for typical symptoms (heartburn, regurgitation) without alarm features. PPI once daily 30 min before breakfast for 8 weeks. If partial response, increase to BID. Step down to lowest effective dose or H2RA for maintenance. Alarm features (dysphagia, weight loss, GI bleed, age >60 new onset): EGD before empiric therapy. Long-term PPI: monitor Mg, B12, consider bone density.",
    url: null,
  },
  // ── Dermatology ──
  {
    source: "AAD",
    tier: 2,
    guidelineTitle: "Atopic Dermatitis",
    guidelineYear: 2023,
    abfmDomain: "Dermatology",
    section: "Management",
    content: "Mild: emollients + low-potency topical corticosteroids (hydrocortisone 2.5% for face/folds, triamcinolone 0.1% for body). Moderate: medium-potency TCS or topical calcineurin inhibitors (tacrolimus, pimecrolimus) for steroid-sparing. Severe: consider dupilumab, tralokinumab, or JAK inhibitors (abrocitinib, upadacitinib). Maintenance: proactive TCS 2x/week to prevent flares. Bleach baths for recurrent infection.",
    url: null,
  },
  // ── Geriatrics ──
  {
    source: "AGS",
    tier: 2,
    guidelineTitle: "Beers Criteria",
    guidelineYear: 2023,
    abfmDomain: "Geriatrics",
    section: "Potentially Inappropriate Medications",
    content: "Avoid in older adults (≥65): first-generation antihistamines (diphenhydramine), benzodiazepines, non-COX-selective NSAIDs long-term, muscle relaxants (cyclobenzaprine, methocarbamol), long-acting sulfonylureas (glimepiride, glyburide). Use lowest effective doses of PPIs. Avoid antipsychotics for behavioral symptoms of dementia unless non-pharmacologic measures have failed and patient is a danger. Review medication list at every visit.",
    url: null,
  },
  // ── Urology ──
  {
    source: "AUA",
    tier: 2,
    guidelineTitle: "Benign Prostatic Hyperplasia",
    guidelineYear: 2021,
    abfmDomain: "Male Reproductive",
    section: "Management",
    content: "Mild symptoms (IPSS <8): watchful waiting with lifestyle modifications (fluid management, caffeine reduction). Moderate (IPSS 8-19): alpha-blocker (tamsulosin 0.4mg daily) first-line for symptom relief. 5-alpha reductase inhibitor (finasteride, dutasteride) if prostate >30g. Combination for large prostates. PDE5i (tadalafil 5mg daily) for concurrent BPH + ED. Surgical referral if refractory or complications.",
    url: null,
  },
];
