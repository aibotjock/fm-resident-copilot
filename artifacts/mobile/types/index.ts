export type ClinicalMode =
  | "point_of_care"
  | "documentation"
  | "ddx"
  | "board_prep"
  | "flashcards";

export type AppMode = "clinical" | "study";

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
  abfmDomain?: string;
}

export interface Bookmark {
  id: string;
  query: string;
  mode: ClinicalMode;
  condition?: string;
  response: string;
  system?: string;
  timestamp: number;
  note?: string;
  abfmDomain?: string;
}

export interface SRSCard {
  id: string;
  front: string;
  back: string;
  condition?: string;
  topic: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: number;
  createdAt: number;
  lastReviewed?: number;
  abfmDomain?: string;
}

export type SRSRating = 0 | 1 | 3 | 4;

export interface Flashcard {
  front: string;
  back: string;
}

export interface CitationEntry {
  source: string;
  year?: string;
  guideline?: string;
  confidence: "direct" | "peripheral" | "outside";
  note?: string;
}

export interface CitationMetadata {
  domain: string;
  weight: string;
  citations: CitationEntry[];
  limitation: string | null;
}

export interface ABFMDomainCoverage {
  domain: string;
  displayName: string;
  weight: number;
  queryCount: number;
  flashcardCount: number;
  masteredCount: number;
}

export interface ITEScore {
  id: string;
  year: 1 | 2 | 3;
  takenDate: string;
  scores: Record<string, number>;
  createdAt: number;
}

export const ABFM_ITE_SECTIONS = [
  "Cardiovascular",
  "Musculoskeletal",
  "Psychiatry & Behavioral Health",
  "Endocrine & Metabolic",
  "Preventive Medicine & Health Maintenance",
  "Women's Health & Reproductive Medicine",
  "Gastrointestinal",
  "Pulmonary & Allergy",
  "Infectious Disease",
  "Neurology",
  "Dermatology",
  "Renal & Urology",
  "Pediatrics",
  "Hematology & Oncology",
  "Geriatrics",
  "Multisystem & Other",
] as const;

export type ABFMITESection = (typeof ABFM_ITE_SECTIONS)[number];

export const ABFM_DOMAIN_WEIGHTS: Record<string, number> = {
  "Cardiovascular": 10,
  "Musculoskeletal": 10,
  "Psychiatry & Behavioral Health": 8,
  "Endocrine & Metabolic": 8,
  "Preventive Medicine & Health Maintenance": 8,
  "Women's Health & Reproductive Medicine": 7,
  "Gastrointestinal": 6,
  "Pulmonary & Allergy": 6,
  "Infectious Disease": 6,
  "Neurology": 5,
  "Dermatology": 5,
  "Renal & Urology": 5,
  "Pediatrics": 5,
  "Hematology & Oncology": 4,
  "Geriatrics": 4,
  "Multisystem & Other": 3,
};

export const MODE_LABELS: Record<ClinicalMode, string> = {
  point_of_care: "Point of Care",
  documentation: "Documentation",
  ddx: "Differential Dx",
  board_prep: "Board Prep",
  flashcards: "Flashcards",
};

export const MODE_DESCRIPTIONS: Record<ClinicalMode, string> = {
  point_of_care: "Guideline-directed clinical reference",
  documentation: "Charting and coding essentials",
  ddx: "Symptom → evidence-based DDx",
  board_prep: "ABFM ITE exam preparation",
  flashcards: "Spaced repetition review",
};

