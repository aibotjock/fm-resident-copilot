export type ClinicalMode = "point_of_care" | "documentation" | "board_prep" | "flashcards";

export interface Condition {
  name: string;
  system: string;
}

export interface QueryHistory {
  id: string;
  query: string;
  mode: ClinicalMode;
  condition?: string;
  response: string;
  timestamp: number;
  system?: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export const MODE_LABELS: Record<ClinicalMode, string> = {
  point_of_care: "Point of Care",
  documentation: "Documentation",
  board_prep: "Board Prep",
  flashcards: "Flashcards",
};

export const MODE_DESCRIPTIONS: Record<ClinicalMode, string> = {
  point_of_care: "Quick clinical reference",
  documentation: "Charting essentials",
  board_prep: "ABFM exam prep",
  flashcards: "Anki-style review",
};

export const SYSTEMS = [
  "Cardiovascular",
  "Pulmonary",
  "Endocrine",
  "GI",
  "Neurology",
  "Psychiatry",
  "Musculoskeletal",
  "Dermatology",
  "Infectious Disease",
  "Preventive/Screening",
  "Women's Health",
  "Pediatrics",
  "Renal",
  "Hematology",
];

export const CONDITIONS: Condition[] = [
  { name: "Heart Failure", system: "Cardiovascular" },
  { name: "Hypertension", system: "Cardiovascular" },
  { name: "Atrial Fibrillation", system: "Cardiovascular" },
  { name: "Coronary Artery Disease", system: "Cardiovascular" },
  { name: "Dyslipidemia", system: "Cardiovascular" },
  { name: "Peripheral Arterial Disease", system: "Cardiovascular" },
  { name: "Deep Vein Thrombosis", system: "Cardiovascular" },
  { name: "Pulmonary Embolism", system: "Cardiovascular" },
  { name: "COPD", system: "Pulmonary" },
  { name: "Asthma", system: "Pulmonary" },
  { name: "Community-Acquired Pneumonia", system: "Pulmonary" },
  { name: "Sleep Apnea", system: "Pulmonary" },
  { name: "Pulmonary Hypertension", system: "Pulmonary" },
  { name: "Interstitial Lung Disease", system: "Pulmonary" },
  { name: "Type 2 Diabetes", system: "Endocrine" },
  { name: "Type 1 Diabetes", system: "Endocrine" },
  { name: "Hypothyroidism", system: "Endocrine" },
  { name: "Hyperthyroidism", system: "Endocrine" },
  { name: "Metabolic Syndrome", system: "Endocrine" },
  { name: "Cushing's Syndrome", system: "Endocrine" },
  { name: "Adrenal Insufficiency", system: "Endocrine" },
  { name: "GERD", system: "GI" },
  { name: "Peptic Ulcer Disease", system: "GI" },
  { name: "Irritable Bowel Syndrome", system: "GI" },
  { name: "Inflammatory Bowel Disease", system: "GI" },
  { name: "Celiac Disease", system: "GI" },
  { name: "Cirrhosis", system: "GI" },
  { name: "Acute Pancreatitis", system: "GI" },
  { name: "Colorectal Cancer Screening", system: "GI" },
  { name: "Migraine", system: "Neurology" },
  { name: "Epilepsy", system: "Neurology" },
  { name: "Stroke", system: "Neurology" },
  { name: "TIA", system: "Neurology" },
  { name: "Multiple Sclerosis", system: "Neurology" },
  { name: "Parkinson's Disease", system: "Neurology" },
  { name: "Dementia / Alzheimer's", system: "Neurology" },
  { name: "Peripheral Neuropathy", system: "Neurology" },
  { name: "Major Depressive Disorder", system: "Psychiatry" },
  { name: "Generalized Anxiety Disorder", system: "Psychiatry" },
  { name: "Panic Disorder", system: "Psychiatry" },
  { name: "Bipolar Disorder", system: "Psychiatry" },
  { name: "PTSD", system: "Psychiatry" },
  { name: "ADHD", system: "Psychiatry" },
  { name: "Alcohol Use Disorder", system: "Psychiatry" },
  { name: "Opioid Use Disorder", system: "Psychiatry" },
  { name: "Osteoarthritis", system: "Musculoskeletal" },
  { name: "Rheumatoid Arthritis", system: "Musculoskeletal" },
  { name: "Gout", system: "Musculoskeletal" },
  { name: "Low Back Pain", system: "Musculoskeletal" },
  { name: "Osteoporosis", system: "Musculoskeletal" },
  { name: "Fibromyalgia", system: "Musculoskeletal" },
  { name: "Rotator Cuff Injury", system: "Musculoskeletal" },
  { name: "Acne Vulgaris", system: "Dermatology" },
  { name: "Psoriasis", system: "Dermatology" },
  { name: "Eczema / Atopic Dermatitis", system: "Dermatology" },
  { name: "Cellulitis", system: "Dermatology" },
  { name: "Melanoma Screening", system: "Dermatology" },
  { name: "Tinea Infections", system: "Dermatology" },
  { name: "Rosacea", system: "Dermatology" },
  { name: "Urinary Tract Infection", system: "Infectious Disease" },
  { name: "Skin and Soft Tissue Infection", system: "Infectious Disease" },
  { name: "Influenza", system: "Infectious Disease" },
  { name: "COVID-19", system: "Infectious Disease" },
  { name: "HIV Management", system: "Infectious Disease" },
  { name: "Sexually Transmitted Infections", system: "Infectious Disease" },
  { name: "Lyme Disease", system: "Infectious Disease" },
  { name: "Tuberculosis Screening", system: "Infectious Disease" },
  { name: "Colorectal Cancer Screening", system: "Preventive/Screening" },
  { name: "Lung Cancer Screening", system: "Preventive/Screening" },
  { name: "Breast Cancer Screening", system: "Preventive/Screening" },
  { name: "Cervical Cancer Screening", system: "Preventive/Screening" },
  { name: "Prostate Cancer Screening", system: "Preventive/Screening" },
  { name: "Adult Immunizations", system: "Preventive/Screening" },
  { name: "Cardiovascular Risk Reduction", system: "Preventive/Screening" },
  { name: "Prenatal Care", system: "Women's Health" },
  { name: "Gestational Diabetes", system: "Women's Health" },
  { name: "Preeclampsia", system: "Women's Health" },
  { name: "Menopause Management", system: "Women's Health" },
  { name: "Polycystic Ovary Syndrome", system: "Women's Health" },
  { name: "Contraception", system: "Women's Health" },
  { name: "Postpartum Depression", system: "Women's Health" },
  { name: "Endometriosis", system: "Women's Health" },
  { name: "Well Child Visit", system: "Pediatrics" },
  { name: "Childhood Immunizations", system: "Pediatrics" },
  { name: "Pediatric Asthma", system: "Pediatrics" },
  { name: "Otitis Media", system: "Pediatrics" },
  { name: "Febrile Infant", system: "Pediatrics" },
  { name: "Autism Screening", system: "Pediatrics" },
  { name: "Pediatric ADHD", system: "Pediatrics" },
  { name: "Failure to Thrive", system: "Pediatrics" },
  { name: "Chronic Kidney Disease", system: "Renal" },
  { name: "Acute Kidney Injury", system: "Renal" },
  { name: "Nephrolithiasis", system: "Renal" },
  { name: "Hyperkalemia", system: "Renal" },
  { name: "Iron Deficiency Anemia", system: "Hematology" },
  { name: "B12 / Folate Deficiency", system: "Hematology" },
  { name: "Sickle Cell Disease", system: "Hematology" },
  { name: "Anticoagulation Management", system: "Hematology" },
];

export function getModePrompt(mode: ClinicalMode, conditionName: string): string {
  const prompts: Record<ClinicalMode, string> = {
    point_of_care: `Give me a point-of-care clinical reference for ${conditionName} including diagnosis criteria, classification, initial treatment, escalation, hospitalization criteria, board pearl, and source overlap.`,
    documentation: `What should I chart for ${conditionName}? Include relevant history, physical exam findings, labs/workup, assessment/plan prompts, counseling points, and follow-up recommendations.`,
    board_prep: `Give me ABFM board preparation content for ${conditionName} including high-yield pearls, common exam traps, and a board-style multiple choice vignette with answer and explanation.`,
    flashcards: `Generate 5 Anki-style flashcards for ${conditionName} covering key diagnostic criteria, treatments, and board-relevant clinical facts.`,
  };
  return prompts[mode];
}
