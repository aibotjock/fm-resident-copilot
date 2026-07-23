import type { GuidelineChunk } from "../store";

export const SEED_CHUNKS: GuidelineChunk[] = [
  // ========== CARDIOVASCULAR (10%) ==========

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2017 ACC/AHA High Blood Pressure Guideline",
    guideline_year: "2023",
    abfm_domain: "Cardiovascular",
    section: "Blood Pressure Classification and Thresholds",
    content: `Blood pressure classification per 2017 ACC/AHA guideline (updated 2023):
- Normal: <120/<80 mmHg
- Elevated: 120-129/<80 mmHg
- Stage 1 Hypertension: 130-139/80-89 mmHg
- Stage 2 Hypertension: ≥140/≥90 mmHg

Treatment thresholds:
- Stage 1 HTN + established CVD or 10-year ASCVD risk ≥10%: initiate pharmacotherapy alongside lifestyle
- Stage 1 HTN + 10-year ASCVD risk <10%: lifestyle modification first, reassess in 3-6 months
- Stage 2 HTN: antihypertensive pharmacotherapy + lifestyle modification
- BP goal for most patients: <130/80 mmHg
- Hypertensive urgency (no end-organ damage): oral medications, outpatient follow-up within 7 days
- Hypertensive emergency (end-organ damage): reduce MAP by no more than 25% in first hour, IV medications`,
    url: "https://www.ahajournals.org/doi/10.1161/HYP.0000000000000065",
  },

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2017 ACC/AHA High Blood Pressure Guideline",
    guideline_year: "2023",
    abfm_domain: "Cardiovascular",
    section: "Antihypertensive Drug Selection",
    content: `First-line antihypertensive agents (ACC/AHA):
- Thiazide/thiazide-like diuretics: chlorthalidone preferred over HCTZ (longer half-life, superior outcomes)
- ACE inhibitors or ARBs (not in combination with each other)
- Dihydropyridine calcium channel blockers (amlodipine)

Compelling indications:
- CKD with proteinuria: ACEi or ARB (slow progression)
- Heart failure (HFrEF): ACEi/ARB, beta-blocker, MRA, SGLT2i
- Post-MI: ACEi, beta-blocker
- Diabetes + proteinuria: ACEi or ARB
- Black patients without CKD/HF: thiazide or CCB preferred (monotherapy with ACEi/ARB less effective)
- Pregnancy: labetalol, nifedipine, methyldopa (avoid ACEi/ARB — teratogenic)
- Resistant HTN: add spironolactone as 4th agent (per PATHWAY-2 trial)
- Elderly (≥65): SBP target <130 mmHg appropriate if tolerated (SPRINT trial evidence)`,
    url: "https://www.ahajournals.org/doi/10.1161/HYP.0000000000000065",
  },

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2022 AHA/ACC/HFSA Heart Failure Guideline",
    guideline_year: "2022",
    abfm_domain: "Cardiovascular",
    section: "HFrEF Guideline-Directed Medical Therapy",
    content: `Heart failure classification:
- HFrEF: EF ≤40%
- HFmrEF: EF 41-49%
- HFpEF: EF ≥50%
- NYHA Functional Classes: I (no symptoms), II (symptoms with moderate exertion), III (symptoms with minimal exertion), IV (symptoms at rest)

HFrEF GDMT — all Class I recommendations:
1. ACEi/ARB/ARNI: sacubitril-valsartan (Entresto) preferred over ACEi if NYHA II-III, EF ≤40% (reduces mortality vs. enalapril — PARADIGM-HF)
2. Evidence-based beta-blockers ONLY: carvedilol, metoprolol succinate (extended-release), bisoprolol
3. Mineralocorticoid receptor antagonist (MRA): spironolactone or eplerenone — if eGFR >30, K <5.0
4. SGLT2 inhibitor: dapagliflozin or empagliflozin — Class I (2022 update, reduces hospitalizations and CV death)

Device therapy:
- ICD: EF ≤35% despite ≥3 months GDMT, NYHA II-III, life expectancy >1 year (for sudden death prevention)
- CRT: EF ≤35%, LBBB with QRS ≥150ms, NYHA II-IV on GDMT (improves EF, symptoms, survival)

Contraindicated in HFrEF: non-dihydropyridine CCBs (verapamil, diltiazem), NSAIDs, thiazolidinediones`,
    url: "https://www.jacc.org/doi/10.1016/j.jacc.2021.12.012",
  },

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2022 AHA/ACC/HFSA Heart Failure Guideline",
    guideline_year: "2022",
    abfm_domain: "Cardiovascular",
    section: "HFpEF Management",
    content: `HFpEF (EF ≥50%) management:
- SGLT2 inhibitors (empagliflozin): Class IIa — reduces HF hospitalizations (EMPEROR-Preserved trial)
- Diuretics: loop diuretics for volume overload/congestion (Class I)
- Treat underlying conditions: hypertension (BP <130/80), atrial fibrillation, coronary artery disease, obesity, sleep apnea
- ARBs (candesartan): Class IIb — modest benefit
- Spironolactone: Class IIb — borderline benefit in TOPCAT trial
- ACE inhibitors, beta-blockers: NOT shown to reduce mortality in HFpEF
- Exercise training: Class IIa for improvement in functional capacity

Differentiating HF from COPD/PE: BNP or NT-proBNP — elevated in HF (BNP >100 pg/mL, NT-proBNP >300 pg/mL suggests HF)`,
    url: "https://www.jacc.org/doi/10.1016/j.jacc.2021.12.012",
  },

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2023 ACC/AHA Atrial Fibrillation Guideline",
    guideline_year: "2023",
    abfm_domain: "Cardiovascular",
    section: "Stroke Risk Stratification and Anticoagulation",
    content: `Atrial fibrillation stroke risk: CHA2DS2-VASc score
- C: CHF or LV dysfunction (1 pt)
- H: Hypertension (1 pt)
- A2: Age ≥75 (2 pts)
- D: Diabetes mellitus (1 pt)
- S2: Stroke/TIA history (2 pts)
- V: Vascular disease (prior MI, PAD) (1 pt)
- A: Age 65-74 (1 pt)
- Sc: Female sex (1 pt)

Anticoagulation recommendations:
- Score 0 (males) or 1 (females): no anticoagulation recommended
- Score 1 (males): anticoagulation reasonable, individualize
- Score ≥2 (males) or ≥3 (females): oral anticoagulation recommended

Preferred agents:
- DOACs preferred over warfarin (fewer bleeds, no monitoring, better stroke prevention): apixaban, rivaroxaban, dabigatran, edoxaban
- Warfarin only for mechanical heart valves or significant rheumatic mitral stenosis
- Apixaban: lowest bleeding risk among DOACs (ARISTOTLE trial)

HAS-BLED score: estimates bleeding risk — high risk ≥3, but bleeding risk score alone should NOT withhold anticoagulation if stroke risk is high`,
    url: "https://www.jacc.org/doi/10.1016/j.jacc.2023.08.017",
  },

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2023 ACC/AHA Atrial Fibrillation Guideline",
    guideline_year: "2023",
    abfm_domain: "Cardiovascular",
    section: "Rate and Rhythm Control",
    content: `AFib rate control:
- Target resting HR <80 bpm (lenient <110 bpm may be acceptable if asymptomatic)
- First-line: beta-blockers (metoprolol, atenolol) or non-dihydropyridine CCBs (diltiazem, verapamil)
- Avoid non-DHP CCBs in HFrEF (negative inotropy causes decompensation)
- Digoxin: second-line, useful in HF or sedentary patients; narrow therapeutic window (level 0.5-0.9 ng/mL)

AFib rhythm control:
- Class Ic antiarrhythmics (flecainide, propafenone): only in structurally normal heart (no CHD, HF, significant LVH)
- Amiodarone: most effective but significant toxicity (pulmonary, thyroid, hepatic, photosensitivity); used when other agents fail or in HF
- Sotalol: Class III, requires QTc monitoring (stop if QTc >500ms)
- Catheter ablation: pulmonary vein isolation — superior to antiarrhythmic drugs for maintaining sinus rhythm; Class I for symptomatic AFib after failed antiarrhythmic drug; reasonable first-line for younger patients and AFib with HFrEF (CASTLE-AF showed mortality benefit)`,
    url: "https://www.jacc.org/doi/10.1016/j.jacc.2023.08.017",
  },

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2018 ACC/AHA Cholesterol Guideline",
    guideline_year: "2022",
    abfm_domain: "Cardiovascular",
    section: "Statin Benefit Groups and Intensity",
    content: `Four statin benefit groups (Class I — initiate statin therapy):
1. Clinical ASCVD (atherosclerotic CVD): ACS, prior MI, stable/unstable angina, coronary revascularization, stroke/TIA, PAD — high-intensity statin
2. LDL ≥190 mg/dL (primary hyperlipidemia): high-intensity statin (familial hypercholesterolemia)
3. Diabetes mellitus, age 40-75, LDL 70-189: moderate-intensity statin; high-intensity if 10-yr risk ≥7.5%
4. Primary prevention, no DM, age 40-75, LDL 70-189, 10-yr ASCVD risk ≥7.5%: moderate-high intensity statin

Statin intensity:
- High-intensity: atorvastatin 40-80mg/day, rosuvastatin 20-40mg/day (lowers LDL ≥50%)
- Moderate-intensity: atorvastatin 10-20mg, rosuvastatin 5-10mg, simvastatin 20-40mg, pravastatin 40-80mg, lovastatin 40mg (lowers LDL 30-50%)
- Low-intensity: simvastatin 10mg, pravastatin 10-20mg, lovastatin 20mg

Escalation in high-risk ASCVD (LDL ≥70 on max statin):
- Add ezetimibe first (reduces LDL further 15-20%)
- If still LDL ≥70: add PCSK9 inhibitor (evolocumab or alirocumab — reduces LDL 50-60% further)

10-year ASCVD risk calculator: ACC/AHA Pooled Cohort Equations (race/sex-specific)`,
    url: "https://www.jacc.org/doi/10.1016/j.jacc.2018.11.003",
  },

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2021 ACC Chest Pain Guideline",
    guideline_year: "2021",
    abfm_domain: "Cardiovascular",
    section: "Acute Coronary Syndrome Risk Stratification",
    content: `HEART score for chest pain risk stratification (ACS):
- H: History (typical 2, atypical 1, non-cardiac 0)
- E: EKG (LBBB/ST depression 2, nonspecific 1, normal 0)
- A: Age (≥65: 2, 45-65: 1, <45: 0)
- R: Risk factors (≥3 risk factors or hx atherosclerosis 2, 1-2 risk factors 1, none 0)
- T: Troponin (>3x normal 2, 1-3x normal 1, ≤normal 0)

Interpretation:
- 0-3 (low risk): 1.7% MACE — safe discharge with follow-up
- 4-6 (moderate): 12% MACE — observation/testing warranted
- 7-10 (high risk): 50-65% MACE — early invasive strategy

TIMI score for UA/NSTEMI (7 criteria, score 0-7):
- Low (0-2): 5% event rate, conservative management
- Intermediate (3-4): 13% event rate
- High (5-7): 26% event rate, benefit from early invasive strategy

Troponin interpretation: high-sensitivity troponin preferred; 0h/1h or 0h/2h serial strategy with absolute change thresholds per specific assay`,
    url: "https://www.jacc.org/doi/10.1016/j.jacc.2021.07.053",
  },

  // ========== ENDOCRINE & METABOLIC (8%) ==========

  {
    source: "ADA",
    tier: 2,
    guideline_title: "Standards of Medical Care in Diabetes",
    guideline_year: "2024",
    abfm_domain: "Endocrine & Metabolic",
    section: "Diabetes Diagnosis Criteria",
    content: `Diabetes mellitus diagnosis (any one criterion confirmed on two separate days, or two different tests on same day):
1. Fasting plasma glucose ≥126 mg/dL (fasting = no caloric intake ≥8 hours)
2. 2-hour plasma glucose ≥200 mg/dL during 75g OGTT
3. A1c ≥6.5% (standardized assay)
4. Random plasma glucose ≥200 mg/dL with classic hyperglycemia symptoms (polyuria, polydipsia, unexplained weight loss)

Prediabetes:
- Fasting glucose 100-125 mg/dL (IFG)
- 2-hr OGTT 140-199 mg/dL (IGT)
- A1c 5.7-6.4%

Screening:
- Adults ≥35 years: screen every 3 years if normal
- Any adult with overweight/obesity (BMI ≥25, or ≥23 in Asian Americans) + ≥1 risk factor: screen at any age
- Risk factors: physical inactivity, first-degree relative with DM, high-risk ethnicity, GDM history, hypertension, HDL <35, TG >250, PCOS, impaired fasting glucose previously, A1c ≥5.7% previously

Type 1 vs Type 2 differentiation: anti-GAD, anti-islet antibodies; C-peptide level`,
    url: "https://diabetesjournals.org/care/issue/47/Supplement_1",
  },

  {
    source: "ADA",
    tier: 2,
    guideline_title: "Standards of Medical Care in Diabetes",
    guideline_year: "2024",
    abfm_domain: "Endocrine & Metabolic",
    section: "Type 2 Diabetes Glycemic Targets and Initial Management",
    content: `Type 2 diabetes glycemic targets (ADA 2024):
- A1c goal: <7.0% for most adults with T2DM (individualized)
- Less stringent A1c (7.5-8.0%): elderly, limited life expectancy, history of severe hypoglycemia, advanced microvascular/macrovascular complications, long-standing DM where goal is difficult to achieve
- More stringent A1c (<6.5%): short duration, young, no CVD, low hypoglycemia risk, motivated patient

BP goal: <130/80 mmHg
LDL goal: <100 mg/dL; <70 mg/dL with established ASCVD

Initial pharmacotherapy:
1. Metformin: first-line if no contraindications (eGFR ≥30) — stop if eGFR <30; hold for iodinated contrast, surgery
2. With established ASCVD or high CV risk: add GLP-1 RA (liraglutide, semaglutide, dulaglutide) or SGLT2i (empagliflozin, canagliflozin, dapagliflozin) — PROVEN CV/renal benefit beyond glucose lowering
3. With HF or CKD: SGLT2 inhibitor preferred (renal protection, reduces HF hospitalizations)
4. Obesity/weight loss: GLP-1 RA (semaglutide most weight loss; tirzepatide — GLP-1/GIP dual agonist, superior weight loss)
5. High hypoglycemia risk: avoid sulfonylureas/insulin as early additions`,
    url: "https://diabetesjournals.org/care/issue/47/Supplement_1",
  },

  {
    source: "ADA",
    tier: 2,
    guideline_title: "Standards of Medical Care in Diabetes",
    guideline_year: "2024",
    abfm_domain: "Endocrine & Metabolic",
    section: "Insulin Therapy and Monitoring",
    content: `Insulin therapy in T2DM:
- Basal insulin (once-daily): glargine (Lantus, Basaglar), detemir, degludec (Tresiba, less hypoglycemia) — start 10 units or 0.1-0.2 u/kg at bedtime; titrate by 2 units every 3 days to fasting glucose 80-130
- Add prandial insulin when A1c >9% on basal, or postprandial glucose uncontrolled: lispro, aspart, glulisine before largest meal
- Premixed insulins: less flexible, useful in non-adherent patients

Hypoglycemia management:
- Mild-moderate: 15-20g fast-acting carbohydrate (glucose tablets, juice, regular soda); recheck in 15 min; if no improvement repeat
- Severe (unable to self-treat): glucagon (intranasal glucagon 3mg — Baqsimi; or IM/SC glucagon kit); call 911 for altered consciousness

Monitoring:
- Self-monitoring blood glucose: fasting + postprandial targets (140 mg/dL 2hr post)
- Continuous glucose monitoring (CGM): Time-in-range (70-180 mg/dL) goal >70%
- A1c testing: every 3 months if uncontrolled or medication change; every 6 months if stable and at goal

DKA: pH <7.3, glucose >250, ketones; fluids + insulin drip + potassium replacement`,
    url: "https://diabetesjournals.org/care/issue/47/Supplement_1",
  },

  {
    source: "Endocrine Society",
    tier: 2,
    guideline_title: "Clinical Practice Guideline: Hypothyroidism in Adults",
    guideline_year: "2022",
    abfm_domain: "Endocrine & Metabolic",
    section: "Hypothyroidism Diagnosis and Treatment",
    content: `Hypothyroidism diagnosis and management (Endocrine Society):

TSH thresholds:
- TSH 4.5-10 mIU/L + normal free T4 = subclinical hypothyroidism
- TSH >10 mIU/L + low free T4 = overt hypothyroidism
- Treat subclinical if: TSH >10, symptoms, pregnancy or planning pregnancy, age <65

Treatment:
- Levothyroxine (LT4) is first-line: start 1.6 mcg/kg/day; lower dose (25-50 mcg/day) in elderly or cardiac disease
- Take on empty stomach, 30-60 min before breakfast; avoid within 4 hours of calcium, iron, antacids
- Recheck TSH 6-8 weeks after initiation or dose change; adjust dose by 12.5-25 mcg
- TSH goal: 0.5-2.5 mIU/L in most adults; 0.1-1.5 mIU/L in pregnancy

Causes: Hashimoto thyroiditis (TPO antibodies), post-RAI, thyroidectomy, amiodarone, lithium

Myxedema coma: life-threatening; IV LT4 + IV liothyronine (T3) + hydrocortisone + supportive care`,
    url: "https://www.endocrine.org/clinical-practice-guidelines/hypothyroidism",
  },

  {
    source: "Endocrine Society",
    tier: 2,
    guideline_title: "Clinical Practice Guideline: Osteoporosis",
    guideline_year: "2022",
    abfm_domain: "Endocrine & Metabolic",
    section: "Osteoporosis Diagnosis, Screening, and Treatment",
    content: `Osteoporosis screening (USPSTF endorsed):
- Women ≥65: DEXA bone density (T-score ≤-2.5 = osteoporosis; -1.0 to -2.5 = osteopenia)
- Women <65 with increased risk: use FRAX tool (10-yr fracture risk ≥3% hip or ≥20% major osteoporotic fracture = treat)
- Men ≥70 or ≥50 with risk factors: screen per clinical judgment

Treatment (Endocrine Society):
- Universal: calcium 1000-1200 mg/day (diet + supplement); vitamin D 600-800 IU/day (or 1500-2000 IU if deficient)
- Pharmacotherapy thresholds: T-score ≤-2.5, prior hip/vertebral fracture, or osteopenia with high FRAX

First-line: bisphosphonates
- Alendronate 70 mg weekly (take upright, with full glass water, no food/meds for 30-60 min — risk of esophageal injury)
- Risedronate 35 mg weekly or 150 mg monthly
- Zoledronic acid 5 mg IV annually — best adherence
- Drug holiday: after 3-5 years oral bisphosphonate if stable; continue if high risk

Second-line: denosumab (SQ every 6 months — do NOT stop abruptly, risk of rebound vertebral fractures), raloxifene, teriparatide (anabolic, reserve for severe osteoporosis)`,
    url: "https://www.endocrine.org/clinical-practice-guidelines/osteoporosis",
  },

  // ========== PSYCHIATRY & BEHAVIORAL HEALTH (8%) ==========

  {
    source: "APA",
    tier: 2,
    guideline_title: "Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision (DSM-5-TR)",
    guideline_year: "2022",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "Major Depressive Disorder Criteria",
    content: `Major Depressive Disorder (MDD) DSM-5-TR criteria:
- ≥5 symptoms present nearly every day for ≥2 weeks; must include at least one of:
  (1) Depressed mood (subjective or observed)
  (2) Anhedonia (markedly diminished interest/pleasure in nearly all activities)
- Other symptoms: significant weight/appetite change, insomnia or hypersomnia, psychomotor agitation or retardation (observable), fatigue/energy loss, worthlessness or excessive guilt, poor concentration/indecisiveness, recurrent suicidal ideation or attempt

Must cause significant distress or impairment; NOT attributable to substance/medical condition; NOT better explained by psychotic disorder

PHQ-9 severity scoring:
- 0-4: None/minimal; 5-9: Mild; 10-14: Moderate; 15-19: Moderately severe; 20-27: Severe
- Score ≥10: sensitivity 88%, specificity 88% for MDD

Treatment per APA:
- Mild: psychotherapy (CBT) alone or combined with pharmacotherapy
- Moderate-severe: SSRI first-line + psychotherapy
- First-line SSRIs: sertraline, escitalopram (best efficacy-tolerability per STAR*D and network meta-analysis)
- 4-6 weeks for adequate antidepressant trial (partial responders may continue 8-12 weeks)
- Maintain for ≥6-12 months after remission; first episode: 12 months; recurrent: long-term`,
    url: "https://www.psychiatry.org/psychiatrists/practice/dsm",
  },

  {
    source: "APA",
    tier: 2,
    guideline_title: "APA Practice Guideline for Major Depressive Disorder",
    guideline_year: "2023",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "Pharmacotherapy for Depression",
    content: `Antidepressant selection and management (APA):

SSRI first-line (least side effects, safest in overdose):
- Sertraline: broad evidence, safe in cardiac disease, safe in pregnancy; start 25-50mg, max 200mg
- Escitalopram: fewest drug interactions (CYP2C19 minimal); start 10mg, max 20mg
- Fluoxetine: longest half-life (safest for missed doses/discontinuation); activating — avoid in insomnia
- Paroxetine: most anticholinergic, most sedating, most weight gain, most discontinuation syndrome; not preferred in elderly

SNRI second-line:
- Venlafaxine, duloxetine: for comorbid pain, anxiety; dose-dependent norepinephrine; check BP
- Duloxetine also approved for diabetic peripheral neuropathy

Other antidepressants:
- Bupropion: activating, no sexual side effects, weight neutral/loss; lowers seizure threshold — contraindicated in seizure disorder, bulimia, anorexia; also for smoking cessation (Zyban)
- Mirtazapine: sedating (antihistamine), weight gain, useful in insomnia/low appetite depression
- Trazodone: low-dose for insomnia; not effective antidepressant at usual doses

MAOI/TCA: reserved for treatment-resistant; significant interactions and safety concerns
Serotonin syndrome: agitation, clonus, diaphoresis, hyperthermia — risk with combinations of serotonergic drugs

Common side effects: GI upset (SSRIs), sexual dysfunction (SSRIs, SNRIs), weight gain (paroxetine, mirtazapine), discontinuation syndrome (short half-life agents — taper)`,
    url: "https://www.psychiatry.org/psychiatrists/practice/clinical-practice-guidelines",
  },

  {
    source: "APA",
    tier: 2,
    guideline_title: "Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision (DSM-5-TR)",
    guideline_year: "2022",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "Anxiety Disorders",
    content: `Generalized Anxiety Disorder (GAD) DSM-5-TR criteria:
- Excessive worry about multiple events/activities for ≥6 months, difficult to control
- ≥3 of 6 symptoms: restlessness, fatigue, poor concentration, irritability, muscle tension, sleep disturbance
- GAD-7 ≥10: probable GAD (sensitivity 89%, specificity 82%)

Panic Disorder: recurrent unexpected panic attacks + ≥1 month of anticipatory anxiety/behavioral change; rule out medical causes (hyperthyroid, pheochromocytoma, arrhythmia, hypoglycemia)

Social Anxiety Disorder: marked fear of scrutiny in social situations, avoidance, ≥6 months; distinguish from normal shyness

Treatment of anxiety disorders (APA/evidence-based):
- First-line: SSRI or SNRI (sertraline, escitalopram, venlafaxine, duloxetine); therapeutic response 4-6 weeks
- Psychotherapy: CBT with exposure — equivalent or superior to medications long-term
- Short-term: benzodiazepines for acute anxiety/panic — lorazepam, clonazepam; risk of dependence, avoid long-term, avoid in substance use disorder
- Buspirone: for GAD, delayed onset 2-4 weeks, no dependence, no acute efficacy; not for panic
- Beta-blockers (propranolol): situational anxiety (performance anxiety), not for generalized anxiety`,
    url: "https://www.psychiatry.org/psychiatrists/practice/dsm",
  },

  {
    source: "APA",
    tier: 2,
    guideline_title: "Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision (DSM-5-TR)",
    guideline_year: "2022",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "Bipolar Disorder Diagnosis and Management",
    content: `Bipolar I Disorder: ≥1 manic episode lasting ≥7 days (or any duration if hospitalization required or psychotic features); manic episode = abnormally elevated/expansive/irritable mood + increased goal-directed activity + ≥3 of: grandiosity, decreased sleep, pressured speech, racing thoughts, distractibility, psychomotor agitation, risk-taking behavior

Bipolar II: hypomanic episodes (≥4 days, similar but less severe, no hospitalization/psychosis) + at least one major depressive episode; no full manic episodes

Cyclothymic disorder: numerous hypomanic + depressive periods over ≥2 years (1 year in children) without full criteria

Management (APA):
- Acute mania: lithium or valproate ± antipsychotic; atypical antipsychotics can be used as monotherapy for acute mania
- Maintenance: lithium (first-line), valproate, lamotrigine (depression prevention), quetiapine
- Lithium monitoring: trough level 0.6-1.2 mEq/L; toxicity >1.5 mEq/L (tremor, ataxia, altered mental status); monitor renal function, TSH; teratogenic (Ebstein anomaly — relative risk); adequate hydration essential
- AVOID antidepressant monotherapy — can precipitate mania; if needed, must use with mood stabilizer
- Lamotrigine: excellent for bipolar depression; must titrate slowly (SJS risk); start 25mg and increase by 25mg every 2 weeks`,
    url: "https://www.psychiatry.org/psychiatrists/practice/dsm",
  },

  {
    source: "APA",
    tier: 2,
    guideline_title: "Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision (DSM-5-TR)",
    guideline_year: "2022",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "ADHD Diagnosis and Treatment",
    content: `ADHD DSM-5-TR criteria:
- ≥6 symptoms of inattention AND/OR hyperactivity-impulsivity
- Present in ≥2 settings, symptoms before age 12, impairing for ≥6 months
- Presentations: predominantly inattentive, predominantly hyperactive-impulsive, combined

Adults: ≥5 symptoms (not 6) sufficient

Inattention symptoms: careless mistakes, difficulty sustaining attention, not listening, fails to follow through, poor organization, avoids sustained mental effort, loses things, easily distracted, forgetful

Hyperactivity-impulsivity symptoms: fidgets, leaves seat, runs/climbs inappropriately, can't play quietly, "on the go," talks excessively, blurts out answers, can't wait turn, interrupts

Treatment (AAFP/AAP endorsed):
- Children 6+: stimulant medication + behavioral therapy (behavioral therapy alone for 4-5 year olds)
- First-line stimulants: methylphenidate (Ritalin, Concerta, Daytrana) or amphetamine-based (Adderall, Vyvanse)
- Long-acting preferred over short-acting for adherence and duration
- Non-stimulants: atomoxetine (SNRI, delayed onset 4-6 weeks), guanfacine ER, clonidine ER (useful if stimulant intolerance or comorbid tics/anxiety)
- Monitor: height/weight (growth suppression), BP/HR, sleep, appetite, tics
- DEA Schedule II (high abuse potential) — prescriptions cannot be phoned in or refilled early`,
    url: "https://www.psychiatry.org/psychiatrists/practice/dsm",
  },

  {
    source: "APA",
    tier: 2,
    guideline_title: "Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision (DSM-5-TR)",
    guideline_year: "2022",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "Schizophrenia Spectrum Disorders",
    content: `Schizophrenia DSM-5-TR criteria:
- ≥2 of 5 symptoms (≥1 must be from first 3) for ≥1 month:
  1. Delusions, 2. Hallucinations, 3. Disorganized speech, 4. Grossly disorganized or catatonic behavior, 5. Negative symptoms (alogia, avolition, flat affect)
- Continuous signs of disturbance ≥6 months
- Must rule out: schizoaffective disorder, substance use, medical condition

Treatment:
- Second-generation (atypical) antipsychotics: first-line — risperidone, olanzapine, quetiapine, aripiprazole, ziprasidone, lurasidone, paliperidone
- Clozapine: for treatment-resistant schizophrenia (failed ≥2 antipsychotics); requires mandatory REMS monitoring (ANC weekly/biweekly) due to agranulocytosis risk
- Long-acting injectable formulations: for adherence issues

Antipsychotic side effects:
- EPS (extrapyramidal symptoms): more with first-generation (haloperidol, fluphenazine); less with atypicals; treat with benztropine or diphenhydramine
- Tardive dyskinesia: involuntary orofacial movements — VMAT2 inhibitors (valbenazine, deutetrabenazine) if severe
- Metabolic syndrome: most with olanzapine/clozapine (weight gain, glucose intolerance, dyslipidemia) — monitor metabolic labs
- QTc prolongation: ziprasidone, haloperidol — avoid with other QTc-prolonging agents
- Hyperprolactinemia: risperidone, haloperidol (amenorrhea, galactorrhea, sexual dysfunction)
- NMS (neuroleptic malignant syndrome): fever, rigidity, altered mental status, autonomic instability — stop antipsychotic, supportive care, dantrolene/bromocriptine`,
    url: "https://www.psychiatry.org/psychiatrists/practice/dsm",
  },

  // ========== PREVENTIVE MEDICINE (8%) ==========
  // (USPSTF content is injected live; seed data covers CDC/ACIP immunizations)

  {
    source: "CDC/ACIP",
    tier: 1,
    guideline_title: "Adult Immunization Schedule",
    guideline_year: "2024",
    abfm_domain: "Preventive Medicine & Health Maintenance",
    section: "Adult Recommended Immunizations",
    content: `CDC/ACIP 2024 Adult Immunization Schedule — routine recommendations:

Influenza: annually for all adults ≥6 months; high-dose or adjuvanted for ≥65

COVID-19: updated annual vaccine for all adults (≥6 months)

Tdap: one dose for all adults who have not received (regardless of time since Td); then Td or Tdap every 10 years; Tdap in each pregnancy (27-36 weeks, ideally ≥27 weeks)

Shingles (Zoster): RZV (Shingrix) — 2 doses 2-6 months apart for all adults ≥50; preferred over ZVL (Zostavax, no longer available in US); give regardless of prior history of shingles or prior ZVL vaccination

Pneumococcal vaccines: 
- PCV20 (Prevnar20): single dose for adults ≥65 not previously vaccinated; preferred over PCV15/PPSV23 combination
- High-risk conditions (immunocompromised, asplenia, CKD, diabetes, smoking, COPD, heart disease) < 65: PCV20 or PCV15 followed by PPSV23

MMR: 1 dose for adults born ≥1957 without evidence of immunity; 2 doses if high-risk (international travel, healthcare workers, college students)
Varicella: 2 doses for adults without evidence of immunity

Hepatitis B: complete 3-dose series for all unvaccinated adults; 2-dose Heplisav-B (>18 years) available
Hepatitis A: 2 doses for high-risk (travel, liver disease, substance use, men who have sex with men, food handlers)

HPV: through age 26 for all; shared decision making 27-45 (less benefit, most already exposed)`,
    url: "https://www.cdc.gov/vaccines/schedules/hcp/imz/adult.html",
  },

  {
    source: "CDC/ACIP",
    tier: 1,
    guideline_title: "Childhood and Adolescent Immunization Schedule",
    guideline_year: "2024",
    abfm_domain: "Preventive Medicine & Health Maintenance",
    section: "Birth to Adolescence Vaccine Schedule",
    content: `CDC/ACIP 2024 Childhood Immunization Schedule:

Birth: HepB #1
1-2 months: HepB #2
2 months: DTaP #1, Hib #1, IPV #1, PCV15/PCV20 #1, RV #1 (RotaTeq — 3 dose; Rotarix — 2 dose)
4 months: DTaP #2, Hib #2, IPV #2, PCV #2, RV #2
6 months: DTaP #3, PCV #3, Hib #3 (if Hib-OMP), HepB #3, RV #3 (RotaTeq only), Influenza (annually)
12-15 months: MMR #1, Varicella #1, Hib #4, PCV #4, HepA #1
15-18 months: DTaP #4
18-24 months: HepA #2 (≥6 months after #1)
4-6 years: DTaP #5, IPV #4, MMR #2, Varicella #2
11-12 years: Tdap, MenACWY #1, HPV (2 doses if started before 15th birthday; 3 doses if started ≥15)
16 years: MenACWY booster
16-18 years: MenB (2-3 doses — shared decision making)

COVID-19: all children ≥6 months, updated annual vaccination

Contraindications to live vaccines (MMR, Varicella, RV, intranasal flu): immunocompromised states, pregnancy
Catch-up schedule available for delayed vaccinations`,
    url: "https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html",
  },

  {
    source: "USPSTF",
    tier: 1,
    guideline_title: "USPSTF Colorectal Cancer Screening",
    guideline_year: "2021",
    abfm_domain: "Preventive Medicine & Health Maintenance",
    section: "Colorectal Cancer Screening Recommendations",
    content: `USPSTF 2021 Colorectal Cancer Screening — Grade A (age 45-75) and Grade B (age 45-49):
- All adults: begin at age 45 (changed from 50 in 2021 update)
- Screen through age 75 for average-risk adults
- Age 76-85: individual decision (Grade C — consider patient preferences, life expectancy, prior screening)
- Age >85: no screening recommended

Screening options (all acceptable, patient preference guides choice):
- Annual high-sensitivity guaiac FOBT or FIT test
- FIT-DNA (Cologuard): every 1-3 years
- CT colonography: every 5 years
- Flexible sigmoidoscopy: every 5 years
- Flexible sigmoidoscopy + annual FIT: every 10 years (flex sig) + annual (FIT)
- Colonoscopy: every 10 years

High-risk patients (hereditary syndromes, first-degree relative with CRC <60, IBD): earlier/more frequent screening; not covered by USPSTF recommendation

Positive non-colonoscopy test requires diagnostic colonoscopy`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
  },

  {
    source: "USPSTF",
    tier: 1,
    guideline_title: "USPSTF Breast Cancer Screening",
    guideline_year: "2024",
    abfm_domain: "Preventive Medicine & Health Maintenance",
    section: "Breast Cancer Screening Recommendations",
    content: `USPSTF 2024 Breast Cancer Screening — Grade B:
- Begin mammography at age 40 (updated from 50 in 2024 guideline; Grade B for ages 40-74)
- Biennial (every 2 years) mammography for women 40-74
- Age 75+: insufficient evidence (Grade I)

BRCA risk:
- Women with family history: offer BRCA risk assessment and refer for genetic counseling if positive screen
- BRCA1/2 mutation carriers: consider bilateral mastectomy (risk reduction), enhanced surveillance (annual mammogram + MRI)
- Chemoprevention with tamoxifen, raloxifene, or aromatase inhibitor for high-risk women (Grade B)

Abnormal mammogram categories (BI-RADS):
- BI-RADS 0: incomplete — needs additional imaging
- BI-RADS 1-2: negative/benign — routine screening
- BI-RADS 3: probably benign — 6-month follow-up
- BI-RADS 4: suspicious — biopsy recommended
- BI-RADS 5: highly suggestive of malignancy — biopsy

Dense breast tissue: reduces mammogram sensitivity; supplemental ultrasound or MRI may be offered`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening",
  },

  {
    source: "USPSTF",
    tier: 1,
    guideline_title: "USPSTF Lung Cancer Screening",
    guideline_year: "2021",
    abfm_domain: "Preventive Medicine & Health Maintenance",
    section: "Lung Cancer Screening Recommendations",
    content: `USPSTF 2021 Lung Cancer Screening — Grade B:
- Annual low-dose CT (LDCT) for:
  - Adults 50-80 years
  - ≥20 pack-year smoking history
  - Currently smoke OR quit within past 15 years

Discontinue screening if:
- Person has not smoked in >15 years
- Develops a health problem limiting life expectancy or ability to pursue curative treatment
- Reaches age 81

Important considerations:
- Shared decision-making discussion before initiating (benefits, harms including false positives, invasive procedures, radiation exposure, incidental findings)
- Screening should only occur at facilities with appropriate follow-up capability
- 2021 lowered start age from 55 to 50 and lowered pack-year threshold from 30 to 20 — expands eligibility, especially for Black adults

Lung-RADS interpretation:
- Category 1-2: no or benign findings — annual LDCT
- Category 3: probably benign — 6-month LDCT
- Category 4A: suspicious — 3-month LDCT or PET/CT
- Category 4B/X: very suspicious — tissue sampling`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening",
  },

  // ========== PULMONARY & ALLERGY (7%) ==========

  {
    source: "GOLD",
    tier: 2,
    guideline_title: "Global Strategy for Prevention, Diagnosis and Management of COPD (GOLD Report)",
    guideline_year: "2024",
    abfm_domain: "Pulmonary & Allergy",
    section: "COPD Diagnosis and Classification",
    content: `COPD diagnosis and GOLD classification:

Diagnosis: post-bronchodilator FEV1/FVC <0.70 on spirometry + appropriate symptoms/exposure history

GOLD airflow limitation severity (post-bronchodilator FEV1):
- GOLD 1 (Mild): FEV1 ≥80% predicted
- GOLD 2 (Moderate): 50% ≤ FEV1 < 80%
- GOLD 3 (Severe): 30% ≤ FEV1 < 50%
- GOLD 4 (Very Severe): FEV1 <30%

Symptom/exacerbation assessment (ABE groups, 2023 update):
- Group A: low risk (0-1 non-hospitalized exacerbations), fewer symptoms (mMRC 0-1 or CAT <10)
- Group B: low risk (0-1 non-hospitalized exacerbations), more symptoms (mMRC ≥2 or CAT ≥10)
- Group E: high risk (≥2 exacerbations or ≥1 hospitalization)

Symptoms: CAT (COPD Assessment Test) ≥10 = significant; mMRC (Modified MRC dyspnea scale) ≥2 = significant

Risk factors: tobacco smoking (primary), occupational exposures, alpha-1 antitrypsin deficiency (consider in young or family history)`,
    url: "https://goldcopd.org/2024-gold-report",
  },

  {
    source: "GOLD",
    tier: 2,
    guideline_title: "Global Strategy for Prevention, Diagnosis and Management of COPD (GOLD Report)",
    guideline_year: "2024",
    abfm_domain: "Pulmonary & Allergy",
    section: "COPD Pharmacological Management",
    content: `COPD pharmacological management (GOLD 2024):

Inhaler hierarchy by group:
- Group A: short-acting bronchodilator PRN (SABA: albuterol/levalbuterol; SAMA: ipratropium)
- Group B: LAMA (preferred: tiotropium, umeclidinium, glycopyrrolate) OR LABA (salmeterol, formoterol, indacaterol)
- Group E: LAMA + LABA (dual bronchodilation); if blood eosinophils ≥300/mcL: consider adding ICS

Triple therapy (ICS + LAMA + LABA): for frequent exacerbations, especially with eosinophils ≥100/mcL

ICS considerations: reduce exacerbations but increase pneumonia risk — use cautiously (blood eosinophils guide)
Roflumilast (PDE4 inhibitor): for severe GOLD 3-4, chronic bronchitis, frequent exacerbations on maximal bronchodilators; add-on therapy

Oxygen therapy: long-term O2 for SpO2 ≤88% at rest (or ≤89% with cor pulmonale); improves survival

Pulmonary rehabilitation: Class A recommendation for all GOLD 2-4 patients — reduces dyspnea and hospitalizations

COPD exacerbation management: 
- Short-acting bronchodilators (SABA ± SAMA) — mainstay
- Systemic corticosteroids: prednisone 40mg/day × 5 days (non-inferior to longer courses — REDUCE trial)
- Antibiotics: if increased sputum purulence, increased volume, or increased dyspnea (all three = Anthonisen criteria Type I)`,
    url: "https://goldcopd.org/2024-gold-report",
  },

  {
    source: "GINA",
    tier: 2,
    guideline_title: "Global Initiative for Asthma (GINA) Strategy Report",
    guideline_year: "2024",
    abfm_domain: "Pulmonary & Allergy",
    section: "Asthma Diagnosis, Classification, and Stepwise Management",
    content: `Asthma diagnosis (GINA 2024):
- Variable airflow limitation: FEV1/FVC below lower limit of normal (LLN) + ≥12% and 200mL improvement post-bronchodilator
- If spirometry normal: bronchial provocation (methacholine — PC20 ≤8 mg/mL), FENO ≥50 ppb, or PEF variability >10%

Asthma severity/control levels:
- Well-controlled: daytime symptoms ≤2/week, no nocturnal, ≤2 SABA uses/week, no limitation
- Partly controlled: 1-2 features of uncontrolled
- Uncontrolled: ≥3 features of uncontrolled

GINA stepwise treatment (Track 1 — ICS-based):
- Step 1: as-needed low-dose ICS-formoterol (preferred; SABA PRN as alternative)
- Step 2: low-dose ICS daily + SABA PRN; OR ICS-formoterol PRN
- Step 3: low-dose ICS-LABA (preferred) or medium-dose ICS; add-on LTRA
- Step 4: medium-high dose ICS-LABA; consider LAMA add-on (tiotropium); refer specialist
- Step 5: add-on tiotropium; biologics (anti-IL-5 mepolizumab/benralizumab for eosinophilic; anti-IgE omalizumab for allergic; anti-IL-4/IL-13 dupilumab); low-dose OCS (last resort)

SABA-only therapy (albuterol PRN alone): no longer recommended as Step 1 per GINA 2019+ update — all patients should have ICS component

Acute severe asthma: SABA every 20 min × 3, ipratropium, systemic corticosteroids, supplemental O2; IV magnesium sulfate for severe exacerbations not responding to initial therapy`,
    url: "https://ginasthma.org/reports",
  },

  {
    source: "IDSA",
    tier: 2,
    guideline_title: "IDSA/ATS Consensus Guidelines on Management of Community-Acquired Pneumonia in Adults",
    guideline_year: "2023",
    abfm_domain: "Pulmonary & Allergy",
    section: "CAP Severity Assessment and Treatment",
    content: `Community-Acquired Pneumonia (CAP) risk stratification:

CURB-65 score (1 point each): Confusion, Urea >19mg/dL (BUN >19), Respiratory rate ≥30, BP <90/60, age ≥65
- 0-1: low risk — outpatient
- 2: moderate — hospital admission or close outpatient monitoring
- ≥3: high risk — hospitalization (ICU if ≥5)

PSI (Pneumonia Severity Index): more complex, superior to CURB-65 for identifying low-risk patients (Class I, II = outpatient)

Outpatient CAP treatment (no comorbidities, no recent antibiotics):
- Amoxicillin 1g TID × 5 days OR doxycycline 100mg BID × 5 days (if no atypical coverage needed)
- Comorbidities (COPD, heart disease, immunosuppression): amoxicillin-clavulanate + macrolide OR respiratory fluoroquinolone (levofloxacin, moxifloxacin)

Inpatient non-ICU CAP:
- Beta-lactam (ampicillin-sulbactam, ceftriaxone) + macrolide OR respiratory fluoroquinolone monotherapy

ICU/severe CAP:
- Beta-lactam + azithromycin OR beta-lactam + respiratory fluoroquinolone
- If Pseudomonas risk: pip-tazo or cefepime + ciprofloxacin
- If MRSA risk: add vancomycin or linezolid

Duration: 5 days if good clinical response (not longer unless no improvement)`,
    url: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults",
  },

  // ========== INFECTIOUS DISEASE (7%) ==========

  {
    source: "IDSA",
    tier: 2,
    guideline_title: "IDSA Clinical Practice Guidelines for Uncomplicated and Complicated Urinary Tract Infections",
    guideline_year: "2022",
    abfm_domain: "Infectious Disease",
    section: "UTI Diagnosis and Treatment",
    content: `Urinary Tract Infection management (IDSA 2022):

Uncomplicated cystitis (premenopausal, non-pregnant women, no structural abnormalities):
- Nitrofurantoin macrocrystal 100mg BID × 5 days (first-line; avoid if CrCl <30)
- TMP-SMX DS 1 tab BID × 3 days (first-line if local resistance <20%)
- Fosfomycin 3g single dose (effective but less convenient)
- Fluoroquinolones (ciprofloxacin, levofloxacin): reserve for complicated UTIs or resistant organisms; avoid as first-line uncomplicated (stewardship — preserve for serious infections)
- Beta-lactams: amoxicillin-clavulanate, cephalexin — acceptable alternatives

Pyelonephritis (outpatient, mild-moderate):
- Ciprofloxacin 500mg BID × 7 days (if local E. coli resistance <10%) OR
- TMP-SMX DS × 14 days (if susceptibility known) OR
- Oral beta-lactam × 10-14 days (less efficacious)
- If fluoroquinolone resistance concern: single dose IV/IM ceftriaxone then oral therapy

Catheter-associated UTI (CAUTI): ≥10³ CFU/mL with compatible signs/symptoms; remove or change catheter if possible; treat 7-14 days based on organism/severity

Asymptomatic bacteriuria: do NOT treat (except pregnancy or prior to urologic procedure); routine urine culture in elderly residents of nursing homes without symptoms = do not treat`,
    url: "https://www.idsociety.org/practice-guideline/urinary-tract-infections",
  },

  {
    source: "CDC",
    tier: 1,
    guideline_title: "CDC Sexually Transmitted Infections Treatment Guidelines",
    guideline_year: "2021",
    abfm_domain: "Infectious Disease",
    section: "STI Treatment Recommendations",
    content: `CDC 2021 STI Treatment Guidelines — key regimens:

Chlamydia:
- Doxycycline 100mg BID × 7 days (preferred — superior to azithromycin for rectal chlamydia)
- Azithromycin 1g single dose (alternative — acceptable for urogenital only)
- Test-of-cure: only needed in pregnancy; retest all patients at 3 months

Gonorrhea:
- Ceftriaxone 500mg IM single dose (≥150kg: 1g); NO longer dual therapy with azithromycin (CDC 2020 update)
- If cephalosporin allergy: gentamicin 240mg IM + azithromycin 2g PO
- Disseminated gonococcal infection: IV ceftriaxone 1g q24h × ≥24-48h then oral stepdown

Syphilis:
- Primary/secondary/early latent (<1 year): Benzathine penicillin G 2.4 million units IM × 1 dose
- Late latent or unknown duration: 2.4 million units IM weekly × 3 doses
- Neurosyphilis: Aqueous crystalline penicillin G IV × 10-14 days
- Penicillin allergy: doxycycline 100mg BID × 14 days (non-pregnant)

Genital Herpes:
- First episode: acyclovir 400mg TID or 200mg 5x/day × 7-10 days; valacyclovir 1g BID × 7-10 days
- Episodic: shorter courses
- Suppressive therapy: for ≥6 outbreaks/year or to reduce transmission to partners; valacyclovir 500mg daily

Trichomoniasis: metronidazole 500mg BID × 7 days (women); 2g single dose for men (treat partners simultaneously)`,
    url: "https://www.cdc.gov/std/treatment-guidelines/default.htm",
  },

  {
    source: "IDSA",
    tier: 2,
    guideline_title: "IDSA Practice Guidelines for Skin and Soft Tissue Infections",
    guideline_year: "2022",
    abfm_domain: "Infectious Disease",
    section: "Cellulitis, Abscess, and Necrotizing Fasciitis",
    content: `Skin and Soft Tissue Infections (IDSA 2022):

Non-purulent cellulitis (no abscess, no purulent drainage):
- Streptococcal etiology (Groups A, B, C, G) — no MRSA coverage needed
- Mild (no systemic infection): dicloxacillin, cephalexin PO × 5 days; extend to 14 days if slow improvement
- Moderate-severe or immunocompromised: IV penicillin, cefazolin, or nafcillin
- Mark the border and reassess at 48 hours

Purulent infections (furuncles, carbuncles, abscesses):
- Incision and drainage (I&D) is the primary treatment
- Add antibiotics for: systemic signs (fever, cellulitis >2cm, multiple lesions, immunocompromise, extremes of age)
- MRSA coverage required: TMP-SMX DS BID or doxycycline 100mg BID × 5-7 days
- Severe/complicated: vancomycin IV

Necrotizing fasciitis — surgical emergency:
- Type I (polymicrobial, including anaerobes): trunk/perineum
- Type II (Group A Strep ± Staph): extremities
- Key features: severe pain out of proportion, rapid progression, "wooden" texture skin, crepitus, systemic toxicity
- Treatment: IMMEDIATE surgical debridement + broad-spectrum IV antibiotics (pip-tazo or carbapenems + clindamycin for toxin suppression); do NOT delay surgery for imaging

Diabetic foot infections: probe to bone positive = high likelihood of osteomyelitis; MRI most sensitive for osteomyelitis`,
    url: "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections",
  },

  {
    source: "IDSA",
    tier: 2,
    guideline_title: "IDSA Clinical Practice Guidelines for HIV Primary Care",
    guideline_year: "2023",
    abfm_domain: "Infectious Disease",
    section: "HIV Testing, Initiation, and Monitoring",
    content: `HIV Primary Care (IDSA/DHHS 2023):

Diagnosis:
- 4th generation (Ag/Ab combination) assay preferred — detects HIV-1 p24 antigen and anti-HIV-1/2 antibodies
- Window period: ~18-45 days (much shorter than earlier 3rd gen tests)
- USPSTF: Screen all adults age 15-65 (Grade A); adolescents with risk factors at any age; high-risk annually

Antiretroviral therapy (ART):
- Recommend ART for ALL patients with HIV, regardless of CD4 count (reduce transmission, prevent AIDS-defining illness)
- Preferred initial regimens (DHHS 2023): bictegravir/tenofovir AF/emtricitabine (Biktarvy) — once-daily, high barrier to resistance
- Alternative: dolutegravir-based regimens

Monitoring on ART:
- HIV viral load: 4-8 weeks after initiation, then every 3-6 months; goal = undetectable (<50 copies/mL)
- Undetectable = Untransmittable (U=U): no risk of sexual transmission when suppressed ≥6 months
- CD4 count: monitor every 3-6 months until stable and suppressed; annually thereafter

Opportunistic infection prophylaxis by CD4:
- <200 cells/mcL: TMP-SMX 1 DS daily (PCP prophylaxis)
- <100 cells/mcL: also MAC prophylaxis (azithromycin 1200mg weekly or clarithromycin) [unless on effective ART with rising CD4]
- <50 cells/mcL: consider CMV retinitis screening

PrEP: for HIV-negative high-risk individuals — emtricitabine/tenofovir DF (Truvada) or tenofovir AF (Descovy, for non-receptive sex only); check renal function, HBV status; prescribe 3-month supply with confirmatory HIV test`,
    url: "https://www.idsociety.org/practice-guideline/hiv-primary-care",
  },

  // ========== WOMEN'S HEALTH & REPRODUCTIVE MEDICINE (7%) ==========

  {
    source: "ACOG",
    tier: 2,
    guideline_title: "ACOG Practice Bulletins — Cervical Cancer Screening",
    guideline_year: "2023",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "Cervical Cancer Screening and Colposcopy",
    content: `Cervical cancer screening (ACOG/ASCCP 2023):
- Age <21: no screening regardless of sexual activity onset
- Age 21-29: Pap smear alone every 3 years (co-testing or HPV alone NOT recommended in this age group — high HPV prevalence, usually clears spontaneously)
- Age 30-65: Preferred: co-testing (Pap + HPV) every 5 years OR HPV testing alone every 5 years; acceptable: Pap alone every 3 years
- Age >65: discontinue if ≥3 consecutive negative Paps, or ≥2 consecutive negative co-tests within 10 years, with most recent in past 5 years; NO prior CIN 2+ or AIS history

Abnormal Pap results and management (ASCCP 2019):
- ASC-US: reflex HPV test; if HPV negative = routine screening; if HPV positive = colposcopy
- LSIL: colposcopy (age ≥25); younger patients may observe
- ASC-H, HSIL, AGC, AIS: colposcopy + endocervical sampling
- HPV 16 or 18 positive: colposcopy (highest risk — don't manage conservatively)

Post-hysterectomy: discontinue Pap testing if hysterectomy for benign reason and no cervix; continue if cervix retained or history of CIN 2+/3

HPV vaccine: ideally pre-sexual debut; catch-up through age 26; shared decision making 27-45`,
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin",
  },

  {
    source: "ACOG",
    tier: 2,
    guideline_title: "ACOG Practice Bulletin: Prenatal Care",
    guideline_year: "2023",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "Routine Prenatal Screening and Care",
    content: `Prenatal care — recommended screening (ACOG 2023):

First visit (initial prenatal):
- CBC, blood type and Rh factor, antibody screen
- Rubella immunity, syphilis (RPR/VDRL), hepatitis B surface antigen, HIV (opt-out)
- Urine culture (treat asymptomatic bacteriuria in pregnancy), urinalysis
- Gonorrhea and chlamydia (all patients), hepatitis C (all patients per 2019 ACOG update)
- Pap smear if due per screening guidelines
- Varicella immunity, TSH (if symptomatic or risk factors)

First trimester screening (11-14 weeks):
- Cell-free DNA (cfDNA/NIPT): screens for trisomies 21, 18, 13, sex chromosome aneuploidy; not diagnostic
- Nuchal translucency + PAPP-A + hCG (combined screening)

Second trimester:
- Quad screen (15-20 weeks): AFP, hCG, estriol, inhibin A — screens for Down syndrome, trisomy 18, NTD
- AFP elevated: evaluate for NTD, abdominal wall defects, twin gestation, wrong dates
- Anatomy ultrasound: 18-22 weeks

Glucose challenge test (GCT): 24-28 weeks; 50g glucose, 1-hr cutoff ≥130 or ≥140 mg/dL; if abnormal → 3-hr OGTT (100g); GDM diagnosed if ≥2 values exceed Carpenter-Coustan thresholds

Group B Streptococcus (GBS): culture at 35-37 weeks; prophylactic penicillin G in labor if positive (or prior GBS infant, GBS bacteriuria, or unknown status + ≥37 weeks + ≥18h ROM + fever)

Rh-negative: administer RhD immune globulin (Rhogam) 300mcg IM at 28 weeks and within 72 hours postpartum if baby is Rh positive`,
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin",
  },

  {
    source: "ACOG",
    tier: 2,
    guideline_title: "ACOG Practice Bulletin: Gestational Hypertension and Preeclampsia",
    guideline_year: "2022",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "Preeclampsia Diagnosis and Management",
    content: `Preeclampsia diagnosis (ACOG 2022):

Diagnosis: ≥20 weeks gestation + NEW hypertension (SBP ≥140 or DBP ≥90 on 2 occasions ≥4 hours apart) + any of:
- Proteinuria ≥300mg/24h, protein:creatinine ≥0.3, or urine dipstick ≥2+
- OR severe features: SBP ≥160/DBP ≥110, thrombocytopenia (<100,000), impaired liver function (AST/ALT 2x normal, severe RUQ/epigastric pain), renal insufficiency (creatinine >1.1 or doubling), pulmonary edema, new headache, visual symptoms

HELLP syndrome: Hemolysis + Elevated Liver enzymes + Low Platelets (variant of severe preeclampsia)

Management:
- Antihypertensive treatment initiated when SBP ≥160 or DBP ≥110 (to prevent stroke)
- Acute severe HTN: IV labetalol (first-line), IV hydralazine, or oral nifedipine immediate release
- Outpatient BP goal: <140/90
- Magnesium sulfate: for seizure prophylaxis in severe preeclampsia or eclampsia
- Eclampsia: IV/IM magnesium (4g loading dose then 1-2g/hr maintenance); airway management; delivery after stabilization
- Aspirin 81mg/day: preventive in high-risk women starting ≤16 weeks

Delivery: timing based on gestational age and severity; ≥37 weeks: deliver; 34-36 weeks severe features: deliver; <34 weeks: individualized with maternal-fetal medicine consultation`,
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin",
  },

  {
    source: "ACOG",
    tier: 2,
    guideline_title: "ACOG Practice Bulletin: Contraception",
    guideline_year: "2023",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "Contraceptive Methods and Counseling",
    content: `Contraception — ACOG 2023 (US MEC Categories: 1=use, 2=generally use, 3=generally avoid, 4=do not use):

Most effective (LARC — Long-Acting Reversible Contraception):
- Levonorgestrel IUD (Mirena 52mg up to 8yr, Liletta 8yr, Kyleena 5yr, Skyla 3yr): MEC 4 pregnancy; excellent for dysmenorrhea, AUB
- Copper IUD (Paragard, non-hormonal): up to 10-12 years; also emergency contraception if placed ≤5 days post-intercourse
- Etonogestrel subdermal implant (Nexplanon): 3 years; most effective method (0.05% failure rate)

Combined hormonal contraceptives (CHCs — combined OCP, patch, ring):
- Absolute contraindications (MEC 4): VTE history, stroke, CAD, migraine with aura, breast cancer, ≥35yo + smoking >15 cig/day, uncontrolled HTN, current hepatitis
- Migraine without aura: MEC 2 for OCPs
- Not recommended: lactating <4-6 weeks postpartum (MEC 4)

Progestin-only pill (mini-pill): safe in breastfeeding, VTE, migraines with aura; requires strict timing

Emergency contraception:
- Ulipristal acetate (Ella): most effective up to 120h post-intercourse
- Levonorgestrel (Plan B): most effective within 72h (less effective if >75kg)
- Copper IUD: most effective of all — up to 5 days

Postpartum contraception: LARC can be placed immediately postpartum (within 10 minutes of placental delivery) or before hospital discharge`,
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin",
  },

  // ========== GASTROINTESTINAL (7%) ==========

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Practice Guideline: GERD",
    guideline_year: "2023",
    abfm_domain: "Gastrointestinal",
    section: "GERD Diagnosis and Management",
    content: `Gastroesophageal Reflux Disease (GERD) — AAFP/ACG:

Diagnosis: clinical (heartburn + regurgitation ≥2x/week is sufficient for empiric trial); endoscopy if alarm symptoms or refractory

Alarm symptoms requiring endoscopy: dysphagia, odynophagia, weight loss, vomiting, bleeding, anemia, family history of GI cancer, age >50 with new symptoms

Lifestyle modifications (first-line):
- Head of bed elevation (4-6 inches), avoid late meals (≥3 hours before lying down)
- Avoid trigger foods: caffeine, alcohol, chocolate, peppermint, fatty/spicy foods, tomato products, citrus
- Weight loss if overweight

Pharmacotherapy:
- Step-up or step-down approach
- H2 blockers (famotidine, ranitidine withdrawn): faster onset but less effective for healing esophagitis
- PPIs (omeprazole, lansoprazole, pantoprazole, esomeprazole): most effective — take 30-60 min before first meal; 4-8 week course for uncomplicated; use lowest effective dose for maintenance
- Antacids: for breakthrough symptoms

Complications:
- Erosive esophagitis: Grade A-B (mild) — 8 weeks PPI; Grade C-D: 8 weeks + consider maintenance
- Barrett's esophagus: metaplastic columnar epithelium replacing squamous; risk of adenocarcinoma; requires surveillance endoscopy (frequency based on dysplasia grade)

Alarm for eosinophilic esophagitis: dysphagia, food impaction, rings/furrows on endoscopy, young age, atopy; biopsy shows >15 eos/hpf; treatment: PPI trial then topical steroids (fluticasone swallowed) ± elimination diet`,
    url: "https://www.aafp.org/pubs/afp/issues/2023/gerd",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Guideline: H. pylori",
    guideline_year: "2022",
    abfm_domain: "Gastrointestinal",
    section: "H. pylori Testing and Eradication",
    content: `Helicobacter pylori — diagnosis and treatment:

Who to test:
- ALL patients with peptic ulcer disease (active or past)
- Unexplained iron deficiency anemia
- Idiopathic thrombocytopenic purpura (ITP)
- Functional dyspepsia in those <60 without alarm symptoms (test-and-treat strategy)

Diagnostic tests:
- Non-invasive (preferred): Urea breath test (UBT) — sensitivity 94%, specificity 97%; stop PPIs 2 weeks and antibiotics 4 weeks prior
- Fecal antigen test (H. pylori stool antigen): good accuracy, stop PPIs 2 weeks prior
- Serology (IgG antibody): poor specificity, cannot confirm eradication — not recommended for diagnosis or test of cure
- Invasive (endoscopy-based): CLO test (rapid urease), histology, culture (for resistance testing)

First-line triple therapy (if local clarithromycin resistance <15%):
- Clarithromycin triple: PPI BID + clarithromycin 500mg BID + amoxicillin 1g BID × 14 days
- Bismuth quadruple: PPI BID + bismuth subsalicylate + metronidazole + tetracycline × 10-14 days (preferred if penicillin allergy or high clarithromycin resistance)

Confirm eradication: UBT or stool antigen ≥4 weeks after completing therapy (stop PPIs 2 weeks before); test all patients treated

Post-eradication: ulcer heals without maintenance acid suppression in most cases`,
    url: "https://www.aafp.org/pubs/afp/hpylori",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Guideline: Irritable Bowel Syndrome",
    guideline_year: "2023",
    abfm_domain: "Gastrointestinal",
    section: "IBS Diagnosis and Treatment",
    content: `Irritable Bowel Syndrome (IBS) — Rome IV Criteria:
- Recurrent abdominal pain ≥1 day/week for ≥3 months, associated with ≥2 of:
  1. Related to defecation
  2. Change in stool frequency
  3. Change in stool form (appearance)
- Onset ≥6 months before diagnosis

Subtypes: IBS-C (constipation), IBS-D (diarrhea), IBS-M (mixed), IBS-U (unclassified)

Red flags requiring evaluation: age >45, new onset, blood in stool, nocturnal symptoms, weight loss, family history of CRC/IBD/celiac, fever, abnormal labs

Diagnostic workup: CBC, CRP/ESR, TSH, fecal calprotectin (to rule out IBD); celiac serology (tissue transglutaminase IgA) — celiac 2-3x more common in IBS

Treatment (stepwise):
1. Lifestyle: dietary modifications — low-FODMAP diet (reduces symptoms in 50-80%); adequate fiber (especially soluble for IBS-C)
2. IBS-C: osmotic laxatives (PEG), linaclotide (Linzess), lubiprostone, plecanatide
3. IBS-D: loperamide (symptomatic), rifaximin 550mg TID × 14 days (non-absorbable antibiotic — effective for IBS-D and bloating), alosetron (women only, limited access — REMS), antispasmodics (dicyclomine, hyoscine)
4. Antidepressants (TCA or SSRI): for visceral hypersensitivity and comorbid anxiety/depression
5. Psychological therapies: CBT, gut-directed hypnotherapy — durable benefit`,
    url: "https://www.aafp.org/pubs/afp/ibs",
  },

  // ========== MUSCULOSKELETAL (8%) ==========

  {
    source: "ACR",
    tier: 2,
    guideline_title: "ACR Guideline for Management of Rheumatoid Arthritis",
    guideline_year: "2023",
    abfm_domain: "Musculoskeletal",
    section: "Rheumatoid Arthritis Diagnosis and Treatment",
    content: `Rheumatoid Arthritis (ACR/EULAR 2023):

Diagnosis: 2010 ACR/EULAR classification criteria (score ≥6/10):
- Joint involvement: 1 large joint (0) → >10 joints including small joints (5)
- Serology: negative (0); low positive RF or anti-CCP (2); high positive (3)
- Acute phase reactants: normal (0); abnormal CRP or ESR (1)
- Duration: <6 weeks (0); ≥6 weeks (1)

Key labs: RF (rheumatoid factor — 70-80% sensitive), anti-CCP (anti-cyclic citrullinated peptide antibodies — more specific than RF, ~95% specific; predicts erosive disease), CRP, ESR, CBC, metabolic panel

Management (treat-to-target: DAS28 remission or low disease activity):

Step 1 (DMARD-naive, low-moderate disease): Methotrexate (MTX) — anchor drug of RA; 15-25mg weekly (PO or SQ); supplement folic acid 1mg daily to reduce side effects; check CBC, LFTs every 4-8 weeks initially; avoid in pregnancy, significant hepatic disease, alcoholism

Step 2 (inadequate MTX response): Add biologic or targeted synthetic DMARD:
- TNF inhibitors: etanercept, adalimumab, certolizumab, golimumab, infliximab — screen for latent TB (IGRA) before initiating
- IL-6 inhibitors: tocilizumab, sarilumab (suppress acute phase reactants — ESR/CRP unreliable for monitoring)
- JAK inhibitors: tofacitinib, baricitinib, upadacitinib — oral; risk of thrombosis, herpes zoster, malignancy; use after TNF failure

Screening before biologic: IGRA/PPD for TB; HBV (risk of reactivation); update vaccines`,
    url: "https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines",
  },

  {
    source: "ACR",
    tier: 2,
    guideline_title: "ACR Guideline for Management of Gout",
    guideline_year: "2023",
    abfm_domain: "Musculoskeletal",
    section: "Gout Diagnosis, Acute Treatment, and Urate-Lowering Therapy",
    content: `Gout management (ACR 2023):

Diagnosis:
- Gold standard: urate crystals on synovial fluid analysis (needle-shaped, negatively birefringent crystals under polarized light)
- Serum urate: may be normal or low during acute flare (not reliable for diagnosis)
- X-ray: overhanging edges, sclerotic margins, preserved joint space (distinguishes from RA); punched-out erosions

Acute gout treatment (within 24 hours of onset):
- NSAIDs (indomethacin, naproxen, celecoxib): first-line if no CKD, GI disease
- Colchicine: low-dose (1.2mg PO then 0.6mg 1 hour later) as effective as high-dose with fewer GI side effects; reduce with CKD; avoid with strong CYP3A4 inhibitors (clarithromycin, cyclosporine)
- Corticosteroids: for patients with CKD, GI contraindications; prednisone 30-40mg/day × 3-5 days; joint injection if monoarticular

Urate-lowering therapy (ULT) — indications:
- ≥2 gout flares per year
- Tophi (tophaceous gout)
- CKD ≥Stage 3
- Urolithiasis (urate stones)
- Joint damage

ULT target: serum urate <6 mg/dL (more difficult tophi: <5 mg/dL)
- Allopurinol: first-line; start low (100mg daily or 50mg if CKD), increase slowly; HLA-B*5801 testing before use in Han Chinese, Thai, Korean patients (SJS risk); febuxostat: alternative (FDA warning — may increase CV death)
- Prophylaxis during ULT initiation: colchicine 0.6mg daily × 3-6 months (prevents mobilization flares)
- Pegloticase (Krystexxa): for refractory tophaceous gout, IV biweekly; monitor urate levels (if rises >6 = likely developed antibodies — stop)`,
    url: "https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Gout",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Practice Guideline: Low Back Pain",
    guideline_year: "2022",
    abfm_domain: "Musculoskeletal",
    section: "Acute and Chronic Low Back Pain Management",
    content: `Low back pain — AAFP/ACP guidelines:

Red flags requiring urgent imaging/workup:
- Fever + back pain (epidural abscess, discitis, osteomyelitis)
- Weight loss + back pain (malignancy)
- History of malignancy
- Recent significant trauma
- Bladder/bowel incontinence or saddle anesthesia — CAUDA EQUINA SYNDROME (MRI urgently)
- Severe neurologic deficits
- IV drug use, immunosuppression
- Age >70 with new back pain (fracture)

Acute LBP (<12 weeks) management:
- Reassurance: most acute LBP resolves in 4-6 weeks
- Activity as tolerated (bed rest NOT recommended — worsens outcomes)
- Heat/ice, superficial massage
- NSAIDs (first-line pharmacotherapy): ibuprofen, naproxen, diclofenac
- Skeletal muscle relaxants (cyclobenzaprine, methocarbamol): modest benefit, sedating; not for chronic
- Spinal manipulation (chiropractic): modest benefit
- Opioids: not first-line; only if severe, short courses; significant risks of dependence

Chronic LBP (>12 weeks):
- Exercise therapy, CBT, multidisciplinary rehabilitation — most effective
- Duloxetine: modest evidence for chronic LBP (SNRI)
- Tramadol, buprenorphine: second-line; avoid long-term opioids as possible
- Epidural steroid injections: modest short-term benefit for radiculopathy
- Surgery: only for structural causes (HNP with neurologic deficit, spinal stenosis) after conservative treatment failure`,
    url: "https://www.aafp.org/pubs/afp/issues/2022/back-pain",
  },

  // ========== NEUROLOGY (5%) ==========

  {
    source: "AAN",
    tier: 2,
    guideline_title: "AAN Practice Guideline: Migraine Headache",
    guideline_year: "2022",
    abfm_domain: "Neurology",
    section: "Migraine Diagnosis and Acute Treatment",
    content: `Migraine diagnosis (IHS/ICHD-3 criteria):
- ≥5 attacks; 4-72 hours duration; ≥2 of: unilateral, pulsating, moderate-severe, worsened by activity; ≥1 of: nausea/vomiting, photophobia + phonophobia; not better explained by another diagnosis

Migraine with aura (classic migraine): fully reversible visual (scintillating scotoma, zigzag pattern), sensory, or speech symptoms over 5-60 minutes, followed or accompanied by headache

Acute/abortive migraine treatment:
- Mild-moderate: NSAIDs (ibuprofen, naproxen), acetaminophen, combination analgesics (caffeine + ASA + APAP — Excedrin)
- Moderate-severe: triptans (5-HT1B/D agonists) — first-line specific therapy
  - Sumatriptan (Imitrex): available in oral, nasal, SQ; onset fastest with SQ
  - Oral triptans: rizatriptan, eletriptan (highest efficacy), naratriptan (slowest onset, fewest side effects)
  - CONTRAINDICATED: established CAD, stroke, uncontrolled HTN, basilar/hemiplegic migraine
- Gepants (CGRP receptor antagonists): ubrogepant, rimegepant — no triptan contraindications, safe with coronary disease; no serotonin syndrome risk; also preventive (rimegepant PRN 48h)
- Lasmiditan (5-HT1F agonist): for CV contraindication to triptans; causes sedation — no driving 8h after
- Anti-emetics (prochlorperazine, metoclopramide): adjunct for nausea + intrinsically analgesic for migraine

Avoid: opioids (worsen headache frequency, analgesic overuse headache), butalbital (analgesic overuse)`,
    url: "https://www.aan.com/Guidelines",
  },

  {
    source: "AAN",
    tier: 2,
    guideline_title: "AAN Practice Guideline: Migraine Headache Prevention",
    guideline_year: "2022",
    abfm_domain: "Neurology",
    section: "Migraine Preventive Therapy",
    content: `Migraine preventive therapy — AAN guidelines:

Indications for preventive therapy:
- ≥4 headache days/month with significant impairment
- Acute medications overused or contraindicated
- Patient preference for prevention over acute treatment

Preventive medications with Level A evidence:
- Beta-blockers: propranolol (most studied), metoprolol, timolol — effective, also treat anxiety/tremor; avoid in asthma, depression, Raynaud's
- Valproate/valproic acid: effective; CONTRAINDICATED in pregnancy (NTDs); monitor liver, CBC; weight gain, alopecia
- Topiramate: effective; cognitive side effects ("dopamax"), weight loss, kidney stones, teratogenic (cleft palate)
- CGRP monoclonal antibodies (most specific for migraine):
  - Erenumab (Aimovig), fremanezumab (Ajovy), galcanezumab (Emgality), eptinezumab (Vyepti IV): monthly or quarterly SC/IV; highly effective, minimal side effects, safe in CVD; first-line for chronic migraine
- Amitriptyline (TCA): modest evidence, useful in comorbid insomnia or tension headache
- Venlafaxine: evidence for prevention; useful in comorbid depression/anxiety

Goal: ≥50% reduction in headache frequency; reassess at 3-6 months; try 2-3 month trial before switching
Analgesic/triptan overuse: >10-15 days/month of acute medication causes chronic daily headache — must wean; start preventive`,
    url: "https://www.aan.com/Guidelines/Migraine",
  },

  {
    source: "AAN",
    tier: 2,
    guideline_title: "AAN Practice Guideline: Epilepsy",
    guideline_year: "2022",
    abfm_domain: "Neurology",
    section: "Seizure Classification, First Seizure, and Antiepileptic Therapy",
    content: `Seizure and Epilepsy (AAN/ILAE):

Seizure classification:
- Focal onset: aware (simple partial) vs. impaired awareness (complex partial); ± focal to bilateral tonic-clonic
- Generalized onset: tonic-clonic, absence, myoclonic, atonic, tonic, clonic
- Unknown onset

Epilepsy diagnosis: ≥2 unprovoked seizures >24 hours apart; OR 1 unprovoked + high recurrence risk (>60%); OR epilepsy syndrome

First unprovoked seizure:
- Brain imaging (MRI preferred), EEG, basic labs (glucose, Na, Ca)
- Risk of recurrence: 40-50% after first; start AED if: brain lesion, epileptiform EEG, nocturnal seizure, prior CNS injury

Antiepileptic drug selection by seizure type:
- Focal seizures: levetiracetam (Keppra), lacosamide, oxcarbazepine, carbamazepine, zonisamide; carbamazepine/phenytoin effective but more interactions
- Generalized tonic-clonic: valproate (best evidence), levetiracetam, lamotrigine
- Absence: ethosuximide (drug of choice — superior to valproate and lamotrigine per NAEG trial), valproate, lamotrigine
- Myoclonic: valproate, levetiracetam, clonazepam; avoid phenytoin/carbamazepine (worsen myoclonus)
- Juvenile myoclonic epilepsy (JME): lifelong therapy usually required; valproate first-line

Carbamazepine: potent CYP inducer — multiple drug interactions; SJS risk in Han Chinese (HLA-B*1502 testing)
Status epilepticus management: benzodiazepine (lorazepam IV 0.1mg/kg) → fosphenytoin/levetiracetam → general anesthesia`,
    url: "https://www.aan.com/Guidelines/Epilepsy",
  },

  // ========== RENAL & UROLOGY (5%) ==========

  {
    source: "KDIGO",
    tier: 2,
    guideline_title: "KDIGO Clinical Practice Guideline for Chronic Kidney Disease",
    guideline_year: "2024",
    abfm_domain: "Renal & Urology",
    section: "CKD Staging, Evaluation, and Management",
    content: `CKD Classification (KDIGO 2024) — based on GFR category + albuminuria category:

GFR Categories (G1-G5):
- G1: ≥90 mL/min/1.73m² (normal, with kidney damage marker)
- G2: 60-89 (mildly decreased)
- G3a: 45-59 (mild-moderately decreased)
- G3b: 30-44 (moderately-severely decreased)
- G4: 15-29 (severely decreased)
- G5: <15 (kidney failure, dialysis preparation)

Albuminuria Categories:
- A1: <30 mg/g (normal to mildly increased)
- A2: 30-299 mg/g (moderately increased — microalbuminuria)
- A3: ≥300 mg/g (severely increased — macroalbuminuria)

CKD Management:
- BP target: <120/80 if tolerated (per SPRINT/evidence); ACEi or ARB for proteinuric CKD (reduces progression)
- SGLT2 inhibitors: finerenone (MRA), empagliflozin/dapagliflozin — now Class 1 recommendation for DKD with albuminuria (CREDENCE, DAPA-CKD, EMPA-KIDNEY trials)
- GLP-1 RA (semaglutide): FLOW trial — significant reduction in kidney disease progression and CV events
- Dietary: protein restriction 0.8g/kg/day (not <0.6 in non-dialysis); sodium <2g/day
- Avoid nephrotoxins: NSAIDs, IV contrast with low GFR (hold metformin if GFR <30)

Complications by GFR:
- GFR <60: anemia monitoring (EPO if appropriate), metabolic acidosis (bicarbonate supplementation), hyperparathyroidism
- GFR <30: prepare for renal replacement therapy discussion, AV fistula creation
- GFR <15: initiate dialysis or transplant referral`,
    url: "https://kdigo.org/guidelines/ckd-mbd",
  },

  // ========== PEDIATRICS (5%) ==========

  {
    source: "AAP",
    tier: 2,
    guideline_title: "AAP Bright Futures Periodicity Schedule",
    guideline_year: "2024",
    abfm_domain: "Pediatrics",
    section: "Well-Child Care Schedule and Developmental Surveillance",
    content: `AAP Bright Futures 2024 — Recommended Well-Child Visits:
- Newborn (3-5 days), 1 month, 2 months, 4 months, 6 months, 9 months, 12 months, 15 months, 18 months, 24 months, 30 months
- Then annually: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19-21 years

Developmental screening (not just surveillance):
- 9 months, 18 months, 30 months: formal developmental screening instrument (ASQ, PEDS)
- 18 months AND 24 months: autism-specific screening (M-CHAT-R at 16-30 months)
- Vision and hearing: at birth (OAE/ABR screen), and at appropriate ages

Developmental milestones — red flags (when to refer):
- Not babbling by 12 months
- No single words by 16 months
- No two-word phrases by 24 months (not counting imitation or repetition)
- Loss of any language or social skills at any age
- No walking by 18 months (refer orthopedics/neurology)

Lead screening: universal at 12 and 24 months; targeted screening by risk factors

Anemia (iron deficiency): universal screening at 12 months (hemoglobin or hematocrit); selective screening at 15-18 months and older if risk factors

Newborn screening: state-mandated panel including PKU, congenital hypothyroidism, hemoglobinopathies, CAH, galactosemia, hearing screen, critical CHD (pulse oximetry)`,
    url: "https://www.aap.org/en/patient-care/preventive-care",
  },

  {
    source: "AAP",
    tier: 2,
    guideline_title: "AAP Clinical Practice Guideline: Attention-Deficit/Hyperactivity Disorder",
    guideline_year: "2023",
    abfm_domain: "Pediatrics",
    section: "ADHD Diagnosis and Treatment in Children and Adolescents",
    content: `Pediatric ADHD — AAP 2023 Guidelines:

Diagnosis:
- Age 4-18: diagnose using DSM-5 criteria + information from multiple settings (parent, teacher, school reports)
- Validated rating scales: Vanderbilt, Conners, SNAP — obtain from parents AND teachers
- Rule out: learning disabilities, anxiety, depression, sleep disorders, hearing/vision problems, absence seizures (can mimic inattention)
- Comorbidities common: anxiety (30-40%), oppositional defiant disorder (50%), depression, ASD

Treatment by age:

Ages 4-5 years: 
- First-line: parent training in behavior management (PTBM) and/or classroom interventions
- Medication only if symptoms severe AND poor response to behavioral therapy
- If medication needed: methylphenidate first-line

Ages 6-11 years:
- FDA-approved stimulant medication + behavioral therapy (combined superior to either alone)
- First-line stimulants: methylphenidate (Ritalin, Concerta) or amphetamine salts (Adderall XR, Vyvanse)
- Long-acting preferred for school performance, dosing convenience

Ages 12-18 (adolescents):
- Medication + behavioral therapy; assess school performance, risky behavior, driving
- Discuss transition to adult care

Monitoring: height, weight (growth velocity), BP, HR at each visit; medication holidays during summer not generally recommended (maintain treatment for consistent benefit)`,
    url: "https://www.aap.org/en/patient-care/adhd",
  },

  {
    source: "AAP",
    tier: 2,
    guideline_title: "AAP Clinical Practice Guideline: Asthma in Children",
    guideline_year: "2023",
    abfm_domain: "Pediatrics",
    section: "Pediatric Asthma Stepwise Management",
    content: `Pediatric asthma management (AAP/NAEPP-aligned 2023):

Classification:
- Intermittent: symptoms ≤2 days/week, nighttime ≤2x/month, no limitation, FEV1 ≥80%
- Mild persistent: symptoms >2 days/week but not daily, nighttime 3-4x/month, minor limitation
- Moderate persistent: daily symptoms, nighttime >1x/week, some limitation, FEV1 60-80%
- Severe persistent: continuous symptoms, nightly, extreme limitation, FEV1 <60%

Stepwise treatment (NAEPP Steps):
- Step 1 (Intermittent): SABA PRN only (albuterol)
- Step 2 (Mild persistent): daily low-dose ICS (fluticasone, budesonide) + SABA PRN
- Step 3: medium-dose ICS OR low-dose ICS + LABA (age ≥5) or LTRA (age <5)
- Step 4: medium-dose ICS + LABA; consider referral to specialist
- Step 5: high-dose ICS + LABA ± anti-IgE (omalizumab for allergic asthma ≥6yr) or anti-IL-5 (mepolizumab ≥6yr)
- Step 6: high-dose ICS + LABA + oral corticosteroids

Asthma action plan: green/yellow/red zones based on symptoms or PEF

Acute severe asthma exacerbation (ER): SABA q20min × 3, ipratropium (first hour), systemic corticosteroids, O2, IV magnesium sulfate for severe (1-2g over 20 min); heliox if needed

Risk factors for fatal asthma: prior intubation, prior ICU admission, two or more hospitalizations, overuse of SABA (>2 canisters/month)`,
    url: "https://www.aap.org/en/patient-care/asthma",
  },

  {
    source: "AAP",
    tier: 2,
    guideline_title: "AAP Clinical Practice Guideline: Otitis Media",
    guideline_year: "2022",
    abfm_domain: "Pediatrics",
    section: "Acute Otitis Media Diagnosis and Treatment",
    content: `Acute Otitis Media (AOM) — AAP 2022:

Diagnosis requires ALL 3:
1. Acute onset (rapid onset of signs/symptoms)
2. Middle ear effusion (MEE): bulging tympanic membrane, limited mobility, air-fluid level
3. Middle ear inflammation: distinct erythema OR otalgia interfering with normal activity/sleep

Distinguish from OME (otitis media with effusion, "glue ear"): MEE without signs of acute inflammation; no antibiotics

Treatment:
- Immediate antibiotics (do not observe):
  - <6 months: always treat
  - 6 months-2 years: bilateral AOM or severe AOM (fever ≥39°C or severe otalgia)
  - Any age with severe AOM, or caregiver cannot ensure reliable follow-up
- Observation option (watchful waiting 48-72h):
  - 6 months-2 years: unilateral AOM, mild symptoms, normal immune status, reliable follow-up
  - ≥2 years: non-severe bilateral or unilateral AOM with mild symptoms

Antibiotic choice:
- First-line: amoxicillin 80-90mg/kg/day divided BID × 10 days (5-7 days if age ≥2 with mild symptoms)
- If penicillin allergy (non-anaphylactic): cefdinir, cefuroxime, cefpodoxime
- If penicillin allergy (severe/anaphylactic): azithromycin (less effective)
- If treatment failure (48-72h): amoxicillin-clavulanate (augments beta-lactamase coverage)
- If vomiting/can't take PO: ceftriaxone IM 50mg/kg × 1-3 days`,
    url: "https://www.aap.org/en/patient-care/acute-otitis-media",
  },

  // ========== GERIATRICS (4%) ==========

  {
    source: "USPSTF",
    tier: 1,
    guideline_title: "USPSTF Falls Prevention in Older Adults",
    guideline_year: "2023",
    abfm_domain: "Geriatrics",
    section: "Falls Prevention Interventions",
    content: `Falls prevention in community-dwelling adults ≥65 (USPSTF 2023):
- Grade B: exercise interventions for community-dwelling adults ≥65 who are at increased risk of falling
- Grade I (insufficient evidence): vitamin D supplementation for falls prevention specifically

Risk assessment for falls:
- Gait and balance testing: Get Up and Go test (>12 seconds = high fall risk)
- Medications: polypharmacy, sedatives/hypnotics, antihypertensives, anticholinergics, opioids
- Environmental hazards
- Vision impairment
- Orthostatic hypotension (systolic drop ≥20 mmHg or diastolic ≥10 mmHg after standing 1 minute)

Effective interventions:
- Exercise: strength training, balance training (Tai Chi), flexibility — reduces falls by 23%
- Medication review: deprescribe fall-risk medications (benzodiazepines, sedating antihistamines, anticholinergics)
- Vision correction
- Environmental modifications (grab bars, remove rugs, adequate lighting)
- Vitamin D: if deficient, replete; routine high-dose supplementation does NOT reduce falls

For prior fallers or high risk: multifactorial intervention — CDST tool, physical therapy referral

Hip protectors: modest evidence, adherence poor`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/falls-prevention-in-older-adults-interventions",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Guideline: Dementia and Cognitive Impairment",
    guideline_year: "2023",
    abfm_domain: "Geriatrics",
    section: "Dementia Screening, Diagnosis, and Management",
    content: `Dementia and Mild Cognitive Impairment (AAFP/AAN):

Screening: USPSTF 2020 — insufficient evidence for routine dementia screening in asymptomatic adults; clinical judgment guides
- Brief validated tools: Mini-Cog (3-item recall + clock draw, <3 min), MMSE (30 items), MoCA (30 items — more sensitive for MCI, requires training)

Alzheimer's disease (60-80% of dementia): progressive memory impairment → executive function → language → visuospatial; cortical deficits; amyloid plaques + tau tangles
Vascular dementia (15-20%): stepwise decline, focal deficits, CVD risk factors, white matter changes on MRI
Lewy body dementia (LBD): fluctuating cognition + visual hallucinations + parkinsonism + REM sleep behavior disorder; AVOID antipsychotics (severe reactions)
Frontotemporal dementia (FTD): behavioral/personality changes or language problems; younger onset

Workup: CBC, CMP, TSH, B12, folate, RPR (reversible causes); MRI preferred

Management:
- Cholinesterase inhibitors: donepezil (5-10mg QD), rivastigmine, galantamine — for mild-moderate Alzheimer's, also LBD
- Memantine (NMDA antagonist): moderate-severe Alzheimer's; add to cholinesterase inhibitor or use alone
- Behavioral symptoms: non-pharmacological first; SSRIs for agitation/depression; antipsychotics (if necessary) — black box warning for elderly with dementia (increased mortality)
- Lecanemab (Leqembi) and donanemab: amyloid antibodies — slow early Alzheimer's progression; available for MCI or mild stage with confirmed amyloid`,
    url: "https://www.aafp.org/pubs/afp/dementia",
  },

  // ========== DERMATOLOGY (5%) ==========

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Practice Guideline: Acne Vulgaris",
    guideline_year: "2022",
    abfm_domain: "Dermatology",
    section: "Acne Classification and Stepwise Treatment",
    content: `Acne vulgaris management — AAFP guidelines:

Classification:
- Comedonal: open (blackheads) and closed (whiteheads) comedones; no inflammation
- Mild-moderate inflammatory: papules and pustules
- Severe: nodules, cysts, extensive lesions; scarring risk

Stepwise treatment:

Comedonal/mild inflammatory:
- Topical retinoid (tretinoin, adapalene, tazarotene): first-line; reduces follicular keratinization; effective for all types; apply at night to dry skin; causes initial purging
- Benzoyl peroxide (BPO): bactericidal, reduces P. acnes resistance; 2.5-10%; combine with topical antibiotics to prevent resistance
- Topical antibiotics (clindamycin, erythromycin): NEVER use alone — always combine with BPO

Moderate-severe inflammatory:
- Add oral antibiotics: doxycycline (preferred — less GI side effects than tetracycline) or minocycline × 3-6 months; limit use to avoid resistance
- Oral contraceptives (combined): for females — effective as anti-androgen therapy (Yaz, Estrostep, Ortho Tri-Cyclen FDA-approved); also spironolactone off-label (anti-androgen)

Severe/nodular/cystic or treatment-resistant:
- Isotretinoin (Accutane, 13-cis-retinoic acid): 0.5-1mg/kg/day × 5-6 months; highly effective (near-permanent remission)
- iPLEDGE program mandatory (teratogenic — 2 negative pregnancy tests, two forms of contraception)
- Monitor: CBC, lipids, LFTs monthly; mood changes
- Intralesional corticosteroid injection: for individual nodules/cysts (triamcinolone 1-3mg/mL)`,
    url: "https://www.aafp.org/pubs/afp/acne",
  },

  {
    source: "USPSTF",
    tier: 1,
    guideline_title: "USPSTF Skin Cancer Behavioral Counseling",
    guideline_year: "2023",
    abfm_domain: "Dermatology",
    section: "Melanoma and Skin Cancer Prevention",
    content: `Skin cancer prevention and detection (USPSTF/AAFP 2023):

USPSTF: Behavioral counseling interventions to reduce UV exposure — Grade B for fair-skinned children, adolescents, and young adults age 6 months to 24 years; Grade I (insufficient evidence) for counseling adults ≥25

Melanoma recognition — ABCDE criteria:
- A: Asymmetry
- B: Border irregularity (notched, ragged, irregular)
- C: Color variation (multiple shades of brown, black, red, white, blue)
- D: Diameter >6mm (pencil eraser)
- E: Evolution — any change in size, shape, color or new lesion

Types of skin cancer:
- Basal cell carcinoma (BCC): most common; pearly/translucent papule with telangiectasia; rolled borders; rarely metastasizes; sun-exposed areas
- Squamous cell carcinoma (SCC): scaly, keratotic plaque; can metastasize (especially if >2cm, high-risk features); actinic keratosis = precursor
- Melanoma: most dangerous; can arise de novo or in existing nevus

Dysplastic/atypical nevi: clinical surveillance or biopsy; not all require excision; 1-3 atypical nevi = slightly increased risk

Treatment:
- BCC/SCC: surgical excision with appropriate margins (Mohs micrographic surgery for high-risk/cosmetically sensitive sites)
- Actinic keratosis: liquid nitrogen, topical 5-FU, imiquimod, photodynamic therapy

Sun protection counseling: SPF ≥30, broad-spectrum, water-resistant; reapply every 2 hours; protective clothing; avoid tanning beds`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/skin-cancer-counseling",
  },

  // ========== HEMATOLOGY & ONCOLOGY (4%) ==========

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Review: Iron Deficiency Anemia",
    guideline_year: "2023",
    abfm_domain: "Hematology & Oncology",
    section: "Iron Deficiency Anemia Diagnosis and Treatment",
    content: `Iron Deficiency Anemia (IDA) — diagnosis and management:

Diagnosis labs:
- CBC: microcytic (MCV <80), hypochromic anemia; thrombocytosis often present
- Ferritin: most specific test for iron stores (<30 ng/mL = iron deficient; <10 = depleted); <12 ng/mL diagnostic for IDA even without anemia
- Serum iron: low; TIBC: elevated; transferrin saturation: <20% (calculate: serum iron/TIBC × 100)
- Reticulocyte count: inappropriately low for degree of anemia

Anemia of chronic disease (ACD): ferritin normal/elevated, TIBC low, transferrin sat low-normal; distinguish from IDA by ferritin

Treatment:
- Oral iron: ferrous sulfate 325mg (65mg elemental iron) BID-TID — take on empty stomach with vitamin C for absorption; GI side effects common (constipation, nausea) — can try ferrous gluconate or ferric iron
- Duration: treat until hemoglobin normalized + 3 additional months to replenish stores (check at 4-8 weeks for response — Hgb should rise ≥1g/dL per 2 weeks)
- IV iron (ferric carboxymaltose, ferumoxytol, iron sucrose, low-molecular-weight iron dextran): for intolerance to oral, malabsorption, IBD, heart failure, non-responders; faster repletion; anaphylaxis risk (especially iron dextran — premedicate)

Must identify and treat underlying cause:
- Women: menorrhagia (most common in reproductive age), pregnancy
- GI blood loss: screen for occult GI bleeding (colorectal cancer, PUD)
- Malabsorption: celiac disease (check tissue transglutaminase IgA)`,
    url: "https://www.aafp.org/pubs/afp/anemia",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Review: Anticoagulation Management",
    guideline_year: "2023",
    abfm_domain: "Hematology & Oncology",
    section: "VTE Treatment and Anticoagulation",
    content: `Venous Thromboembolism (VTE) treatment and anticoagulation:

DVT/PE diagnosis:
- Wells criteria: pretest probability scoring
- D-dimer: high sensitivity; if negative with low/moderate pretest probability → rule out PE (age-adjusted threshold: age × 10 mcg/L for patients ≥50)
- Imaging: duplex ultrasound for DVT; CT pulmonary angiography (CTPA) for PE (gold standard)
- Echo: for massive PE (RV strain, septal D-sign, McConnell sign)

VTE treatment:
- DOACs preferred over warfarin: apixaban, rivaroxaban (can be started without parenteral bridging); edoxaban, dabigatran (require initial 5-10 days parenteral)
- Rivaroxaban DVT: 15mg BID × 21 days then 20mg daily
- Apixaban DVT: 10mg BID × 7 days then 5mg BID
- Low molecular weight heparin (LMWH, enoxaparin): preferred in cancer-associated VTE (DOACs now also appropriate for most cancers, except GI/GU cancers — higher bleeding)
- Warfarin: when DOACs not available or renal failure; INR goal 2-3; bridge with LMWH until therapeutic (INR 2-3 × 24 hours)

Duration of anticoagulation:
- Provoked (surgery, immobility, estrogen): 3 months
- Unprovoked first event: 3 months minimum; consider extended therapy (bleeding risk vs. recurrence risk)
- Recurrent VTE: indefinite anticoagulation
- Cancer-associated: treat as long as cancer active

Reversal agents:
- Warfarin: vitamin K (slow) + 4-factor PCC (Kcentra, rapid) + FFP (large volume)
- Dabigatran: idarucizumab (Praxbind — specific reversal)
- Apixaban/rivaroxaban: andexanet alfa (Andexxa — specific reversal); 4-factor PCC (off-label)`,
    url: "https://www.aafp.org/pubs/afp/anticoagulation",
  },

  // ========== MULTISYSTEM & OTHER (2%) ==========

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Guideline: Opioid Prescribing for Chronic Pain",
    guideline_year: "2022",
    abfm_domain: "Multisystem & Other",
    section: "Chronic Pain Management and Opioid Stewardship",
    content: `Opioid prescribing for chronic pain (CDC 2022 Guidelines, AAFP-endorsed):

Before initiating opioids:
- Establish diagnosis and document functional goals
- Non-opioid and non-pharmacologic therapies first: NSAIDs, acetaminophen, SNRIs, TCAs, gabapentinoids, physical therapy, CBT, acupuncture, interventional procedures
- PDMP (prescription drug monitoring program) check mandatory in most states
- Risk assessment: ORT (Opioid Risk Tool) or DIRE scale

If initiating opioids:
- Start low, go slow; use lowest effective dose
- Use immediate-release formulations first (not ER/LA for non-cancer chronic pain)
- Coprescribe naloxone if: ≥50 MME/day, concurrent benzodiazepine, prior overdose, substance use disorder risk
- 90 MME/day = threshold above which overdose risk substantially increases — careful justification required
- Reassess at 1-4 weeks and regularly; taper if inadequate improvement in pain/function or adverse effects

Benzodiazepine + opioid: AVOID — combination increases fatal overdose risk 3-4x; FDA black box warning

Opioid use disorder (OUD) treatment:
- Buprenorphine (Subutex/Suboxone): MAT — any prescriber with DEA license (DATA 2000 waiver eliminated — any DEA-licensed provider can now prescribe); sublingual/buccal; partial mu agonist
- Methadone: full agonist — only through OTP (opioid treatment program) clinics for OUD; NOT for office-based
- Naltrexone (Vivitrol): opioid antagonist, monthly injection; no risk of diversion; must be detoxed first (7-10 days opioid-free)`,
    url: "https://www.cdc.gov/drugoverdose/pdf/clinical_practice_guideline-a.pdf",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Guideline: Tobacco Use Cessation",
    guideline_year: "2022",
    abfm_domain: "Preventive Medicine & Health Maintenance",
    section: "Tobacco Cessation Counseling and Pharmacotherapy",
    content: `Tobacco use cessation — USPSTF Grade A / AAFP:

Brief counseling: 5 A's model — Ask (tobacco use), Advise (quit), Assess (readiness), Assist (provide treatment), Arrange (follow-up); even brief counseling by physician (3 min) increases quit rates

Pharmacotherapy (all FDA-approved first-line — combination therapy most effective):
1. Varenicline (Chantix): most effective single agent; partial nicotinic ACh receptor agonist; reduces withdrawal and reward; start 1-2 weeks before quit date; titrate: 0.5mg QD × 3 days → 0.5mg BID × 4 days → 1mg BID; 12 weeks; neuropsychiatric warning (FDA 2016 review found risk was lower than initially feared)
2. Bupropion SR (Wellbutrin SR, Zyban): start 150mg QD × 3 days, then 150mg BID × 7-12 weeks before quit date; contraindicated in seizure disorder, eating disorders
3. Nicotine replacement therapy (NRT): nicotine patch + short-acting (gum, lozenge, inhaler, spray) — combination more effective than patch alone; available OTC
   - Patch: 21mg × 6 weeks → 14mg × 2 weeks → 7mg × 2 weeks (if >10 cigarettes/day)
   - NRT safe in cardiovascular disease

Combination therapy: varenicline + NRT, or bupropion + NRT — superior to monotherapy

Electronic cigarettes: FDA has not approved for cessation; insufficient evidence for USPSTF recommendation; not recommended as first-line

Motivational interviewing for ambivalent patients: 5 R's — Relevance, Risks, Rewards, Roadblocks, Repetition`,
    url: "https://www.aafp.org/pubs/afp/tobacco-cessation",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Guideline: Alcohol Use Disorders",
    guideline_year: "2023",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "Alcohol Use Disorder Screening, Brief Intervention, and Treatment",
    content: `Alcohol Use Disorder (AUD) — SBIRT and management:

Screening tools:
- AUDIT-C (3 questions): score ≥3 (women) or ≥4 (men) = positive; follow with full AUDIT
- CAGE (4 questions): Cut down, Annoyed, Guilty, Eye-opener; ≥2 = probable AUD
- AUDIT (10 questions): comprehensive; scores 8-15 = hazardous; 16-19 = harmful; ≥20 = AUD likely

DSM-5-TR AUD criteria: ≥2 of 11 criteria within 12 months (mild: 2-3, moderate: 4-5, severe: ≥6)

AUDIT Risky drinking thresholds (NIAAA): men >4 drinks/occasion or >14/week; women >3 drinks/occasion or >7/week

Alcohol withdrawal management:
- Mild-moderate (CIWA-Ar <8): outpatient benzodiazepine taper
- Moderate-severe: inpatient; benzodiazepines (lorazepam, chlordiazepoxide) are gold standard; diazepam for mild-moderate if no liver disease
- Alcohol withdrawal seizures: first seizure typically 6-48h after last drink; treat with benzodiazepines (not phenytoin)
- Delirium tremens (DTs): 48-96h after cessation; autonomic instability, hallucinations, confusion; mortality 1-5% if treated; requires ICU-level care
- Thiamine 100mg IV before any dextrose (prevent Wernicke encephalopathy)

Pharmacotherapy for AUD:
- Naltrexone: 50mg daily oral or 380mg IM monthly (Vivitrol); reduces craving and reward; contraindicated if opioids used (precipitates withdrawal) or severe hepatic disease
- Acamprosate: reduces GABA/glutamate imbalance; renally dosed; not if severe CKD; start after detox
- Disulfiram (Antabuse): aversive; acetaldehyde reaction with alcohol; requires motivation; avoid in CV disease
- All FDA-approved medications are underutilized`,
    url: "https://www.aafp.org/pubs/afp/alcohol-use-disorder",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP/ADA Clinical Practice Guideline: Obesity Management",
    guideline_year: "2023",
    abfm_domain: "Endocrine & Metabolic",
    section: "Obesity Pharmacotherapy and Surgical Management",
    content: `Obesity management (AAFP/ADA/Obesity Medicine Society 2023):

Classification:
- Overweight: BMI 25-29.9 kg/m²
- Obesity Class I: 30-34.9; Class II: 35-39.9; Class III: ≥40 (severe/morbid)
- Asian Americans: overweight ≥23, obesity ≥27.5

Lifestyle: 500-750 kcal/day deficit; ≥150 min/week moderate aerobic exercise; structured behavioral programs (high intensity: ≥14 sessions in 6 months)

Pharmacotherapy (FDA-approved — consider at BMI ≥30, or ≥27 with comorbidity):
- GLP-1 receptor agonists: most effective class
  - Semaglutide (Wegovy 2.4mg weekly SQ): 15-17% weight loss (STEP trials)
  - Tirzepatide (Zepbound — GLP-1/GIP dual agonist): 20-22% weight loss (SURMOUNT trials)
  - Liraglutide 3mg (Saxenda daily SQ): 5-8% weight loss; less effective
- Naltrexone-bupropion (Contrave): modest 3-5% weight loss; avoid with opioids
- Phentermine-topiramate ER (Qsymia): 7-10% weight loss; teratogenic, CV effects, cognitive
- Orlistat (Alli/Xenical): GI lipase inhibitor; GI side effects; modest 3-4% weight loss; OTC available

Bariatric surgery (BMI ≥40 or ≥35 with comorbidities, failed conservative):
- Roux-en-Y gastric bypass (RYGB): gold standard; superior for DM remission; dumping syndrome risk
- Sleeve gastrectomy: most common procedure; less malabsorption; GERD may worsen
- Adjustable gastric band: highest revision rate, less used
- LAGB/sleeve: lower risk than RYGB; RYGB superior long-term weight loss`,
    url: "https://www.aafp.org/pubs/afp/obesity-management",
  },

  // ========== ADDITIONAL HIGH-YIELD CARDIOVASCULAR ==========

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Review: Peripheral Artery Disease",
    guideline_year: "2022",
    abfm_domain: "Cardiovascular",
    section: "PAD Diagnosis and Management",
    content: `Peripheral Artery Disease (PAD) — AAFP/ACC/AHA:

Diagnosis:
- Ankle-Brachial Index (ABI): resting ABI ≤0.90 diagnostic of PAD; ABI >1.40 = non-compressible (calcified vessels, seen in diabetes/CKD — use toe-brachial index)
- Normal ABI: 1.00-1.40; borderline: 0.91-0.99
- Symptoms: classic intermittent claudication (reproducible exertional leg pain, relieves with rest); many asymptomatic or atypical

Risk factors: smoking (strongest), diabetes, hypertension, hyperlipidemia, age ≥50

Management:
- Lifestyle: smoking cessation (most important — reduces progression); supervised exercise therapy (claudication improves 180% — most effective for symptoms)
- Medical:
  - Antiplatelet: aspirin or clopidogrel (both reduce cardiovascular events)
  - Statin therapy: high-intensity (reduces events independent of LDL level — pleiotropic effect)
  - ACEi or ARB: reduce cardiovascular events
  - Cilostazol (phosphodiesterase inhibitor): first-line for claudication symptom relief (60-150% improvement in walking distance); CONTRAINDICATED in HF
- Revascularization: for limb-threatening ischemia (rest pain, tissue loss — Rutherford 4-6), or disabling claudication not responsive to conservative therapy`,
    url: "https://www.aafp.org/pubs/afp/pad",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Review: Thyroid Nodules",
    guideline_year: "2023",
    abfm_domain: "Endocrine & Metabolic",
    section: "Thyroid Nodule Evaluation and Management",
    content: `Thyroid nodule evaluation (AAFP/ATA 2023):

Initial evaluation:
- TSH: if low → evaluate for hyperthyroidism (toxic adenoma, multinodular goiter); if normal/high → US and FNA based on US features
- Thyroid ultrasound: required for all palpable nodules or incidental findings
- TIRADS (Thyroid Imaging Reporting and Data System): 1 (benign) to 5 (highly suspicious)

FNA biopsy indications (size thresholds by TIRADS category):
- Highly suspicious (TR5): ≥1 cm → FNA; 0.5-1cm → consider
- Moderately suspicious (TR4): ≥1.5 cm → FNA
- Mildly suspicious (TR3): ≥2.5 cm → FNA
- Not suspicious (TR2): FNA rarely needed; TR1 (benign) = no FNA

Bethesda cytology classification:
- I: Non-diagnostic (repeat FNA)
- II: Benign (2-4% malignancy risk — monitor with US in 12-24 months)
- III: AUS/FLUS (5-15% risk — repeat FNA or molecular testing)
- IV: Follicular neoplasm (15-30% risk — diagnostic lobectomy)
- V: Suspicious for malignancy (60-75% risk — lobectomy/thyroidectomy)
- VI: Malignant (>97% risk — thyroidectomy)

Papillary thyroid cancer: most common (80-85%); excellent prognosis; Psammoma bodies on histology; lymph node spread common but survival high
Follicular thyroid cancer: vascular invasion; hematogenous spread; no lymph node spread typically`,
    url: "https://www.aafp.org/pubs/afp/thyroid-nodules",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Guideline: Preoperative Evaluation",
    guideline_year: "2023",
    abfm_domain: "Multisystem & Other",
    section: "Perioperative Risk Assessment and Optimization",
    content: `Preoperative evaluation (AAFP/ACC/AHA 2023):

Cardiac risk stratification:
- Revised Cardiac Risk Index (RCRI, Lee Index): 1 point each for IHD, HF, stroke/TIA, diabetes on insulin, Cr >2.0, high-risk surgery
  - 0 points: <1% MACE risk; 1 point: 1%; 2 points: 2.4%; ≥3 points: 5.4%
- ACS/ACC stepwise algorithm: assess MACE risk → determine functional capacity → further testing

Functional capacity: ≥4 METs = adequate for intermediate-risk surgery without further cardiac testing
- 1 MET: sitting, eating; 4 METs: climbing stairs, walking uphill; >10 METs: strenuous sports

Pre-op testing (evidence-based, only if clinically indicated):
- ECG: not routine; order for known/suspected CAD, significant arrhythmia, ≥50 with cardiac risk
- CXR: not routine; order for decompensated HF, COPD exacerbation
- CBC: if significant blood loss expected, known anemia, renal/liver disease
- BMP: hypertension, diabetes, renal disease, diuretics
- Coagulation studies: anticoagulant use, liver disease, suspected bleeding disorder
- Echo: not routine; only if suspected new/unstable HF or valvular disease

Medication management perioperatively:
- Continue: beta-blockers, statins, antihypertensives (most)
- Hold: ACEi/ARBs day of surgery (hypotension under anesthesia)
- Hold: SGLT2i ≥3 days before major surgery (DKA risk)
- Hold: metformin day of surgery and 48h after contrast or major surgery
- Anticoagulants: bridge vs. hold decision based on thromboembolic risk vs. bleeding risk`,
    url: "https://www.aafp.org/pubs/afp/preoperative",
  },

  // ========== MUSCULOSKELETAL — EXPANSION ==========

  {
    source: "ACR",
    tier: 2,
    guideline_title: "2019 ACR Guideline for Osteoarthritis of the Hand, Hip, and Knee",
    guideline_year: "2019",
    abfm_domain: "Musculoskeletal",
    section: "Osteoarthritis Diagnosis and Management",
    content: `Osteoarthritis (OA) — ACR 2019 guideline:

Diagnosis:
- Knee OA: age ≥50 + knee pain + morning stiffness <30 min + crepitus → clinical diagnosis; X-ray confirms (joint space narrowing, osteophytes, subchondral sclerosis)
- Hip OA: hip pain + internal rotation <15° + flexion ≤115° + ESR <45 mm/h → 86% sensitivity for OA
- Hand OA: hard tissue enlargement ≥2 of 10 selected joints + swelling ≤3 MCP joints

First-line (strongly recommended):
- Exercise therapy (aquatic, aerobic, resistance) — strongest evidence; improves pain and function
- Weight loss ≥5% body weight in overweight OA patients (reduces knee loading by 4× per pound lost)
- Patient education and self-management programs

Pharmacotherapy:
- Topical NSAIDs: FIRST-CHOICE for hand and knee OA (diclofenac gel 1%); superior safety vs. oral NSAIDs
- Oral NSAIDs: effective for pain; use lowest dose shortest duration; add PPI if GI risk; avoid in CKD, HF, >75 years
- Topical capsaicin: adjunct for hand and knee OA
- Intraarticular corticosteroids: short-term benefit (4–8 weeks); useful for flares; limit to 3–4 per joint per year
- Intraarticular hyaluronic acid: conditionally recommended for knee OA (modest benefit vs. placebo)
- Duloxetine: conditionally recommended for knee OA (central sensitization component)
- Opioids: NOT recommended for OA (risks > benefits); tramadol conditionally acceptable

Not recommended: glucosamine, chondroitin (no evidence above placebo); hydroxychloroquine; TNF inhibitors

Surgical referral: persistent pain/functional limitation after ≥3-6 months of conservative therapy`,
    url: "https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Osteoarthritis",
  },

  {
    source: "Endocrine Society",
    tier: 2,
    guideline_title: "2020 Endocrine Society Clinical Practice Guideline: Osteoporosis",
    guideline_year: "2020",
    abfm_domain: "Musculoskeletal",
    section: "Osteoporosis Screening, Diagnosis, and Pharmacotherapy",
    content: `Osteoporosis — Endocrine Society / AAFP / NOF guidelines:

Diagnosis (DXA T-score):
- Normal: T-score ≥ -1.0
- Osteopenia (low bone mass): T-score -1.0 to -2.5
- Osteoporosis: T-score ≤ -2.5
- Severe/established osteoporosis: T-score ≤ -2.5 + fragility fracture

Screening (USPSTF):
- All women ≥65 years: DXA screening
- Postmenopausal women <65 with risk factors: DXA if FRAX 10-year major fracture risk ≥9.3%
- Men ≥70 or men 50-69 with risk factors: DXA recommended

Treatment thresholds (NOF guidelines):
- T-score ≤ -2.5 at spine, femoral neck, or total hip: treat
- Osteopenia (T-score -1.0 to -2.5) + FRAX 10-year risk: major osteoporotic fracture ≥20% OR hip fracture ≥3%: treat
- Prior fragility fracture: treat regardless of T-score

Pharmacotherapy:
- First-line: bisphosphonates (alendronate 70 mg/week or 10 mg/day PO; risedronate; zoledronic acid 5 mg IV annually)
- Denosumab: injectable Q6 months; first-line alternative; do NOT discontinue abruptly (rebound vertebral fractures)
- Anabolic agents: teriparatide (PTH 1-34) or abaloparatide — for severe osteoporosis or bisphosphonate failure; 18–24 months maximum; follow with antiresorptive
- Romosozumab (sclerostin inhibitor): reduces both spine and hip fractures; 12 months then switch to antiresorptive

Calcium + Vitamin D: calcium 1200 mg/day (dietary preferred); Vitamin D 800-1000 IU/day to maintain 25-OH-D ≥30 ng/mL
Drug holiday: after 5 years bisphosphonate if low-moderate risk; reassess DXA; continue if high risk
Jaw osteonecrosis and atypical femur fractures: rare with oral bisphosphonates; higher risk with IV and longer use`,
    url: "https://academic.oup.com/jcem/article/104/5/1802/5418369",
  },

  {
    source: "ACR",
    tier: 2,
    guideline_title: "2021 ACR Guideline for Fibromyalgia",
    guideline_year: "2021",
    abfm_domain: "Musculoskeletal",
    section: "Fibromyalgia Diagnosis and Treatment",
    content: `Fibromyalgia — ACR 2010/2016 diagnostic criteria and management:

Diagnosis (2016 ACR criteria — no tender point count required):
- Widespread pain index (WPI) ≥7 AND symptom severity scale (SSS) ≥5, OR WPI 4-6 AND SSS ≥9
- Symptoms present at similar level ≥3 months
- No other diagnosis that would explain the pain
- Associated: fatigue, unrefreshing sleep, cognitive symptoms ("fibro fog"), somatic symptoms

Labs: normal CBC, CMP, TSH, ESR, CRP, ANA — diagnosis is clinical; labs to exclude mimics
Mimics: hypothyroidism, inflammatory arthritis, SLE, PMR, myopathy, sleep apnea

Management hierarchy (EULAR 2017, ACR):
Strongly recommended (non-pharmacologic):
1. Aerobic exercise (best evidence): land or water-based, 2-3×/week
2. Cognitive behavioral therapy (CBT) — addresses central sensitization
3. Patient education about condition (reduces catastrophizing)
4. Multimodal rehabilitation programs

Pharmacotherapy (adjunctive):
- Duloxetine 60-120 mg/day: FDA-approved; targets SNS-mediated central pain
- Milnacipran 100-200 mg/day: FDA-approved; similar to duloxetine
- Pregabalin 300-450 mg/day: FDA-approved; reduces central sensitization
- Amitriptyline 10-50 mg/hs: off-label but widely used for sleep + pain
- Cyclobenzaprine 5-10 mg/hs: short-term use for sleep

Not recommended: opioids (do not improve fibromyalgia; may worsen central sensitization); corticosteroids; NSAIDs (minimal evidence); strong opioids contraindicated`,
    url: "https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Practice Guideline: Shoulder Pain",
    guideline_year: "2020",
    abfm_domain: "Musculoskeletal",
    section: "Rotator Cuff Disease and Shoulder Pain Assessment",
    content: `Shoulder pain — rotator cuff disease (most common cause in primary care):

Anatomy: supraspinatus (most commonly torn), infraspinatus, teres minor, subscapularis

Diagnostic tests (exam):
- Neer impingement sign: arm in IR, forward flex to 180° — sensitivity 72%, specificity 60%
- Hawkins-Kennedy: arm 90° forward flex, internally rotate — sensitivity 79%, specificity 59%
- Empty can (supraspinatus): arm 90° forward flex, 30° abduction, thumb down → assess strength
- Drop arm test: rotator cuff tear — inability to lower slowly (sensitivity 21%, specificity 92%)
- Speed's test: biceps tendinopathy — resisted forward flex with elbow extended
- O'Brien's test: labral tear (SLAP) — arm 90°, elbow extended, thumb down, cross body

Imaging:
- X-ray: rule out glenohumeral OA, calcific tendinitis, AC joint disease, fracture
- MRI: gold standard for full-thickness tears, SLAP lesions; order if conservative therapy fails
- Ultrasound: dynamic assessment, cheaper; useful for partial tears and guided injection

Management:
- Rotator cuff tendinopathy/impingement: NSAIDs + physical therapy (6-12 weeks) → subacromial corticosteroid injection if PT fails → surgery if persistent
- Full-thickness rotator cuff tear in active patient: orthopedic referral for possible repair
- Glenohumeral OA: conservative (PT, NSAIDs, intraarticular injection) → joint replacement
- Adhesive capsulitis (frozen shoulder): stages (freezing, frozen, thawing); intraarticular CS injection + PT accelerates resolution; gentle stretching; surgery rarely needed
- Biceps tendinopathy: conservative; corticosteroid injection near tendon`,
    url: "https://www.aafp.org/pubs/afp/shoulder-pain",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP / AAO Clinical Guideline: Knee Pain in Primary Care",
    guideline_year: "2021",
    abfm_domain: "Musculoskeletal",
    section: "Knee Pain Evaluation and Management",
    content: `Knee pain — primary care evaluation (AAFP/AAO):

Ottawa Knee Rules (when to X-ray):
Age ≥55 OR isolated patellar tenderness OR fibula head tenderness OR inability to flex to 90° OR inability to weight bear (4 steps immediately and in ED) → X-ray indicated
Ottawa rule sensitivity 97-99% for fracture; specificity ~50%

Common diagnoses by location:
- Anterior: patellofemoral pain syndrome (PFPS), patellar tendinopathy, Osgood-Schlatter (adolescents), prepatellar bursitis
- Medial: MCL sprain, medial meniscal tear, pes anserine bursitis (overweight, OA, DM)
- Lateral: IT band syndrome (runners), LCL sprain, lateral meniscal tear, popliteal cyst (Baker's cyst)
- Posterior: Baker's cyst, popliteal artery entrapment, DVT
- Diffuse: OA, inflammatory arthritis, septic arthritis

Meniscal tear — clinical tests:
- McMurray test: valgus/varus stress with rotation; sensitivity 70%, specificity 71%
- Thessaly test (most sensitive): weight-bearing rotation; sensitivity 89% for medial meniscal tears
- Joint line tenderness: most sensitive exam finding

ACL tear:
- Lachman test: gold standard (sensitivity 84%, specificity 98% for complete tear)
- Anterior drawer: less sensitive
- Pivot shift: specific but difficult in acute setting

Management:
- PFPS: quadriceps strengthening, patellar taping, avoid aggravating activities; NSAIDs short-term
- IT band syndrome: stretching, foam rolling, temporary reduction in mileage
- Meniscal tear: conservative (PT, activity modification, NSAIDs) 6 weeks before MRI; MRI before orthopedic referral
- ACL tear: orthopedic referral; surgical vs. conservative based on activity level, age, instability`,
    url: "https://www.aafp.org/pubs/afp/knee-pain",
  },

  // ========== RENAL & UROLOGY — EXPANSION ==========

  {
    source: "KDIGO",
    tier: 2,
    guideline_title: "KDIGO 2024 CKD Clinical Practice Guideline",
    guideline_year: "2024",
    abfm_domain: "Renal & Urology",
    section: "CKD Complications Management",
    content: `CKD complications management — KDIGO 2024:

Anemia of CKD:
- Threshold: Hgb <10 g/dL in non-dialysis CKD; investigate iron stores first
- Iron therapy: if TSAT <20% OR ferritin <200 ng/mL → iron supplementation (oral or IV)
- Erythropoiesis-stimulating agents (ESAs): if Hgb <10 g/dL after iron optimization; target Hgb 10-11.5 g/dL (do not target >13; increased CV risk)

Metabolic acidosis:
- Target: serum bicarbonate ≥22 mEq/L in CKD
- Treat with oral sodium bicarbonate (Baking soda) or citrate supplements
- Correction slows CKD progression

Hyperkalemia in CKD:
- Dietary potassium restriction: <2-3 g/day; avoid high-K foods (bananas, oranges, potatoes, tomatoes)
- Review and adjust medications: ACEi/ARB — weigh benefit vs. K-sparing effect; do not routinely discontinue for hyperkalemia ≤5.5 mEq/L if other benefits present
- Patiromer (Veltassa) or sodium zirconium cyclosilicate (Lokelma): potassium binders; allow continued ACEi/ARB use
- Loop diuretics: can reduce K in volume-overloaded patients

Mineral metabolism:
- Phosphorus: dietary restriction if elevated; phosphate binders if >4.5 mg/dL (sevelamer preferred — no calcium load)
- PTH: secondary hyperparathyroidism — treat with activated Vitamin D (calcitriol) when PTH elevated; target per CKD stage
- Calcium: avoid hypercalcemia (no >3 g elemental calcium/day total)

Cardiovascular risk reduction (leading cause of death in CKD):
- Statins: recommended for all CKD G1-G3; reassess in G4-G5 (continue if started)
- BP target: ≤130/80 mmHg; ACEi or ARB first-line if proteinuria
- SGLT2i: now recommended for CKD G2-G4 with proteinuria (CREDENCE, DAPA-CKD trials)`,
    url: "https://kdigo.org/guidelines/ckd-evaluation-and-management/",
  },

  {
    source: "KDIGO",
    tier: 2,
    guideline_title: "KDIGO 2012 Acute Kidney Injury Clinical Practice Guideline",
    guideline_year: "2012",
    abfm_domain: "Renal & Urology",
    section: "Acute Kidney Injury Staging and Management",
    content: `Acute Kidney Injury (AKI) — KDIGO 2012 staging:

Definition: increase in serum Cr ≥0.3 mg/dL within 48h OR ≥50% increase from baseline within 7 days OR urine output <0.5 mL/kg/h for >6h

Staging:
- Stage 1: Cr ≥0.3 mg/dL rise OR 1.5-1.9× baseline; UO <0.5 mL/kg/h for 6-12h
- Stage 2: Cr 2.0-2.9× baseline; UO <0.5 mL/kg/h for ≥12h
- Stage 3: Cr ≥3× baseline OR Cr ≥4.0 mg/dL OR initiation of RRT; UO <0.3 mL/kg/h for ≥24h or anuria ≥12h

Pre-renal vs. intrinsic (FeNa):
- FeNa <1%: pre-renal (hypovolemia, cardiorenal syndrome, hepatorenal syndrome) OR contrast nephropathy
- FeNa >2%: intrinsic (ATN, glomerulonephritis, interstitial nephritis)
- FeNa unreliable with diuretics → use FeUrea instead (<35% = pre-renal)

Common causes:
- Pre-renal: volume depletion, cardiorenal, hepatorenal, NSAID-induced (afferent vasoconstriction), ACEi/ARB (efferent dilation in RAS)
- ATN: ischemic (hypotension, sepsis), nephrotoxic (contrast, aminoglycosides, vancomycin, cisplatin)
- AIN: drug-induced (NSAIDs, PPIs, PCN, sulfa, rifampin); eosinophilia, eosinophiluria, rash
- Post-renal: obstruction (BPH, stones, malignancy) → renal ultrasound

Contrast nephropathy prevention:
- Identify high-risk (CKD G3+, DM, volume depletion, heart failure, NSAID use)
- Pre-hydrate: IV NS 1 mL/kg/h for 3-12h before and 6-12h after; oral hydration acceptable for low-risk
- Use iso-osmolar or low-osmolar contrast; minimize contrast volume
- Hold metformin for 48h after contrast in eGFR <45

Indications for emergent dialysis (AEIOU):
Acidosis (pH <7.1), Electrolyte (K >6.5), Ingestion/poisoning, Overload (refractory), Uremia (symptoms: encephalopathy, pericarditis, bleeding)`,
    url: "https://kdigo.org/guidelines/acute-kidney-injury/",
  },

  {
    source: "AUA",
    tier: 2,
    guideline_title: "2023 AUA Guideline: Benign Prostatic Hyperplasia (BPH)",
    guideline_year: "2023",
    abfm_domain: "Renal & Urology",
    section: "BPH Diagnosis and Management",
    content: `Benign Prostatic Hyperplasia (BPH) / LUTS — AUA 2023:

Diagnosis:
- AUA Symptom Score (AUASS / IPSS): validated questionnaire; mild 0-7, moderate 8-19, severe 20-35
- Digital rectal exam: estimate prostate size; assess for nodules/asymmetry (→ PSA)
- Urinalysis: rule out infection, hematuria, glucose/protein
- PSA: if prostate cancer suspected or changes management; discuss before checking
- Post-void residual (PVR) ultrasound: if retention suspected; >300 mL abnormal
- Imaging and cystoscopy: NOT routine; reserved for specific indications

Management:
- Mild (IPSS ≤7) or mildly bothersome symptoms: watchful waiting + lifestyle modification
  - Limit fluids 2-3h before bed, avoid caffeine/alcohol, timed voiding, double voiding

- Moderate-severe (IPSS 8+): offer pharmacotherapy
  - Alpha-1 blockers (first-line): tamsulosin 0.4 mg/day, alfuzosin, silodosin — rapid onset (days); SFx: orthostatic hypotension, retrograde ejaculation (silodosin > tamsulosin), floppy iris syndrome
  - 5-alpha reductase inhibitors (5-ARIs): finasteride 5 mg/day or dutasteride 0.5 mg/day — shrinks prostate; onset 3-6 months; best for prostate >40 g; reduces PSA by ~50% (double PSA to estimate true value); SFx: decreased libido, ED, gynecomastia
  - Combination (alpha-blocker + 5-ARI): superior to either alone for large prostates (>40g); reduces retention and surgical risk (CombAT trial)
  - PDE5 inhibitors: tadalafil 5 mg/day — also treats ED; option for patients with both conditions
  - Anticholinergics/beta-3 agonists: for OAB/storage symptoms; caution if PVR >250 mL

Surgical referral: refractory urinary retention, recurrent UTI, bladder stones, renal insufficiency, failed medical therapy`,
    url: "https://www.auanet.org/guidelines-and-quality/guidelines/benign-prostatic-hyperplasia",
  },

  {
    source: "AUA",
    tier: 2,
    guideline_title: "2022 AUA Guideline: Medical Management of Kidney Stones",
    guideline_year: "2022",
    abfm_domain: "Renal & Urology",
    section: "Nephrolithiasis Evaluation and Medical Management",
    content: `Nephrolithiasis — AUA 2022 medical management:

Stone composition (from 24-hour urine):
- Calcium oxalate (75-80%): most common; hypercalciuria, hyperoxaluria, hypocitraturia
- Calcium phosphate (5-10%): RTA, hyperparathyroidism, alkaline urine
- Uric acid (5-10%): low urine pH, hyperuricosuria, gout, DM; radiolucent on plain X-ray (seen on CT)
- Struvite (10-15%): "infection stones" — urease-producing bacteria (Proteus, Klebsiella); staghorn calculi; treat infection and stone
- Cystine (<1%): hereditary cystinuria; hexagonal crystals on UA

Acute management:
- Pain control: ketorolac (NSAID) first-line (reduces ureteral spasm); opioids if NSAID contraindicated
- Medical expulsive therapy (MET): alpha-blocker (tamsulosin 0.4 mg/day) — increases passage rate for distal ureteral stones 5-10 mm
- Spontaneous passage rate: <5 mm: ~68%; 5-10 mm: ~47%; >10 mm: unlikely without intervention
- Indications for urgent urologic intervention: urosepsis + obstruction, solitary kidney, bilateral obstruction, anuria, refractory pain/vomiting, obstruction with fever

Metaphylaxis (prevention):
All stone formers: high fluid intake to urine output ≥2.5 L/day; urine specific gravity <1.010
- Calcium oxalate: dietary calcium 1000-1200 mg/day (do NOT restrict; binds oxalate in gut); reduce oxalate-rich foods (spinach, nuts, chocolate); if hypercalciuria → thiazide diuretic (reduces urinary calcium); if hypocitraturia → potassium citrate
- Uric acid: alkalinize urine to pH 6.5-7.0 with potassium citrate; allopurinol if hyperuricosuria; dietary purine restriction
- Struvite: treat infection; surgical removal often required`,
    url: "https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones",
  },

  {
    source: "AUA",
    tier: 2,
    guideline_title: "2020 AUA Guideline: Hematuria Evaluation",
    guideline_year: "2020",
    abfm_domain: "Renal & Urology",
    section: "Microscopic Hematuria Evaluation",
    content: `Hematuria evaluation — AUA 2020:

Definitions:
- Gross (visible) hematuria: always requires complete evaluation
- Microscopic hematuria: ≥3 RBC/HPF on properly collected, non-contaminated midstream urinalysis on at least one specimen

Benign causes to exclude before workup:
- Menstruation, vigorous exercise, urologic procedures, recent instrumentation → repeat UA in 6 weeks
- Confirmed benign cause: no further workup needed

Indications for full evaluation (cystoscopy + upper tract imaging):
- Any gross hematuria
- Microscopic hematuria in patients with any risk factor OR age >35 years
Risk factors: smoking (strongest), occupational chemical exposure, irritative voiding symptoms, prior pelvic radiation, prior cyclophosphamide, analgesic abuse, chronic UTI, indwelling foreign body

Evaluation pathway:
1. Urinalysis with microscopy (confirm RBC, not myoglobin/hemoglobin)
2. Urine culture (if dipstick positive for leukocytes/nitrites — treat UTI, repeat UA in 6 weeks)
3. Serum Cr and eGFR
4. Imaging: CT urography (preferred; three-phase: non-contrast, arterial, excretory) for upper tract — renal masses, stones, urothelial tumors; MRI urography if CT contrast contraindicated
5. Cystoscopy (in-office flexible): evaluate bladder and urethra for urothelial carcinoma
6. Urine cytology: low sensitivity but ordered concurrently with cystoscopy

Most common causes by age:
- <40: UTI, nephrolithiasis, IgA nephropathy, trauma
- >40: Bladder cancer, renal cell carcinoma, BPH, stones, UTI

Persistent hematuria after negative workup: nephrology referral if significant proteinuria/casts/dysmorphic RBC (→ glomerulonephritis); repeat evaluation at 3-5 years if initially negative`,
    url: "https://www.auanet.org/guidelines-and-quality/guidelines/hematuria",
  },

  // ========== DERMATOLOGY — EXPANSION ==========

  {
    source: "AAD",
    tier: 2,
    guideline_title: "2023 AAD-NPF Guidelines of Care for Psoriasis",
    guideline_year: "2023",
    abfm_domain: "Dermatology",
    section: "Psoriasis Diagnosis and Management",
    content: `Psoriasis — AAD-NPF 2023:

Diagnosis: clinical (well-demarcated, erythematous plaques with silvery-white scale)
- Auspitz sign: pinpoint bleeding after scale removal (characteristic)
- Koebner phenomenon: new lesions at sites of trauma
- Nail findings: pitting, oil spots, onycholysis, subungual hyperkeratosis
- Scalp: thick, adherent scale; may be first/only site
- Common sites: extensor surfaces (elbows, knees), scalp, lower back, umbilicus, intergluteal cleft

PASI score and BSA: severity classification
- Mild: BSA <3% OR DLQI <6
- Moderate-severe: BSA 3-10% OR DLQI ≥6 → consider systemic therapy

Comorbidities: psoriatic arthritis (30%), metabolic syndrome, cardiovascular disease, depression, IBD
- Screen all patients: joint pain (dactylitis, enthesitis, sausage digits), anxiety/depression, cardiometabolic risk

Management:
Mild (localized):
- Topical corticosteroids (first-line): potency based on site; use mid-potency on body, low-potency on face/skin folds
- Vitamin D analogues (calcipotriene): adjunct to or combination with TCS; calcipotriene/betamethasone combo foam (Enstilar) — superior to either alone
- Keratolytics (salicylic acid): thick scalp plaques
- Topical calcineurin inhibitors (tacrolimus/pimecrolimus): face, skin folds (off-label)
- Topical PDE4 inhibitor (roflumilast 0.3% cream): FDA-approved for mild-moderate plaque psoriasis

Moderate-Severe (systemic):
- Phototherapy: NB-UVB (narrowband UVB) — first-line systemic; safest long-term; 3×/week
- Methotrexate: 15-25 mg/week; monitor LFTs; avoid in active hepatitis, alcohol use; folate supplement; hepatotoxic
- Cyclosporine: rapid response; reserved for severe flares; limit to 1-2 years (nephrotoxicity, HTN)
- Apremilast (PDE4 inhibitor): oral; moderate psoriasis; avoid in depression/suicidal ideation
- Biologics: TNF inhibitors (etanercept, adalimumab, infliximab), IL-17 inhibitors (secukinumab, ixekizumab — most effective), IL-23 inhibitors (guselkumab, risankizumab, tildrakizumab); JAK inhibitors (deucravacitinib — TYK2, safer JAK profile)

Psoriatic arthritis: biologic therapy; TNF or IL-17 inhibitor; methotrexate for peripheral arthritis`,
    url: "https://www.aad.org/member/practice/clinical-excellence/guidelines/psoriasis",
  },

  {
    source: "AAD",
    tier: 2,
    guideline_title: "2023 AAD Guidelines of Care: Atopic Dermatitis",
    guideline_year: "2023",
    abfm_domain: "Dermatology",
    section: "Atopic Dermatitis Diagnosis and Stepwise Treatment",
    content: `Atopic dermatitis (eczema) — AAD 2023:

Diagnosis (Hanifin-Rajka criteria): pruritus + characteristic distribution + chronic/relapsing course + personal/family history of atopy
- Infants (<2 yrs): face, scalp, extensor surfaces
- Children (2-12 yrs): flexural creases (antecubital, popliteal fossae), neck, wrists
- Adults: hands, flexural areas, face/neck

Severity: mild (localized, clear intervals), moderate (frequent recurrences, sleep disturbance), severe (continuous symptoms, affecting QoL)

Stepwise management:
Step 1 — Skin care (all patients):
- Moisturize within 3 minutes of bathing ("soak and seal"): fragrance-free emollient/cream/ointment
- Short warm baths (5-10 min); use mild, fragrance-free soap
- Identify and avoid triggers: irritants (wool, fragrances, soaps), allergens, sweat, stress

Step 2 — Mild: topical corticosteroids (TCS)
- Low-potency: face, skin folds, infants (hydrocortisone 1-2.5%)
- Medium-high potency: body lesions
- Apply once or twice daily; taper to intermittent proactive therapy (2×/week) when clear

Step 3 — Moderate: topical calcineurin inhibitors (TCIs)
- Tacrolimus 0.1% ointment (adults), 0.03% (children 2-15 years): face, skin folds (steroid-sparing)
- Pimecrolimus 1% cream: milder disease; excellent for face
- Topical PDE4 inhibitor: crisaborole 2% (FDA for ≥2 years), difamilast
- Topical JAK1 inhibitor: ruxolitinib 1.5% cream (FDA-approved ≥12 years, mild-moderate AD)

Step 4 — Moderate-severe: systemic
- Dupilumab (IL-4/13 inhibitor): FDA-approved ≥6 months; injectable Q2-4 weeks; safest biologic; first-line systemic
- JAK inhibitors: abrocitinib, upadacitinib, baricitinib — FDA-approved adults; rapid onset
- Cyclosporine: off-label; use 1-2 years maximum
- Methotrexate/azathioprine/mycophenolate: off-label; longer onset

Antibiotics: only if secondary infection (S. aureus — honey-colored crusting, impetigo pattern); routine decolonization not recommended`,
    url: "https://www.aad.org/member/practice/clinical-excellence/guidelines/atopic-dermatitis",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Clinical Guidance: Dermatophytosis and Tinea Infections",
    guideline_year: "2022",
    abfm_domain: "Dermatology",
    section: "Tinea Infections and Superficial Fungal Infections",
    content: `Tinea (dermatophytosis) — clinical guide for primary care:

Types and presentation:
- Tinea pedis (athlete's foot): interdigital maceration, scaling, pruritus; ±vesicles (inflammatory type)
- Tinea cruris (jock itch): medial thighs, inguinal folds; sharp border; spare scrotum (unlike Candida)
- Tinea corporis (ringworm): annular, scaly plaque with central clearing, raised border
- Tinea capitis: scalp scaling + alopecia; most common in children; can cause kerion (boggy, tender mass)
- Tinea unguium (onychomycosis): thickened, discolored, brittle nails; confirm with KOH or nail culture before treatment
- Tinea versicolor (Malassezia furfur — NOT a dermatophyte): hypo or hyperpigmented fine-scaling macules; trunk; Wood's lamp = yellow-green; treat with topical antifungals

Diagnosis: clinical + KOH preparation (hyphae confirm dermatophyte); culture for refractory or scalp/nail

Treatment:
- Tinea pedis, cruris, corporis: topical antifungals 2-4 weeks
  - Terbinafine 1% cream: most effective; fungicidal; apply BID × 1 week (cruris/corporis) or 2 weeks (pedis)
  - Clotrimazole 1% or miconazole: effective; apply BID × 2-4 weeks
- Tinea capitis: MUST use systemic (topical ineffective due to hair follicle involvement)
  - Griseofulvin (first-line pediatric): 20-25 mg/kg/day × 6-8 weeks; take with fatty meal
  - Terbinafine: alternative, 4-6 weeks; superior for Trichophyton species
  - Adjunct: selenium sulfide 2.5% shampoo twice weekly to reduce shedding
- Onychomycosis: systemic required
  - Terbinafine 250 mg/day: 6 weeks (fingernail), 12 weeks (toenail); hepatotoxic; check LFTs if prolonged
  - Itraconazole pulse: 200 mg BID 1 week/month × 2-3 months; multiple drug interactions
  - Topical (tavaborole, ciclopirox): <50% cure; mild disease/cannot tolerate systemic
  - Cure rate: ~50-70% with systemic; 20-25% relapse

Prevention: keep feet dry, wear moisture-wicking socks, change shoes regularly, avoid barefoot in communal areas`,
    url: "https://www.aafp.org/pubs/afp/tinea",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP / IDSA: Skin and Soft Tissue Infections Management",
    guideline_year: "2022",
    abfm_domain: "Dermatology",
    section: "Cellulitis, Erysipelas, and Abscess Management",
    content: `Skin and soft tissue infections (SSTIs) — IDSA/AAFP:

Cellulitis vs. Erysipelas:
- Cellulitis: deeper dermis/subcutaneous tissue; borders less distinct; can occur anywhere
- Erysipelas: superficial dermis, lymphatics; SHARPLY demarcated, raised border; face or lower legs; S. pyogenes
- Both: unilateral lower extremity most common; warmth, erythema, edema, tenderness
- Bilateral lower leg "cellulitis": almost never true cellulitis (consider stasis dermatitis, lipodermatosclerosis, contact dermatitis)

Causative organisms:
- Non-purulent cellulitis/erysipelas: Group A Streptococcus (S. pyogenes)
- Purulent (abscess, furunculosis): S. aureus (MSSA or MRSA)

Classification:
- Non-purulent, mild: beta-lactam (cephalexin 500 mg QID × 5 days) — covers strep
- Non-purulent, moderate (systemic): IV antibiotics (ampicillin-sulbactam, nafcillin/oxacillin); Cefazolin 2g IV Q8h acceptable
- Purulent abscess: INCISION AND DRAINAGE is primary treatment; antibiotics adjunct for systemic features
  - MRSA coverage (TMP-SMX DS BID × 5-7 days preferred; doxycycline 100 mg BID × 5 days alternative)
- MRSA risk factors: prior MRSA, failure of beta-lactam, healthcare exposure, household contact with MRSA, crowded living

Marking border: mark erythema border with pen at presentation; reassess 24-48h
Hospitalization: systemic signs (fever >38.5°C, HR >90, RR >20, WBC >12K), rapid spread, failure of oral therapy, immunocompromise, near face/hands/genitals

Complications: lymphangitis (streaking), bacteremia, necrotizing fasciitis (surgical emergency: hard, wooden-feel, dishwater fluid, pain out of proportion)
Recurrent cellulitis: low-dose penicillin VK 250 mg BID or cephalexin 250 mg BID × 6-12 months for suppression; treat predisposing conditions (tinea pedis, lymphedema, obesity)`,
    url: "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
  },

  // ========== GASTROINTESTINAL — EXPANSION ==========

  {
    source: "ACG",
    tier: 2,
    guideline_title: "2018 ACG Clinical Guideline: Inflammatory Bowel Disease",
    guideline_year: "2018",
    abfm_domain: "Gastrointestinal",
    section: "Crohn's Disease and Ulcerative Colitis Diagnosis and Management",
    content: `Inflammatory Bowel Disease (IBD) — ACG 2018:

Crohn's Disease (CD) vs. Ulcerative Colitis (UC):
- UC: mucosal inflammation, continuous from rectum proximally; BLOODY diarrhea; smoking PROTECTIVE
- Crohn's: transmural; any GI tract mouth-to-anus; skip lesions; cobblestone; smoking worsens
- Crohn's: perianal disease (fistulas, abscesses), fistulas, strictures, malabsorption; extraintestinal manifestations (uveitis, episcleritis, ankylosing spondylitis, erythema nodosum, pyoderma gangrenosum, PSC [UC>CD])

Diagnosis:
- Endoscopy: gold standard; biopsy essential (pathology differentiates CD vs UC)
- Biomarkers: fecal calprotectin (>150-200 μg/g: sensitive for IBD, helps distinguish from IBS); CRP; ESR
- Imaging: CT or MRI enterography for small bowel CD; pelvic MRI for perianal disease

Management — UC:
- Mild-moderate proctitis/left-sided: mesalamine suppository or enema; oral mesalamine if extensive
- Moderate-severe: oral corticosteroids for flare (not maintenance); biologic therapy if steroid-dependent/refractory
  - Anti-TNFs: infliximab, adalimumab, golimumab
  - Anti-integrins: vedolizumab (gut-selective)
  - IL-12/23: ustekinumab
  - JAK inhibitors: tofacitinib, ozanimod (S1P modulator), upadacitinib
- Maintenance: mesalamine (mild disease); biologic for moderate-severe
- Colectomy: refractory, dysplasia, perforation, toxic megacolon

Management — Crohn's:
- Mild ileocolonic: budesonide 9 mg/day (topical effect, less systemic)
- Moderate-severe: anti-TNF (infliximab, adalimumab, certolizumab); combination with immunomodulator (azathioprine/6-MP) reduces immunogenicity
- Methotrexate: alternative immunomodulator for CD
- Ustekinumab, vedolizumab, risankizumab: biologic options
- Exclusive enteral nutrition: first-line for pediatric CD (mucosal healing)

Colorectal cancer surveillance: all UC patients and CD with colonic involvement → colonoscopy 8 years after diagnosis, then Q1-3 years`,
    url: "https://journals.lww.com/ajg/fulltext/2018/04000/management_of_crohn_s_disease.4.aspx",
  },

  {
    source: "AASLD",
    tier: 2,
    guideline_title: "2023 AASLD Practice Guidance: NAFLD/MASLD",
    guideline_year: "2023",
    abfm_domain: "Gastrointestinal",
    section: "Non-Alcoholic Fatty Liver Disease — Screening, Diagnosis, and Management",
    content: `Metabolic-associated steatotic liver disease (MASLD/NAFLD) — AASLD 2023:

New nomenclature (2023):
- MASLD (metabolic-associated steatotic liver disease): replaces NAFLD; requires ≥1 cardiometabolic risk factor
- MASH (metabolic-associated steatohepatitis): replaces NASH; inflammation + ballooning + steatosis
- MetALD: alcohol + metabolic risk; previously overlapping

Spectrum: Simple steatosis → MASH → Fibrosis (F1-F4) → Cirrhosis → HCC

Risk factors: obesity (central), type 2 DM (strongest modifier for progression), hyperlipidemia, metabolic syndrome, sleep apnea

Diagnosis:
- Elevated ALT (common but not required); ALT can be normal in MASLD
- Ultrasound: detects steatosis >20-30%; cannot stage fibrosis; first-line screening tool
- FIB-4 score: [(age × AST)/(PLT × √ALT)]; <1.30 → low fibrosis risk; >2.67 → high risk → refer hepatology
- NAFLD Fibrosis Score (NFS): also validated non-invasive fibrosis staging
- Liver biopsy: gold standard for staging; reserved for uncertain diagnosis or high fibrosis risk
- FibroScan (transient elastography): non-invasive fibrosis assessment; ordered by GI/hepatology

Management:
- Weight loss: 5-10% reduces steatosis; ≥10% improves histology (MASH); ≥7-10% reduces fibrosis
- Mediterranean diet + aerobic exercise
- GLP-1 receptor agonists: semaglutide (significant histologic improvement in trials); FDA-approved for obesity
- Pioglitazone: improves histology in MASH (with and without DM); weight gain, osteoporosis risk
- Vitamin E 800 IU/day: improves histology in non-diabetic MASH (PIVENS trial); no long-term safety data
- Resmetirom (Rezdiffra): FDA-approved 2024 — first disease-specific therapy for MASH with moderate-severe fibrosis (F2-F3)
- Avoid alcohol, hepatotoxic meds; evaluate for other liver disease

HCC surveillance: cirrhosis from MASLD → ultrasound Q6 months ± AFP`,
    url: "https://www.aasld.org/practice-guidelines/nafld",
  },

  {
    source: "ACG",
    tier: 2,
    guideline_title: "2013 ACG Clinical Guideline: Acute Pancreatitis",
    guideline_year: "2013",
    abfm_domain: "Gastrointestinal",
    section: "Acute Pancreatitis Diagnosis and Management",
    content: `Acute pancreatitis — ACG 2013:

Diagnosis (2 of 3 required):
1. Abdominal pain characteristic (epigastric, radiation to back, onset 30-60 min post-meal)
2. Serum lipase (or amylase) >3× upper limit of normal — lipase more specific; amylase normalizes faster
3. Characteristic imaging (CT or MRI with pancreatic inflammation)

Lipase: preferred marker (sensitivity >95%); peaks within 24-48h; remains elevated 3-5 days
Lipase-to-amylase ratio: >3 suggests alcoholic etiology

Common etiologies: Gallstones (40%) → ERCP/cholecystectomy; Alcohol (30%); Hypertriglyceridemia (>1000 mg/dL — treat with insulin infusion ± plasmapheresis); Idiopathic (15%); Medications (thiazides, azathioprine, furosemide, sulfa, metronidazole, tetracycline, valproate)

Severity classification (Revised Atlanta 2012):
- Mild: no organ failure, no local complications; resolves in <1 week
- Moderately severe: transient organ failure (<48h) OR local complications
- Severe: persistent organ failure (>48h) — mortality 30-50%

SIRS criteria (predict severity): >2 present at admission → ICU monitoring
Ranson criteria: >3 at 48h = severe (12 risk factors total)
BISAP score: BUN >25, Impaired mental status, SIRS, Age >60, Pleural effusion — ≥3 = increased mortality

Management (ACG):
- Aggressive IV hydration: Lactated Ringer's preferred over NS (reduces SIRS); 250-500 mL/h first 24h
- NPO initially → early oral feeding (within 24-48h if tolerated) — superior to prolonged NPO
- Pain control: IV opioids (hydromorphone or morphine)
- Antibiotics: NOT routine; only for confirmed infected necrosis (carbapenem or fluoroquinolone + metronidazole)
- Gallstone pancreatitis: ERCP within 24h if cholangitis or persistent obstruction; cholecystectomy same admission or within 4 weeks if mild
- NECROTIZING pancreatitis: CT diagnosis; manage conservatively first; surgical debridement only if infected (CT-guided FNA) and fails antibiotics`,
    url: "https://journals.lww.com/ajg/fulltext/2013/02000/american_college_of_gastroenterology_guideline_.8.aspx",
  },

  // ========== GERIATRICS — EXPANSION ==========

  {
    source: "AGS",
    tier: 2,
    guideline_title: "2023 AGS Beers Criteria for Potentially Inappropriate Medication Use in Older Adults",
    guideline_year: "2023",
    abfm_domain: "Geriatrics",
    section: "Beers Criteria and Polypharmacy in Older Adults",
    content: `Beers Criteria (AGS 2023) — medications to AVOID or use with caution in adults ≥65:

Medications to AVOID (selected high-priority):
- First-generation antihistamines: diphenhydramine, hydroxyzine, chlorpheniramine — highly anticholinergic; confusion, falls, urinary retention, constipation; avoid for sleep (Benadryl)
- Benzodiazepines (all): diazepam, lorazepam, clonazepam — fall risk, hip fracture, cognitive impairment, respiratory depression; do not abruptly stop if dependent
- Non-BZD hypnotics (Z-drugs): zolpidem, zaleplon, eszopiclone — same risks as BZDs; avoid for insomnia; preferred: melatonin, low-dose doxepin, CBT-I
- Tricyclic antidepressants: amitriptyline, imipramine, nortriptyline — anticholinergic, orthostatic, cardiac conduction; amitriptyline EXPLICITLY listed; prefer SSRI
- Antipsychotics for behavioral BPSD: increased mortality in dementia; use only when non-pharmacologic fails and patient/family informed
- Skeletal muscle relaxants: cyclobenzaprine, carisoprodol, methocarbamol — anticholinergic, fall risk, little evidence in elderly
- Sulfonylureas (especially glyburide and chlorpropamide): prolonged hypoglycemia; prefer glipizide if SU needed
- NSAIDs (oral): GI bleeding, peptic ulcer (5× higher risk), renal impairment, fluid retention, HTN exacerbation; avoid unless no alternative + add PPI
- Megestrol: appetite stimulation — increased thromboembolic risk
- Antispasmodics (oxybutynin, tolterodine): anticholinergic; prefer mirabegron (beta-3 agonist)

Use with caution:
- Aspirin >100 mg/day: no primary prevention benefit ≥60; increased GI bleed risk
- Dabigatran: increased GI bleed vs. warfarin if eGFR <30; prefer apixaban
- Rivaroxaban: QD dosing — if dose missed, reduced anticoagulation; apixaban safer

STOPP/START criteria: European equivalent of Beers; START identifies drugs that should BE prescribed (frequently under-prescribed in elderly)

Deprescribing approach: identify medication indication, assess risk-benefit, patient preference, taper carefully when stopping antidepressants, BZDs, antihypertensives, opioids`,
    url: "https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.18372",
  },

  {
    source: "AGS",
    tier: 2,
    guideline_title: "AGS/AMS Clinical Practice Guidelines: Delirium Prevention and Management",
    guideline_year: "2020",
    abfm_domain: "Geriatrics",
    section: "Delirium Recognition and Management in Older Adults",
    content: `Delirium in older adults — AGS/AMS guidelines:

Definition: acute brain dysfunction with fluctuating consciousness, attention deficit, cognitive disturbance
Core features: CAMINO mnemonic
- Acute onset and fluctuating course
- Inattention (cannot state days of week backward) — REQUIRED
- Altered level of consciousness OR disorganized thinking (one required for diagnosis)

CAM (Confusion Assessment Method) — validated screening:
Feature 1: Acute onset + fluctuating course AND Feature 2: Inattention → PLUS Feature 3 (disorganized thinking) OR Feature 4 (altered consciousness) = DELIRIUM

Subtypes:
- Hyperactive: agitation, calling out, pulling lines — recognized more easily
- Hypoactive: quiet, withdrawn, somnolent — often missed; worse prognosis
- Mixed: both features

Risk factors: age ≥65, pre-existing cognitive impairment, severe illness, dehydration, immobility, sensory impairment, medications (anticholinergics, opioids, BZDs, steroids)

Precipitants (FIND ME mnemonic): Fasting/dehydration, Infection, New drugs, Decreased O2, Metabolic abnormalities, Environmental change

Workup: BMP, CBC, UA/culture, blood cultures if infected, TSH, liver enzymes, drug screen, medication review; brain imaging only if focal neuro findings or head trauma; LP if fever + meningismus

Management — NON-PHARMACOLOGIC (first-line, prevents and treats):
- HELP protocol (Hospital Elder Life Program): reorientation, sensory aids (glasses, hearing aids), early mobilization, sleep hygiene, hydration/nutrition, non-pharmacologic sleep program
- Frequent reorientation by staff and family

Pharmacology (for agitation threatening safety):
- Low-dose haloperidol 0.25-0.5 mg PO/IM (least studied but most experience): short-term only; EPS risk
- Quetiapine 12.5-25 mg: more sedating; useful for ICU
- Avoid benzodiazepines UNLESS alcohol/BZD withdrawal delirium (then BZDs are first-line)

Prevention: avoid anticholinergics, unnecessary catheters, physical restraints; early mobility`,
    url: "https://www.americangeriatrics.org/media-center/news/ags-ams-guidelines-delirium",
  },

  {
    source: "AGS",
    tier: 2,
    guideline_title: "AGS Clinical Practice Guideline: Urinary Incontinence in Older Adults",
    guideline_year: "2022",
    abfm_domain: "Geriatrics",
    section: "Urinary Incontinence Evaluation and Management",
    content: `Urinary incontinence (UI) in older adults — AGS:

Types:
- Stress UI: involuntary leakage with increased intraabdominal pressure (cough, sneeze, exercise); weak pelvic floor/sphincter; more common in women
- Urgency UI (OAB wet): sudden urge to void + inability to reach toilet; detrusor overactivity; most common in elderly
- Overflow UI: constant dribbling or incomplete emptying; detrusor underactivity (diabetes, MS, cauda equina) OR outlet obstruction (BPH, stricture); high PVR
- Mixed: stress + urgency; common in older women
- Functional: cognitive/mobility limitations prevent timely toileting; incontinence functional, not anatomic

Evaluation:
- History: character, timing, volume, associated symptoms, fluid intake, medications
- Medications causing UI: diuretics, CCBs (retention/overflow), alpha-blockers (stress), opioids (retention), BZDs (functional), anticholinergics (retention/overflow)
- Pelvic exam: pelvic organ prolapse, atrophic vaginitis, mass
- DRE: prostate size, sphincter tone
- Urinalysis + culture: rule out UTI (common precipitant)
- Post-void residual (PVR): bladder scan or catheter; >150-200 mL → overflow/retention

Management:
Behavioral (first-line, all types):
- Bladder training: scheduled voiding, gradually extend intervals (urgency UI)
- Pelvic floor muscle training (PFMT / Kegel exercises): 8-12 contractions 3×/day × 8-12 weeks; stress and urgency UI (Level 1A evidence)
- Urgency: urge suppression techniques; scheduled voiding Q2-3h

Pharmacotherapy:
- Urgency UI (OAB): antimuscarinic agents (oxybutynin, tolterodine, solifenacin, trospium); PREFER mirabegron (beta-3 agonist) in older adults — avoids anticholinergic SFx; avoid oxybutynin IR in elderly (Beers criteria)
- Stress UI: topical estrogen (vaginal) for atrophic vaginitis; duloxetine (off-label); pelvic floor PT; midurethral sling surgery
- Overflow/retention: treat cause; catheterization (intermittent preferred); alpha-blockers for BPH

Genitourinary syndrome of menopause (GSM): vaginal dryness, dyspareunia, urgency — topical estrogen first-line (vaginal cream, ring, tablet); systemic HRT increases UI risk`,
    url: "https://www.americangeriatrics.org/guidelines",
  },

  // ========== HEMATOLOGY & ONCOLOGY — EXPANSION ==========

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP / ASH Clinical Practice: B12 and Folate Deficiency Anemia",
    guideline_year: "2022",
    abfm_domain: "Hematology & Oncology",
    section: "Vitamin B12 and Folate Deficiency Diagnosis and Treatment",
    content: `Vitamin B12 (cobalamin) deficiency — AAFP/ASH:

Clinical manifestations:
- Hematologic: macrocytic anemia (MCV >100 fL), hypersegmented neutrophils (≥5 lobes in ≥1 neutrophil), megaloblastosis
- Neurologic (B12-specific, NOT folate): subacute combined degeneration (posterolateral spinal cord); proprioception loss, vibration loss, ataxia, cognitive impairment; peripheral neuropathy; neuropsychiatric (depression, psychosis)
- IMPORTANT: Folate corrects anemia but NOT neurologic deficits — do not replace folate without ruling out B12 deficiency first

B12 deficiency causes:
- Pernicious anemia: autoimmune (anti-intrinsic factor antibodies, anti-parietal cell antibodies); achlorhydria; most common cause in developed countries; associated with autoimmune thyroid disease
- Dietary: strict vegans (no animal products)
- Malabsorption: gastrectomy, ileal resection/disease (Crohn's), celiac, surgical bypass
- Metformin: reduces B12 absorption (monitor annually in long-term metformin use)
- PPIs/H2 blockers: reduce gastric acid → less protein-bound B12 release

Diagnosis: Serum B12 <200 pg/mL definitive; 200-300 pg/mL borderline → check methylmalonic acid (MMA) and homocysteine (both elevated in B12 deficiency; only homocysteine elevated in folate deficiency)

Treatment:
- Pernicious anemia: IM cyanocobalamin 1000 mcg daily × 7 days, then weekly × 4 weeks, then monthly (lifelong); OR high-dose oral B12 1000-2000 mcg/day (effective — ~1% absorbed without IF by passive diffusion)
- Dietary/malabsorption: oral B12 1000-2000 mcg/day OR IM monthly
- Monitor: reticulocyte count rises 3-5 days; Hgb normalizes 6-8 weeks; neurologic improvement slower (may be incomplete if prolonged)

Folate deficiency:
- Causes: poor diet, alcohol (most common), malabsorption (celiac, tropical sprue), increased demand (pregnancy, hemolysis, malignancy), medications (methotrexate, phenytoin, sulfasalazine, trimethoprim)
- Homocysteine elevated (MMA normal — distinguishes from B12)
- Treatment: folic acid 1-5 mg/day PO × 4 months; neural tube defect prevention: 0.4-0.8 mg/day pre-conception
- Always rule out B12 deficiency before starting folate therapy`,
    url: "https://www.aafp.org/pubs/afp/vitamin-b12-deficiency",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP Thrombocytopenia Evaluation in Primary Care",
    guideline_year: "2021",
    abfm_domain: "Hematology & Oncology",
    section: "Thrombocytopenia Differential Diagnosis and Workup",
    content: `Thrombocytopenia (platelet count <150,000/μL) — primary care evaluation:

Classification by platelet count:
- Mild: 100,000-150,000 — usually asymptomatic; observation often appropriate
- Moderate: 50,000-100,000 — petechiae possible; increased surgical bleeding
- Severe: <50,000 — significant bleed risk; <20,000 → spontaneous bleeding risk; <10,000 → CNS/life-threatening bleed risk

Pseudothrombocytopenia: EDTA-induced platelet clumping → repeat in citrate tube; common artifact

Differential diagnosis framework:

1. Decreased production:
   - Bone marrow suppression: chemotherapy, radiation, aplastic anemia
   - Infiltration: leukemia, lymphoma, myeloma, solid tumor metastasis
   - Nutritional: B12/folate deficiency, alcohol
   - Viral: HIV (check risk factors), EBV, CMV, hepatitis C

2. Increased destruction — immune-mediated:
   - ITP (Immune Thrombocytopenic Purpura): isolated thrombocytopenia, no anemia or leukopenia, no splenomegaly, exclusion diagnosis
     - Treatment: observation (>30,000 without bleeding), prednisone 1 mg/kg/day, IVIG (rapid response needed), anti-D (Rh+ patients), TPO agonists (eltrombopag, romiplostim) for chronic
   - Drug-induced: heparin (HIT), quinine, quinidine, sulfonamides, vancomycin, linezolid, checkpoint inhibitors → HIT: check anti-PF4 antibody; 4T score
   - TTP: MAHA (schistocytes) + thrombocytopenia + renal failure + fever + neuro changes → EMERGENCY plasmapheresis
   - HUS: MAHA + thrombocytopenia + AKI (especially post-Shiga-toxin E. coli O157:H7)
   - HELLP: pregnancy — hemolysis + elevated LFTs + low platelets
   - Antiphospholipid syndrome: venous/arterial thrombosis + thrombocytopenia
   - SLE: multi-mechanism

3. Sequestration: hypersplenism (portal HTN, cirrhosis, lymphoma)

Initial workup: CBC + differential, peripheral blood smear, reticulocyte count, BMP/LFTs, LDH, haptoglobin; HIV/HCV if risk factors; B12/folate; ANA if SLE suspected; coagulation studies (DIC); heparin exposure history`,
    url: "https://www.aafp.org/pubs/afp/thrombocytopenia",
  },

  {
    source: "USPSTF",
    tier: 1,
    guideline_title: "USPSTF: Colorectal Cancer Screening 2021",
    guideline_year: "2021",
    abfm_domain: "Hematology & Oncology",
    section: "Colorectal Cancer Screening Recommendations and Methods",
    content: `Colorectal cancer (CRC) screening — USPSTF 2021 (Grade B: 45-75; Grade C: 76-85):

Screening start age: 45 years (average risk) — USPSTF 2021 update (previously 50); ACG/USMSTF: also 45

Screening methods (all acceptable):
Stool-based tests (non-invasive):
- gFOBT (guaiac FOBT): annually; avoid red meat, NSAIDs, Vitamin C 3 days before; 3 consecutive samples
- FIT (fecal immunochemical test): annually; more specific than gFOBT; no dietary restriction; preferred stool test
- FIT-DNA (Cologuard): every 1-3 years; higher sensitivity (92%) but lower specificity → more false positives

Structural tests:
- Colonoscopy: every 10 years; gold standard; direct visualization and polypectomy; bowel prep required; sedation needed
- CT colonography (virtual colonoscopy): every 5 years; requires bowel prep; IV contrast optional; cannot remove polyps
- Flexible sigmoidoscopy: every 5 years; or Q10 years + annual FIT

High-risk screening (START EARLIER, MORE FREQUENT):
- First-degree relative with CRC or advanced adenoma <60 years OR ≥2 first-degree relatives any age → colonoscopy starting at age 40 OR 10 years before youngest relative's diagnosis (whichever earlier), Q5 years
- Lynch syndrome (HNPCC): colonoscopy starting age 20-25, Q1-2 years
- FAP: flexible sigmoidoscopy starting puberty; colectomy usually recommended
- IBD (UC/CD with colonic involvement): colonoscopy 8 years after diagnosis, then Q1-3 years

Stop screening: at 75 (discuss risk-benefit); do not screen after 85

Positive non-colonoscopy test: follow-up diagnostic colonoscopy within 6 months (not another non-invasive test)

Risk factors: personal/family history CRC, IBD, Lynch/FAP, obesity, red/processed meat, alcohol, smoking; PROTECTIVE: physical activity, fiber, calcium, aspirin (not first-line for cancer prevention)`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
  },

  // ========== NEUROLOGY — EXPANSION ==========

  {
    source: "AAN",
    tier: 2,
    guideline_title: "2022 AAN/MDS Practice Guideline: Parkinson Disease",
    guideline_year: "2022",
    abfm_domain: "Neurology",
    section: "Parkinson Disease Diagnosis and Management",
    content: `Parkinson Disease (PD) — AAN/MDS guidelines:

Diagnosis (UK Brain Bank criteria):
Cardinal motor features (TRAP): Tremor (resting, 4-6 Hz, pill-rolling, improves with action), Rigidity (cogwheel, lead-pipe), Akinesia/Bradykinesia, Postural instability
- Resting tremor disappears with intentional movement (vs. essential tremor which is ACTION tremor, no rigidity)
- Unilateral onset → bilateral progression
- Strong response to levodopa supports diagnosis

Supportive features: anosmia (often premotor), constipation, REM sleep behavior disorder, orthostatic hypotension, pain
Red flags against PD: no levodopa response, early falls, symmetrical onset, early dementia, cerebellar signs, autonomic failure → consider MSA, PSP, LBD, DLB

Staging: Hoehn-Yahr scale (1-5; 1-2 unilateral, 3 bilateral with balance, 4-5 severe/wheelchair)

Pharmacotherapy:
- Dopamine precursor: LEVODOPA (L-DOPA) + carbidopa — most effective; "gold standard"; carbidopa prevents peripheral conversion → more reaches brain, reduces nausea
  - Preparations: immediate release (Sinemet), extended release, intestinal gel (Duopa) for advanced
  - Motor fluctuations with chronic use: "wearing off," "on-off" phenomenon, dyskinesias (involuntary movements at peak dose)
- Dopamine agonists: pramipexole, ropinirole, rotigotine patch — first-line in younger patients (delay motor complications); SE: impulse control disorders (gambling, hypersexuality), daytime somnolence, hallucinations, leg edema
- MAO-B inhibitors: selegiline, rasagiline, safinamide — mild symptom control; adjunct; possible neuroprotection
- COMT inhibitors: entacapone, opicapone — extend levodopa action; reduce "wearing off"
- Amantadine: treats levodopa-induced dyskinesias; also mild PD

Non-motor management:
- Dementia: rivastigmine (only ChEI approved for PD dementia); avoid typical antipsychotics (worsen PD)
- Psychosis/hallucinations: reduce PD meds first; quetiapine or clozapine (atypical); pimavanserin (FDA-approved for PD psychosis)
- Depression: SSRIs, SNRIs; TCAs with caution
- Constipation: increased fiber, hydration, docusate; macrogol (PEG laxative)
- Exercise: neurologist-guided exercise therapy (LSVT BIG, LSVT LOUD, tango, tai chi — evidence for gait and QoL)
- DBS (deep brain stimulation): STN or GPi; for fluctuations/dyskinesias refractory to medication`,
    url: "https://www.aan.com/Guidelines/home/GuidelineDetail/1045",
  },

  {
    source: "ACC/AHA",
    tier: 2,
    guideline_title: "2017 ACC/AHA Guideline on Evaluation and Management of Syncope",
    guideline_year: "2017",
    abfm_domain: "Neurology",
    section: "Syncope Evaluation and Risk Stratification",
    content: `Syncope evaluation — ACC/AHA 2017:

Definition: transient, self-limited loss of consciousness due to global cerebral hypoperfusion; characteristically: rapid onset, short duration, spontaneous complete recovery

Classification:
1. Reflex (neurally-mediated) — most common (50%):
   - Vasovagal: prodrome (warmth, nausea, diaphoresis), triggers (pain, emotion, prolonged standing); tilt-table test positive; benign
   - Situational: cough, micturition, defecation, post-exercise
   - Carotid sinus syndrome: turning head, tight collar → carotid massage (confirm diagnosis; do under monitoring)

2. Orthostatic hypotension: ≥20 mmHg systolic OR ≥10 mmHg diastolic drop within 3 min of standing
   - Causes: volume depletion, medications (diuretics, alpha-blockers, antihypertensives), autonomic neuropathy (DM, PD, MSA)
   - Active stand test: BP lying → then standing at 1, 3, 5 min

3. Cardiac syncope — HIGH RISK:
   - Arrhythmia: VT, VF, high-degree AV block, sick sinus syndrome, SVT with pre-excitation
   - Structural: severe AS (effort syncope), HCM, acute MI, PE, cardiac tamponade

High-risk features (require urgent evaluation/admission):
- New ECG abnormality (complete LBBB, Q waves, long QT/short QT, Brugada pattern, delta waves, AV block)
- Structural heart disease (HCM, severe AS, prior MI, EF <35%)
- Exertional syncope
- Family history of sudden cardiac death
- Syncope without prodrome in supine position
- During exercise

Workup:
- ALL patients: 12-lead ECG, history, physical, orthostatic BPs
- Ambulatory monitoring (Holter/event monitor): if arrhythmic cause suspected; no clear diagnosis
- Tilt-table test: if reflex syncope suspected after initial evaluation
- Echocardiogram: if structural heart disease suspected or ECG abnormal
- NOT routine: carotid ultrasound (unless stroke suspected), neuroimaging (unless focal deficit), EEG (unless seizure suspected)

CHESS/EGSYS/SFSR risk scores: predict serious outcome; guide admission vs. discharge

Seizure vs. syncope: clonic jerks AFTER LOC (syncope); prolonged tonic-clonic BEFORE recovery, aura, post-ictal confusion, tongue biting, incontinence (more specific for seizure)`,
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000492",
  },

  // ========== MULTISYSTEM & OTHER — EXPANSION ==========

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP: Chronic Pain Management in Primary Care",
    guideline_year: "2022",
    abfm_domain: "Multisystem & Other",
    section: "Opioid Therapy for Chronic Non-Cancer Pain — CDC 2022 Guidelines",
    content: `Chronic non-cancer pain — CDC 2022 Clinical Practice Guideline for Opioid Prescribing:

CDC 2022 core principles:
1. Non-opioid therapies preferred first: NSAIDs, acetaminophen, SNRIs (duloxetine, milnacipran), gabapentinoids, topical agents, exercise therapy, CBT, physical therapy
2. Opioids: only if expected benefits > risks; lowest effective dose; reassess frequently
3. Immediate-release opioids before ER/LA opioids for non-cancer chronic pain
4. Avoid concurrent opioid + benzodiazepine (↑ overdose risk 3-4×); taper if currently combined
5. Morphine milligram equivalents (MME): risk increases substantially at ≥50 MME/day; use caution ≥90 MME/day

Opioid initiation:
- Signed informed consent / treatment agreement (risks, alternatives, urine drug screen, PDMP check)
- Prescription drug monitoring program (PDMP): check before initiating AND periodically
- Urine drug screen: at baseline and periodically during therapy
- Start lowest effective dose; titrate by 25-50% increments; reassess monthly × 3, then Q3-6 months

High-risk indicators (require more intensive monitoring):
- History of OUD, alcohol use disorder
- Mental health comorbidities (depression, PTSD)
- Sleep-disordered breathing
- Concurrent benzodiazepines, sedatives, stimulants

Opioid use disorder (OUD) treatment — SAMHSA:
- Medications for OUD (MOUD) — first-line:
  - Buprenorphine/naloxone (Suboxone): first-line; office-based (DATA 2000 waiver no longer required since 2023); sublingual; partial mu agonist + antagonist; safer (ceiling effect)
  - Methadone: OTP clinic; daily observed dosing; full mu agonist; QTc monitoring
  - Naltrexone (Vivitrol): monthly IM; complete detox required first; high relapse if non-adherent; useful in motivated patients
- Naloxone rescue (Narcan): prescribe to ALL patients on chronic opioids (0.4 mg IM or 4 mg intranasal); educate patient + household members
- Opioid overdose: naloxone 0.4-2 mg IV/IM/IN; may need repeat doses for fentanyl; supportive care; 911`,
    url: "https://www.cdc.gov/drugoverdose/prescribing/guideline.html",
  },

  {
    source: "AAFP",
    tier: 1,
    guideline_title: "AAFP: Approach to Fatigue in Primary Care",
    guideline_year: "2023",
    abfm_domain: "Multisystem & Other",
    section: "Fatigue Workup and Differential Diagnosis",
    content: `Chronic fatigue evaluation — AAFP primary care approach:

Definition: fatigue lasting >6 months; persistent or relapsing; reduces activity by ≥50%

Myalgic encephalomyelitis / Chronic fatigue syndrome (ME/CFS) — IOM 2015 criteria:
- Substantial reduction in pre-illness activity + profound fatigue
- Post-exertional malaise (PEM): hallmark — worsening symptoms after physical/cognitive exertion (not just tiredness)
- Unrefreshing sleep
- Plus ≥1 of: cognitive impairment ("brain fog") OR orthostatic intolerance
- Exclusion of other explanations after workup

Differential diagnosis of chronic fatigue (systematic approach):
- Endocrine: hypothyroidism (TSH first), diabetes (fasting glucose/A1c), adrenal insufficiency (if systemic symptoms: 8 AM cortisol)
- Anemia: CBC, iron studies, B12/folate, reticulocyte count
- Sleep disorders: obstructive sleep apnea (Epworth scale, polysomnography), insomnia, restless legs
- Mood disorders: depression (PHQ-9), anxiety (GAD-7) — most common identified cause of chronic fatigue
- Chronic infections: HIV, hepatitis B/C, EBV (mono in young adults), Lyme (if endemic area + exposure)
- Inflammatory: connective tissue disease (ANA, anti-dsDNA, anti-SSA/B), inflammatory arthritis (CRP, ESR)
- Cardiac: exertional dyspnea + fatigue → echo (assess EF, valvular disease), ECG
- Malignancy: unexplained weight loss, night sweats, lymphadenopathy, elevated LDH/uric acid → CXR, CT
- Medications: beta-blockers, diuretics, antihistamines, BZDs, statins, opioids

Initial labs: CBC, BMP, TSH, LFTs, ESR/CRP, UA, fasting glucose; consider ferritin (iron deficiency without anemia)

ME/CFS management:
- No curative treatment; goal = symptom management and function
- Pacing: avoid "push-crash" cycles; heart rate-based pacing; graded exercise therapy CONTRAINDICATED (worsens PEM)
- Sleep hygiene, CBT (for coping, not curative), low-dose amitriptyline or trazodone for sleep
- Orthostatic intolerance: increased salt/fluid, compression stockings, fludrocortisone, propranolol

Long COVID overlap: post-acute sequelae of SARS-CoV-2 (PASC); similar presentation to ME/CFS; brain fog, fatigue, PEM`,
    url: "https://www.aafp.org/pubs/afp/fatigue",
  },

  // ========== CARDIOVASCULAR — ADDITIONAL HIGH-YIELD ==========

  {
    source: "ACC/AHA",
    tier: 2,
    guideline_title: "2023 ACC/AHA Guideline for Diagnosis and Management of Atrial Fibrillation",
    guideline_year: "2023",
    abfm_domain: "Cardiovascular",
    section: "Atrial Fibrillation Diagnosis, Stroke Risk, and Anticoagulation",
    content: `Atrial Fibrillation (AFib) — ACC/AHA 2023:

Classification:
- Paroxysmal: self-terminates within 7 days
- Persistent: lasts >7 days (needs cardioversion)
- Long-standing persistent: continuous >12 months
- Permanent: accepted; no further rhythm control attempted

Diagnosis: irregular rhythm on exam/ECG; confirmed by 12-lead ECG or Holter

Initial evaluation: TFTs (thyroid), BMP, CBC, echo (structural heart disease, LA size, LV function), sleep apnea screen

Stroke risk — CHA₂DS₂-VASc score:
C: CHF/LV dysfunction (1 pt)
H: Hypertension (1 pt)
A₂: Age ≥75 (2 pts)
D: Diabetes mellitus (1 pt)
S₂: Stroke/TIA/thromboembolism (2 pts)
V: Vascular disease (prior MI, PAD, aortic plaque) (1 pt)
A: Age 65-74 (1 pt)
Sc: Sex category female (1 pt)

Anticoagulation thresholds (ACC/AHA 2023):
- Score ≥2 in men OR ≥3 in women: anticoagulate (NOT antiplatelets — inferior to OAC)
- Score 1 in men OR 2 in women: may consider OAC
- Score 0 in men OR 1 in women (female sex alone): no anticoagulation

Preferred anticoagulants (DOACs over warfarin if eligible):
- Apixaban 5 mg BID: preferred; less GI bleed, renal dose: 2.5 mg BID if ≥2 of: age ≥80, Cr ≥1.5, weight ≤60 kg
- Rivaroxaban 20 mg daily with evening meal
- Dabigatran 150 mg BID: avoid if eGFR <30; not preferred in elderly (higher GI bleed vs. warfarin)
- Warfarin: second-line; TTR >70% needed; INR target 2.0-3.0

Rate control (first-line for most):
- Beta-blockers (metoprolol, bisoprolol, carvedilol): first-line; especially HFrEF
- Non-dihydropyridine CCBs (diltiazem, verapamil): effective; CONTRAINDICATED in HFrEF
- Digoxin: adjunct; less effective with exercise; narrow therapeutic window; toxicity (N/V, visual changes, bradycardia)
- Target resting HR <110 bpm (lenient strategy acceptable per RACE II trial)

Rhythm control (cardioversion ± antiarrhythmic):
- Rate vs. rhythm: no mortality difference (AFFIRM trial); rhythm control for symptoms
- Electrical cardioversion: TEE first if AFib >48h (or unknown duration) unless anticoagulated ≥3 weeks; cardiovert then anticoagulate ≥4 weeks (thrombus formation risk)
- Antiarrhythmics: flecainide/propafenone (no structural heart disease); amiodarone (structural HD — toxicity: thyroid, pulmonary, hepatic, photo); sotalol; dronedarone (do not use in HF or permanent AFib)
- Catheter ablation: pulmonary vein isolation; superior to drugs for paroxysmal/early persistent AFib`,
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001193",
  },

  // ========== PREVENTIVE MEDICINE — ADDITIONAL ==========

  {
    source: "USPSTF",
    tier: 1,
    guideline_title: "USPSTF: Statin Use for Cardiovascular Disease Prevention 2022",
    guideline_year: "2022",
    abfm_domain: "Preventive Medicine & Health Maintenance",
    section: "Statin Prescribing for Primary Prevention",
    content: `Statin primary prevention — USPSTF 2022 (Grade B for qualifying adults):

Recommendation: Prescribe LOW-TO-MODERATE dose statins for adults 40-75 who have:
1. No history of CVD (primary prevention)
2. ≥1 CVD risk factor (dyslipidemia, DM, HTN, or smoking)
3. Estimated 10-year CVD risk ≥10% (calculated using Pooled Cohort Equations — PCE)

Grade C (offer selectively, individualized decision): 10-year risk 7.5-10%
Grade I (insufficient evidence): adults ≥76 years

Pooled Cohort Equations (PCE) — 10-year ASCVD risk:
Inputs: age, sex, race, total cholesterol, HDL, systolic BP, BP treatment status, DM, smoking status
- Available at ACC ASCVD Risk Estimator Plus (online/app)
- Low risk: <5%; Borderline: 5-7.5%; Intermediate: 7.5-20%; High: ≥20%

Statin intensity selection:
- Low-intensity: lovastatin 20 mg, pravastatin 40 mg, simvastatin 10 mg → LDL reduction ~30%
- Moderate-intensity: atorvastatin 10-20 mg, rosuvastatin 5-10 mg, simvastatin 20-40 mg → LDL reduction 30-50%
- High-intensity: atorvastatin 40-80 mg, rosuvastatin 20-40 mg → LDL reduction >50%

Monitoring: fasting lipids 4-12 weeks after initiation and dose change; annual thereafter
Statin side effects:
- Myopathy: myalgias (5-10%); CK not routinely checked; check if symptomatic (hold if CK >10× ULN)
- Rhabdomyolysis: rare but life-threatening; CK >10,000 or >10× ULN with symptoms → stop immediately
- Hepatotoxicity: rare; routine LFT monitoring not recommended; check if symptomatic
- Diabetes risk: slight increase in DM risk (especially high-intensity); cardiovascular benefit outweighs in most
- Drug interactions: simvastatin/lovastatin + CYP3A4 inhibitors (amiodarone, azole antifungals, HIV PIs, grapefruit) → myopathy risk; prefer rosuvastatin or pravastatin in these patients`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/statin-use-in-adults-preventive-medication",
  },

  // ========== WOMEN'S HEALTH — ADDITIONAL ==========

  {
    source: "ACOG",
    tier: 2,
    guideline_title: "ACOG Practice Bulletin: Menopause and Hormone Therapy",
    guideline_year: "2022",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "Menopause Diagnosis and Hormone Replacement Therapy",
    content: `Menopause and Hormone Therapy (HT) — ACOG 2022:

Definitions:
- Natural menopause: 12 months amenorrhea without other cause; median age 51.4 years
- Perimenopause: 2-8 years before menopause; irregular cycles, vasomotor symptoms
- Premature ovarian insufficiency (POI): menopause before 40 years; FSH >25 IU/L on two occasions
- Surgical menopause: bilateral oophorectomy at any age

Diagnosis: clinical (symptoms + 12-month amenorrhea); FSH >25 IU/L supports diagnosis
Vasomotor symptoms (VMS): hot flashes, night sweats — most common symptoms; affect 75-80% of women; peak during first 2 years, can last >10 years

Hormone therapy — indications and benefits:
- MOST EFFECTIVE treatment for VMS (Grade A evidence)
- Effective for: genitourinary syndrome of menopause (GSM), mood changes, sleep disruption
- Systemic HT: estrogen + progestogen (if intact uterus) — protects against endometrial cancer
- Estrogen-only: ONLY for women with prior hysterectomy (no uterus)
- Non-oral estrogen (patches, gels, vaginal ring): avoids first-pass hepatic metabolism → lower clot risk

Risk reassessment — WHI study context:
- WHI study: mostly oral CEE + MPA in women 63 years avg; NOT representative of typical menopausal women ≤60
- For MOST symptomatic women ≤60 OR within 10 years of menopause: benefits > risks (cardiovascular neutral)
- Timing hypothesis: HT started near menopause may be cardioprotective; started ≥10 years after = increased CV risk

Contraindications to systemic HT:
- Active or history of breast cancer, endometrial cancer
- Unexplained vaginal bleeding
- Active DVT/PE or strong thromboembolic history
- Active liver disease or liver tumor
- Known CAD, stroke, or TIA (relative)

Non-hormonal options (for VMS when HT contraindicated):
- SSRIs/SNRIs: paroxetine 7.5 mg (only FDA-approved non-hormonal for VMS), venlafaxine, escitalopram
- Gabapentin: 300 mg TID; especially nocturnal symptoms
- Clonidine: modest effect; SE: hypotension, dry mouth
- Fezolinetant (Veozah): FDA-approved 2023 — NKB pathway antagonist; effective non-hormonal option

Duration: use lowest effective dose shortest time; no mandatory time limit if ongoing symptoms and benefits > risks (ACOG 2022)

Vaginal estrogen (local): safe for GSM; minimal systemic absorption; use long-term; even with breast cancer history (per most guidelines)`,
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2014/01/management-of-menopausal-symptoms",
  },

  // ========== INFECTIOUS DISEASE — ADDITIONAL ==========

  {
    source: "IDSA",
    tier: 2,
    guideline_title: "IDSA Diagnosis and Management of Lyme Disease",
    guideline_year: "2020",
    abfm_domain: "Infectious Disease",
    section: "Lyme Disease Diagnosis and Treatment",
    content: `Lyme disease — IDSA 2020 guidelines:

Causative agent: Borrelia burgdorferi (USA); transmitted by Ixodes scapularis tick; geographic: Northeast, Midwest US; peak: May-September

Clinical stages:

1. Early localized (3-30 days after tick bite):
   - Erythema migrans (EM): pathognomonic; ≥5 cm expanding rash; classic bull's-eye pattern OR uniform erythema; 70-80% of patients; warm, not painful or pruritic
   - Diagnosis: CLINICAL — do not test when EM is present (serology negative early); treat based on exam
   - Treatment: doxycycline 100 mg BID × 10 days (adults; NOT pregnant women or children <8 years); amoxicillin 500 mg TID × 14 days (pregnancy, children); cefuroxime alternative

2. Early disseminated (days-weeks):
   - Neurologic (Lyme neuroborreliosis): facial palsy (bilateral in 25%), meningitis, radiculopathy, encephalopathy
     → CSF: lymphocytic pleocytosis; Lyme antibody testing in CSF; treat with doxycycline 14-21 days (OR IV ceftriaxone if severe)
   - Cardiac: AV block (1st-3rd degree); Lyme carditis; monitor with telemetry if PR >300 ms or high-degree block; treat with doxycycline or IV ceftriaxone
   - Multiple EM lesions

3. Late disseminated (months-years):
   - Lyme arthritis: large joint (especially knee); intermittent; synovial fluid: 25,000-50,000 WBC/μL
     → Treat with doxycycline 28 days; amoxicillin × 28 days; if refractory → IV ceftriaxone × 28 days
   - Late neurologic: encephalopathy, cognitive changes → IV ceftriaxone

Serologic testing (TWO-TIER mandatory):
- EIA/ELISA first → if positive or equivocal → IgM and IgG Western blot
- IgM: positive 2-4 weeks after infection (only reliable first 4 weeks)
- IgG: 4-6 weeks; should be positive in late disease; use IgG ONLY if >4 weeks symptoms
- Positive IgM alone after >4 weeks = likely false positive

Post-treatment Lyme disease syndrome (PTLDS): persistent symptoms after adequate treatment; NOT ongoing infection; do NOT retreat with antibiotics; no evidence for long-term antibiotics

Tick bite prophylaxis: single dose doxycycline 200 mg if: Ixodes tick, attached ≥36h, within 72h of removal, in endemic area`,
    url: "https://www.idsociety.org/practice-guideline/lyme-disease/",
  },

  // ========== PULMONARY — EXPANDED ==========

  {
    source: "AASM",
    tier: 2,
    guideline_title: "AASM Clinical Practice Guidelines for Obstructive Sleep Apnea",
    guideline_year: "2023",
    abfm_domain: "Pulmonary & Allergy",
    section: "OSA Diagnosis and Treatment",
    content: `Obstructive Sleep Apnea (OSA) — AASM 2023 guidelines:

DIAGNOSIS:
- Polysomnography (PSG, in-lab) is gold standard; home sleep apnea testing (HSAT) acceptable for uncomplicated adults
- AHI (Apnea-Hypopnea Index) cutoffs:
  • Mild OSA: AHI 5-14 events/hour
  • Moderate OSA: AHI 15-29 events/hour
  • Severe OSA: AHI ≥30 events/hour
- Clinical suspicion: Epworth Sleepiness Scale ≥10, witnessed apneas, loud snoring, morning headaches, nocturia
- STOP-BANG screening: 3+ of 8 criteria = high risk (Snoring, Tired, Observed apneas, Pressure [HTN], BMI >35, Age >50, Neck >40cm, Gender male)

TREATMENT:
1. Continuous positive airway pressure (CPAP): first-line for moderate-severe OSA; also for mild OSA with significant symptoms or cardiovascular comorbidity
   - Adequate use: ≥4 hours/night on ≥70% of nights (Medicare definition for continued coverage)
   - Auto-titrating PAP (APAP): acceptable alternative to CPAP for non-complex patients
2. Mandibular advancement device (MAD): preferred patient alternative for mild-moderate OSA; less effective than CPAP but improves adherence
3. Weight loss: can reduce AHI (10% weight loss → ~26% AHI reduction)
4. Positional therapy: for position-dependent OSA (supine-predominant)
5. Upper airway surgery (UPPP, hypoglossal nerve stimulation): for CPAP-intolerant patients

COMORBIDITIES: OSA is independently associated with hypertension (resistant HTN), AF, stroke, type 2 DM, pulmonary HTN, GERD
- CPAP reduces cardiovascular events and all-cause mortality in severe OSA

Board trap: Treating OSA with CPAP does NOT reliably reduce cardiovascular events in patients without severe baseline sleepiness (SAVE trial); clinical decision should be individualized.`,
    url: "https://aasm.org/clinical-resources/practice-standards/practice-guidelines/",
  },

  {
    source: "BTS/CHEST",
    tier: 2,
    guideline_title: "BTS/CHEST Pleural Disease Guidelines",
    guideline_year: "2022",
    abfm_domain: "Pulmonary & Allergy",
    section: "Pleural Effusion Evaluation and Management",
    content: `Pleural Effusion — BTS/CHEST guidelines:

CLASSIFICATION — LIGHT'S CRITERIA (1972, still gold standard):
Exudate if ONE or more of the following:
1. Pleural fluid protein / serum protein > 0.5
2. Pleural fluid LDH / serum LDH > 0.6
3. Pleural fluid LDH > 2/3 upper limit of normal serum LDH

Transudate causes: CHF (#1), liver cirrhosis, nephrotic syndrome, hypothyroidism, constrictive pericarditis
Exudate causes: pneumonia (parapneumonic), malignancy, TB, PE, collagen vascular disease, pancreatitis, post-CABG

ADDITIONAL TESTS on pleural fluid:
- pH <7.2 → complicated parapneumonic effusion or empyema (requires drainage)
- Glucose <60 mg/dL → empyema, malignancy, rheumatoid disease, TB
- Adenosine deaminase (ADA) >40 U/L → high sensitivity/specificity for TB pleuritis
- Cytology: positive in ~60% of malignant effusions
- Cell count: neutrophils → acute/parapneumonic; lymphocytes → TB, malignancy, sarcoid

MANAGEMENT:
- Transudates: treat underlying cause; thoracentesis if symptomatic
- Exudates: drain if: empyema (pus), pH <7.2, loculated, non-draining after 1 week antibiotics, or malignant (for palliation)
- Parapneumonic effusion drainage indications: frank pus on aspiration, pH <7.2, glucose <60, positive Gram stain/culture, or loculation
- Malignant effusion: pleurodesis (talc) or indwelling pleural catheter (IPC) for recurrence prevention

THORACENTESIS technique: ultrasound guidance reduces complications (pneumothorax rate 1.3% US-guided vs 8% blind)

Chylothorax (triglycerides >110 mg/dL): lymphatic obstruction; causes: malignancy, thoracic duct injury post-surgery, trauma`,
    url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/pleural-disease/",
  },

  {
    source: "ATS/IDSA",
    tier: 2,
    guideline_title: "ATS/IDSA Community-Acquired Pneumonia Guidelines",
    guideline_year: "2019",
    abfm_domain: "Pulmonary & Allergy",
    section: "CAP Severity Assessment and Antibiotic Therapy",
    content: `Community-Acquired Pneumonia (CAP) — ATS/IDSA 2019 guidelines:

DIAGNOSIS: Clinical + radiographic (CXR or CT showing new infiltrate)

SEVERITY ASSESSMENT — CURB-65 score (1 point each):
- Confusion (new onset)
- Urea (BUN) >19 mg/dL
- Respiratory rate ≥30/min
- Blood pressure: systolic <90 OR diastolic ≤60 mmHg
- Age ≥65

Score 0-1: outpatient; Score 2: hospitalize or close follow-up; Score 3+: inpatient; Score 4-5: consider ICU

PSI (Pneumonia Severity Index, PORT score) is more accurate but complex; preferred in research; CURB-65 preferred for bedside use.

OUTPATIENT TREATMENT:
- No comorbidities: amoxicillin 1g TID × 5 days (preferred by ATS/IDSA 2019 over azithromycin due to resistance) OR doxycycline 100mg BID × 5d
- With comorbidities (COPD, immunosuppression, recent antibiotics): respiratory fluoroquinolone (levofloxacin 750mg QD × 5d) OR amoxicillin-clavulanate + azithromycin
- Macrolone monotherapy (azithromycin): avoid where Streptococcal pneumoniae resistance >25%

INPATIENT TREATMENT (non-ICU):
- Beta-lactam (ceftriaxone 1g IV daily) + macrolide (azithromycin 500mg IV/PO) OR respiratory fluoroquinolone monotherapy

ICU TREATMENT:
- Beta-lactam + azithromycin OR beta-lactam + respiratory fluoroquinolone
- Add antipseudomonal coverage if Pseudomonas risk (structural lung disease, COPD, recent hospitalizations)
- MRSA CAP: vancomycin or linezolid

DURATION: 5 days for non-severe CAP; extend based on clinical stability (afebrile ≥48h, improving symptoms)

BIOMARKERS: PCT (procalcitonin) useful for antibiotic de-escalation; CRP tracks response; Legionella/pneumococcal urinary antigen for severe CAP`,
    url: "https://www.thoracic.org/statements/resources/tb-opi/cap-in-adults-guideline.pdf",
  },

  {
    source: "ATS/ERS",
    tier: 2,
    guideline_title: "ATS/ERS Official Statement: Idiopathic Pulmonary Fibrosis",
    guideline_year: "2022",
    abfm_domain: "Pulmonary & Allergy",
    section: "IPF Diagnosis and Management",
    content: `Idiopathic Pulmonary Fibrosis (IPF) — ATS/ERS 2022 guidelines:

DIAGNOSIS:
- Usual interstitial pneumonia (UIP) pattern required: bibasilar, subpleural honeycombing (±traction bronchiectasis)
- HRCT: typical UIP pattern = honeycombing with or without peripheral traction bronchiectasis/bronchiolectasis
- Biopsy: surgical lung biopsy (VATS) if HRCT indeterminate; transbronchial lung cryobiopsy acceptable alternative
- Exclusion of known causes: drugs (amiodarone, bleomycin, nitrofurantoin), hypersensitivity pneumonitis, collagen vascular disease, occupational exposure

CLINICAL FEATURES: progressive dyspnea, dry cough, bibasilar crackles ("Velcro"), clubbing (~50%), male >female, age >60, smoking history

SPIROMETRY: restrictive pattern — ↓FVC, ↓TLC, ↓DLCO; FEV1/FVC ratio normal or elevated

TREATMENT:
- Antifibrotic agents (strong recommendation): nintedanib (150mg BID) OR pirfenidone (801mg TID) — both slow FVC decline by ~50%; do NOT improve FVC
- Acid suppression: GERD common; treat (though evidence for outcome benefit is limited)
- Pulmonary rehabilitation: improves 6MWT and quality of life
- Lung transplantation: definitive treatment for eligible patients (IPF is leading indication for lung transplant in adults)
- Supplemental O2 for resting hypoxemia (SaO2 ≤88%)

DO NOT USE: N-acetylcysteine (NAC) monotherapy; corticosteroids; azathioprine; cyclophosphamide (increase mortality in IPF)

PROGNOSIS: median survival 3-5 years from diagnosis; 5-year mortality ~70%

ACUTE EXACERBATION OF IPF: acute worsening with new bilateral opacities; triggers include GERD aspiration, infection, procedure; treat with high-dose corticosteroids empirically; poor prognosis`,
    url: "https://www.thoracic.org/statements/ipf.php",
  },

  {
    source: "ESC/ERS",
    tier: 2,
    guideline_title: "ESC/ERS Guidelines for Pulmonary Hypertension",
    guideline_year: "2022",
    abfm_domain: "Pulmonary & Allergy",
    section: "Pulmonary Hypertension Classification and Management",
    content: `Pulmonary Hypertension (PH) — ESC/ERS 2022 guidelines:

DEFINITION: mean pulmonary arterial pressure (mPAP) >20 mmHg at rest on right heart catheterization (RHC) — updated 2022 from old threshold of >25 mmHg

WHO/ERS GROUPS:
1. Pulmonary arterial hypertension (PAH): idiopathic, heritable, drug/toxin-induced (anorexigens), connective tissue disease (scleroderma #1), HIV, portal HTN, congenital heart disease
2. PH due to left heart disease: HFrEF, HFpEF, valvular disease — MOST COMMON cause overall
3. PH due to lung disease: COPD, ILD, OSA
4. Chronic thromboembolic PH (CTEPH): requires VQ scan screening in PE survivors with persistent dyspnea
5. Unclear/multifactorial PH

DIAGNOSIS WORKUP:
- Echo: screens for PH; TR velocity >2.8 m/s = elevated probability; RHC required for definitive diagnosis
- VQ scan: CTEPH evaluation (CT-PA can miss distal disease)
- 6-minute walk test (6MWT): functional assessment, prognosis
- WHO functional class (I-IV): determines treatment strategy

TREATMENT (Group 1 PAH):
- WHO FC II-III: initial combination therapy with ERA (ambrisentan, macitentan) + PDE5i (sildenafil, tadalafil) — AMBITION trial supports upfront combination
- WHO FC III-IV: add prostacyclin (parenteral epoprostenol preferred for severe PAH; inhaled iloprost; oral selexipag)
- Anticoagulation: recommended for idiopathic PAH (warfarin, target INR 2.0-3.0) — controversial, center-dependent
- Lung transplant: for refractory PAH
- Treat underlying cause for Groups 2-3

CTEPH (Group 4): pulmonary endarterectomy (PEA) is potentially curative; riociguat for inoperable CTEPH`,
    url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Pulmonary-Hypertension",
  },

  // ========== PEDIATRICS — EXPANDED ==========

  {
    source: "AAP",
    tier: 2,
    guideline_title: "AAP Bright Futures: Guidelines for Health Supervision of Infants, Children, and Adolescents",
    guideline_year: "2023",
    abfm_domain: "Pediatrics",
    section: "Well-Child Visit Schedule and Developmental Surveillance",
    content: `AAP Bright Futures Well-Child Visit Schedule (2023):

VISIT SCHEDULE:
- Prenatal visit (high-risk), Newborn (hospital), 1 week (high-risk), 2 weeks, 1 month, 2 months, 4 months, 6 months, 9 months, 12 months, 15 months, 18 months, 24 months, 30 months, 3 years, 4 years, 5 years, then annually through adolescence

DEVELOPMENTAL SURVEILLANCE (every visit) + SCREENING TOOLS:
- Ages & Stages Questionnaire (ASQ) at 9, 18, 30 months
- Autism screening: M-CHAT-R/F at 18 and 24 months (mandatory)
- Developmental delay screening: at 9, 18, 24/30 months using validated tool
- Hearing screen: universal newborn hearing screen before hospital discharge; assess at each visit

KEY MILESTONES (red flags if absent):
- 2 months: social smile, tracks past midline
- 4 months: head control, babbles
- 6 months: sits with support, babbling consonants
- 9 months: sits independently, babbles mama/dada (non-specific), pincer grasp emerging
- 12 months: stands independently, first words, pincer grasp complete
- 18 months: walks independently, ≥10 words, points to indicate wants
- 24 months: 2-word phrases, runs, ≥50 words
- 3 years: 3-word sentences, rides tricycle
- 4 years: hops on one foot, 4-word sentences, draws person with 3 parts

ANTICIPATORY GUIDANCE (key topics):
- Safe sleep (back-to-sleep, no bed sharing, firm mattress) until 12 months
- Car seat: rear-facing until 2 years OR upper weight/height limit; then forward-facing with harness; then booster
- Screen time: none <18-24 months (except video chat); <1 hr/day 2-5 years
- Lead screening: blood lead level at 12 and 24 months in high-risk areas
- Iron supplementation: 1 mg/kg/day at 4 months for exclusively breastfed infants; universal screen at 12 months

PREVENTIVE LABS: universal newborn screen (NBS), critical congenital heart disease (CCHD) screen, bilirubin screen, hemoglobin/hematocrit at 12 months`,
    url: "https://brightfutures.aap.org",
  },

  {
    source: "AAP",
    tier: 2,
    guideline_title: "AAP Clinical Practice Guideline for ADHD: Diagnosis, Evaluation, and Treatment",
    guideline_year: "2019",
    abfm_domain: "Pediatrics",
    section: "ADHD Diagnosis and Pharmacologic Management",
    content: `ADHD — AAP Clinical Practice Guidelines 2019:

DIAGNOSIS (DSM-5-TR criteria):
- ≥6 inattention symptoms (or ≥5 in adults ≥17) AND/OR ≥6 hyperactivity-impulsivity symptoms
- Symptoms present before age 12
- Symptoms in ≥2 settings (home AND school/work)
- Clear functional impairment
- Not better explained by another condition

Types: Predominantly Inattentive (formerly ADD), Predominantly Hyperactive-Impulsive, Combined presentation

EVALUATION:
- Vanderbilt ADHD Rating Scales: standard tool; parent AND teacher versions required
- Consider: vision/hearing screen, sleep evaluation (OSA can mimic ADHD), anxiety, learning disabilities
- No laboratory test or neuroimaging required for diagnosis

TREATMENT BY AGE:
- Preschool (4-5 years): behavior therapy FIRST; medication only if inadequate response or impairment severe
- School-age (6-11 years): FDA-approved medications FIRST-LINE + behavior therapy (combination superior to either alone)
- Adolescents (12-18 years): medications first-line + behavior therapy + consider organizational skills training

MEDICATIONS — STIMULANTS (first-line):
1. Methylphenidate (Ritalin, Concerta, Vyvanse-type): most studied; standard and extended-release
2. Amphetamines (Adderall, Vyvanse): equal efficacy; DEA Schedule II
- Monitor: BP, HR, height/weight (growth velocity monthly × 6 months, then quarterly)
- Side effects: appetite suppression, insomnia, headache; rarely cardiac effects (screen for cardiac history)
- No evidence for increased substance abuse when treated; may be protective

NON-STIMULANTS (second-line):
- Atomoxetine (Strattera): non-stimulant SNRI; takes 4-6 weeks; FDA-approved; black box warning for suicidality
- Guanfacine ER (Intuniv), Clonidine ER (Kapvay): alpha-2 agonists; useful for tic disorders, aggression, sleep

COMORBIDITIES: 50-60% have at least one comorbidity (anxiety, depression, ODD, ASD, LD); treat ADHD first unless anxiety is severe`,
    url: "https://publications.aap.org/pediatrics/article/144/4/e20192528",
  },

  {
    source: "AAP",
    tier: 2,
    guideline_title: "AAP Clinical Practice Guideline: Febrile Seizures",
    guideline_year: "2011",
    abfm_domain: "Pediatrics",
    section: "Febrile Seizure Evaluation and Management",
    content: `Febrile Seizures — AAP Guidelines 2011 (updated 2022):

DEFINITION: Seizure with fever (>38°C) in children 6 months-5 years WITHOUT CNS infection or metabolic cause and no prior afebrile seizure history

CLASSIFICATION:
Simple febrile seizure (80-85%):
- Generalized (tonic-clonic)
- Duration <15 minutes
- Does NOT recur within 24 hours
- Complete neurologic recovery

Complex febrile seizure (15-20%):
- Focal onset
- Duration ≥15 minutes (febrile status epilepticus if ≥30 min)
- Recurs within 24 hours OR incomplete recovery

EVALUATION:
- Simple febrile seizure: LUMBAR PUNCTURE NOT ROUTINELY REQUIRED in well-appearing children >18 months who are fully immunized
  → LP recommended if: meningeal signs, clinical concern for meningitis, prolonged postictal state, <12 months (especially if not fully immunized), 12-18 months (clinical judgment), prior antibiotics that may mask meningitis
- EEG: NOT recommended after first simple febrile seizure
- Neuroimaging: NOT recommended after simple febrile seizure
- Blood glucose, electrolytes: not routinely needed unless specific clinical concern

MANAGEMENT:
- Active seizure: benzodiazepine (rectal diazepam, buccal/intranasal midazolam)
- After seizure: address fever (antipyretics for comfort, NOT proven to prevent recurrence)
- Prophylactic antiepileptics NOT recommended for simple febrile seizures
- Diazepam rectal gel: consider for parents of high-risk children with prolonged seizure history

RECURRENCE: 30-35% of children with first febrile seizure will have another; risk factors: age <12 months, family history, low fever at time of seizure, brief fever before seizure

PROGNOSIS: Excellent. NO increased risk of epilepsy, cognitive impairment, or death after simple febrile seizure. Lifetime epilepsy risk only slightly elevated (~2-5% vs 1-2% general population)`,
    url: "https://publications.aap.org/pediatrics/article/127/2/389",
  },

  {
    source: "AAP",
    tier: 2,
    guideline_title: "AAP Clinical Practice Guideline: Acute Otitis Media",
    guideline_year: "2013",
    abfm_domain: "Pediatrics",
    section: "AOM Diagnosis and Antibiotic Management",
    content: `Acute Otitis Media (AOM) — AAP Clinical Practice Guideline 2013:

DIAGNOSIS CRITERIA (all 3 required):
1. Moderate-to-severe bulging of the tympanic membrane (TM) OR new onset otorrhea not due to external otitis
2. Mild TM bulging + RECENT onset of ear pain (<48h) + intense TM erythema
3. (OR: TM perforation with purulent discharge)
- Erythema alone without bulging is NOT sufficient for AOM diagnosis

Distinguish from Otitis Media with Effusion (OME): fluid without signs of acute inflammation — do NOT treat with antibiotics

TREATMENT DECISION:

Severe AOM (any age): immediate antibiotics
- Severe symptoms: moderate-severe otalgia, otalgia ≥48h, temperature ≥39°C

Non-severe AOM — watchful waiting option (48-72 hours):
- ≥2 years: bilateral or unilateral, mild symptoms → watchful waiting acceptable
- 6-23 months: bilateral → treat; unilateral, mild → watchful waiting acceptable
- <6 months: always treat

ANTIBIOTIC THERAPY:
- First-line: amoxicillin 80-90 mg/kg/day divided BID × 10 days (5-7 days for mild cases ≥2 years)
- Penicillin allergy (non-severe): cefdinir, cefpodoxime, cefuroxime
- Penicillin allergy (severe/anaphylaxis): clindamycin or TMP-SMX
- Treatment failure (48-72h no improvement): amoxicillin-clavulanate 90 mg/kg/day
- Recurrent AOM (≥3 episodes/6 months or ≥4/year): refer for tympanostomy tubes evaluation

COMPLICATIONS: mastoiditis, meningitis, brain abscess — rare but serious; headache/neck stiffness warrant workup

PREVENTION: pneumococcal vaccine (PCV15/PCV20) and influenza vaccine reduce AOM incidence; breastfeeding protective; avoid pacifier use after 6 months; avoid supine bottle feeding`,
    url: "https://publications.aap.org/pediatrics/article/131/3/e964",
  },

  {
    source: "NAEPP",
    tier: 2,
    guideline_title: "NAEPP Expert Panel Report 3: Guidelines for the Diagnosis and Management of Asthma in Children",
    guideline_year: "2020",
    abfm_domain: "Pediatrics",
    section: "Childhood Asthma Stepwise Management",
    content: `Childhood Asthma — NAEPP EPR-3 (updated 2020):

CLASSIFICATION (children ≥5 years):
Intermittent: symptoms ≤2 days/week, nighttime ≤2/month, FEV1 ≥80%, no daily medications needed
Persistent - Mild: symptoms >2d/week but not daily; nighttime 3-4/month; FEV1 ≥80%
Persistent - Moderate: daily symptoms; nighttime >1/week; FEV1 60-80%
Persistent - Severe: continual symptoms; frequent nighttime; FEV1 <60%

STEPWISE THERAPY:
Step 1 (Intermittent): SABA (albuterol) PRN only — no controller medication
Step 2 (Mild Persistent): Low-dose ICS (fluticasone 88-264 mcg/day or equivalent); montelukast alternative
Step 3 (Moderate Persistent): Low-dose ICS + LABA (if ≥5 years) OR medium-dose ICS
Step 4: Medium-dose ICS + LABA
Step 5: High-dose ICS + LABA ± tiotropium
Step 6: High-dose ICS + LABA + oral corticosteroids

KEY MEDICATIONS:
- SABA (albuterol): rescue; via MDI + spacer in all children; nebulizer for acute exacerbations
- ICS: most effective controller; use lowest effective dose; growth velocity monitor (minimal effect at low-medium doses)
- LABA (salmeterol, formoterol): NOT approved <5 years; always with ICS (increased mortality risk as monotherapy)
- Montelukast: alternative to ICS for mild persistent; less effective than ICS

CHILDREN 0-4 YEARS: ICS preferred; LABA not approved; montelukast alternative; cromolyn no longer preferred

SPACER/VHC: mandatory for MDI in all children <12 years; reduces oropharyngeal deposition, improves lung deposition

ASTHMA ACTION PLAN: green/yellow/red zones based on symptoms AND peak flow; written plan for school

ACUTE EXACERBATION (school-age): albuterol 2.5-5mg nebulized or 4-8 puffs MDI q20min × 3 doses; systemic corticosteroids if no improvement; O2 if SpO2 <92%`,
    url: "https://www.nhlbi.nih.gov/health-topics/asthma",
  },

  // ========== WOMEN'S HEALTH — EXPANDED ==========

  {
    source: "ACOG",
    tier: 2,
    guideline_title: "ACOG Practice Bulletin: Contraception",
    guideline_year: "2022",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "Contraception Effectiveness and Long-Acting Reversible Contraception",
    content: `Contraception — ACOG 2022:

CDC MEDICAL ELIGIBILITY CRITERIA (MEC) FOR CONTRACEPTIVE USE:
Category 1: No restriction | Category 2: Advantages > risks | Category 3: Risks > advantages | Category 4: Unacceptable health risk (contraindicated)

EFFECTIVENESS (Pearl Index — failures per 100 woman-years with PERFECT use):
- LONG-ACTING REVERSIBLE CONTRACEPTION (LARC) — most effective:
  • Levonorgestrel IUD (Mirena, Liletta, Kyleena, Skyla): 0.1-0.8% failure; lasts 3-8 years; reduces menstrual bleeding
  • Copper IUD (Paragard): 0.6-0.8% failure; lasts 10-12 years; non-hormonal; ALSO most effective emergency contraception if placed ≤5 days post-coitus
  • Etonogestrel implant (Nexplanon): 0.05% failure; lasts 3 years; most effective reversible method
- INJECTABLE: depot medroxyprogesterone acetate (DMPA/Depo-Provera): 6% typical-use failure; bone density loss with prolonged use (reversible); Q13 weeks injection
- COMBINED ORAL CONTRACEPTIVES (COCs): 9% typical-use; 0.3% perfect-use; estrogen-containing
  • Absolute contraindications (MEC 4): migraine with aura, ≥35 years old AND smoking ≥15 cigarettes/day, history of VTE/DVT/PE, stroke, coronary artery disease, known thrombophilia, breast cancer
  • Drug interactions: rifampin (reduces effectiveness); St. John's Wort; anticonvulsants (carbamazepine, phenytoin, topiramate)
- PROGESTIN-ONLY PILLS (POPs): 9% typical-use; safe in breastfeeding women; fewer contraindications; must take same time daily (±3 hours for older generation; ±24 hours for norethindrone 0.35mg)
- BARRIER: male condom (85% typical use, 98% perfect); only method protecting against STIs
- FERTILITY AWARENESS: 2-23% typical-use failure

EMERGENCY CONTRACEPTION:
- Levonorgestrel (Plan B, Take Action): within 72h (up to 120h); less effective with BMI >25 kg/m²
- Ulipristal acetate (ella): within 120h; more effective than LNG especially >72h; prescription required; avoid breastfeeding 1 week
- Copper IUD: most effective (>99%); up to 5 days post-coitus

POSTPARTUM CONTRACEPTION: LARCs can be placed immediately postpartum (IUD) or within 6 weeks; COCs contraindicated <6 weeks postpartum in breastfeeding; progestin-only methods safe immediately postpartum`,
    url: "https://www.acog.org/womens-health/faqs/birth-control",
  },

  {
    source: "ACOG/AE-PCOS",
    tier: 2,
    guideline_title: "ACOG Practice Bulletin: Polycystic Ovary Syndrome",
    guideline_year: "2023",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "PCOS Diagnosis and Management",
    content: `Polycystic Ovary Syndrome (PCOS) — ACOG 2023:

DIAGNOSIS — ROTTERDAM CRITERIA (2 of 3 required, after excluding other causes):
1. Oligo- or anovulation (irregular/absent menses)
2. Clinical or biochemical hyperandrogenism (hirsutism, acne, alopecia; elevated free/total testosterone)
3. Polycystic ovaries on ultrasound (≥12 follicles 2-9mm OR ovarian volume >10 mL on either ovary)

EXCLUSION OF MIMICS (required before diagnosis):
- TSH (hypothyroidism), prolactin (hyperprolactinemia), 17-OH progesterone (congenital adrenal hyperplasia)
- Cushing's syndrome if clinical features present; androgen-secreting tumor (if testosterone very high or rapid virilization)

CLINICAL FEATURES:
- Menstrual: oligomenorrhea (<8 cycles/year), amenorrhea
- Hyperandrogenic: hirsutism (modified Ferriman-Gallwey score ≥8), acne, androgenic alopecia
- Metabolic: insulin resistance (70-80%), type 2 DM (10× increased risk), metabolic syndrome, obesity (not universal)
- Reproductive: anovulatory infertility (most common cause of anovulatory infertility)
- Psychological: anxiety, depression

MANAGEMENT:
1. Lifestyle modification: first-line; 5-10% weight loss restores ovulation in obese women; aerobic exercise recommended
2. Menstrual regulation: COCs (suppress LH, reduce androgens, regulate cycles) — first-line for non-pregnant patients; progestin withdrawal × 10 days Q1-3 months
3. Hyperandrogenism: COCs ± spironolactone 50-100mg/day (anti-androgen); finasteride alternative
4. Insulin resistance/metabolic: metformin 500mg-2g/day; FDA-approved for DM prevention; reduces LH, improves insulin sensitivity
5. Infertility/ovulation induction:
   - First-line: letrozole 2.5-7.5mg days 3-7 (superior to clomiphene; NEJM 2014 — higher live birth rate)
   - Second-line: clomiphene citrate OR metformin
   - Third-line: gonadotropins, IVF
6. Endometrial protection: progestin therapy if amenorrhea to prevent endometrial hyperplasia/cancer

LONG-TERM RISKS: T2DM, metabolic syndrome, cardiovascular disease, endometrial cancer (due to unopposed estrogen), OSA`,
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/01/polycystic-ovary-syndrome",
  },

  {
    source: "ACOG",
    tier: 2,
    guideline_title: "ACOG Committee Opinion: Screening and Diagnosis of Perinatal Depression",
    guideline_year: "2023",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "Perinatal and Postpartum Depression Screening and Treatment",
    content: `Postpartum Depression (PPD) and Perinatal Mental Health — ACOG 2023:

SCREENING:
- Edinburgh Postnatal Depression Scale (EPDS): standard screening tool; 10-item self-report; score ≥10 warrants further evaluation; score ≥13 suggests major depression
- Screen at: first prenatal visit AND postpartum visits (USPSTF Grade B — screen all perinatal women)
- PHQ-9 also validated in perinatal population

CLASSIFICATION:
- Baby blues: 50-80% of women; onset within 3-5 days; self-limited by 2 weeks; education and support
- Postpartum depression (PPD): 10-15% of women; onset within 4 weeks to 12 months postpartum; meets MDD criteria (DSM-5); impairs mother-infant bonding and child development
- Postpartum anxiety: often comorbid with PPD; GAD, panic disorder, OCD patterns
- Postpartum psychosis: rare (1-2/1000); onset within 2 weeks; hallucinations, delusions, disorganized behavior; psychiatric emergency; 5% suicide/infanticide rate → immediate hospitalization

TREATMENT:
- Mild-moderate PPD: psychotherapy (CBT, interpersonal therapy) first-line; SSRIs if inadequate response
- Moderate-severe PPD: SSRIs first-line (sertraline preferred — most studied, lowest breast milk transfer)
- Breastfeeding safety: sertraline and paroxetine preferred (low milk-to-plasma ratio); avoid fluoxetine (active metabolite)
- Brexanolone (Zulresso, IV): FDA-approved for PPD (2019); single 60-hour infusion; requires REMS; for moderate-severe PPD; rapid onset
- Zuranolone (Zurzuvae, oral): FDA-approved 2023 for PPD; 14-day course; synthetic neurosteroid (GABAA modulator)

PARTNER SUPPORT: 10% of fathers develop depression in first postpartum year; screen male partners too

RISK FACTORS: prior PPD (50% recurrence), depression in pregnancy, poor social support, domestic violence, unplanned pregnancy, perinatal loss, NICU admission`,
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2023/02/screening-and-diagnosis-of-mental-health-conditions-during-pregnancy-and-postpartum",
  },

  {
    source: "ACOG",
    tier: 2,
    guideline_title: "ACOG Practice Bulletin: Prenatal Care",
    guideline_year: "2022",
    abfm_domain: "Women's Health & Reproductive Medicine",
    section: "First Trimester Prenatal Screening and Lab Evaluation",
    content: `Prenatal Care — ACOG 2022 (First Trimester):

INITIAL PRENATAL LABS (at first prenatal visit, ideally 8-10 weeks):
- CBC with differential: anemia, thrombocytopenia; MCV <80 → iron studies, hemoglobin electrophoresis if indicated
- Blood type and Rh factor + antibody screen: Rh-negative women receive RhoGAM at 28 weeks and after sensitizing events
- Rubella IgG: if non-immune → vaccinate postpartum (live vaccine, avoid in pregnancy)
- RPR or VDRL: syphilis screening (USPSTF Grade A)
- HIV: opt-out screening (USPSTF Grade A)
- Hepatitis B surface antigen (HBsAg): universal screening (USPSTF Grade B)
- Hepatitis C: all adults 18-79 per USPSTF
- Urine culture: bacteriuria screen (treat even if asymptomatic — risk of pyelonephritis/preterm birth)
- Pap smear: if due per cervical cancer screening guidelines
- GC/chlamydia: screen women ≤25 or at-risk (USPSTF Grade B)
- TSH: screen symptomatic women; consider universal in areas with iodine deficiency
- Varicella IgG: if unsure immune status
- Glucose challenge test: 24-28 weeks (gestational diabetes screen)

FIRST-TRIMESTER SCREENING (10-13 weeks):
- Cell-free fetal DNA (cfDNA/NIPT): screens for trisomy 21 (Down), 18 (Edwards), 13 (Patau); sex chromosome aneuploidies; best PPV in high-risk women; offer to all
- First-trimester combined screening: nuchal translucency (NT) + PAPP-A + beta-hCG; 85-90% detection rate for T21
- Sequential or contingency integrated screening with second-trimester markers: used if cfDNA not available

ANATOMY SCAN: 18-20 weeks; evaluates fetal anatomy, placenta location, amniotic fluid, fetal growth

SUPPLEMENTS:
- Folic acid: 400-800 mcg/day starting ≥1 month before conception; 4mg/day if prior NTD child or on valproate/carbamazepine
- Iron: 27 mg/day (prenatal vitamins usually sufficient); supplement if anemia detected
- DHA 200-300 mg/day: supports fetal neurologic development
- Low-dose aspirin 81 mg/day starting 12-28 weeks: recommended by USPSTF for women at HIGH risk for preeclampsia`,
    url: "https://www.acog.org/womens-health/faqs/prenatal-care",
  },

  // ========== PSYCHIATRY — EXPANDED ==========

  {
    source: "APA",
    tier: 2,
    guideline_title: "APA Practice Guideline for the Treatment of Patients with Bipolar Disorder",
    guideline_year: "2023",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "Bipolar Disorder Diagnosis and Pharmacologic Management",
    content: `Bipolar Disorder — APA Practice Guidelines 2023:

DSM-5 DIAGNOSTIC CRITERIA:
Bipolar I: At least ONE manic episode (even if preceded/followed by depression); mania = 7 days or hospitalization or psychosis; marked functional impairment
Bipolar II: At least ONE hypomanic episode (≥4 days) AND ONE major depressive episode; NO full manic episode; functional impairment primarily from depression
Cyclothymic disorder: ≥2 years of numerous hypomanic + depressive periods (not meeting full MDE criteria)

MANIC EPISODE features (≥3 of): grandiosity, decreased need for sleep (not fatigue), pressured speech, racing thoughts, distractibility, goal-directed activity increase, risky behavior

KEY DISTINCTION: Bipolar depression vs. unipolar depression: personal/family history, early onset, atypical features (hypersomnia, hyperphagia), psychotic features, rapid onset/offset, treatment resistance to antidepressants

MOOD STABILIZERS — EVIDENCE-BASED:
1. Lithium carbonate (gold standard for classic bipolar I):
   - Therapeutic range: 0.6-1.2 mEq/L (acute mania: 0.8-1.2); maintenance: 0.6-0.8
   - Monitoring: BMP (Cr/BUN), TSH, ECG q6-12 months; lithium level 5 days after dose change or q6 months
   - Side effects: tremor (fine), polyuria/polydipsia (nephrogenic DI), hypothyroidism, weight gain, teratogenicity (Ebstein anomaly — relative, not absolute)
   - Toxicity (>1.5 mEq/L): coarse tremor, nausea, ataxia, confusion; avoid NSAIDs and ACE inhibitors/thiazides (increase levels)
   - Unique benefit: proven antisuicidal effect; reduces all-cause mortality in bipolar disorder

2. Valproate (Depakote): equally effective as lithium for mixed states and rapid cycling; monitor CBC, LFTs, valproate level; teratogenic (neural tube defects, contraceptive required); avoid in women of childbearing potential if possible
3. Lamotrigine: most effective for bipolar depression prevention (NOT acute mania); rash (Stevens-Johnson) — slow titration mandatory
4. Atypical antipsychotics (quetiapine, olanzapine, aripiprazole, lurasidone): acute mania and bipolar depression; quetiapine most studied for bipolar depression

ANTIDEPRESSANTS IN BIPOLAR: generally AVOIDED as monotherapy (risk of precipitating mania/mixed state/rapid cycling); if needed, only with mood stabilizer; bupropion or SSRI + mood stabilizer if absolutely indicated

ACUTE MANIA: atypical antipsychotic ± lithium or valproate; haloperidol if severe agitation`,
    url: "https://psychiatryonline.org/pb/assets/raw/sitewide/practice_guidelines/guidelines/bipolar.pdf",
  },

  {
    source: "APA/VA-DoD",
    tier: 2,
    guideline_title: "APA/VA-DoD Clinical Practice Guideline for PTSD and Acute Stress Disorder",
    guideline_year: "2023",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "PTSD Diagnosis and Evidence-Based Treatment",
    content: `PTSD — APA/VA-DoD Clinical Practice Guidelines 2023:

DSM-5 DIAGNOSTIC CRITERIA (all 4 criterion clusters required):
A. Exposure to traumatic event (direct, witness, learned about close family/friend, or repeated occupational exposure)
B. Intrusion symptoms: flashbacks, nightmares, distressing recollections, psychological/physiological reactivity to trauma cues (≥1)
C. Avoidance: of internal (thoughts, feelings) or external (reminders) trauma cues (≥1)
D. Negative cognitions/mood: persistent negative beliefs, distorted blame, persistent negative emotions, diminished interest, detachment, inability to feel positive emotions (≥2)
E. Alterations in arousal/reactivity: hypervigilance, exaggerated startle, sleep disturbance, irritability/aggression, reckless behavior, concentration problems (≥2)
Duration: >1 month; functional impairment; not due to substances or medical condition
Acute stress disorder: same symptoms but <1 month duration after trauma

FIRST-LINE TREATMENTS (strong evidence):
1. PSYCHOTHERAPY (preferred):
   - Prolonged Exposure (PE): gold standard; imaginal + in vivo exposure to trauma memories
   - Cognitive Processing Therapy (CPT): cognitive restructuring of trauma-related beliefs
   - EMDR (Eye Movement Desensitization and Reprocessing): evidence-based; especially trauma-focused
   - Cognitive Behavioral Therapy for trauma (CBT-T)

2. PHARMACOTHERAPY (strong evidence for trauma-focused therapy + medications):
   - SSRIs (first-line): sertraline and paroxetine are FDA-APPROVED for PTSD; fluoxetine and venlafaxine also evidence-based
   - Treatment duration: ≥12 months after symptom remission; do not discontinue abruptly
   - Prazosin (alpha-1 blocker): evidence for PTSD-related nightmares; start 1mg QHS, titrate to 10-15mg; VA guideline supported
   - Benzodiazepines: NOT recommended for PTSD (may impair fear extinction, increase risk of dependence)

COMORBIDITIES: substance use disorder (40-60%), MDD (50%), traumatic brain injury (veterans); screen for suicidality at every visit

PRIMARY CARE SCREENING: Primary Care PTSD Screen (PC-PTSD-5): 5 questions; score ≥3 = positive; warrants full assessment`,
    url: "https://www.healthquality.va.gov/guidelines/MH/ptsd/",
  },

  {
    source: "SAMHSA/CSAT",
    tier: 1,
    guideline_title: "SAMHSA/CSAT Clinical Guidelines for Medications for Opioid Use Disorder",
    guideline_year: "2023",
    abfm_domain: "Psychiatry & Behavioral Health",
    section: "Medication for Opioid Use Disorder (MOUD) — Buprenorphine, Naltrexone, Methadone",
    content: `Substance Use Disorder / MOUD — SAMHSA/CSAT Guidelines 2023:

DSM-5 OPIOID USE DISORDER (OUD) criteria: ≥2 of 11 criteria in 12-month period (tolerance, withdrawal, use more than intended, failed attempts to cut down, time spent obtaining/using/recovering, neglect of responsibilities, continued use despite problems, etc.)
Severity: Mild (2-3), Moderate (4-5), Severe (≥6)

MEDICATIONS FOR OUD (MOUD) — all 3 are FDA-approved, reduce mortality 50%:

1. BUPRENORPHINE (Suboxone/Subutex):
   - Mechanism: partial mu-opioid agonist + kappa antagonist; ceiling effect on respiratory depression
   - Buprenorphine/naloxone (Suboxone): preferred for office-based treatment; naloxone deters IV misuse
   - DEA X-waiver ELIMINATED as of January 2023 (Consolidated Appropriations Act): any DEA-licensed provider can prescribe buprenorphine for OUD — no special waiver required
   - Initiation: patient must be in mild-moderate withdrawal (COWS score ≥8-12); starting when NOT in withdrawal → precipitated withdrawal; low-dose (microdose) buprenorphine induction avoids this
   - Starting dose: 2-4mg sublingual; titrate by 2-4mg per day; target 16-24mg/day for most patients
   - Home induction supported (telemedicine-based induction is now standard of care)

2. NALTREXONE (Vivitrol, extended-release injectable):
   - Mechanism: full opioid antagonist; non-addictive; NO abuse potential; NOT a scheduled substance
   - Formulation: oral (50mg daily) or monthly IM injection (380mg — Vivitrol)
   - Requires opioid-free for 7-10 days before initiation (5-7 days for buprenorphine, 7-10 days for methadone) to avoid precipitated withdrawal
   - Preferred when: abstinence-based programs, high-risk professions (healthcare, law), alcohol use disorder comorbidity

3. METHADONE:
   - Full mu-opioid agonist; only dispensed at federally licensed Opioid Treatment Programs (OTPs)
   - Once-daily observed dosing (initially); take-home doses earned
   - Most effective for severe OUD; requires daily clinic attendance
   - Significant drug interactions (QTc prolongation); cardiac monitoring recommended

ALCOHOL USE DISORDER (AUD):
- Naltrexone (oral or IM): first-line; reduces craving/relapse
- Acamprosate: reduces protracted withdrawal dysphoria; renal dosing required; safe in liver disease
- Disulfiram: aversion therapy; poor adherence; not first-line
- Gabapentin: off-label but growing evidence for AUD withdrawal prevention

CANNABIS USE DISORDER: No FDA-approved medications; CBT first-line; motivational enhancement therapy`,
    url: "https://store.samhsa.gov/product/Clinical-Guidelines-for-the-Use-of-Buprenorphine-in-the-Treatment-of-Opioid-Addiction/SMA07-3939",
  },

  // ========== INFECTIOUS DISEASE — EXPANDED ==========

  {
    source: "DHHS",
    tier: 1,
    guideline_title: "DHHS Guidelines for the Use of Antiretroviral Agents in Adults and Adolescents with HIV",
    guideline_year: "2024",
    abfm_domain: "Infectious Disease",
    section: "HIV Diagnosis, ART Initiation, and Initial Regimen",
    content: `HIV Management — DHHS Guidelines 2024:

DIAGNOSIS:
- 4th generation HIV-1/2 antigen/antibody combination assay: preferred initial test; detects HIV RNA (p24 antigen) + antibodies; window period 18-45 days
- Confirmatory: HIV-1/HIV-2 antibody differentiation assay → if negative, HIV-1 NAT (RNA)
- Acute HIV: elevated RNA with negative or indeterminate antibody (before seroconversion)
- USPSTF: screen all adults 15-65 years (Grade A); opt-out screening recommended

INITIAL EVALUATION:
- CD4 count, HIV RNA (viral load), HLA-B*5701 (abacavir hypersensitivity), drug resistance testing (genotype), CBC, CMP, lipids, hepatitis B/C serologies, RPR, TSH, TB screening (IGRA), urine GC/chlamydia
- Opportunistic infection prophylaxis based on CD4 count:
  • CD4 <200: TMP-SMX for PCP and toxoplasma prophylaxis
  • CD4 <50: azithromycin for MAC prophylaxis; fluconazole for candida/cryptococcus (resource-limited settings)

WHEN TO START ART:
- ALL people with HIV, regardless of CD4 count — START IMMEDIATELY (same-day ART recommended)
- High urgency (start ASAP, even same day): AIDS-defining illness, pregnancy, acute HIV infection, to prevent transmission

PREFERRED INITIAL REGIMEN (DHHS 2024):
- Bictegravir/tenofovir alafenamide/emtricitabine (BIC/TAF/FTC — Biktarvy): single-tablet regimen; preferred for most
- Dolutegravir + TAF/FTC (Triumeq or combination): preferred for women of childbearing age (lower NTD risk than older InSTIs)
- Cabotegravir + rilpivirine (Cabenuva): monthly or bimonthly IM injection; for virologically suppressed patients; enhances adherence

MONITORING:
- Viral load 2-4 weeks after starting, then q4-8 weeks until undetectable, then q3-6 months
- Target: undetectable viral load (<20-50 copies/mL) within 24 weeks
- U=U (Undetectable = Untransmittable): with sustained viral suppression, HIV transmission during sex is effectively zero

OPPORTUNISTIC INFECTIONS: PCP (TMP-SMX), CMV retinitis (valganciclovir), MAC (azithromycin), toxoplasma encephalitis (pyrimethamine/sulfadiazine + leucovorin), cryptococcal meningitis (amphotericin B → fluconazole)

PREP (Pre-Exposure Prophylaxis):
- TDF/FTC (Truvada): USPSTF Grade A recommendation for HIV-negative adults at high risk
- TAF/FTC (Descovy): alternative; approved for non-MSM after pregnancy concerns excluded
- Cabotegravir IM q2 months: injectable PrEP; more effective than oral in HPTN 083`,
    url: "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-arv",
  },

  {
    source: "IDSA/SHEA",
    tier: 2,
    guideline_title: "IDSA/SHEA Clinical Practice Guidelines for Clostridioides difficile Infection",
    guideline_year: "2021",
    abfm_domain: "Infectious Disease",
    section: "C. difficile Classification and Antibiotic Treatment",
    content: `Clostridioides difficile Infection (CDI) — IDSA/SHEA 2021:

DIAGNOSIS:
- Stool test for patients with ≥3 unformed stools/24 hours (no testing of asymptomatic patients or formed stools)
- Testing algorithm: NAAT (PCR) highly sensitive; toxin EIA specific — NAAT + toxin combination most accurate (reduces overdiagnosis)
- Do NOT test patients who are asymptomatic carriers

SEVERITY CLASSIFICATION (IDSA 2021):
- Non-severe (mild-moderate): WBC ≤15,000 cells/μL AND serum creatinine <1.5 mg/dL
- Severe: WBC >15,000 OR Cr ≥1.5 mg/dL
- Fulminant: hypotension/shock, ileus, OR megacolon → surgical consultation

TREATMENT (IDSA 2021 — KEY CHANGE: fidaxomicin now preferred over vancomycin):
Initial non-severe episode:
- PREFERRED: fidaxomicin 200mg BID × 10 days (higher sustained cure rate, lower recurrence than vancomycin)
- ALTERNATIVE: vancomycin 125mg QID × 10 days
- Metronidazole: NO LONGER RECOMMENDED as first-line (inferior cure rates)

Initial severe episode: vancomycin 125mg QID × 10 days OR fidaxomicin 200mg BID × 10 days

Fulminant CDI: vancomycin 500mg QID PO/NG + metronidazole 500mg IV q8h; surgical consultation; possible total colectomy

RECURRENT CDI (within 8 weeks of completing therapy):
- 1st recurrence: fidaxomicin (preferred) OR vancomycin pulse/taper × 6 weeks (125mg QID 10d → BID 7d → daily 7d → q2-3 days × 8 weeks)
- ≥2 recurrences: fecal microbiota transplantation (FMT) — FDA-approved (Rebyota, Vowst); highly effective (80-90%)
- Bezlotoxumab (monoclonal antibody against toxin B): given IV with antibiotics for recurrence prevention in high-risk patients

DISCONTINUE offending antibiotics as soon as possible; avoid PPIs, anti-motility agents (narcotics, anti-diarrheals)

INFECTION CONTROL: contact precautions; hand WASHING (soap and water) — alcohol hand gels do NOT kill C. diff spores; private room; bleach disinfection of surfaces`,
    url: "https://www.idsociety.org/practice-guideline/clostridium-difficile/",
  },

  {
    source: "CDC",
    tier: 1,
    guideline_title: "CDC Sexually Transmitted Infections Treatment Guidelines",
    guideline_year: "2021",
    abfm_domain: "Infectious Disease",
    section: "Gonorrhea, Chlamydia, and Syphilis Treatment",
    content: `STI Treatment — CDC 2021 Guidelines:

GONORRHEA (Neisseria gonorrhoeae):
- Treatment (uncomplicated urogenital, rectal, pharyngeal): CEFTRIAXONE 500mg IM × 1 dose (if ≥150 kg: 1g IM)
  → No longer recommend adding azithromycin to ceftriaxone (2021 update — previous dual therapy abandoned due to resistance tracking)
- Penicillin allergy: Gentamicin 240mg IM + azithromycin 2g PO (reserve; only if ceftriaxone unavailable)
- Resistance: widespread fluoroquinolone resistance; cephalosporin resistance emerging — culture + sensitivities for treatment failure
- Test of cure: oropharyngeal infections 1-2 weeks after treatment; urogenital only if symptoms persist
- Co-treatment for chlamydia: if chlamydia NOT excluded: add doxycycline 100mg BID × 7d

CHLAMYDIA (Chlamydia trachomatis):
- Treatment (uncomplicated urogenital, rectal): doxycycline 100mg BID × 7 days (preferred over azithromycin since 2021 — superior for rectal chlamydia)
- Alternative: azithromycin 1g PO × 1 dose (acceptable for urogenital; NOT preferred for rectal infection)
- Pregnancy: azithromycin 1g PO × 1 dose (doxycycline contraindicated in pregnancy); amoxicillin alternative
- Lymphogranuloma venereum (LGV strains): doxycycline 100mg BID × 21 days

SYPHILIS (Treponema pallidum):
- Primary/secondary/early latent (<1 year): Benzathine penicillin G 2.4 million units IM × 1 dose
- Late latent (>1 year duration unknown): Benzathine penicillin G 2.4 million units IM × 3 doses (weekly × 3)
- Neurosyphilis: aqueous crystalline penicillin G 18-24 million units IV daily × 10-14 days
- Penicillin allergy: doxycycline 100mg BID × 14d (primary/secondary); 28d (late latent); MUST desensitize and treat with penicillin in pregnancy
- Jarisch-Herxheimer reaction: fever, myalgias 6-8h after first dose (especially secondary syphilis) — self-limited; antipyretics; NOT an allergy

SCREENING GUIDELINES (USPSTF):
- Gonorrhea/chlamydia: all sexually active women ≤25 years (Grade B); older women at risk
- Syphilis: pregnant women (Grade A); sexually active persons at increased risk (Grade B) including MSM, commercial sex workers, HIV-positive individuals

EXPEDITED PARTNER THERAPY (EPT): treating partners of chlamydia/gonorrhea patients without physical exam — legal in most states; recommended by CDC`,
    url: "https://www.cdc.gov/std/treatment-guidelines/",
  },

  // ========== HEMATOLOGY — EXPANDED ==========

  {
    source: "ASH/ACCP",
    tier: 2,
    guideline_title: "ASH/ACCP Guidelines for VTE Treatment and Duration",
    guideline_year: "2021",
    abfm_domain: "Hematology & Oncology",
    section: "DVT and PE Treatment, Anticoagulant Selection, and Duration",
    content: `VTE Treatment (DVT and PE) — ASH/ACCP Guidelines 2021:

DIAGNOSIS:
- DVT: D-dimer (Wells score pretest probability); compression ultrasound confirmatory
- PE: D-dimer + CT pulmonary angiography (CTPA) gold standard; V/Q scan if CTPA contraindicated
- Wells criteria for PE: clinical signs of DVT, alternative diagnosis less likely, HR >100, immobilization/surgery within 4 weeks, prior DVT/PE, hemoptysis, malignancy

ANTICOAGULATION SELECTION:
1. DOACs (preferred for most patients):
   - Apixaban (Eliquis): 10mg BID × 7d → 5mg BID; preferred for obese patients, cancer VTE
   - Rivaroxaban (Xarelto): 15mg BID × 21d → 20mg daily
   - Edoxaban/Dabigatran: require 5-10 days of parenteral therapy first (use only after LMWH)
   - GFR considerations: rivaroxaban avoid if CrCl <30; apixaban preferred in renal disease
   
2. LMWH (enoxaparin): preferred in pregnancy (DOACs contraindicated), cancer-associated VTE (although DOACs now acceptable for most cancers per newer evidence), antiphospholipid syndrome (warfarin preferred)

3. Warfarin: used with cancer (LMWH superior for cancer VTE), APS, mechanical valves; INR target 2.0-3.0

DURATION:
- Provoked VTE (reversible risk factor: surgery, immobilization, estrogen): 3 months → no extended therapy if risk factor removed
- Unprovoked DVT/PE (first episode): minimum 3 months; consider extended therapy (indefinitely) based on bleeding risk vs. recurrence risk
  → Male sex, proximal DVT, PE (vs. DVT alone) favor extended therapy
  → Extended: apixaban 2.5mg BID OR rivaroxaban 10mg daily (reduced-dose regimens after 6 months)
- Cancer-associated VTE: indefinitely while cancer active or on chemotherapy

MASSIVE/SUBMASSIVE PE:
- Massive PE (hemodynamic instability): systemic thrombolysis (tPA alteplase 100mg IV × 2h) if no contraindications; catheter-directed thrombolysis if absolute contraindications to systemic tPA
- Submassive PE (RV dysfunction, elevated troponin/BNP but hemodynamically stable): anticoagulate + monitor; thrombolysis only if deteriorating

INFERIOR VENA CAVA (IVC) FILTER: only if anticoagulation absolutely contraindicated; not superior to anticoagulation alone; retrievable filters preferred`,
    url: "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines",
  },

  {
    source: "NHLBI/ASH",
    tier: 2,
    guideline_title: "NHLBI Evidence-Based Management of Sickle Cell Disease",
    guideline_year: "2022",
    abfm_domain: "Hematology & Oncology",
    section: "Sickle Cell Disease Complications, Hydroxyurea, and Acute Management",
    content: `Sickle Cell Disease (SCD) — NHLBI/ASH Guidelines 2022:

PATHOPHYSIOLOGY: HbSS most common and severe; HbSC, HbS/beta-thalassemia also symptomatic; HbAS (trait) — generally asymptomatic but can have complications with extreme conditions

SCREENING: Newborn blood spot screening — mandatory in all 50 states

HYDROXYUREA — Cornerstone of SCD management:
- Indication: ALL patients with HbSS or HbS/beta0-thalassemia ≥9 months (NHLBI 2022 — not just recurrent crisis)
- Mechanism: increases HbF, reduces HbS polymerization; decreases adhesion molecules, leukocyte count
- Starting dose: 15-20 mg/kg/day; titrate by 5 mg/kg/day q8 weeks to maximum tolerated dose (max ~35 mg/kg/day)
- Goal: ANC 2,000-4,000, HbF increase >15-20%, no significant cytopenias
- Benefit: reduces VOC frequency by 44%, ACS by 50%, hospitalizations, transfusions, stroke risk, and mortality
- Monitoring: CBC q4 weeks; hold if ANC <2,000 or platelets <80,000

VASO-OCCLUSIVE CRISIS (VOC) MANAGEMENT:
- Pain severity: titrate opioids based on pain scale; do NOT under-treat
- IV hydration: isotonic saline; correct dehydration
- Parenteral opioids: morphine or hydromorphone IV/SQ; PCA pump preferred for frequent admissions
- Ketorolac: adjunct (limit to 5 days); avoid NSAIDs long-term (renal toxicity)
- Incentive spirometry: prevents ACS in all hospitalized SCD patients
- Hospital discharge: adequate oral opioid prescription, follow-up within 2-3 days

ACUTE CHEST SYNDROME (ACS): new infiltrate + fever, chest pain, cough, hypoxia — leading cause of death:
- Supplemental O2, incentive spirometry, bronchodilators, empiric antibiotics (CAP coverage + atypical), exchange transfusion if severe (preferred over simple transfusion)

STROKE: primary prevention with transcranial Doppler (TCD) screening annually age 2-16; if elevated velocity → prophylactic transfusion program; if stroke → exchange transfusion then chronic transfusion

CHRONIC TRANSFUSION: target HbS <30% for primary/secondary stroke prevention; iron chelation required (deferoxamine, deferasirox) to prevent iron overload

CRIZANLIZUMAB (Adakveo): anti-P-selectin monoclonal antibody; IV monthly; reduces VOC frequency by 45%

VOXELOTOR (Oxbryta): increases HbO2 affinity; reduces hemolysis; FDA-approved for hemoglobin improvement

PENICILLIN PROPHYLAXIS: ALL patients with HbSS from birth until age 5 (some centers until age 10); pneumococcal vaccines (PCV15 and PPSV23) mandatory

BONE MARROW TRANSPLANT: curative; best outcomes in children with HLA-matched sibling; gene therapy emerging as curative option`,
    url: "https://www.nhlbi.nih.gov/health-topics/sickle-cell-disease",
  },

  // ========== MULTISYSTEM — EXPANDED ==========

  {
    source: "SCCM/ESICM",
    tier: 2,
    guideline_title: "Surviving Sepsis Campaign International Guidelines",
    guideline_year: "2021",
    abfm_domain: "Multisystem & Other",
    section: "Sepsis-3 Definition, Diagnosis, and 1-Hour Bundle",
    content: `Sepsis Management — Surviving Sepsis Campaign 2021 / Sepsis-3 Definition:

SEPSIS-3 DEFINITIONS (2016, still current):
- Sepsis: life-threatening organ dysfunction caused by dysregulated host response to infection
  → SOFA score ≥2 points (or increase from baseline) with suspected infection
  → qSOFA (quick SOFA, bedside screen): altered mentation, RR ≥22/min, SBP ≤100 mmHg — ≥2 of 3 = high risk
- Septic shock: sepsis + vasopressor requirement to maintain MAP ≥65 mmHg + serum lactate >2 mmol/L (18 mg/dL) despite adequate fluid resuscitation; mortality >40%
- SIRS criteria no longer defines sepsis (too non-specific)

ORGAN DYSFUNCTION (SOFA score components): PaO2/FiO2 ratio, GCS, MAP/vasopressors, bilirubin, creatinine, platelets

1-HOUR BUNDLE (SSC 2021):
1. Measure lactate; re-measure if initial >2 mmol/L
2. Blood cultures BEFORE antibiotics (≥2 sets)
3. Broad-spectrum antibiotics within 1 hour (goal immediately upon recognition)
4. 30 mL/kg IV crystalloid for hypotension OR lactate ≥4 mmol/L
5. Vasopressors if MAP <65 mmHg despite fluids: norepinephrine first-line

ANTIBIOTIC SELECTION:
- Community-onset: broad-spectrum; empiric coverage for MRSA if high risk (vancomycin), gram-negatives, and source-directed
- Healthcare/hospital-onset: anti-pseudomonal coverage (piperacillin-tazobactam, meropenem); add vancomycin for MRSA risk
- De-escalate: once culture results available; procalcitonin-guided de-escalation (reduces duration without harm)
- Target duration: 7-10 days for most infections; shorter durations validated for CAP, UTI, peritonitis

HEMODYNAMIC TARGETS:
- MAP ≥65 mmHg (first target); norepinephrine first-line vasopressor; vasopressin add-on (0.03-0.04 units/min) to spare norepinephrine
- Dopamine: NOT preferred (more arrhythmias); reserve for bradycardia
- Epinephrine: add-on or substitute if norepinephrine insufficient; causes tachycardia, hyperglycemia, lactic acidosis
- Dobutamine: add for persistent hypoperfusion with low CO despite adequate MAP

CORTICOSTEROIDS: IV hydrocortisone 200mg/day (50mg q6h) only for septic shock not responsive to fluids + vasopressors; reduces vasopressor requirement, duration of shock; no mortality benefit (APROCCHSS/ADRENAL trials)

GLUCOSE CONTROL: target 140-180 mg/dL; avoid hypoglycemia; insulin infusion protocol in ICU

LUNG PROTECTIVE VENTILATION (for ARDS complicating sepsis): tidal volume 6 mL/kg IBW; plateau pressure <30 cmH2O; PEEP per ARDSNet table; prone positioning ≥16h/day if PaO2/FiO2 <150`,
    url: "https://www.sccm.org/SurvivingSepsisCampaign/Guidelines/Adult-Patients",
  },

  {
    source: "SCCM/AGS",
    tier: 2,
    guideline_title: "SCCM/AGS Clinical Practice Guidelines for Delirium in Critically Ill Patients",
    guideline_year: "2018",
    abfm_domain: "Multisystem & Other",
    section: "Delirium Recognition, Prevention, and Management",
    content: `Delirium — SCCM/AGS Guidelines (PADIS 2018 + hospital delirium):

DEFINITION: Acute change in mental status characterized by: (1) disturbance in attention and awareness, (2) additional disturbance in cognition (memory, orientation, language, perception), (3) develops acutely and fluctuates, (4) not explained by pre-existing neurocognitive disorder

TYPES:
- Hyperactive: agitation, combativeness, pulling at lines/tubes (~25%)
- Hypoactive: withdrawal, somnolence, reduced responsiveness — often MISSED; worse prognosis (~50%)
- Mixed (~25%)

DIAGNOSIS TOOLS:
- CAM (Confusion Assessment Method): STANDARD; requires: (1) acute onset + fluctuating course AND (2) inattention AND either (3) disorganized thinking OR (4) altered level of consciousness
  → CAM-ICU: validated for nonverbal ICU patients using features A, B, C, D; bedside assessment with picture tests
- 4AT scale: quick bedside screen (Alert, Abbreviated Mental Test-4, Attention, Acute change)

ABCDEF BUNDLE (ICU prevention):
A — Assess, prevent, and manage Pain
B — Both SAT (spontaneous awakening trial) and SBT (spontaneous breathing trial) daily
C — Choice of analgesia and sedation (minimize benzodiazepines; use propofol or dexmedetomidine instead)
D — Delirium: assess, prevent, and manage
E — Early mobility and Exercise
F — Family engagement and empowerment

PREVENTION (strongly evidence-based):
- Non-pharmacologic FIRST: reorientation (clocks, windows, lighting cycles), mobilization, hearing aids/glasses, hydration/nutrition, sleep hygiene, cognitive stimulation
- AVOID: benzodiazepines (strong risk factor for delirium), restraints, bladder catheters, polypharmacy, Beers Criteria medications

PHARMACOLOGIC MANAGEMENT (symptoms only, NOT to treat):
- Antipsychotics: haloperidol 0.5-1mg (NOT routinely recommended to reduce delirium duration per SCCM 2018; use sparingly for safety)
- Quetiapine: off-label for agitation; associated with QTc prolongation; avoid if QTc >450ms
- Dexmedetomidine: preferred sedative in ICU to prevent delirium vs. benzodiazepines (less delirium, facilitates weaning)
- Melatonin/ramelteon: low-dose melatonin 0.5-3mg QHS for sleep-wake cycle regulation; evidence emerging

HOSPITAL DELIRIUM RISK FACTORS (non-ICU): age >65, dementia, prior delirium, visual/hearing impairment, dehydration, immobility, Foley catheter, multiple medications, pain, sleep deprivation, surgery

OUTCOMES: delirium is associated with prolonged mechanical ventilation, ICU/hospital LOS, cognitive impairment, functional decline, and mortality`,
    url: "https://www.sccm.org/Clinical-Resources/Guidelines/Guidelines/Guidelines-for-the-Prevention-and-Management-of-Pa",
  },

  // ========== MUSCULOSKELETAL — EXPANDED ==========

  {
    source: "ACR",
    tier: 2,
    guideline_title: "ACR Guideline for the Management of Gout",
    guideline_year: "2020",
    abfm_domain: "Musculoskeletal",
    section: "Gout Diagnosis, Acute Flare Management, and Urate-Lowering Therapy",
    content: `Gout — ACR 2020 Clinical Practice Guidelines:

DIAGNOSIS:
- Gold standard: joint aspiration with monosodium urate (MSU) crystals — needle-shaped, negatively birefringent under polarized light
- Clinical diagnosis acceptable if classic presentation (podagra in first MTP joint, rapid onset, erythema, warmth) + hyperuricemia
- Imaging: ultrasound (double contour sign, tophi), dual-energy CT (DECT) — confirms urate deposits without aspiration

ACUTE GOUT FLARE MANAGEMENT (anti-inflammatory):
FIRST-LINE (any one):
1. NSAIDs (full anti-inflammatory dose): indomethacin 50mg TID, naproxen 500mg BID; avoid with CKD, peptic ulcer
2. Colchicine: 1.2mg loading → 0.6mg 1 hour later (low-dose superior to high-dose per AGREE trial, fewer GI effects); then 0.6mg QD-BID; start within 36 hours of flare
3. Glucocorticoids: prednisone 30-40mg/day × 5 days (if NSAIDs/colchicine contraindicated)

KEY: start within 24 hours of flare for best response; combination therapy (e.g., colchicine + NSAID) if inadequate mono response

URATE-LOWERING THERAPY (ULT) — TREAT TO TARGET:
INDICATION: ≥2 gout flares/year OR tophi OR urate nephrolithiasis OR CKD stage 3+ with gout (regardless of frequency)
TARGET: serum uric acid (SUA) <6 mg/dL; <5 mg/dL if tophi (to dissolve deposits)

FIRST-LINE: allopurinol (xanthine oxidase inhibitor)
- Start: 100mg/day; titrate by 100mg q2-5 weeks to target SUA
- Maximum: 800mg/day (renally adjusted); typical effective dose 300-400mg/day
- HLA-B*5801 screening before allopurinol in Asian/Pacific Islander descent (risk of severe hypersensitivity — DRESS, SJS/TEN)
- Common error: starting ULT without anti-inflammatory prophylaxis → triggers flare

ALTERNATIVE: febuxostat (Uloric) — more expensive; FDA warning for CV mortality (restrict to allopurinol failures)

PROBENECID: uricosuric; second-line; avoid with eGFR <30 or nephrolithiasis history

PROPHYLAXIS during ULT initiation (6 months minimum or until SUA at target × 6 months):
- Colchicine 0.6mg QD-BID (preferred) OR low-dose NSAID daily OR low-dose prednisone

LIFESTYLE: low-purine diet (limit red meat, organ meats, shellfish, alcohol, fructose-sweetened beverages); weight loss; increase dairy; cherry consumption (modest effect); hydration

AVOID in gout patients: thiazide diuretics (increase uric acid), low-dose aspirin (reduce UA excretion), cyclosporine, pyrazinamide (all raise uric acid)`,
    url: "https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Gout",
  },

  {
    source: "AAOS",
    tier: 2,
    guideline_title: "AAOS Clinical Practice Guideline: Rotator Cuff Injuries",
    guideline_year: "2019",
    abfm_domain: "Musculoskeletal",
    section: "Shoulder Pain and Rotator Cuff Tear Diagnosis and Management",
    content: `Shoulder Pain and Rotator Cuff Disease — AAOS 2019 Guideline:

ANATOMY: Rotator cuff = 4 muscles (SITS): Supraspinatus (most commonly torn), Infraspinatus, Teres minor, Subscapularis

DIAGNOSIS:
Clinical examination:
- Neer sign: forward flexion with shoulder internally rotated (subacromial impingement) — sensitivity 79%, specificity 53%
- Hawkins-Kennedy test: shoulder forward flexed 90° + internal rotation (impingement) — sensitivity 79%, specificity 59%
- Empty can (Jobe test): shoulder abducted 90°, forward flexed 30°, thumbs pointing down (supraspinatus) — sensitivity 69-89%
- Drop arm test: inability to lower arm slowly from 90° abduction → full-thickness tear; high specificity
- External rotation lag sign: full-thickness infraspinatus tear
- Belly press test: subscapularis integrity

Imaging:
- X-ray: first-line (AC joint, calcifications, acromial morphology, arthritis); may show superior humeral head migration in massive tear
- MRI: gold standard for rotator cuff tears (full vs. partial, muscle atrophy, tendon retraction)
- Ultrasound: dynamic; equivalent sensitivity/specificity to MRI for full-thickness tears in experienced hands; less expensive, accessible

CLASSIFICATION: Partial-thickness (50% tendon involved → consider surgical repair
- Full-thickness tear: small (<1cm), medium (1-3cm), large (3-5cm), massive (>5cm)

TREATMENT:
Conservative (first-line for most):
- PT × 6-12 weeks: rotator cuff strengthening, scapular stabilization, postural training
- NSAIDs: pain control
- Subacromial corticosteroid injection: short-term pain relief (strongest evidence for 4-6 weeks); limit to 3-4 per year; no evidence for tissue-healing benefit; may weaken tendon if surgical repair planned

Surgical (arthroscopic rotator cuff repair):
- Indications: failed conservative therapy × 3-6 months; acute full-thickness tear after trauma; large tear with progressive weakness; young active patient with full-thickness tear
- Outcomes: best in smaller tears, younger patients, early surgery (before muscle atrophy/fatty infiltration)

RETURN TO ACTIVITY: after surgery: passive ROM 6 weeks → active ROM 12 weeks → strengthening 4-6 months → return to overhead activity 6-12 months`,
    url: "https://www.aaos.org/quality/quality-programs/upper-extremity-programs/rotator-cuff-injuries/",
  },

  // ========== v7 ADDITIONS: TOP-100 FM GAP COVERAGE ==========

  // ── CARDIOVASCULAR ──

  {
    source: "ACC/AHA",
    tier: 1,
    guideline_title: "2022 AHA/ACC Guideline for the Diagnosis and Management of Patients with Chest Pain (NSTEMI/STEMI Management)",
    guideline_year: "2022",
    abfm_domain: "Cardiovascular",
    section: "STEMI and NSTEMI Acute Management",
    content: `NSTEMI / Unstable Angina Management (ACC/AHA 2022):
ANTIPLATELET THERAPY:
- Aspirin 324 mg immediately (loading dose), then 81 mg daily indefinitely
- P2Y12 inhibitor (add to aspirin — DAPT):
  • Ticagrelor 180 mg load → 90 mg BID (preferred over clopidogrel; reduces mortality)
  • Clopidogrel 600 mg load → 75 mg daily (if ticagrelor not tolerated or on anticoagulation)
  • Prasugrel: only after coronary anatomy known (avoid if prior TIA/stroke, age ≥75, weight <60 kg)
- DAPT duration: at least 12 months post-ACS in most patients; shorter (3-6 mo) if high bleeding risk

ANTICOAGULATION:
- UFH: initial choice if catheterization planned imminently
- Enoxaparin: 1 mg/kg SQ q12h; equivalent or superior to UFH; continue through PCI
- Fondaparinux: alternative if bleeding risk high; cannot be sole anticoagulant at PCI (add UFH)
- Bivalirudin: option at time of PCI if high bleeding risk

INVASIVE STRATEGY (PCI TIMING):
- Immediate (<2h): refractory angina, hemodynamic instability, recurrent arrhythmia
- Early invasive (<24h): GRACE risk score >140, dynamic ECG changes, elevated troponin
- Delayed invasive (24-72h): stable intermediate-risk patients
- Conservative (no angiography): low-risk; women with nonspecific findings; preference-based

STEMI:
- Primary PCI preferred if door-to-balloon ≤90 min (first medical contact ≤120 min)
- Fibrinolysis if PCI unavailable and symptom onset <12h: alteplase or tenecteplase; contraindicated with prior ICH, recent stroke, active bleeding, aortic dissection
- Anticoagulation: UFH or enoxaparin during fibrinolysis

POST-ACS MEDICATIONS (Class I):
- Beta-blocker (metoprolol): initiate within 24h if no HF, shock, or bradycardia; continue indefinitely
- High-intensity statin (atorvastatin 40-80 mg or rosuvastatin 20-40 mg): start before discharge
- ACE inhibitor or ARB: EF ≤40%, anterior MI, hypertension, or diabetes — start within 24h
- Eplerenone/spironolactone: EF ≤40% with symptomatic HF or diabetes already on ACEi + BB`,
    url: "https://www.jacc.org/doi/10.1016/j.jacc.2021.07.053",
  },

  {
    source: "AHA/ASA",
    tier: 1,
    guideline_title: "2019 AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke",
    guideline_year: "2019",
    abfm_domain: "Neurology",
    section: "Acute Ischemic Stroke Treatment",
    content: `ACUTE ISCHEMIC STROKE — AHA/ASA 2019:

RECOGNITION: FAST acronym (Face drooping, Arm weakness, Speech difficulty, Time to call 911)
Cincinnati Prehospital Stroke Scale: facial droop, arm drift, speech; positive = 72% probability of stroke

IV THROMBOLYSIS — tPA (Alteplase):
ELIGIBLE: ischemic stroke with disabling deficits, onset <4.5 hours, no contraindications
- Dose: 0.9 mg/kg IV (max 90 mg); 10% bolus over 1 min, remainder over 60 min
- Extended window (3.0-4.5h): avoid if age >80, on anticoagulant, NIHSS >25, hx both DM + prior stroke, imaging >1/3 MCA territory
Contraindications: prior ICH, intracranial neoplasm/AVM, recent (3 mo) head trauma/stroke/surgery, active internal bleeding, BP >185/110 refractory to treatment, platelets <100K, INR >1.7, use of direct thrombin inhibitors or Xa inhibitors within 48h

BLOOD PRESSURE MANAGEMENT:
- If receiving tPA: BP <185/110 before; maintain <180/105 after
- If not tPA eligible: allow permissive hypertension (treat only if >220/120 or end-organ damage)
- Nicardipine or labetalol IV for BP lowering

MECHANICAL THROMBECTOMY (Endovascular):
- Indication: LVO (ICA, MCA M1/M2), NIHSS ≥6, ASPECTS ≥6, onset <6 hours (selected patients up to 24h with perfusion imaging)
- Target door-to-puncture: ≤60 min
- Can be performed with or without tPA (if tPA eligible, give both)

ACUTE MANAGEMENT:
- Oxygen: maintain SaO2 ≥94%; avoid supplemental O2 if normoxic (no benefit)
- Glucose: treat hyperglycemia (>180 mg/dL); avoid hypoglycemia
- Fever: treat with acetaminophen; target normothermia
- Aspirin 325 mg within 24-48h (after ruling out hemorrhage and if no tPA in last 24h)

SECONDARY PREVENTION:
- Non-cardioembolic stroke: aspirin, aspirin + dipyridamole, or clopidogrel (all equivalent)
- Cardioembolic stroke (AF): anticoagulation (DOAC preferred over warfarin)
- High-risk TIA/minor stroke: dual antiplatelet (aspirin + clopidogrel) x 21 days then single agent`,
    url: "https://www.ahajournals.org/doi/10.1161/STR.0000000000000211",
  },

  // ── INFECTIOUS DISEASE ──

  {
    source: "AASLD",
    tier: 1,
    guideline_title: "AASLD Practice Guidance: Hepatitis B Virus Infection (2023)",
    guideline_year: "2023",
    abfm_domain: "Gastroenterology",
    section: "Hepatitis B Diagnosis, Monitoring, and Antiviral Treatment",
    content: `HEPATITIS B VIRUS (HBV) — AASLD 2023:

SEROLOGIC INTERPRETATION:
- HBsAg+, anti-HBc+, anti-HBs-: active (chronic) infection
- HBsAg-, anti-HBc+, anti-HBs+: prior infection, immune
- HBsAg-, anti-HBc-, anti-HBs+: vaccinated, immune
- HBsAg+, HBeAg+, high HBV DNA: immune tolerant or HBeAg+ chronic hepatitis B
- HBsAg+, HBeAg-, HBV DNA detectable: HBeAg- chronic hepatitis B (anti-HBe+)

PHASES OF CHRONIC HBV:
1. Immune tolerant: HBeAg+, very high viral load, normal ALT, minimal fibrosis — treatment generally deferred
2. Immune active (HBeAg+): elevated ALT, HBV DNA >20,000 IU/mL → TREAT
3. Inactive carrier: HBsAg+, HBeAg-, HBV DNA <2,000 IU/mL, normal ALT — monitor
4. HBeAg-negative CHB: HBV DNA >2,000 IU/mL, elevated ALT → TREAT

TREATMENT INDICATIONS (Class I):
- HBeAg+ or HBeAg- CHB with HBV DNA >2,000 IU/mL AND elevated ALT (>ULN)
- Compensated cirrhosis: treat if HBV DNA detectable (any level)
- Decompensated cirrhosis: treat regardless of HBV DNA level
- Immunosuppression (chemotherapy, rituximab, steroids): prophylaxis to prevent reactivation

FIRST-LINE ANTIVIRAL THERAPY:
- Tenofovir alafenamide (TAF) 25 mg daily: preferred (less renal/bone toxicity than TDF)
- Tenofovir disoproxil fumarate (TDF) 300 mg daily: effective alternative; monitor renal function/bone density
- Entecavir 0.5 mg daily: high barrier to resistance; dose 1 mg if lamivudine-experienced
- Pegylated interferon alfa-2a: finite duration (48 wks); HBeAg seroconversion possible; avoid in decompensated disease
- Avoid lamivudine, adefovir as first-line (high resistance rates)

MONITORING:
- LFTs, HBV DNA q3-6 months; HBeAg/anti-HBe annually if HBeAg+
- HCC surveillance: ultrasound +/- AFP q6 months if cirrhosis or high-risk ethnicity/family history (Asian males ≥40, Asian females ≥50, Africans ≥20, all cirrhotic)
- Treatment endpoint: HBeAg+ → HBeAg seroconversion + HBV DNA undetectable → continue ≥12 months then consider stopping; HBeAg- → indefinite therapy (relapse common on cessation)`,
    url: "https://www.aasld.org/publications/practice-guidelines",
  },

  {
    source: "AASLD-IDSA",
    tier: 1,
    guideline_title: "HCV Guidance: Recommendations for Testing, Managing, and Treating Hepatitis C (2023)",
    guideline_year: "2023",
    abfm_domain: "Gastroenterology",
    section: "Hepatitis C Screening, Diagnosis, and Direct-Acting Antiviral Treatment",
    content: `HEPATITIS C VIRUS (HCV) — AASLD-IDSA 2023:

SCREENING:
- USPSTF Grade B: screen all adults 18-79 (universal one-time screen)
- Repeat annually: persons who inject drugs, HIV-positive, incarcerated individuals
- Test: anti-HCV antibody; if reactive → HCV RNA (qualitative or quantitative)

DIAGNOSIS:
- Anti-HCV+, HCV RNA+: active infection → treat
- Anti-HCV+, HCV RNA-: resolved infection (retest in 6 months if recent exposure)
- Staging: FIB-4 score (age x AST / PLT x sqrt-ALT) — <1.3 low fibrosis; ≥2.67 advanced

TREATMENT APPROACH ("Treat All"):
- Treat ALL patients with chronic HCV regardless of fibrosis stage
- Goal: SVR12 (undetectable HCV RNA 12 weeks post-treatment) = virologic cure in >97%

PANGENOTYPIC PREFERRED REGIMENS:
1. Sofosbuvir/velpatasvir (Epclusa): 12 weeks for all genotypes 1-6; SVR >95%
2. Glecaprevir/pibrentasvir (Mavyret): 8 weeks GT 1-6 without cirrhosis (treatment-naive); 12 weeks with compensated cirrhosis; SVR >97%
3. Sofosbuvir/velpatasvir/voxilaprevir (Vosevi): 12 weeks for previously treated patients

SPECIAL POPULATIONS:
- Decompensated cirrhosis: sofosbuvir/velpatasvir +/- low-dose ribavirin (avoid NS3/4A protease inhibitors)
- CKD stage 4-5/dialysis: glecaprevir/pibrentasvir preferred (renal-safe)
- HIV/HCV coinfection: same regimens; check drug interactions with ART

POST-SVR MONITORING:
- HCC surveillance: continue q6 months indefinitely if advanced fibrosis (F3-F4) or cirrhosis
- Retest if re-exposure risk continues (reinfection possible)`,
    url: "https://www.hcvguidelines.org",
  },

  {
    source: "IDSA",
    tier: 1,
    guideline_title: "IDSA Clinical Practice Guideline for Acute Bacterial Rhinosinusitis in Children and Adults (2012)",
    guideline_year: "2012",
    abfm_domain: "Pulmonary",
    section: "Acute Bacterial Rhinosinusitis Diagnosis and Management",
    content: `ACUTE RHINOSINUSITIS — IDSA 2012:

DISTINGUISHING VIRAL FROM BACTERIAL:
Criteria favoring bacterial (ABRS) — ANY ONE of:
1. Persistent symptoms ≥10 days without improvement
2. Severe symptoms: purulent nasal discharge + facial pain/pressure for ≥3-4 consecutive days
3. Worsening after initial improvement (double sickening — bacterial superinfection)

DIAGNOSIS: Clinical — routine sinus imaging NOT recommended for uncomplicated ABRS.
CT sinus: reserve for complications (orbital cellulitis, meningitis, cavernous sinus thrombosis) or failure of therapy.

TREATMENT:
- First-line: Amoxicillin-clavulanate (augmentin) 500/125 mg TID or 875/125 mg BID x 5-7 days adults; 10-14 days children
  → Preferred over amoxicillin alone (higher rates of resistant organisms)
- Penicillin allergy: doxycycline or respiratory fluoroquinolone (levofloxacin 500 mg/d x 5-7 days)
- TMP-SMX and macrolides: NOT recommended (high resistance rates)

ADJUNCTIVE THERAPY:
- Nasal saline irrigation: symptom relief
- Intranasal corticosteroid: modest benefit (reduces mucosal edema)
- Decongestants (oxymetazoline): no more than 3 days (rhinitis medicamentosa risk)
- Antihistamines: NOT recommended (thicken secretions)

COMPLICATIONS (require urgent evaluation):
- Orbital: preseptal/periorbital cellulitis, orbital abscess (proptosis, ophthalmoplegia)
- Intracranial: meningitis, epidural/subdural abscess, cavernous sinus thrombosis`,
    url: "https://academic.oup.com/cid/article/54/8/e72/365169",
  },

  {
    source: "IDSA",
    tier: 1,
    guideline_title: "IDSA Clinical Practice Guideline for Diagnosis and Management of Group A Streptococcal Pharyngitis (2012)",
    guideline_year: "2012",
    abfm_domain: "Infectious Disease",
    section: "Acute Pharyngitis — Group A Streptococcus Diagnosis and Treatment",
    content: `ACUTE PHARYNGITIS — IDSA 2012:

ETIOLOGY: ~90% viral; GAS (Group A Streptococcus) = 5-15% adults, 20-30% children.
Goal: identify GAS to treat and prevent acute rheumatic fever (ARF).

CENTOR / McISAAC SCORE:
Criteria (each = 1 point):
+ Tonsillar exudate
+ Tender anterior cervical adenopathy
+ Fever (history or ≥38°C)
+ Absence of cough
+ Age 3-14 (add 1 point), 15-44 (0 points), ≥45 (subtract 1 point)

Interpretation:
- ≤1: GAS very unlikely — no testing, no antibiotics
- 2-3: Rapid antigen detection test (RADT) — treat only if positive
- ≥4: Empirical antibiotic treatment acceptable without testing

TESTING:
- RADT (rapid strep test): sensitivity 70-90%, specificity >95%; negative RADT in children → throat culture
- Adults: culture not routinely required if RADT negative

ANTIBIOTIC TREATMENT (when GAS confirmed):
- First-line: Amoxicillin 500 mg BID or 250 mg TID x 10 days
  OR Penicillin V 250 mg TID or 500 mg BID x 10 days
- Penicillin allergy (non-anaphylactic): cephalexin 500 mg BID x 10 days
- Anaphylactic penicillin allergy: azithromycin 500 mg day 1 then 250 mg x 4 days OR clindamycin 300 mg TID x 10 days
- Do NOT use TMP-SMX (ineffective for GAS)

FULL 10-DAY COURSE required to prevent acute rheumatic fever (ARF).

INFECTIOUS MONONUCLEOSIS (EBV):
- Positive monospot; atypical lymphocytes; splenomegaly
- Avoid ampicillin/amoxicillin (diffuse maculopapular rash)
- Restrict contact sports x 3-4 weeks (splenic rupture risk)
- Steroid: only for airway obstruction or severe thrombocytopenia`,
    url: "https://academic.oup.com/cid/article/55/10/e86/321183",
  },

  {
    source: "IDSA/ACIP",
    tier: 1,
    guideline_title: "IDSA Clinical Practice Guideline for Seasonal Influenza; ACIP Influenza Vaccination Recommendations (2024)",
    guideline_year: "2024",
    abfm_domain: "Infectious Disease",
    section: "Influenza Diagnosis, Treatment, and Chemoprophylaxis",
    content: `INFLUENZA — IDSA/ACIP 2024:

DIAGNOSIS:
- Clinical: abrupt onset fever, myalgia, headache, malaise, nonproductive cough, sore throat, rhinitis
- Rapid influenza diagnostic test (RIDT): sensitivity 50-70%; negative does not rule out in high-risk
- Rapid molecular assay (ID NOW, Cobas): sensitivity >90%; preferred if available
- PCR: gold standard; reserve for hospitalized/immunocompromised

ANTIVIRAL TREATMENT — treat within 48 hours of symptom onset for maximum benefit:

HIGH-RISK populations requiring treatment (regardless of duration):
- Hospitalized patients (start empirically — don't wait for testing)
- Age ≥65, chronic lung/cardiac/renal/hepatic/metabolic disease, immunocompromised, BMI ≥40, pregnancy/postpartum, nursing home residents

ANTIVIRAL OPTIONS:
- Oseltamivir (Tamiflu) 75 mg BID x 5 days: first-line oral; reduce to 75 mg/day if GFR <30
- Zanamivir (Relenza) 10 mg inhaled BID x 5 days: avoid in COPD/asthma (bronchospasm)
- Baloxavir marboxil (Xofluza): 40 mg single dose (≤80 kg) or 80 mg (>80 kg); not for complicated/severe or immunocompromised
- Peramivir 600 mg IV x 1 dose: hospitalized patients unable to tolerate oral

CHEMOPROPHYLAXIS:
- Oseltamivir 75 mg daily x 7 days post-exposure (high-risk household contacts, healthcare outbreaks)
- NOT a substitute for annual vaccination

VACCINATION:
- Annual universal recommendation ≥6 months
- High-dose (Fluzone HD), adjuvanted (FLUAD), or recombinant (Flublok) preferred for adults ≥65`,
    url: "https://www.idsociety.org/practice-guideline/influenza/",
  },

  // ── ENDOCRINE ──

  {
    source: "ATA",
    tier: 1,
    guideline_title: "American Thyroid Association Guidelines for Diagnosis and Management of Hyperthyroidism (2016)",
    guideline_year: "2016",
    abfm_domain: "Endocrine & Metabolic",
    section: "Hyperthyroidism — Graves Disease, Toxic Nodular Goiter, and Thyroid Storm",
    content: `HYPERTHYROIDISM — ATA 2016:

ETIOLOGY:
- Graves disease: most common (autoimmune; TSH receptor antibodies — TRAb/TSHR-Ab)
- Toxic multinodular goiter: autonomous nodules; older patients
- Toxic adenoma: single autonomously functioning nodule; scan shows "hot nodule"
- Subacute thyroiditis: transient hyperthyroidism; tender thyroid; elevated ESR; low radioiodine uptake

DIAGNOSIS:
- TSH suppressed (<0.1 mU/L) + elevated free T4 and/or free T3
- Overt: low TSH + elevated FT4/FT3
- Subclinical: low TSH + normal FT4/FT3 — treat if TSH persistently <0.1 + cardiac risk or osteoporosis
- TRAb: positive in Graves (sensitivity 95%); avoids need for scan if classic presentation
- Radioiodine uptake and scan: Graves (diffuse uptake) vs toxic nodule (focal) vs thyroiditis (low uptake)

TREATMENT OPTIONS FOR GRAVES DISEASE (3 options):

1. Radioactive Iodine (RAI/I-131):
   - Preferred for most adults; >80% achieve euthyroid or hypothyroid state
   - Hypothyroidism expected in >80% (requires levothyroxine lifelong)
   - Contraindicated: pregnancy, breastfeeding, active thyroid eye disease (worsens orbitopathy)
   - Pre-treat with methimazole if symptomatic, elderly, cardiac disease; stop 5-7 days before RAI

2. Antithyroid Drugs (ATD):
   - Methimazole (MMI): preferred over PTU for most (once daily, less hepatotoxicity); 5-30 mg/day
   - PTU: use in first trimester pregnancy (MMI teratogenic), thyroid storm (blocks T4 to T3 conversion)
   - Duration: 12-18 months; remission in 50% after ATD withdrawal
   - Warn about agranulocytosis: sore throat + fever → stop ATD, check CBC immediately

3. Thyroidectomy:
   - Total preferred when: large goiter, coexisting thyroid cancer, severe ophthalmopathy, pregnancy (second trimester), patient preference

SYMPTOMATIC MANAGEMENT:
- Beta-blocker (propranolol 10-40 mg q6-8h or atenolol 25-100 mg/day): rapid symptom control (palpitations, tremor, heat intolerance)

THYROID STORM (life-threatening emergency):
- Signs: HR >140, fever, AMS, GI symptoms, markedly elevated thyroid hormones
- Treatment: PTU 500-1000 mg load then 250 mg q4h + Lugol's iodine (1h after PTU) + hydrocortisone 300 mg IV + propranolol IV + cooling; ICU care`,
    url: "https://www.liebertpub.com/doi/10.1089/thy.2016.0229",
  },

  {
    source: "ACOG/ADA",
    tier: 1,
    guideline_title: "ACOG Practice Bulletin: Gestational Diabetes Mellitus; ADA Standards of Care 2024",
    guideline_year: "2024",
    abfm_domain: "Women's Health",
    section: "Gestational Diabetes Mellitus — Screening, Diagnosis, and Management",
    content: `GESTATIONAL DIABETES MELLITUS (GDM) — ACOG/ADA 2024:

SCREENING (universal at 24-28 weeks):
Two-step approach (standard in US):
- Step 1: 50g glucose challenge test (GCT) — no fasting; 1-hr cutoff ≥130 or ≥140 mg/dL
- Step 2 (if GCT abnormal): 100g 3-hour OGTT; GDM if ≥2 values exceed Carpenter-Coustan:
  → Fasting ≥95 | 1h ≥180 | 2h ≥155 | 3h ≥140 mg/dL

One-step approach (IADPSG): 75g 2-hour OGTT; GDM if ANY value exceeded:
  → Fasting ≥92 | 1h ≥180 | 2h ≥153 mg/dL

Early screening for high-risk (prior GDM, BMI ≥35, prior macrosomia, strong family history T2DM): first trimester FPG or A1c

GLYCEMIC TARGETS IN GDM:
- Fasting: <95 mg/dL
- 1-hour postprandial: <140 mg/dL
- 2-hour postprandial: <120 mg/dL

MANAGEMENT:
1. Medical Nutrition Therapy (MNT): first-line; 175g carbohydrate/day minimum; complex carbs, evenly distributed
2. Physical activity: 30 min moderate activity most days
3. Glucose monitoring: fasting + postprandial minimum 4x/day

PHARMACOTHERAPY (if targets not met after 1-2 weeks MNT + activity):
- Insulin: first-line pharmacotherapy; titrate to glycemic targets
  • NPH + regular or insulin analogs (aspart, lispro, detemir): safe in pregnancy
- Metformin: acceptable alternative if patient refuses insulin (crosses placenta; reassuring infant data)
- Glyburide: largely abandoned (higher neonatal hypoglycemia, macrosomia)

FETAL MONITORING: US for estimated fetal weight; NST weekly if poorly controlled or on insulin

DELIVERY: Diet-controlled GDM → 40 weeks; insulin-requiring → 39-39.6 weeks

POSTPARTUM: 75g OGTT at 4-12 weeks (screen for T2DM); high lifetime T2DM risk (>50%); annual FPG or A1c`,
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/02/gestational-diabetes-mellitus",
  },

  // ── UROLOGY / MEN'S HEALTH ──

  {
    source: "AUA",
    tier: 1,
    guideline_title: "AUA Guideline on Erectile Dysfunction (2018, updated 2022)",
    guideline_year: "2022",
    abfm_domain: "Genitourinary",
    section: "Erectile Dysfunction Evaluation and Management",
    content: `ERECTILE DYSFUNCTION (ED) — AUA 2022:

DEFINITION: Consistent inability to attain/maintain penile erection sufficient for satisfactory sexual performance; prevalence 40% at age 40, 70% at age 70.

EVALUATION:
- Complete sexual, medical, and psychosocial history; IIEF questionnaire
- Labs: fasting glucose or HbA1c, lipid panel, morning total testosterone x 2 measurements
- Identify reversible causes: medications (beta-blockers, SSRIs, antipsychotics, 5-ARIs), alcohol/tobacco, performance anxiety, relationship issues, hypogonadism, CV disease, DM, HTN

CARDIOVASCULAR RISK STRATIFICATION (Princeton III):
- Low risk: sexual activity safe (stable CAD, controlled HTN, mild HF, compensated DM)
- Intermediate risk: cardiac evaluation before ED treatment
- High risk: defer (unstable angina, uncontrolled HTN, severe HF)

TREATMENT (stepwise):
1. LIFESTYLE MODIFICATION: exercise, weight loss, smoking cessation, reduce alcohol
2. PDE5 INHIBITORS (first-line pharmacotherapy):
   - Sildenafil 25-100 mg PRN 30-60 min before sex (max 1x/day; food reduces absorption)
   - Tadalafil 10-20 mg PRN or 2.5-5 mg daily (no food effect; duration 36h)
   - Vardenafil 5-20 mg PRN; Avanafil 50-200 mg PRN (fastest onset ~15 min)
   - ABSOLUTE CONTRAINDICATION: concurrent nitrate use (ANY nitrate — severe hypotension)
   - Caution: alpha-blocker combination (hypotension)
3. TESTOSTERONE REPLACEMENT: if documented hypogonadism + ED
4. INTRAURETHRAL ALPROSTADIL (MUSE): less effective than PDE5i
5. INTRACAVERNOSAL INJECTION: alprostadil combinations; effective when PDE5i fail
6. VACUUM ERECTION DEVICE: no medications; post-prostatectomy option
7. PENILE PROSTHESIS: surgical; refractory ED after less-invasive options fail`,
    url: "https://www.auanet.org/guidelines-and-quality/guidelines/erectile-dysfunction-guideline",
  },

  {
    source: "AUA/USPSTF",
    tier: 1,
    guideline_title: "AUA Early Detection of Prostate Cancer Guideline (2023); USPSTF Prostate Cancer Screening (2018)",
    guideline_year: "2023",
    abfm_domain: "Genitourinary",
    section: "Prostate Cancer Screening — PSA Shared Decision-Making",
    content: `PROSTATE CANCER SCREENING — AUA 2023 / USPSTF 2018:

USPSTF RECOMMENDATION (2018):
- Ages 55-69: GRADE C — offer PSA-based screening after SHARED DECISION-MAKING
- Ages ≥70: GRADE D — do NOT screen routinely (harms outweigh benefits)
- Ages <55: routine screening NOT recommended; offer to high-risk if discussing

AUA GUIDELINE 2023:
- Ages 40-54: baseline PSA for risk-stratification (not routine screening); offer to high-risk individuals
- Ages 55-69: shared decision-making; offer if patient understands harms
- Ages ≥70: routine screening NOT recommended

HIGH-RISK GROUPS (consider earlier/more frequent screening):
- African American men (2x higher incidence and mortality)
- First-degree relative with prostate cancer before age 65
- BRCA2 mutation carriers
- Lynch syndrome

SHARED DECISION-MAKING — discuss:
- Benefits: early detection, potential mortality reduction (ERSPC: 27% reduction; NNS = 781 to prevent 1 death)
- Harms: false positives (biopsy complications), overdiagnosis, treatment side effects (incontinence, ED)
- Adjunct tools if PSA elevated: PSA density, free/total PSA ratio, 4Kscore, PHI, mpMRI before biopsy (reduces unnecessary biopsies)

PSA INTERPRETATION:
- PSA gray zone 1-10 ng/mL: influenced by prostate volume (BPH), age, inflammation, recent ejaculation
- Rising PSA velocity or doubling time may be more concerning than absolute value`,
    url: "https://www.auanet.org/guidelines-and-quality/guidelines/prostate-cancer-early-detection-guideline",
  },

  // ── SLEEP MEDICINE ──

  {
    source: "AASM",
    tier: 1,
    guideline_title: "AASM Clinical Practice Guidelines for Chronic Insomnia Disorder in Adults (2017)",
    guideline_year: "2017",
    abfm_domain: "Psychiatry / Behavioral Health",
    section: "Chronic Insomnia — Evaluation, CBT-I, and Pharmacotherapy",
    content: `CHRONIC INSOMNIA — AASM 2017:

DEFINITION: Difficulty initiating or maintaining sleep, or early awakening; ≥3 nights/week, ≥3 months; causes daytime impairment.

EVALUATION:
- Sleep diary (2 weeks); ISI (Insomnia Severity Index)
- Rule out: OSA, RLS/PLMD, circadian rhythm disorder, depression/anxiety, substances (alcohol, caffeine, beta-blockers, steroids)
- Polysomnography: NOT routinely indicated; use if OSA or PLMD suspected

FIRST-LINE: Cognitive Behavioral Therapy for Insomnia (CBT-I) — STRONGLY RECOMMENDED
Components of CBT-I:
- Sleep restriction: limit time in bed to actual sleep time; gradually extend as efficiency improves
- Stimulus control: bed only for sleep and sex; get up if unable to sleep after 20 min
- Sleep hygiene: consistent wake time 7 days/week; avoid caffeine after 2pm; dark/cool/quiet; no screens 1 hour before
- Relaxation techniques: progressive muscle relaxation, mindfulness
- Cognitive restructuring: address catastrophic thoughts about sleep

PHARMACOTHERAPY (when CBT-I insufficient):
Dual orexin receptor antagonists (DORAs) — preferred for chronic insomnia (no dependence/fall risk):
- Suvorexant (Belsomra) 10-20 mg: FDA-approved; reduced rebound insomnia
- Lemborexant (Dayvigo) 5-10 mg: less residual sedation

Benzodiazepine receptor agonists ("Z-drugs"):
- Zolpidem 5-10 mg (women/elderly 5 mg — falls risk); for sleep onset/maintenance
- Eszopiclone (Lunesta) 1-3 mg: FDA-approved for sleep maintenance
- Zaleplon 5-10 mg: very short-acting; sleep onset only; safe for middle-of-night use

Antidepressants (low-dose):
- Doxepin 3-6 mg (Silenor): FDA-approved for insomnia maintenance
- Trazodone 25-100 mg: widely used off-label

Melatonin: primarily for circadian disorders; weak evidence for chronic insomnia
Ramelteon 8 mg: melatonin receptor agonist; no abuse potential

AVOID in elderly: benzodiazepines, diphenhydramine (Benadryl), TCAs (Beers Criteria)`,
    url: "https://aasm.org/resources/clinicalguidelines/041417.pdf",
  },

  // ── NEUROLOGY ──

  {
    source: "AAN/ADA",
    tier: 1,
    guideline_title: "AAN Practice Guideline on Diabetic Peripheral Neuropathy; ADA Standards of Care 2024",
    guideline_year: "2024",
    abfm_domain: "Neurology",
    section: "Diabetic Peripheral Neuropathy — Screening, Diagnosis, and Treatment",
    content: `DIABETIC PERIPHERAL NEUROPATHY (DPN) — AAN/ADA 2024:

PREVALENCE: ~50% of people with DM; most common = distal symmetric polyneuropathy (DSPN); leading cause of non-traumatic lower limb amputation.

SCREENING:
- Screen annually for DSPN: at DM diagnosis (Type 2), or 5 years after diagnosis (Type 1)
- Foot exam: inspect skin, pulses, 10g monofilament (protective sensation), 128 Hz tuning fork (vibration), ankle reflexes, pinprick, proprioception
- 10g monofilament insensitivity = loss of protective sensation → high ulcer/amputation risk

DIAGNOSIS:
- Clinical: stocking-glove distribution; burning, tingling, electric shock, allodynia (especially at night); numbness, loss of balance
- Differential: B12 deficiency, hypothyroidism, uremia, alcohol, metformin (depletes B12), monoclonal gammopathy

PREVENTION: Glycemic control most important — aggressive control slows progression (DCCT for T1DM)

PHARMACOTHERAPY FOR PAINFUL DPN:
- Duloxetine (Cymbalta) 60-120 mg/day: FDA-approved; NNT ~5; SNRI; also treats comorbid depression
- Pregabalin (Lyrica) 150-600 mg/day: FDA-approved; titrate; sedation, weight gain, edema
- Gabapentin 1800-3600 mg/day TID: off-label but widely used; titrate slowly; renal dose adjustment
- TCAs (amitriptyline, nortriptyline) 25-100 mg QHS: effective; low-cost; avoid in elderly, cardiac disease (QTc prolongation)
- Tapentadol ER: FDA-approved for DPN pain; reserve for refractory cases

FOOT CARE AND ULCER PREVENTION:
- Daily foot inspection; avoid barefoot walking
- Podiatry referral for high-risk feet; accommodative footwear
- Address coexisting peripheral arterial disease (PAD coexists in 30-50%)`,
    url: "https://www.neurology.org/doi/10.1212/WNL.0000000000004509",
  },

  {
    source: "AAN",
    tier: 1,
    guideline_title: "AAN Practice Guideline: Disease-Modifying Therapies for Adults with Multiple Sclerosis (2018)",
    guideline_year: "2018",
    abfm_domain: "Neurology",
    section: "Multiple Sclerosis — Diagnosis, Relapse Management, and Disease-Modifying Therapy",
    content: `MULTIPLE SCLEROSIS — AAN 2018:

DIAGNOSIS — McDonald Criteria (2017 revision):
- Requires: ≥2 attacks + ≥2 objective lesions; OR MRI evidence of DIS + DIT
- DIS on MRI: ≥1 T2 lesion in ≥2 of 4 CNS regions (periventricular, juxtacortical, infratentorial, spinal cord)
- DIT on MRI: simultaneous enhancing + non-enhancing lesions, OR new T2/enhancing lesion on follow-up
- CSF: oligoclonal bands (OCB) support diagnosis; required for PPMS

MS CLINICAL TYPES:
- Relapsing-Remitting (RRMS): ~85% at diagnosis; discrete attacks with recovery
- Secondary Progressive (SPMS): gradual disability after initial RRMS
- Primary Progressive (PPMS): steady worsening from onset; older patients

ACUTE RELAPSE TREATMENT:
- IV methylprednisolone 1g/day x 3-5 days: accelerates recovery (does not change long-term outcome)
- Oral equivalent: prednisone 1250 mg/day x 3-5 days (comparable efficacy)
- Plasmapheresis: severe relapses not responding to steroids

DISEASE-MODIFYING THERAPIES (DMTs):
HIGH-EFFICACY:
- Natalizumab (Tysabri): 68% relapse reduction; anti-VLA4; risk of PML (JC virus antibody screening required)
- Ocrelizumab (Ocrevus): anti-CD20; RRMS + PPMS (only FDA-approved DMT for PPMS); infusion q6 months
- Cladribine tablets: high-efficacy; limited to 2 treatment years

MODERATE-EFFICACY:
- Dimethyl fumarate (Tecfidera) 240 mg BID: oral; GI side effects initially; monitor lymphocytes
- Fingolimod (Gilenya): first oral DMT; cardiac monitoring at first dose; VZV reactivation risk
- Teriflunomide (Aubagio): oral daily; teratogenic (contraception required)

LOWER EFFICACY (platform):
- Interferons (IFN beta-1a IM/SC, IFN beta-1b SC): 30% relapse reduction; established safety; flu-like SE
- Glatiramer acetate (Copaxone): SC injection; injection site reactions; safe in pregnancy

PPMS: Ocrelizumab — only FDA-approved therapy for PPMS`,
    url: "https://www.neurology.org/doi/10.1212/WNL.0000000000005721",
  },

  // ── PEDIATRICS ──

  {
    source: "AAP",
    tier: 1,
    guideline_title: "AAP Clinical Practice Guideline for Evaluation and Treatment of Children and Adolescents with Obesity (2023)",
    guideline_year: "2023",
    abfm_domain: "Pediatrics",
    section: "Childhood and Adolescent Obesity — Evaluation, Lifestyle, Pharmacotherapy, and Surgery",
    content: `CHILDHOOD AND ADOLESCENT OBESITY — AAP 2023:

DEFINITION:
- BMI ≥85th percentile = overweight
- BMI ≥95th percentile = obesity
- BMI ≥120% of 95th percentile or BMI ≥35 = Class 2 / severe obesity

EVALUATION: Plot BMI for age at every visit starting at 2 years.
Labs for BMI ≥95th: fasting lipids, ALT, fasting glucose or HbA1c, TSH

TREATMENT — KEY PARADIGM SHIFT: Active treatment, NOT watchful waiting.

INTENSIVE HEALTH BEHAVIOR AND LIFESTYLE TREATMENT (IHBLT): First-line for ALL with obesity
- ≥26 hours of face-to-face treatment over 3-12 months (families, not just children)
- Dietary changes, physical activity (60 min/day), reduced screen time (<2h/day), sleep optimization
- Motivational interviewing; non-stigmatizing, patient-centered approach

PHARMACOTHERAPY (new 2023 recommendations — not previously endorsed):
- Indicated: BMI ≥95th + comorbidities if IHBLT insufficient
- Age ≥12:
  • Orlistat 120 mg TID with fat-containing meals: FDA-approved ≥12 years; GI side effects
  • Phentermine/topiramate ER (Qsymia): FDA-approved ≥12; ~9-10% weight loss; avoid in pregnancy, glaucoma
  • Semaglutide (Wegovy) 2.4 mg SC weekly: FDA-approved for obesity ≥12 (June 2023); 15-17% weight loss; GI side effects; contraindicated if personal/family history MTC or MEN2
- Age ≥8:
  • Metformin: BMI ≥95th with prediabetes or T2DM; modest weight benefit

BARIATRIC SURGERY:
- Recommended: adolescents ≥13 with BMI ≥120% of 95th + serious comorbidities (T2DM, severe OSA, severe NASH)
- Sleeve gastrectomy most common; Roux-en-Y gastric bypass also performed`,
    url: "https://publications.aap.org/pediatrics/article/151/2/e2022060640/190443/",
  },

  // ── WOMEN'S HEALTH ──

  {
    source: "ACOG",
    tier: 1,
    guideline_title: "ACOG Practice Bulletin: Endometriosis (2022)",
    guideline_year: "2022",
    abfm_domain: "Women's Health",
    section: "Endometriosis — Diagnosis, Medical Management, and Surgical Treatment",
    content: `ENDOMETRIOSIS — ACOG 2022:

PREVALENCE: ~10% of reproductive-age women; 30-50% of women with infertility or chronic pelvic pain; average 8-10 year delay in diagnosis.

CLINICAL FEATURES:
- Dysmenorrhea (severe, starts before menses)
- Dyspareunia (deep)
- Chronic pelvic pain (noncyclical)
- Dyschezia (pain with defecation)
- Infertility (mechanical — tubal; immune; ovarian reserve)
- Exam: fixed retroverted uterus or nodularity on rectovaginal exam in advanced disease

DIAGNOSIS:
- Clinical diagnosis acceptable to initiate empirical treatment (laparoscopy NOT required first)
- Definitive: laparoscopy with histologic confirmation (endometrial glands + stroma outside uterus)
- Ultrasound: identifies endometriomas (chocolate cysts); poor sensitivity for peritoneal implants
- MRI: surgical planning; deep infiltrating endometriosis mapping

MEDICAL TREATMENT (suppresses estrogen):
FIRST-LINE:
- NSAIDs: first for pain; start 1-2 days before expected menses
- Combined hormonal contraceptives (CHC): pill/patch/ring — continuous preferred
- Progestin-only therapy: norethindrone 5 mg/day; Depo-Provera 150 mg q3mo; LNG-IUD (Mirena)

SECOND-LINE:
- GnRH agonists (leuprolide/Lupron 3.75 mg IM monthly): medical menopause; add-back estrogen/progestin to prevent bone loss; limit to 6 months without add-back
- Elagolix (Orilissa): GnRH antagonist; oral; two FDA-approved doses for endometriosis pain

SURGICAL TREATMENT:
- Laparoscopic excision or ablation: evidence for pain reduction
- Cystectomy for endometriomas (not aspiration): reduces pain and recurrence
- Hysterectomy +/- BSO: definitive; no future fertility desire
- Post-surgery hormonal therapy: reduces recurrence`,
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2010/03/endometriosis",
  },

  // ── GASTROENTEROLOGY ──

  {
    source: "ACG",
    tier: 1,
    guideline_title: "American College of Gastroenterology Guideline: Diagnosis and Management of Celiac Disease (2023)",
    guideline_year: "2023",
    abfm_domain: "Gastroenterology",
    section: "Celiac Disease — Diagnosis, Dietary Treatment, and Monitoring",
    content: `CELIAC DISEASE — ACG 2023:

DEFINITION: Immune-mediated enteropathy triggered by gluten (wheat, rye, barley) in genetically susceptible individuals (HLA-DQ2/DQ8); causes villous atrophy and malabsorption.

PREVALENCE: ~1% of Western population; majority undiagnosed; 2:1 female predominance.

CLINICAL PRESENTATIONS:
- Classic: diarrhea, steatorrhea, weight loss, bloating, abdominal pain
- Atypical (most common): iron deficiency anemia refractory to oral iron, osteoporosis, elevated transaminases, infertility, peripheral neuropathy, dermatitis herpetiformis (pathognomonic — IgA deposits at dermal-epidermal junction)
- Silent: positive serology + histology without symptoms

TESTING — perform on GLUTEN-CONTAINING diet:
Serology (first-line):
- Anti-tissue transglutaminase IgA (TTG-IgA): sensitivity 95%, specificity 95%
- Total IgA level (with TTG-IgA): ~2% of celiacs have IgA deficiency → false-negative TTG-IgA → use IgG-based tests (TTG-IgG, DGP-IgG)
- EMA-IgA: very high specificity; not for initial testing

Confirmation:
- Endoscopy + duodenal biopsy (≥4 samples): gold standard; Marsh classification 0-3c
- HLA-DQ2/DQ8: if negative, celiac essentially excluded; useful for family members

TREATMENT:
- Strict lifelong gluten-free diet (GFD): sole proven treatment; avoid wheat, rye, barley
- Dietitian referral essential (hidden gluten in medications, condiments, cross-contamination)
- Symptom improvement: weeks to months; histologic recovery: 1-2 years in adults

MONITORING:
- TTG-IgA at 3-6 months post-GFD (normalize within 12-24 months)
- Annual: nutritional labs (iron, B12, folate, calcium, vitamin D, zinc)
- DEXA scan at diagnosis (osteoporosis risk)

COMPLICATIONS:
- Non-responsive celiac (5%): most commonly inadvertent gluten ingestion
- Refractory celiac type II: risk of enteropathy-associated T-cell lymphoma (EATL)`,
    url: "https://journals.lww.com/ajg/fulltext/2023/01000/acg_clinical_guideline__diagnosis_and_management.13.aspx",
  },

  // ── DERMATOLOGY ──

  {
    source: "AAD",
    tier: 1,
    guideline_title: "AAD Guidelines of Care for Allergic Contact Dermatitis and Irritant Contact Dermatitis (2023)",
    guideline_year: "2023",
    abfm_domain: "Dermatology",
    section: "Contact Dermatitis — Diagnosis and Management",
    content: `CONTACT DERMATITIS — AAD 2023:

TYPES:
1. Irritant Contact Dermatitis (ICD): most common (80%); non-immunologic; direct skin damage (soaps, detergents, solvents, water); dose-dependent; occurs on first exposure
2. Allergic Contact Dermatitis (ACD): type IV delayed hypersensitivity (T-cell mediated); requires prior sensitization; appears 12-96 hours after re-exposure

COMMON ALLERGENS (ACD):
- Nickel (jewelry, belt buckles, cell phones)
- Fragrance mix (cosmetics, personal care products)
- Neomycin / Bacitracin (topical antibiotics — especially post-surgical wounds)
- Rubber/latex chemicals (gloves)
- Urushiol: poison ivy/oak/sumac (most common ACD in US)
- Hair dye (p-phenylenediamine)

CLINICAL FEATURES:
- Acute ACD: pruritic erythematous papules, vesicles, bullae; oozing
- Chronic: lichenification, scaling, fissuring
- ACD vs ICD: ACD more pruritic, distinct borders, may spread beyond contact; ICD more burning/stinging, corresponds precisely to contact area

DIAGNOSIS:
- History: timing (ACD: delayed 12-96h; ICD: immediate or cumulative)
- Patch testing: gold standard for ACD; standard series + customized panels; read at 48h and 96h

TREATMENT:
- AVOIDANCE: cornerstone — identify and eliminate causative agent

Topical:
- Mid-to-high potency topical corticosteroid (triamcinolone 0.1%, clobetasol 0.05%): first-line twice daily
- Calcineurin inhibitors (tacrolimus, pimecrolimus): steroid-sparing; safe for face and eyelids

Systemic:
- Oral prednisone: extensive/severe/facial ACD (poison ivy); 1 mg/kg/day x 5 days then taper x 14-21 days total; avoid short 5-day tapers (rebound)
- Antihistamines: sedating (hydroxyzine) for sleep/pruritus; non-sedating for daytime

Wet compresses: cool water for acute vesicular phase`,
    url: "https://www.aad.org/member/clinical-quality/guidelines/contact-dermatitis",
  },

  {
    source: "AAD",
    tier: 1,
    guideline_title: "AAD Clinical Practice Guidelines: Basal Cell and Squamous Cell Carcinomas (2018, updated 2022)",
    guideline_year: "2022",
    abfm_domain: "Dermatology",
    section: "Non-Melanoma Skin Cancer — BCC and SCC Diagnosis and Management",
    content: `NON-MELANOMA SKIN CANCER (BCC AND SCC) — AAD 2022:

BASAL CELL CARCINOMA (BCC):
- Most common cancer in US; locally invasive; rarely metastasizes
- Classic: pearly papule with rolled border and central telangiectasia on sun-exposed skin (head, neck)
- Subtypes: nodular (most common), superficial, morpheaform/infiltrative (highest recurrence)

SQUAMOUS CELL CARCINOMA (SCC):
- Arises from keratinocytes; ~4% metastatic potential
- Precursor: actinic keratosis (AK) → SCC in situ (Bowen disease) → invasive SCC
- Appearance: erythematous scaly crusted papule or plaque; ulcerated; indurated
- High-risk features: size >2 cm, depth >2 mm, perineural invasion, ear/lip location, immunosuppression

DIAGNOSIS: Clinical + dermoscopy; confirmed by shave or punch biopsy

TREATMENT:
Standard (low-risk lesions):
- Surgical excision: BCC 4mm margins; SCC 4-6mm margins; cure rates >95%
- Electrodesiccation and curettage (ED&C): small, well-defined, low-risk lesions only

Mohs Micrographic Surgery (MMS) — PREFERRED FOR:
- High-risk locations (head, neck, hands, feet, genitalia)
- Aggressive histologic subtypes (morpheaform BCC, perineural SCC)
- Recurrent tumors; large tumors; immunosuppressed patients
- Highest cure rates (>98% BCC; >96% SCC)

Nonsurgical (selected patients):
- Topical imiquimod 5% cream or 5-FU: superficial BCC, SCC in situ (NOT invasive)
- Radiation therapy: elderly/inoperable patients; adjuvant for perineural invasion

Advanced/metastatic BCC: Vismodegib (hedgehog pathway inhibitor) or sonidegib
Advanced/metastatic SCC: cemiplimab (PD-1 inhibitor) or pembrolizumab

PREVENTION:
- Broad-spectrum SPF ≥30 sunscreen daily; UPF clothing; sun avoidance 10am-4pm
- Actinic keratosis treatment: liquid nitrogen, 5-FU, imiquimod, PDT (field therapy)`,
    url: "https://www.aad.org/member/clinical-quality/guidelines/basal-squamous-cell-carcinoma",
  },

  // ── OBESITY UPDATE ──

  {
    source: "AHA/AACE/Obesity Society",
    tier: 1,
    guideline_title: "AHA/AACE 2023 Obesity Management Algorithm; GLP-1 and Dual Agonists for Obesity",
    guideline_year: "2023",
    abfm_domain: "Endocrine & Metabolic",
    section: "Obesity Pharmacotherapy — GLP-1 Agonists and Tirzepatide (2023 Updates)",
    content: `OBESITY PHARMACOTHERAPY — 2023 UPDATES:

INDICATIONS: BMI ≥30 (no comorbidities) OR BMI ≥27 + weight-related comorbidity (T2DM, HTN, OSA, dyslipidemia, NASH, PCOS, OA)

FIRST-LINE PREFERRED (high-efficacy agents):

1. SEMAGLUTIDE (Wegovy) 2.4 mg SC weekly — GLP-1 receptor agonist:
- FDA-approved June 2021 for chronic weight management
- STEP 1 trial (68 wks): ~14.9% mean body weight reduction (placebo 2.4%)
- SELECT trial 2023: significant reduction in MACE in non-diabetic obese patients with established CVD (20% HR reduction) — FDA cardiovascular indication
- Titration: 0.25 mg/wk x 4 wks → titrate monthly to 2.4 mg/wk over 16 weeks
- Side effects: nausea, vomiting, diarrhea (transient); rare pancreatitis
- Contraindicated: personal/family history of MTC, MEN2

2. TIRZEPATIDE (Zepbound) 5-15 mg SC weekly — GIP/GLP-1 dual agonist:
- FDA-approved November 2023 for obesity (Zepbound); Mounjaro = T2DM indication
- SURMOUNT-1 (72 wks): 20.9% weight loss with 15 mg dose (vs 3.1% placebo)
- SURMOUNT-5 head-to-head: 47% more weight loss than semaglutide 2.4 mg
- Titration: 2.5 mg/wk x 4 wks → increase by 2.5 mg every 4 wks → target 5-15 mg/wk
- Side effects: same as semaglutide; same MTC/MEN2 contraindication

3. LIRAGLUTIDE (Saxenda) 3 mg SC daily: ~5-8% weight loss; once-daily less convenient; FDA-approved ≥12 years

OTHER AGENTS:
- Phentermine/topiramate ER (Qsymia): 9-10% weight loss; avoid pregnancy; cognitive SE
- Naltrexone/bupropion ER (Contrave): 5-6% weight loss; seizure contraindication
- Orlistat: GI lipase inhibitor; fatty stool; poor tolerability; least effective

BARIATRIC SURGERY: BMI ≥40 or ≥35 + comorbidities; sleeve gastrectomy or RYGB; superior long-term; consider when pharmacotherapy insufficient`,
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001060",
  },


  // ========== v7 ADDITIONS BATCH 2: REMAINING TOP-100 FM GAPS ==========

  {
    source: "AASLD",
    tier: 1,
    guideline_title: "AASLD Practice Guidance: Hepatic Cirrhosis and Portal Hypertension Complications (2022)",
    guideline_year: "2022",
    abfm_domain: "Gastroenterology",
    section: "Cirrhosis Complications — Varices, SBP, Hepatic Encephalopathy, and HCC Surveillance",
    content: `CIRRHOSIS COMPLICATIONS — AASLD 2022:

DIAGNOSIS OF CIRRHOSIS:
- Clinical: spider angiomas, palmar erythema, gynecomastia, caput medusae, splenomegaly, ascites
- Labs: thrombocytopenia (hypersplenism), elevated PT/INR, hypoalbuminemia, elevated bilirubin
- MELD-Na score: predicts 90-day mortality without transplant (used for organ allocation)
- Imaging: ultrasound (nodular liver, splenomegaly, ascites); FIB-4 >3.25 suggests advanced fibrosis

ESOPHAGEAL VARICES — PREVENTION AND MANAGEMENT:
Non-selective beta-blockers (NSBB): first-line for primary prophylaxis
- Propranolol 20 mg BID (titrate to HR 55-60 or max tolerated) or nadolol 40 mg daily
- Carvedilol 6.25 mg BID: preferred if available (also reduces hepatic venous pressure gradient)
- Contraindicated: SBP <90, bradycardia, decompensated HF, severe COPD/asthma
Endoscopic band ligation (EBL): first-line for high-risk varices (large varices or red wale signs) if NSBB contraindicated; also equivalent primary prophylaxis option
Acute variceal hemorrhage management: octreotide IV + endoscopy within 12 hours + prophylactic antibiotics (ceftriaxone 1g/day x 7 days)

SPONTANEOUS BACTERIAL PERITONITIS (SBP):
- Diagnostic tap: ascitic PMN ≥250/mm3 + positive culture (usually E. coli, Klebsiella, Strep)
- Treatment: cefotaxime 2g IV q8h x 5 days (or ceftriaxone); albumin 1.5 g/kg on day 1 + 1 g/kg on day 3 (prevents hepatorenal syndrome)
- Primary prophylaxis: norfloxacin (or TMP-SMX) if ascitic protein <1.5 g/dL + renal dysfunction or Child-Pugh ≥9 with bilirubin ≥3
- Secondary prophylaxis (after SBP): norfloxacin 400 mg/day indefinitely

HEPATIC ENCEPHALOPATHY (HE):
- Precipitants: GI bleed, infection, constipation, renal failure, sedatives, electrolyte disturbances
- Grades: I (mild confusion) → IV (coma)
- Treatment:
  • Lactulose: 30-45 mL q1-2h until 2-3 loose stools/day; maintenance 30-45 mL BID-TID
  • Rifaximin 550 mg BID: adjunct and maintenance; significantly reduces recurrence (TARGET-HE trial)
  • Identify and treat precipitant

ASCITES MANAGEMENT:
- First-line: sodium restriction (≤2 g/day) + spironolactone 100 mg/day (titrate up to 400 mg); add furosemide 40 mg/day (titrate up to 160 mg) maintaining 100:40 ratio
- Refractory ascites: large-volume paracentesis (>5L) + albumin (6-8 g/L removed); TIPS consideration

HCC SURVEILLANCE:
- Every 6 months: abdominal ultrasound +/- AFP for ALL cirrhotic patients (any etiology)`,
    url: "https://www.aasld.org/publications/practice-guidelines",
  },

  {
    source: "ADA",
    tier: 1,
    guideline_title: "ADA Standards of Medical Care in Diabetes 2024 — Prediabetes and Diabetes Prevention",
    guideline_year: "2024",
    abfm_domain: "Endocrine & Metabolic",
    section: "Prediabetes Diagnosis, Lifestyle Intervention, and Pharmacotherapy",
    content: `PREDIABETES AND DIABETES PREVENTION — ADA 2024:

DIAGNOSTIC CRITERIA FOR PREDIABETES:
- Impaired Fasting Glucose (IFG): FPG 100-125 mg/dL
- Impaired Glucose Tolerance (IGT): 2-hour OGTT glucose 140-199 mg/dL
- Elevated A1c: 5.7-6.4%
- Any one criteria = prediabetes; persons with IFG + IGT + elevated A1c have highest T2DM progression risk

SCREENING FOR PREDIABETES/T2DM:
- Screen all adults ≥35 years (USPSTF Grade B: 35-70, overweight/obese)
- Screen earlier if BMI ≥25 (≥23 in Asian Americans) + ≥1 risk factor: first-degree relative with DM, high-risk ethnicity (Black, Hispanic, Native American, Asian, Pacific Islander), GDM history, HTN, HDL <35 mg/dL or TG >250, PCOS, A1c ≥5.7% previously, sedentary lifestyle, cardiovascular disease
- Rescreening: every 1-3 years if normal; annually if prediabetes
- No preferred test — FPG, 2h OGTT, or A1c all acceptable; OGTT most sensitive

TREATMENT — LIFESTYLE MODIFICATION (FIRST-LINE):
- Diabetes Prevention Program (DPP): landmark trial — 5-7% weight loss + 150 min/week moderate physical activity → 58% relative risk reduction in T2DM conversion (vs 31% with metformin)
- Goal: achieve and maintain ≥5% weight loss; 150+ min/week aerobic activity
- CDC-recognized DPP programs available (covered by Medicare Part B and many insurers)
- Dietary pattern: Mediterranean, DASH, or plant-based — no single diet mandated
- Sleep: treat OSA; optimize sleep duration (poor sleep worsens insulin resistance)

PHARMACOTHERAPY FOR PREDIABETES:
Metformin — CONSIDER (not mandatory) for:
- BMI ≥35 AND age <60 years
- Women with prior GDM (high-risk group)
- Those with A1c ≥6.0% or progression on repeat testing
- Dose: 500 mg BID with meals → 1000 mg BID (max 2550 mg/day); extended-release preferred (less GI side effects)
- Monitor B12 annually (metformin depletes B12 over time)

GLP-1 receptor agonists (semaglutide, liraglutide) and tirzepatide: not FDA-approved specifically for prediabetes; may reduce progression as obesity treatment side effect

MONITORING:
- Repeat A1c or FPG every 6-12 months to monitor for progression to T2DM
- Annual monitoring even if lifestyle is successful`,
    url: "https://diabetesjournals.org/care/article/47/Supplement_1/S43/153954/",
  },

  {
    source: "CMS/NHPCO",
    tier: 1,
    guideline_title: "Medicare Hospice Benefit; National Consensus Project Clinical Practice Guidelines for Quality Palliative Care (2018)",
    guideline_year: "2018",
    abfm_domain: "Geriatrics",
    section: "Palliative Care, Hospice Eligibility, and Goals-of-Care Communication",
    content: `PALLIATIVE CARE AND HOSPICE — CMS/NHPCO:

PALLIATIVE CARE:
- Definition: specialized medical care focused on relieving suffering and improving quality of life for patients with serious illness at ANY stage; not limited to end of life; can be provided alongside curative treatment
- Indications: any serious or life-limiting illness (cancer, HF, COPD, dementia, ALS, ESRD, etc.)
- Components: pain and symptom management, goals-of-care communication, psychosocial support, coordination of care

HOSPICE:
- Definition: comfort-focused care when curative treatment is no longer pursued; covers last 6 months of life
- Medicare eligibility (Medicare Part A Hospice Benefit):
  • Two physicians certify prognosis ≤6 months if disease runs its natural course
  • Patient (or surrogate) elects comfort-focused care (agrees to forgo curative treatment for the terminal diagnosis)
  • Enrolled in an approved hospice program
- Covered services: physician visits, nursing, home health aide, medical social work, chaplaincy, medications for comfort, bereavement support
- Diagnoses with validated 6-month prognosis guidelines: cancer (fastest decline), HF (EF <25%, NYHA IV), COPD (FEV1 <30%, oxygen dependent), dementia (Functional Assessment Staging Test Stage 7, unable to ambulate, speak, or dress, with recent aspiration/UTI/pressure ulcer), ESRD (not pursuing dialysis or transplant)

GOALS-OF-CARE CONVERSATION (advance care planning):
- POLST (Physician Orders for Life-Sustaining Treatment): actionable medical orders; resuscitation, artificial nutrition, hospitalization preferences
- Advance directive / Living will: documents wishes for end-of-life care
- Durable Power of Attorney for Healthcare: designates a surrogate decision-maker
- Surrogate hierarchy (when no advance directive): spouse → adult children → parents → siblings → other relatives → close friends

SYMPTOM MANAGEMENT IN SERIOUS ILLNESS:
Pain: oral morphine or oxycodone (start low; titrate q24-48h); fentanyl patch for stable opioid requirements; avoid NSAIDs in renal failure
Dyspnea: low-dose opioids (most evidence-based intervention for dyspnea at EOL); anxiolytics (lorazepam) for refractory; fan directed at face; oxygen only if hypoxic
Nausea/Vomiting: haloperidol 0.5-2 mg SQ/IV; ondansetron; prochlorperazine; treat reversible causes (constipation, opioid-induced)
Constipation: ALL opioid patients require stimulant laxative (senna ± bisacodyl); methylnaltrexone (Relistor) for opioid-induced constipation refractory to oral laxatives
Delirium at EOL: haloperidol 0.5-2 mg; lorazepam if refractory; discontinue anticholinergics, unnecessary medications; provide reorientation`,
    url: "https://www.nhpco.org/palliative-care-overview/",
  },

  {
    source: "AAFP/CDC",
    tier: 2,
    guideline_title: "AAFP Choosing Wisely: Acute Bronchitis; CDC Antibiotic Prescribing Recommendations",
    guideline_year: "2023",
    abfm_domain: "Pulmonary",
    section: "Acute Bronchitis — Diagnosis and Antibiotic Avoidance",
    content: `ACUTE BRONCHITIS — AAFP/CDC 2023:

DEFINITION: Acute inflammation of the tracheobronchial tree; cough ≤3 weeks in absence of pneumonia.

ETIOLOGY: Viral in >90% of cases (rhinovirus, influenza, parainfluenza, RSV, coronavirus, adenovirus); bacterial causes rare (<10%): Bordetella pertussis, Mycoplasma pneumoniae, Chlamydia pneumoniae

DIAGNOSIS: Clinical — cough (productive or non-productive), may have wheezing/rhonchi; low-grade fever; no infiltrate on imaging (if obtained)
- Chest X-ray: NOT routinely indicated; obtain if fever >38°C, HR >100, RR >24, oxygen saturation <95%, or clinical features suggest pneumonia (focal consolidation signs)
- Rule out pertussis: prolonged cough >3 weeks, paroxysmal cough, post-tussive vomiting, whoop — PCR or culture if suspected

TREATMENT:
ANTIBIOTICS: NOT recommended (Choosing Wisely — AAFP; CDC) — even if sputum is colored
- No evidence antibiotics reduce illness duration or severity in uncomplicated acute bronchitis
- Yellow/green sputum = neutrophil inflammation, NOT bacterial infection
- Prescribing antibiotics for acute bronchitis = low-value care; contributes to antimicrobial resistance

Symptomatic treatment:
- Cough suppressants: dextromethorphan 15-30 mg q6-8h or codeine 10-20 mg q4h (short-term)
- Honey (adults and children >12 months): evidence for cough relief (avoid in infants <12 months — botulism risk)
- Inhaled albuterol: offer only if wheezing or underlying reactive airway disease
- NSAIDs/acetaminophen: fever and myalgias
- Avoid: antihistamines (ineffective), decongestants (minimal evidence for lower respiratory symptoms)

PERTUSSIS MANAGEMENT:
- Azithromycin 500 mg day 1 then 250 mg days 2-5 (reduces transmission, may reduce severity if given early)
- Prophylaxis of close contacts: azithromycin same regimen
- Report to public health: pertussis is a reportable disease in all states`,
    url: "https://www.aafp.org/pubs/afp/issues/2016/1001/p560.html",
  },

  {
    source: "USPSTF",
    tier: 1,
    guideline_title: "USPSTF Recommendation: Intimate Partner Violence, Elder Abuse, and Abuse of Vulnerable Adults (2018)",
    guideline_year: "2018",
    abfm_domain: "Psychiatry / Behavioral Health",
    section: "Intimate Partner Violence Screening and Referral",
    content: `INTIMATE PARTNER VIOLENCE (IPV) SCREENING — USPSTF 2018:

USPSTF RECOMMENDATION: GRADE B
- Screen ALL women of reproductive age (defined as childbearing-age women, typically 14-46 years) for IPV
- Screen regardless of signs or symptoms of abuse
- Provide or refer to intervention services for those who screen positive
- Men and elderly: insufficient evidence (Grade I) — individualized approach

PREVALENCE: ~1 in 3 women experience physical violence, sexual violence, or stalking by a partner in their lifetime; ~1 in 4 during pregnancy; leading cause of injury in women

VALIDATED SCREENING TOOLS:
- HITS (Hurt, Insult, Threaten, Scream): 4 questions; score ≥11 = positive; can be self-administered
  • How often does your partner: Hurt you physically? Insult or talk down to you? Threaten you? Scream or curse at you?
- HARK (Humiliation, Afraid, Rape, Kick): 4 questions; ≥1 positive = screen positive
- WAST (Women Abuse Screening Tool): 2-question short form; validated in primary care

ASKING ABOUT IPV IN PRACTICE:
- Ask in private, in the patient's preferred language, without partner present
- Non-judgmental, direct language: "Many patients experience violence at home. I ask all my patients about this. Has your partner ever hurt you physically, threatened you, or made you feel afraid?"
- If screening positive: assess safety, provide resources, warm referral to DV services; mandatory reporting varies by state (for child abuse, abuse of minors, elder abuse — varies for adult IPV)

DOCUMENTATION: Document in private; use coded terms if patient at risk of partner reviewing records; offer to review safety plan

SAFETY ASSESSMENT: Danger Assessment (DA) — assesses lethality risk (firearms in home, escalating frequency, threats to kill, strangulation); high lethality → urgent intervention, safety plan, hotline

RESOURCES: National DV Hotline 1-800-799-7233; local shelters; legal advocacy; counseling
REFERRAL: Evidence-based interventions include counseling, advocacy, and safety planning programs`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/intimate-partner-violence-and-abuse-of-elderly-and-vulnerable-adults-screening",
  },

  {
    source: "ACC/AHA/AHA",
    tier: 1,
    guideline_title: "ACC/AHA 2018 Cholesterol Guideline; AHA 2021 Scientific Statement on Hypertriglyceridemia",
    guideline_year: "2021",
    abfm_domain: "Cardiovascular",
    section: "Hypertriglyceridemia and Mixed Dyslipidemia Management",
    content: `HYPERTRIGLYCERIDEMIA — ACC/AHA 2018 / AHA 2021:

CLASSIFICATION:
- Normal: <150 mg/dL
- Mild-moderate: 150-499 mg/dL (most common; lifestyle-driven)
- Severe: 500-999 mg/dL
- Very severe: ≥1000 mg/dL → high risk of acute pancreatitis

COMMON CAUSES (secondary):
- Lifestyle: excess refined carbohydrates/alcohol, obesity, physical inactivity
- Medical: diabetes/insulin resistance (most common), hypothyroidism, CKD, nephrotic syndrome, pregnancy (third trimester)
- Medications: glucocorticoids, thiazides, beta-blockers (non-ISA), oral estrogens, isotretinoin, protease inhibitors, antipsychotics (especially clozapine, olanzapine)
- Genetic: familial hypertriglyceridemia, familial combined hyperlipidemia, lipoprotein lipase deficiency

TREATMENT:

Mild-moderate (150-499 mg/dL):
1. Lifestyle first: weight loss, eliminate refined sugars/alcohol, increase omega-3 rich fish (salmon, sardines), low-carbohydrate diet, aerobic exercise
2. Treat underlying causes (control DM, replace hypothyroid, switch medications if possible)
3. Statins: reduce TG by 10-30% as secondary effect; first priority if ASCVD risk elevated

Severe (500-999 mg/dL):
- Above lifestyle measures + pharmacotherapy to prevent pancreatitis
- Fibrates: fenofibrate 145 mg/day or gemfibrozil 600 mg BID; reduce TG 30-50%; avoid gemfibrozil + statin combination (myopathy risk); fenofibrate preferred with statin
- Omega-3 fatty acids: prescription icosapentaenoic acid (Vascepa — EPA only) 2 g BID or DHA+EPA (Lovaza) 4 g/day; reduce TG 30-50%

Very severe (≥1000 mg/dL — pancreatitis risk):
- Emergent: stop all oral fat intake, IV fluids; insulin drip (if DM, markedly lowers TG rapidly)
- Plasmapheresis: for pancreatitis-associated massive elevation unresponsive to insulin
- Fibrate + omega-3 combination; fenofibrate preferred

VASCEPA (icosapentaenoic acid — EPA only) — CARDIOVASCULAR BENEFIT:
- REDUCE-IT trial: Vascepa 4 g/day in patients with TG 135-499 + statin + CVD or DM → 25% reduction in MACE (NNT ~21 over 5 years)
- Approved for CV risk reduction in patients with TG ≥150 on statin with CVD or DM + ≥2 CV risk factors
- Do NOT confuse with over-the-counter fish oil (mixed EPA+DHA at lower dose — no proven CV benefit)`,
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000699",
  },

  {
    source: "AHA/ACCP",
    tier: 1,
    guideline_title: "AHA/ACC/ACCP Pulmonary Embolism Guidelines (2019); ACEP Clinical Policy for PE Diagnosis",
    guideline_year: "2019",
    abfm_domain: "Pulmonary",
    section: "Pulmonary Embolism — Diagnosis Algorithm, Wells Criteria, PERC, and D-Dimer",
    content: `PULMONARY EMBOLISM DIAGNOSIS — AHA/ACCP 2019:

CLINICAL PRETEST PROBABILITY:
Wells Criteria for PE (simplified — dichotomized version):
+ Clinical signs and symptoms of DVT (3 points)
+ PE is #1 diagnosis or equally likely (3 points)
+ Heart rate >100 (1.5 points)
+ Immobilization ≥3 days or surgery in past 4 weeks (1.5 points)
+ Previous DVT/PE (1.5 points)
+ Hemoptysis (1 point)
+ Malignancy (on treatment, treated in last 6 months, or palliative) (1 point)

Score Interpretation:
- Low probability: 0-1 (PE rate 1-3%)
- Moderate probability: 2-6 (PE rate ~16%)
- High probability: ≥7 (PE rate ~41%)
(Dichotomized: ≤4 = PE unlikely; >4 = PE likely)

PERC RULE (Pulmonary Embolism Rule-out Criteria):
Apply ONLY in low pretest probability patients — if ALL 8 criteria met, no further testing needed:
1. Age <50 years
2. HR <100 bpm
3. SaO2 ≥95% on room air
4. No unilateral leg swelling
5. No hemoptysis
6. No recent trauma or surgery (≤4 weeks)
7. No prior DVT or PE
8. No exogenous estrogen use (OCP, HRT, pregnancy)
Negative PERC: <2% PE probability → no D-dimer or imaging needed

DIAGNOSTIC ALGORITHM:

Low clinical probability (Wells ≤4):
→ PERC negative → no testing; PERC positive → D-dimer
→ D-dimer negative (<500 ng/mL, or age-adjusted threshold age x 10 ng/mL for ≥50 years): PE excluded
→ D-dimer positive → CT pulmonary angiography (CTPA)

High clinical probability (Wells >4):
→ Proceed directly to CTPA (D-dimer has poor sensitivity in high probability)

IMAGING:
- CTPA: gold standard; sensitivity 83-96%, specificity 97%; identifies subsegmental PE (significance unclear)
- V/Q scan: preferred if contrast allergy, CKD, or pregnancy (use after plain film; low-probability V/Q + low clinical probability = PE excluded)
- Compression ultrasound: if CTPA contraindicated and high DVT probability; DVT found → treat as VTE
- Echocardiography: RV dysfunction (RV:LV ratio >0.9), McConnell sign, RV hypokinesis; identifies massive/submassive PE; not for diagnosis

RISK STRATIFICATION:
- Massive PE: hemodynamic instability (SBP <90 or 40 mmHg drop x 15 min) → IV heparin + systemic thrombolysis (alteplase 100 mg IV over 2h if no contraindications)
- Submassive PE: RV dysfunction without hemodynamic instability → anticoagulation; consider catheter-directed thrombolysis if deteriorating
- Low-risk PE: PESI score class I-II or sPESI 0 → outpatient treatment appropriate`,
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000969",
  },

  {
    source: "ACR",
    tier: 1,
    guideline_title: "ACR Guideline for the Management of Systemic Lupus Erythematosus (2024)",
    guideline_year: "2024",
    abfm_domain: "Musculoskeletal",
    section: "Systemic Lupus Erythematosus — Diagnosis, Monitoring, and Treatment",
    content: `SYSTEMIC LUPUS ERYTHEMATOSUS (SLE) — ACR 2024:

DIAGNOSIS — ACR/EULAR 2019 Classification Criteria:
Entry criterion: ANA ≥1:80 (most sensitive test; >95% of SLE patients positive)
Then score additional criteria (≥10 points = SLE classification; each criterion counted once)

Key domains and weights:
- Constitutional: fever (2)
- Hematologic: leukopenia <4000 (3), thrombocytopenia <100K (4), autoimmune hemolytic anemia (4)
- Neuropsychiatric: delirium (2), psychosis (3), seizure (5)
- Mucocutaneous: non-scarring alopecia (2), oral ulcers (2), subacute/discoid lupus (4), acute cutaneous lupus/malar rash (6)
- Serosal: pleural/pericardial effusion (5), acute pericarditis (6)
- Musculoskeletal: arthritis (6)
- Renal: proteinuria >0.5 g/24h (4); class II/V lupus nephritis on biopsy (8); class III/IV nephritis (10)
- Immunologic: anti-dsDNA or anti-Sm (6), antiphospholipid antibodies (2), complement proteins low (3), direct Coombs+ (1)

MONITORING — ANNUAL MINIMUM:
- CBC with differential (cytopenias), CMP (renal function), urinalysis with microscopy (nephritis), urine protein:creatinine ratio
- Complement levels (C3, C4), anti-dsDNA — disease activity markers (low complement + high anti-dsDNA = flare)
- Lipids (accelerated atherosclerosis in SLE), glucose, blood pressure (HTN common)
- Ophthalmology annually (hydroxychloroquine retinal toxicity screening after 5 years of use)

TREATMENT:
ALL PATIENTS with SLE (unless contraindicated):
- Hydroxychloroquine (HCQ) 5 mg/kg/day (max 400 mg/day): reduces flares, organ damage, mortality; safe in pregnancy; requires annual eye exam
- Sunscreen SPF ≥30: UV triggers SLE flares (photosensitivity)
- Vaccines: ensure up to date; avoid live vaccines when on immunosuppression

MILD-MODERATE disease (mucocutaneous, arthritis):
- NSAIDs, low-dose prednisone (≤7.5 mg/day), topical steroids
- Add methotrexate or azathioprine for steroid-sparing

SEVERE/MAJOR ORGAN-THREATENING (nephritis, CNS, hematologic):
- High-dose prednisone (1 mg/kg/day) or IV methylprednisolone pulse (1g x 3 days)
- Mycophenolate mofetil (MMF): first-line induction for lupus nephritis (class III/IV)
- Cyclophosphamide IV (NIH or Euro-Lupus regimen): alternative induction for severe nephritis
- Belimumab (Benlysta): first biologic approved for SLE; anti-BLyS; reduces flares in serologically active disease
- Voclosporin + MMF: approved for lupus nephritis (2021)
- Anifrolumab: anti-interferon type I receptor; approved for moderate-severe SLE

ANTIPHOSPHOLIPID SYNDROME (APS): thrombosis + persistent positive antiphospholipid antibodies (aCL, anti-B2GP1, lupus anticoagulant) → warfarin (INR 2-3 for venous; 3-4 for arterial; DOACs inferior in APS)`,
    url: "https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Lupus",
  },

  // ── v9 additions: 3 missing conditions ────────────────────────────────

  {
    source: "USPSTF / AAD",
    tier: 1,
    guideline_title: "Skin Cancer Screening and Suspicious Lesion Evaluation",
    guideline_year: "2023",
    abfm_domain: "Dermatology",
    section: "Skin Cancer Screening and Suspicious Lesion Evaluation",
    content: `SKIN CANCER SCREENING — USPSTF 2023:
USPSTF RECOMMENDATION: Grade I (Insufficient Evidence) for skin cancer screening by visual skin examination in the primary care setting for asymptomatic adults. The USPSTF does not recommend routine full-body skin exam screening in average-risk asymptomatic patients by a primary care clinician; insufficient evidence to assess benefits vs. harms.

HIGH-RISK POPULATIONS (individualize surveillance):
- Personal or family history of melanoma
- >50 atypical or dysplastic nevi
- History of severe sunburns, extensive UV exposure, tanning bed use
- Immunosuppressed patients (organ transplant, HIV, chronic immunosuppressive therapy)
- Fitzpatrick skin type I–II (fair skin, red/blonde hair, blue eyes)
- Xeroderma pigmentosum

SUSPICIOUS LESION EVALUATION — ABCDE CRITERIA (AAD):
A — Asymmetry: one half does not match the other
B — Border: irregular, ragged, notched, or blurred edges
C — Color: variation in color (shades of brown/black; red, white, or blue areas)
D — Diameter: >6 mm (size of a pencil eraser); concerning if smaller and changing
E — Evolving: any change in size, shape, color, or new symptom (bleeding, crusting)

DERMOSCOPY: Improves diagnostic accuracy for pigmented lesions when clinician is trained; not required in primary care but useful in high-volume practices.

BIOPSY INDICATIONS (AAD 2022):
- Any lesion with ABCDE features, rapidly growing lesion, or lesion clinically suspicious for malignancy
- Preferred biopsy: excisional biopsy with 1–3 mm margins for melanoma (do not shave suspicious pigmented lesions)
- Shave biopsy acceptable for lesions strongly suspected to be basal cell or squamous cell carcinoma
- Punch biopsy: for larger lesions where excision not feasible; sample most atypical area

NON-MELANOMA SKIN CANCER (BCC/SCC):
Basal Cell Carcinoma (BCC): most common skin cancer; pearly papule with rolled border and telangiectasia; rarely metastasizes; treatment: excision, Mohs surgery for high-risk/facial, or electrodesiccation and curettage for low-risk
Squamous Cell Carcinoma (SCC): scaly, erythematous plaque or ulcerated nodule; risk of metastasis (2–5%); Marjolin ulcer = SCC in chronic wound; treat with excision or Mohs; actinic keratosis = SCC precursor (treat with cryotherapy, 5-FU, imiquimod)

MELANOMA MANAGEMENT:
- Stage IA (≤1 mm, no ulceration): wide local excision with 1 cm margins; sentinel lymph node biopsy (SLNB) not required
- Stage IB–II (>1 mm or ulcerated): wide local excision + SLNB; adjuvant therapy for stage IIB–IIC with pembrolizumab
- Stage III–IV: systemic therapy (BRAF/MEK inhibitors if BRAF V600E+; checkpoint inhibitors: nivolumab, pembrolizumab, ipilimumab + nivolumab); refer to oncology

COUNSELING (AAD/AAFP): sunscreen SPF ≥30 (broad spectrum, water resistant), protective clothing, avoid peak UV 10am–4pm, avoid tanning beds (USPSTF Grade B recommendation to counsel young adults 6–24 with fair skin to minimize UV exposure)`,
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/skin-cancer-screening",
  },

  {
    source: "AAP",
    tier: 2,
    guideline_title: "Pediatric Undernutrition (Failure to Thrive) — AAP Clinical Guidelines",
    guideline_year: "2023",
    abfm_domain: "Pediatrics",
    section: "Failure to Thrive — Pediatric Undernutrition Evaluation and Management",
    content: `FAILURE TO THRIVE (FTT) / PEDIATRIC UNDERNUTRITION — AAP 2023:

DEFINITION / DIAGNOSTIC CRITERIA:
Failure to thrive = inadequate physical growth relative to established norms; no single universal cutoff, but commonly defined as:
- Weight-for-age <3rd percentile (or <2nd percentile on WHO growth charts) on two separate occasions, OR
- Crossing ≥2 major percentile lines downward on a growth chart over time (e.g., from 50th to 10th percentile), OR
- Weight-for-length/height <2nd percentile (WHO), OR
- Weight <80% of ideal body weight for height (Waterlow criteria for acute undernutrition)

Use WHO growth charts (0–2 years) and CDC growth charts (2–20 years). Breastfed infants may naturally fall from birth curves — use WHO charts for breastfed infants 0–24 months.

CLASSIFICATION:
- Organic FTT (~20%): underlying medical condition (GERD, congenital heart disease, cystic fibrosis, malabsorption, renal tubular acidosis, hypothyroidism, HIV, celiac disease)
- Non-organic FTT (~80%): inadequate caloric intake without organic cause (psychosocial, feeding difficulties, food insecurity, behavioral issues)
- Mixed: combination of both

EVALUATION — HISTORY (most diagnoses made by history):
- Feeding history: breast vs. formula (dilution errors?), feeding duration, frequency, volume, introduction of solids
- Food security screening: AAP recommends two-question screen ("We worried whether our food would run out" / "Food we bought just didn't last")
- Developmental milestones, social history, caregiver-infant interaction
- Review of systems for organic cause: vomiting, diarrhea, polyuria, dyspnea with feeds, recurrent infections

EVALUATION — PHYSICAL EXAM:
- Accurate weight, length/height, head circumference plotted on growth chart
- Signs of neglect, dysmorphic features, organomegaly
- Assess mid-upper arm circumference (MUAC) for severe acute malnutrition

LABS — INITIAL (targeted, not shotgun):
First-line if organic cause suspected: CBC, CMP (BUN, creatinine, electrolytes, LFTs, albumin), urinalysis, thyroid function (TSH)
Additional based on history: celiac panel (anti-tTG IgA + total IgA), sweat chloride (if pulmonary symptoms), lead level (ages 1–5), HIV, stool studies for malabsorption

MANAGEMENT:
1. Address underlying cause if organic FTT identified
2. Caloric rehabilitation (AAP): catch-up growth requires 1.5–2× estimated average requirements
   - Increase caloric density: formula concentration (22–24 kcal/oz), caloric supplements (Duocal, corn oil, MCT oil)
   - High-calorie foods: whole-fat dairy, nut butters, avocado
3. Feeding therapy: occupational/speech therapy for feeding difficulties, oral aversion, oromotor dysfunction
4. Multidisciplinary team: dietitian, social work, developmental pediatrics for complex cases
5. Food assistance resources: WIC referral, SNAP, local food banks
6. Hospitalization criteria: severe malnutrition (weight <60% ideal), suspected abuse/neglect, severe dehydration, failure of outpatient management

MONITORING: weight every 1–2 weeks initially, then monthly once catch-up growth established; expect 2–3× normal weight gain velocity during catch-up phase`,
    url: "https://www.aap.org/en/patient-care/failure-to-thrive/",
  },

  {
    source: "AAFP / KDIGO",
    tier: 1,
    guideline_title: "Electrolyte Disorders — Evaluation and Management in Primary Care",
    guideline_year: "2023",
    abfm_domain: "Renal & Urology",
    section: "Electrolyte Disorders — Hyponatremia, Hyperkalemia, Hypokalemia, Hypomagnesemia, Hypercalcemia",
    content: `ELECTROLYTE DISORDERS — AAFP/KDIGO 2023:

HYPONATREMIA (Na <135 mEq/L):
Symptoms: nausea, headache, lethargy, seizures, coma (usually with Na <125 mEq/L or rapid decline)
Step 1 — Assess osmolality:
- Hyperosmolar (>295): hyperglycemia (correct Na: add 1.6 mEq/L per 100 mg/dL glucose >100), mannitol
- Iso-osmolar (280–295): pseudohyponatremia (hyperlipidemia, hyperproteinemia)
- Hypo-osmolar (<280): most clinically relevant — proceed to volume assessment

Step 2 — Assess volume status:
- Hypovolemic hyponatremia: urine Na <20 (extra-renal loss: vomiting, diarrhea) or >20 (renal loss: diuretics, Addison's) → isotonic saline
- Euvolemic hyponatremia: urine Na >20, urine osmolality >100 → SIADH (most common cause in euvolemic) → fluid restriction 1–1.5 L/day; treat underlying cause; vasopressin receptor antagonists (tolvaptan, conivaptan) for severe refractory SIADH
  SIADH causes: CNS disease, pulmonary disease, malignancy (small cell lung cancer), SSRIs, NSAIDs, carbamazepine
- Hypervolemic hyponatremia: urine Na <20 → CHF, cirrhosis, nephrotic syndrome → fluid + sodium restriction, treat underlying cause

Correction rate: raise Na no faster than 8–12 mEq/L per 24 hours (risk of osmotic demyelination syndrome / central pontine myelinolysis if corrected too rapidly)
Acute severe/symptomatic (seizures, coma): 3% hypertonic saline 100 mL IV bolus; raise Na by 1–2 mEq/L/hour until symptoms resolve, then slow to ≤8–12/24h

HYPERKALEMIA (K >5.0 mEq/L):
Causes: CKD (most common), ACE inhibitors/ARBs, potassium-sparing diuretics (spironolactone), NSAIDs, rhabdomyolysis, adrenal insufficiency, pseudohyperkalemia (hemolysis)
EKG changes (in order): peaked T waves → prolonged PR → widened QRS → sine wave → VF
Management by severity:
- Mild (5.0–5.5, no EKG changes): dietary K restriction (<2 g/day), hold offending agents, optimize GFR
- Moderate (5.5–6.0) or EKG changes: add sodium bicarbonate (metabolic acidosis), kayexalate or patiromer (K binders); patiromer preferred for CKD
- Severe (>6.0 or EKG changes): IV calcium gluconate (membrane stabilization — immediate, 30–60 min); IV insulin + dextrose (shifts K intracellularly, 15–30 min); IV sodium bicarbonate if acidosis; albuterol nebulized; hemodialysis for refractory/severe

HYPOKALEMIA (K <3.5 mEq/L):
Causes: GI loss (vomiting, diarrhea, laxatives), renal loss (diuretics — thiazide/loop, hyperaldosteronism), transcellular shift (insulin, alkalosis, beta-agonists)
Symptoms: muscle weakness, cramps, constipation, arrhythmias (U waves on EKG, T-wave flattening)
Treatment: oral KCl for mild-moderate (10 mEq/hour oral; max 40 mEq/dose); IV KCl for severe (<2.5 or symptomatic; max 10 mEq/hour peripheral, 20 mEq/hour central); correct concurrent hypomagnesemia first (Mg depletion causes renal K wasting)

HYPOMAGNESEMIA (Mg <1.7 mg/dL):
Causes: alcohol use disorder, malnutrition, PPIs (chronic use), loop/thiazide diuretics, malabsorption, poorly controlled DM
Significance: refractory hypokalemia and hypokalemia do not correct without Mg repletion
Treatment: oral Mg oxide/citrate for mild asymptomatic; IV magnesium sulfate for severe or symptomatic (1–2 g IV over 15 min for torsades de pointes; 1–2 g IV over 1 hour for severe deficiency); correct underlying cause

HYPERCALCEMIA (Ca >10.5 mg/dL; corrected for albumin: add 0.8 mg/dL per 1 g/dL albumin below 4):
Most common causes in outpatient: primary hyperparathyroidism (PTH ↑), malignancy (PTH-rP ↑; osteolytic mets)
PTH-based workup: PTH elevated → primary hyperparathyroidism (refer endocrine/surgery if symptomatic or Ca >1 mg/dL above normal or age <50 or osteoporosis or nephrolithiasis); PTH suppressed → malignancy, sarcoidosis, vitamin D toxicity, thiazide diuretics
Symptoms of significant hypercalcemia ("bones, stones, groans, psychic moans"): nephrolithiasis, fractures, constipation, nausea, depression, confusion
Acute severe hypercalcemia (>14 mg/dL or symptomatic): IV isotonic saline (aggressive hydration first); IV bisphosphonates (zoledronic acid 4 mg IV); calcitonin for rapid reduction; dialysis for refractory`,
    url: "https://www.aafp.org/pubs/afp/issues/2023/electrolyte-disorders.html",
  },

  // ── v10 additions: 5 critical thin-coverage conditions ─────────────────

  {
    source: "ADA",
    tier: 2,
    guideline_title: "ADA Standards of Medical Care in Diabetes 2024 — Treatment and Management",
    guideline_year: "2024",
    abfm_domain: "Endocrine & Metabolic",
    section: "Type 2 Diabetes Mellitus — Treatment Targets, Drug Selection, and Monitoring",
    content: `TYPE 2 DIABETES MELLITUS — TREATMENT AND MANAGEMENT (ADA 2024):

GLYCEMIC TARGETS:
- A1c <7.0% for most non-pregnant adults with T2DM
- A1c <8.0% for older adults (>65) with multiple comorbidities, limited life expectancy, or high hypoglycemia risk
- A1c <6.5% may be appropriate if safely achieved with lifestyle/metformin alone
- Fasting glucose target: 80–130 mg/dL; postprandial (1-2h after meal) <180 mg/dL
- Time In Range (TIR) on CGM: >70% (70–180 mg/dL); goal <4% <70 mg/dL

FIRST-LINE THERAPY:
- Lifestyle modification (MNT + physical activity: 150 min/week moderate-intensity) at diagnosis for all
- Metformin: first-line pharmacotherapy (if no contraindication); start at 500 mg with meals, titrate to 1000 mg BID; hold for eGFR <30; check B12 level if on >4 years

CARDIOVASCULAR/RENAL RISK-BASED PRESCRIBING (ADA 2024 priority):
- Established ASCVD or high CV risk: add GLP-1 receptor agonist (liraglutide, semaglutide, dulaglutide) OR SGLT2 inhibitor (empagliflozin, canagliflozin, dapagliflozin) regardless of A1c
- Heart failure with reduced EF: SGLT2 inhibitor preferred (empagliflozin or dapagliflozin — reduce HHF and CV death)
- CKD (eGFR 25–60 or albuminuria): finerenone + SGLT2 inhibitor (canagliflozin or dapagliflozin) — reduce CKD progression
- Obesity/weight loss priority: GLP-1 RA (semaglutide most effective; tirzepatide [GLP-1/GIP] superior for weight reduction)
- Hypoglycemia minimization priority: DPP-4 inhibitors (sitagliptin, linagliptin) or GLP-1 RA or SGLT2i (low hypoglycemia risk)
- Cost consideration: metformin + sulfonylurea (glipizide, glimepiride) or NPH insulin as low-cost options

INSULIN THERAPY:
- Initiate if A1c >10%, symptomatic hyperglycemia, or failure of ≥2 non-insulin agents
- Basal insulin first: glargine (Lantus/Toujeo) or detemir; start 10 units at bedtime or 0.1–0.2 units/kg; titrate by 2 units every 3 days to FBG 80–130 mg/dL
- Add prandial insulin if basal not sufficient: rapid-acting (lispro, aspart, glulisine) with largest meal first; titrate
- Premixed insulins (70/30): less flexible but useful for adherence issues

MONITORING:
- A1c every 3 months until stable at goal, then every 6 months
- Annual: urine albumin/creatinine ratio (UACR), serum creatinine/eGFR, lipid panel, foot exam, dilated eye exam, dental, depression screening (PHQ-2/PHQ-9)
- Blood pressure target: <130/80 mmHg; preferred antihypertensives in DM: ACE inhibitor or ARB (especially with albuminuria)
- LDL target: <100 mg/dL (high-intensity statin if ASCVD risk >10%); <70 mg/dL for established ASCVD
- Annual influenza, pneumococcal (PPSV23 or PCV15/20), HBV (if <60 and unvaccinated), COVID vaccine, zoster

COMPLICATION SCREENING TIMELINE:
At diagnosis: A1c, UACR, CMP, lipids, dilated eye exam, foot exam, dental referral
Year 1 and annually thereafter: UACR, eGFR, foot exam, retinal screen, dental
As indicated: ABI if symptoms of PAD; ECG if cardiac symptoms`,
    url: "https://diabetesjournals.org/care/issue/47/Supplement_1",
  },

  {
    source: "AHA/ASA",
    tier: 2,
    guideline_title: "TIA and Minor Stroke — Early Management and Secondary Stroke Prevention",
    guideline_year: "2021",
    abfm_domain: "Neurology",
    section: "Stroke / TIA — TIA Evaluation, ABCD2 Score, and Secondary Prevention",
    content: `TRANSIENT ISCHEMIC ATTACK (TIA) AND MINOR STROKE — AHA/ASA 2021:

DEFINITION:
TIA: transient neurological dysfunction from focal brain, spinal cord, or retinal ischemia WITHOUT acute infarction on imaging (time-based definition of <24h is no longer used — tissue-based preferred)
Minor stroke: NIHSS ≤3, independent prior to event

ABCD2 SCORE (risk of early stroke after TIA):
A — Age ≥60: 1 point
B — Blood pressure ≥140/90 on presentation: 1 point
C — Clinical features: unilateral weakness 2 pts, speech disturbance without weakness 1 pt
D — Duration: ≥60 min = 2 pts; 10–59 min = 1 pt
D — Diabetes: 1 point
Score 0–3: low risk (~1% 2-day stroke risk); Score 4–5: moderate (~4%); Score 6–7: high (~8%)
Note: ABCD2 alone insufficient — all TIA patients require urgent evaluation within 24 hours regardless of score

URGENT WORKUP (within 24 hours of TIA):
- Brain MRI with DWI (detects small infarcts missed by CT); if MRI unavailable: CT head
- Vascular imaging: CTA head/neck or MRA to evaluate for carotid stenosis, intracranial stenosis, dissection
- Cardiac monitoring: ECG immediately; telemetry or 30-day event monitor for paroxysmal AFib (causes ~30% of cardioembolic strokes)
- Echocardiogram: if cardiac source suspected (young patient, bilateral infarcts, PFO concern)
- Labs: CBC, BMP, glucose, INR/PTT, lipid panel, HbA1c, ESR (if GCA suspected)

ANTIPLATELET THERAPY — DUAL ANTIPLATELET (DAPT):
- High-risk TIA (ABCD2 ≥4) or minor stroke (NIHSS ≤3) without AFib: aspirin 325 mg PLUS clopidogrel 75 mg for 21 days (POINT trial), then aspirin monotherapy 81–325 mg indefinitely
- CHANCE trial (Chinese): aspirin + clopidogrel for 21 days then clopidogrel monotherapy also validated
- Do NOT use warfarin or DOAC for non-cardioembolic TIA/minor stroke (no benefit over antiplatelet)

ANTICOAGULATION — CARDIOEMBOLIC (AFib-related):
- AFib-related TIA: start anticoagulation early (DOAC preferred: apixaban, rivaroxaban, dabigatran, edoxaban)
- Timing: minor TIA/stroke → can start immediately; moderate stroke → 3–7 days; large stroke → 7–14 days (to reduce hemorrhagic transformation risk)

CAROTID STENOSIS:
- Symptomatic stenosis 70–99% (ipsilateral to TIA): carotid endarterectomy (CEA) within 2 weeks (maximum benefit if done early); CEA superior to carotid stenting in most patients >70 years
- Symptomatic stenosis 50–69%: CEA recommended, benefit less robust
- Symptomatic stenosis <50%: medical management only

SECONDARY STROKE PREVENTION (all TIA/stroke patients):
- Antihypertensive: target BP <130/80 mmHg; start after 24–48 hours if stable; ACE inhibitor + thiazide-like diuretic preferred
- High-intensity statin: atorvastatin 40–80 mg or rosuvastatin 20–40 mg; LDL target <70 mg/dL (or reduce by ≥50%)
- Glycemic control: target A1c <7% in diabetic patients
- Lifestyle: smoking cessation (doubles stroke risk), alcohol reduction (>2 drinks/day increases risk), Mediterranean diet, physical activity
- AFib management: rate control + anticoagulation; rhythm control if symptomatic`,
    url: "https://www.ahajournals.org/doi/10.1161/STR.0000000000000375",
  },

  {
    source: "ACC/AHA",
    tier: 2,
    guideline_title: "Cardiac Arrhythmias — Heart Block, Bradyarrhythmias, and SVT Management",
    guideline_year: "2019",
    abfm_domain: "Cardiovascular",
    section: "Heart Block and Cardiac Arrhythmias — Classification, EKG Features, and Management",
    content: `HEART BLOCK AND CARDIAC ARRHYTHMIAS — ACC/AHA 2019 GUIDELINES:

AV HEART BLOCK — CLASSIFICATION AND MANAGEMENT:
First-Degree AV Block: PR interval >200 ms (0.20 sec); all P waves conduct to ventricles; usually benign; no treatment required; monitor if PR >300 ms or new onset
Second-Degree AV Block Type I (Mobitz I / Wenckebach): progressive PR prolongation until P wave drops (non-conducted); associated with inferior MI, increased vagal tone, medication toxicity; usually benign; pacemaker rarely needed (only if symptomatic)
Second-Degree AV Block Type II (Mobitz II): constant PR interval with sudden non-conducted P wave (no preceding PR prolongation); HIGH RISK for complete heart block; pacemaker indicated even if asymptomatic; associated with anterior MI, conduction system disease
2:1 AV Block: every other P wave not conducted; cannot distinguish Mobitz I vs II — need longer rhythm strip; treat as Mobitz II (pacemaker)
Third-Degree (Complete) Heart Block: no P waves conduct to ventricles; P and QRS dissociated; ventricular escape rhythm (rate 20–40 bpm); URGENT pacemaker indicated; causes: inferior MI (usually reversible), Lyme disease, digoxin toxicity, AV nodal ablation

PACEMAKER INDICATIONS (Class I — definitive):
- Symptomatic sinus node dysfunction (sick sinus syndrome): symptomatic bradycardia, chronotropic incompetence
- Symptomatic bradycardia from AV block at any level
- Third-degree AV block
- Second-degree Mobitz II AV block (symptomatic or asymptomatic if associated with structural heart disease)
- Alternating bundle branch block

SUPRAVENTRICULAR TACHYCARDIA (SVT):
AVNRT (AV node re-entry — most common SVT): narrow complex tachycardia 150–250 bpm; "pseudo-R'" in V1 (retrograde P wave); treat acute: vagal maneuvers → adenosine 6 mg IV rapid push (may repeat 12 mg x2); if hemodynamically unstable: synchronized cardioversion
AVRT (accessory pathway, e.g., WPW): delta wave on EKG (short PR + slurred QRS upstroke); pre-excitation; AVOID adenosine, verapamil, digoxin in pre-excitation + AFib (can accelerate conduction → VF); treat with procainamide IV or cardioversion
Atrial flutter: sawtooth flutter waves ~300 bpm with 2:1 block (ventricular rate ~150 bpm); rate control → cardioversion; anticoagulate same as AFib

VENTRICULAR ARRHYTHMIAS:
PVCs: benign if <10,000/24h and normal cardiac function; treat underlying cause (caffeine, electrolytes, ischemia); beta-blocker if symptomatic; ablation for PVC-mediated cardiomyopathy (>15–20% burden)
Sustained VT (>30 sec or hemodynamically unstable): ACLS protocol; IV amiodarone 150 mg over 10 min or lidocaine; cardioversion if unstable; ICD if EF <35% or recurrent VT
VF: immediate defibrillation (200J biphasic)

BRADYCARDIA MANAGEMENT:
Symptomatic bradycardia (HR <50 with hypotension, altered mental status, ischemia, pulmonary edema):
- Atropine 1 mg IV (first-line for vagally mediated or AV nodal block); may repeat to 3 mg total
- Transcutaneous pacing: for unstable bradycardia not responding to atropine
- Dopamine or epinephrine infusion while arranging transvenous pacing
- Transvenous pacemaker: definitive bridge to permanent pacemaker

LONG QT SYNDROME:
QTc >450 ms (males) / >470 ms (females); risk of Torsades de Pointes (TdP) → VF
Common drug causes of acquired QT prolongation: macrolides (azithromycin), fluoroquinolones, antipsychotics (haloperidol, quetiapine), antifungals, methadone, ondansetron; check QTc before starting
Congenital LQTS: refer to electrophysiology; avoid QT-prolonging drugs; consider beta-blocker (propranolol/nadolol); ICD for survivors of cardiac arrest or high-risk mutation (LQT3)`,
    url: "https://www.acc.org/guidelines/hubs/cardiac-arrhythmias",
  },

  {
    source: "AHA/ACCP",
    tier: 2,
    guideline_title: "Pulmonary Embolism Treatment — Anticoagulation, Risk Stratification, and Thrombolysis",
    guideline_year: "2021",
    abfm_domain: "Pulmonary & Allergy",
    section: "Pulmonary Embolism — Treatment, Risk Stratification, Anticoagulation Selection, and Thrombolysis",
    content: `PULMONARY EMBOLISM — TREATMENT AND MANAGEMENT (AHA/ACCP 2021):

RISK STRATIFICATION (after PE confirmed):
Massive PE (high-risk): hemodynamic instability — sustained hypotension (SBP <90 mmHg ≥15 min), shock, cardiac arrest, or need for vasopressors → immediate systemic thrombolysis + anticoagulation
Submassive PE (intermediate-risk): hemodynamically STABLE but with RV dysfunction on echo (RV:LV ratio >0.9) AND/OR elevated troponin/BNP → anticoagulation first; consider catheter-directed thrombolysis (CDT) or surgical embolectomy if deteriorates
Low-risk PE: hemodynamically stable, no RV dysfunction, no elevated biomarkers → anticoagulation; consider early discharge (outpatient management if HESTIA criteria met)

HESTIA CRITERIA (outpatient eligibility — all must be NO):
- Hemodynamically unstable
- Thrombolysis/embolectomy needed
- Active bleeding or high bleeding risk
- O2 requirement >24h
- PE diagnosed on anticoagulation
- Severe pain requiring IV analgesia >24h
- Medical or social reason for hospitalization
- Creatinine clearance <30 mL/min or severe hepatic impairment
- Pregnancy
- HIT in past 3 months or platelets <75K
→ If all HESTIA criteria = NO: outpatient treatment is safe (early discharge within 24h)

ANTICOAGULATION SELECTION:
Initial (first 5–10 days):
- DOACs preferred: rivaroxaban 15 mg BID x21 days, then 20 mg daily; OR apixaban 10 mg BID x7 days, then 5 mg BID
- Parenteral bridge NOT needed with rivaroxaban or apixaban (oral-only regimens)
- LMWH (enoxaparin 1 mg/kg BID or 1.5 mg/kg daily) if DOAC not feasible; bridge to warfarin OR continue LMWH (preferred in cancer-associated VTE: LMWH or rivaroxaban/apixaban preferred over warfarin)
- UFH: for massive PE (easier to reverse), severe renal failure (CrCl <30), or pre-surgical

Long-term (3–12 months) and extended anticoagulation:
- Provoked PE (surgery/trauma/hospitalization): 3 months → stop and reassess
- Provoked PE (minor transient risk factor: OCP, pregnancy, travel): 3 months minimum
- Unprovoked PE: minimum 3 months; strongly consider extended anticoagulation (indefinite) — reduced-dose DOACs (apixaban 2.5 mg BID or rivaroxaban 10 mg daily) after initial 6 months for extended therapy
- Cancer-associated PE: treat until cancer resolved; preferred: LMWH or DOAC (apixaban, rivaroxaban, edoxaban); avoid DOACs if high GI bleeding risk (luminal GI cancer)
- Recurrent unprovoked VTE: indefinite anticoagulation

SYSTEMIC THROMBOLYSIS (massive PE):
- Indication: massive PE (hemodynamic instability)
- Alteplase (tPA) 100 mg IV over 2 hours (standard dose); or 0.6 mg/kg over 15 min if cardiac arrest
- Absolute contraindications: prior intracranial hemorrhage, ischemic stroke <3 months, intracranial malignancy, active bleeding, significant head trauma <3 months
- After thrombolysis: hold UFH during infusion; resume when PTT <80 sec

CATHETER-DIRECTED THROMBOLYSIS (CDT): for submassive PE or massive PE with thrombolysis contraindication; lower dose tPA delivered directly to clot via catheter; lower bleeding risk than systemic

IVC FILTER: not recommended routinely; consider ONLY if anticoagulation absolutely contraindicated AND high PE recurrence risk; temporary filters must be removed when anticoagulation can be resumed

FOLLOW-UP:
- Repeat echocardiogram at 3–6 months (assess for CTEPH — chronic thromboembolic pulmonary hypertension; suspect if persistent dyspnea + elevated RVSP)
- V/Q scan at 3–6 months if CTEPH suspected
- Hypercoagulability workup for unprovoked PE: antiphospholipid antibodies, factor V Leiden, prothrombin mutation, protein C/S, antithrombin; test 3 months after completing anticoagulation (before re-starting)`,
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000963",
  },

  {
    source: "NCCN / AAFP",
    tier: 2,
    guideline_title: "Leukemia and Lymphoma — Recognition, Workup, and Referral in Primary Care",
    guideline_year: "2023",
    abfm_domain: "Hematology & Oncology",
    section: "Leukemia and Lymphoma — Red Flags, Initial Workup, and Referral Criteria",
    content: `LEUKEMIA AND LYMPHOMA — PRIMARY CARE RECOGNITION AND REFERRAL (NCCN/AAFP 2023):

RED FLAG SYMPTOMS REQUIRING PROMPT WORKUP:
- Unexplained lymphadenopathy (nodes >1 cm, firm, non-tender, >4–6 weeks, supraclavicular/mediastinal)
- Unexplained splenomegaly or hepatomegaly
- B symptoms: fever >38°C, drenching night sweats, unintentional weight loss >10% over 6 months (classic for lymphoma)
- Unexplained fatigue, pallor, easy bruising, petechiae
- Bone pain without trauma (myeloma, leukemia)
- Hypercalcemia of unknown etiology
- Abnormal CBC: unexplained leukocytosis, leukopenia, anemia, thrombocytopenia, or blasts on peripheral smear

INITIAL WORKUP IN PRIMARY CARE:
CBC with differential: key first test
- Leukocytosis >100K with blasts → acute leukemia (EMERGENCY — same-day hematology referral)
- Lymphocytosis with smudge cells on peripheral smear → CLL (confirm with flow cytometry)
- WBC 12–100K with mature lymphocytes → evaluate CLL vs. reactive
- Unexplained anemia + elevated protein gap + hypercalcemia → myeloma workup
- Pancytopenia → evaluate for aplastic anemia, myelodysplasia, acute leukemia

Peripheral blood smear: always obtain if CBC abnormal; look for blasts (>20% = acute leukemia), Auer rods (AML), lymphocytosis with smudge cells (CLL), atypical lymphocytes (infectious mononucleosis, reactive)

Myeloma workup: SPEP (serum protein electrophoresis) + UPEP, serum free light chains, beta-2 microglobulin, LDH, calcium, BMP, uric acid, skeletal survey; refer hematology if M-protein detected

Lymphoma workup: CT chest/abdomen/pelvis with contrast; LDH (elevated in aggressive lymphoma); CBC, CMP, uric acid; refer hematology-oncology for biopsy

LEUKEMIA TYPES — HIGH-YIELD DISTINCTIONS:
Acute Myeloid Leukemia (AML): blasts in marrow/blood; Auer rods pathognomonic; presents acutely with pancytopenia; emergency referral
Acute Lymphoblastic Leukemia (ALL): most common pediatric cancer; lymphoblasts; common in children 2–5 years; also adults; TdT positive; emergency referral
Chronic Myeloid Leukemia (CML): Ph chromosome (t(9;22), BCR-ABL); markedly elevated WBC with full myeloid maturation (basophilia prominent); treated with imatinib (TKI); refer urgent but not emergent
Chronic Lymphocytic Leukemia (CLL): most common adult leukemia; CD5+/CD19+/CD23+ mature B-cells; smudge cells; Rai staging; many patients observed (watch and wait); warm autoimmune hemolytic anemia complication; refer hematology

HODGKIN vs. NON-HODGKIN LYMPHOMA:
Hodgkin Lymphoma (HL): Reed-Sternberg cells ("owl-eye" cells); young adults 15–35 and age >55 bimodal; mediastinal mass; B symptoms; excellent prognosis with ABVD chemotherapy ± radiation
Non-Hodgkin Lymphoma (NHL): heterogeneous group; Diffuse Large B-Cell Lymphoma (DLBCL) most common aggressive NHL; Follicular Lymphoma most common indolent NHL; treated with R-CHOP (rituximab + CHOP)
Burkitt Lymphoma: "starry sky" pattern; jaw mass in endemic form; c-myc translocation; highly aggressive — emergency

MYELOMA RED FLAGS (CRAB criteria):
C — Calcium elevated (>11 mg/dL)
R — Renal failure (Cr >2 or GFR <40)
A — Anemia (Hb <10 g/dL)
B — Bone lesions (lytic lesions on skeletal survey) or bone pain
→ Any CRAB criterion = symptomatic myeloma requiring systemic therapy (refer urgently)

REFERRAL URGENCY:
- Blasts on peripheral smear or WBC >100K: SAME DAY emergency hematology referral
- Suspected myeloma with CRAB criteria: urgent within 1–2 weeks
- Suspected lymphoma (B symptoms + lymphadenopathy): urgent within 2 weeks
- CLL without treatment criteria: non-urgent referral acceptable`,
    url: "https://www.nccn.org/guidelines/category_1",
  },
];