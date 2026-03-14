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
];
