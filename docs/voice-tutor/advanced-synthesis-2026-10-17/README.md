# Advanced clinical synthesis expansion

Version: fm-tutor-curriculum-2026-10-17-v8

28 active cases: four upgraded under their existing IDs and 24 additional cases. The merged specialist catalog now contains 301 lessons. Original library topics, medication courses, criteria scope and assessment items retain their existing coverage. The nonvoice application and thumbnail are unchanged.

## Practice behavior

Each case has nine reasoning stages, three supplied data packets (84 total), competing hypotheses, explicitly unknown findings, eight case-specific qualitative feedback dimensions, a 30–60 second handoff, one targeted retry and a changed-factor challenge. Default tutoring asks one question at a time and releases findings after stages 3, 4 and 6. Explicit requests may change stage or practice mode. Case premises and later findings are authored simulations; they are not guideline evidence.

The default opening does not show the teaching differential or feedback anchors. Teaching notes remain an explicit reveal. Voice requests support full case, presentation only, challenge my plan, early debrief and retry. These behaviors are provider instructions; software checks do not establish model adherence in every conversation.

Related medication/criteria lessons load only for the selected case, including exact scoped sources and safety profiles. A comparison drug is not automatically eligible, and purpose-only criteria do not gain a scoring table. Feedback must cite observed learner reasoning, distinguish reasonable alternatives from unsafe actions, mark absent responses not observed, and avoid numerical clinical grades or mastery claims. Checkpoints retain case ID, stage, released packet IDs, working assessment, pending question and retry count through the existing save tool.

## Case manifest

| Case | Domain | ID |
|---|---|---|
| Confusion, falls and polypharmacy | geriatrics / neurology | `advanced-confusion` |
| Kidney function decline with competing chronic treatments | renal / multimorbidity | `advanced-kidney` |
| Fatigue and possible bleeding during anticoagulation | hematology / cardiovascular | `advanced-bleeding` |
| Heart failure, CKD and a complicated medication transition | cardiovascular / transitions | `advanced-heart-failure` |
| Fever, flank pain and potassium risk | infection / renal | `advanced-infection` |
| Dyspnea with overlapping cardiac and pulmonary disease | pulmonary / cardiovascular | `advanced-dyspnea` |
| Recurrent hypoglycemia and treatment burden | geriatrics / endocrinology | `advanced-hypoglycemia` |
| Pregnancy, upper urinary infection and resistance | obstetrics / infection | `advanced-pregnancy` |
| Advanced HIV with hypoxemia and treatment constraints | HIV / pulmonary infection | `advanced-hiv` |
| Recurrent diarrhea, diagnostic uncertainty and prevention | infection / gastroenterology | `advanced-cdi` |
| Foot infection, perfusion and bone involvement | infection / vascular disease | `advanced-diabetic-foot` |
| Presyncope with tick exposure and conduction disease | adolescent / cardiovascular infection | `advanced-lyme-heart` |
| New hypoxemia during a sickle cell pain admission | pediatrics / hematology | `advanced-sickle-chest` |
| Pediatric pneumonia with a pleural complication | pediatrics / pulmonary infection | `advanced-child-pneumonia` |
| Anticoagulated head injury with uncertain home support | geriatrics / emergency care | `advanced-head-injury` |
| Well-appearing neonate with uncertain maternal treatment | neonatal / infection | `advanced-congenital-syphilis` |
| Pelvic infection with oral intolerance and a collection | reproductive health / infection | `advanced-pid` |
| Visual symptoms with newly reactive syphilis testing | infection / ophthalmology | `advanced-neurosyphilis` |
| Ascites, renal decline and altered cognition | hepatology / infection | `advanced-cirrhosis` |
| Acute upper GI bleeding in cirrhosis | hepatology / emergency care | `advanced-portal-bleeding` |
| Reduced sleep and risky behavior after an antidepressant change | mental health / medication safety | `advanced-mood-activation` |
| Bacteremia with a prosthetic valve and renal constraints | cardiovascular / infection | `advanced-prosthetic-endocarditis` |
| Resolved focal symptoms with ongoing vascular risk | neurology / cardiovascular | `advanced-tia` |
| Rapid soft-tissue deterioration with interaction risks | infection / emergency surgery | `advanced-necrotizing-infection` |
| Early chest-pain testing with misleading reassurance | cardiovascular / emergency care | `advanced-chest-pain` |
| Postmenopausal iron deficiency with competing explanations | hematology / gastroenterology | `advanced-anemia` |
| An AF dose rule applied to a new DVT | hematology / transitions | `advanced-anticoagulant-transition` |
| Pancreatic necrosis with a changing infection picture | gastroenterology / critical care | `advanced-pancreatic-necrosis` |

## Evidence and review limits

New primary-source entries cover ADA 2026 older-adult/hypoglycemia recommendations, AHA/ACC heart failure and chest-pain guidance, the AHA TIA statement, AGA iron-deficiency evaluation, NIMH bipolar assessment and NIH PCP oxygenation/ART recommendations. Existing source-scoped IDSA, CDC, ACOG, NIH and FDA lessons support the other comparisons. Each case and source records evidence scope and gaps. Publisher-indexed extracts were used where direct full text was unavailable; those entries say so. Access dates are not publication dates or a guarantee of the latest guidance. No commercial reference is represented as connected.

No individualized resuscitation, sodium correction, transfusion, psychiatric drug, emergency anticoagulant reversal or missing scoring protocol is invented. Independent clinician/pharmacist validation remains pending. Real-device microphone/audio and model-generated medical responses have not been verified for this expansion.

## Software verification

65 automated tests pass, including authenticated search/selection of all 156 original topics and all 301 specialist lessons; evidence linkage and assessment isolation; all 28 case previews and all 84 manual UI finding reveals; checkpoint/progress and existing review/practice workflows. The tutor bundle, isolated TypeScript and whitespace checks also pass. These are software checks, not clinical validation.

The canonical active case module is `artifacts/api-server/voice-tutor/advanced-synthesis.json`. The original four entries in `curriculum.json` remain historical starter data and are filtered out before the active module is merged, preserving their stable IDs. The antibiotic release version is exposed separately as `antibioticContentVersion`.