export function getModePrompt(mode: ClinicalMode, condition: string): string {
  const prompts: Record<ClinicalMode, string> = {
    point_of_care: `Guideline-directed clinical reference for ${condition}: diagnosis criteria, classification, first-line treatment, monitoring targets, and escalation thresholds — all from indexed sources only.`,
    documentation: `SOAP note and charting template for ${condition} with ICD-10 code, HPI elements, assessment, plan, and billing documentation requirements.`,
    ddx: `Evidence-based differential diagnosis for a presentation suggesting ${condition}: ranked differential with must-not-miss, decision branch, and first workup orders from indexed guidelines.`,
    board_prep: `ABFM board preparation for ${condition}: high-yield pearls, key numbers, exam traps, guideline conflicts, and a board-style vignette — from indexed sources only.`,
    flashcards: `Generate 6 Anki-style flashcards for ${condition} covering diagnosis, treatment, monitoring, and board-tested facts — each backed by an indexed guideline source.`,
  };
  return prompts[mode];
}

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
  { name: "Heart Block / Arrhythmia", system: "Cardiovascular" },
  { name: "Asthma", system: "Pulmonary" },
  { name: "COPD", system: "Pulmonary" },
  { name: "Pneumonia", system: "Pulmonary" },
  { name: "Pulmonary Embolism", system: "Pulmonary" },
  { name: "Obstructive Sleep Apnea", system: "Pulmonary" },
  { name: "Pleural Effusion", system: "Pulmonary" },
  { name: "Type 2 Diabetes Mellitus", system: "Endocrine" },
  { name: "Type 1 Diabetes Mellitus", system: "Endocrine" },
  { name: "Hypothyroidism", system: "Endocrine" },
  { name: "Hyperthyroidism", system: "Endocrine" },
  { name: "Adrenal Insufficiency", system: "Endocrine" },
  { name: "Metabolic Syndrome", system: "Endocrine" },
  { name: "GERD", system: "GI" },
  { name: "Peptic Ulcer Disease", system: "GI" },
  { name: "Irritable Bowel Syndrome", system: "GI" },
  { name: "Inflammatory Bowel Disease", system: "GI" },
  { name: "Celiac Disease", system: "GI" },
  { name: "Liver Cirrhosis", system: "GI" },
  { name: "Colorectal Cancer Screening", system: "GI" },
  { name: "Stroke / TIA", system: "Neurology" },
  { name: "Migraine", system: "Neurology" },
  { name: "Epilepsy", system: "Neurology" },
  { name: "Parkinson's Disease", system: "Neurology" },
  { name: "Dementia / Alzheimer's", system: "Neurology" },
  { name: "Multiple Sclerosis", system: "Neurology" },
  { name: "Peripheral Neuropathy", system: "Neurology" },
  { name: "Major Depressive Disorder", system: "Psychiatry" },
  { name: "Generalized Anxiety Disorder", system: "Psychiatry" },
  { name: "Bipolar Disorder", system: "Psychiatry" },
  { name: "ADHD", system: "Psychiatry" },
  { name: "PTSD", system: "Psychiatry" },
  { name: "Schizophrenia", system: "Psychiatry" },
  { name: "Substance Use Disorder", system: "Psychiatry" },
  { name: "Low Back Pain", system: "Musculoskeletal" },
  { name: "Osteoarthritis", system: "Musculoskeletal" },
  { name: "Rheumatoid Arthritis", system: "Musculoskeletal" },
  { name: "Gout", system: "Musculoskeletal" },
  { name: "Osteoporosis", system: "Musculoskeletal" },
  { name: "Fibromyalgia", system: "Musculoskeletal" },
  { name: "Shoulder Pain / Rotator Cuff", system: "Musculoskeletal" },
  { name: "Acne Vulgaris", system: "Dermatology" },
  { name: "Psoriasis", system: "Dermatology" },
  { name: "Atopic Dermatitis", system: "Dermatology" },
  { name: "Cellulitis", system: "Dermatology" },
  { name: "Skin Cancer Screening", system: "Dermatology" },
  { name: "Tinea Infections", system: "Dermatology" },
  { name: "Urinary Tract Infection", system: "Infectious Disease" },
  { name: "Community-Acquired Pneumonia", system: "Infectious Disease" },
  { name: "Sepsis", system: "Infectious Disease" },
  { name: "HIV Management", system: "Infectious Disease" },
  { name: "STI Screening & Treatment", system: "Infectious Disease" },
  { name: "Lyme Disease", system: "Infectious Disease" },
  { name: "Influenza", system: "Infectious Disease" },
  { name: "C. diff Infection", system: "Infectious Disease" },
  { name: "Colorectal Cancer", system: "Preventive/Screening" },
  { name: "Breast Cancer Screening", system: "Preventive/Screening" },
  { name: "Cervical Cancer Screening", system: "Preventive/Screening" },
  { name: "Lung Cancer Screening", system: "Preventive/Screening" },
  { name: "Lipid Screening", system: "Preventive/Screening" },
  { name: "Diabetes Screening", system: "Preventive/Screening" },
  { name: "Hypertension Screening", system: "Preventive/Screening" },
  { name: "Adult Immunization Schedule", system: "Preventive/Screening" },
  { name: "Prenatal Care", system: "Women's Health" },
  { name: "Gestational Diabetes", system: "Women's Health" },
  { name: "Preeclampsia", system: "Women's Health" },
  { name: "Menopause Management", system: "Women's Health" },
  { name: "Contraception", system: "Women's Health" },
  { name: "Polycystic Ovary Syndrome", system: "Women's Health" },
  { name: "Postpartum Depression", system: "Women's Health" },
  { name: "Endometriosis", system: "Women's Health" },
  { name: "Well-Child Visits", system: "Pediatrics" },
  { name: "Childhood Immunizations", system: "Pediatrics" },
  { name: "Pediatric ADHD", system: "Pediatrics" },
  { name: "Childhood Asthma", system: "Pediatrics" },
  { name: "Failure to Thrive", system: "Pediatrics" },
  { name: "Otitis Media", system: "Pediatrics" },
  { name: "Febrile Seizure", system: "Pediatrics" },
  { name: "Chronic Kidney Disease", system: "Renal" },
  { name: "Acute Kidney Injury", system: "Renal" },
  { name: "Nephrolithiasis", system: "Renal" },
  { name: "Proteinuria", system: "Renal" },
  { name: "Electrolyte Disorders", system: "Renal" },
  { name: "Anemia (Iron Deficiency)", system: "Hematology" },
  { name: "Anemia (B12/Folate)", system: "Hematology" },
  { name: "DVT / VTE", system: "Hematology" },
  { name: "Thrombocytopenia", system: "Hematology" },
  { name: "Anticoagulation Management", system: "Hematology" },
  { name: "Leukemia / Lymphoma", system: "Hematology" },
  { name: "Sickle Cell Disease", system: "Hematology" },
];
