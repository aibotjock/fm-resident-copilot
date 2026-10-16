export interface ABFMDomain {
  id: string;
  name: string;
  weight: number;
  primarySources: string[];
  secondarySources: string[];
  limitationNote?: string;
}

export const ABFM_DOMAINS: ABFMDomain[] = [
  {
    id: "cardiovascular",
    name: "Cardiovascular",
    weight: 10,
    primarySources: ["ACC/AHA", "AAFP"],
    secondarySources: ["AAN"],
  },
  {
    id: "musculoskeletal",
    name: "Musculoskeletal",
    weight: 10,
    primarySources: ["ACR", "AAFP"],
    secondarySources: [],
  },
  {
    id: "psychiatry",
    name: "Psychiatry & Behavioral Health",
    weight: 8,
    primarySources: ["APA", "AAFP"],
    secondarySources: [],
  },
  {
    id: "endocrine",
    name: "Endocrine & Metabolic",
    weight: 8,
    primarySources: ["ADA", "Endocrine Society", "AAFP"],
    secondarySources: [],
  },
  {
    id: "preventive",
    name: "Preventive Medicine & Health Maintenance",
    weight: 8,
    primarySources: ["USPSTF", "CDC/ACIP", "AAFP"],
    secondarySources: [],
  },
  {
    id: "womens_health",
    name: "Women's Health & Reproductive Medicine",
    weight: 7,
    primarySources: ["ACOG", "USPSTF", "AAFP"],
    secondarySources: [],
  },
  {
    id: "gastrointestinal",
    name: "Gastrointestinal",
    weight: 6,
    primarySources: ["ACG", "AASLD", "AAFP", "USPSTF"],
    secondarySources: [],
  },
  {
    id: "pulmonary",
    name: "Pulmonary & Allergy",
    weight: 6,
    primarySources: ["GINA", "GOLD", "ATS", "AAFP"],
    secondarySources: [],
  },
  {
    id: "infectious_disease",
    name: "Infectious Disease",
    weight: 6,
    primarySources: ["IDSA", "CDC", "AAFP"],
    secondarySources: ["AAP"],
  },
  {
    id: "neurology",
    name: "Neurology",
    weight: 5,
    primarySources: ["AAN", "ACC/AHA", "AAFP"],
    secondarySources: [],
  },
  {
    id: "dermatology",
    name: "Dermatology",
    weight: 5,
    primarySources: ["AAD", "AAFP"],
    secondarySources: [],
  },
  {
    id: "renal",
    name: "Renal & Urology",
    weight: 5,
    primarySources: ["KDIGO", "AAFP"],
    secondarySources: [],
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    weight: 5,
    primarySources: ["AAP", "CDC/ACIP", "AAFP"],
    secondarySources: [],
  },
  {
    id: "hematology",
    name: "Hematology & Oncology",
    weight: 4,
    primarySources: ["AAFP", "USPSTF"],
    secondarySources: [],
    limitationNote:
      "ASH (American Society of Hematology) and ASCO/NCCN oncology guidelines are not fully indexed. Core hematology content (iron deficiency, B12/folate, thrombocytopenia, VTE, CRC screening) is covered from AAFP and USPSTF sources.",
  },
  {
    id: "geriatrics",
    name: "Geriatrics",
    weight: 4,
    primarySources: ["AGS", "AAFP"],
    secondarySources: [],
  },
  {
    id: "multisystem",
    name: "Multisystem & Other",
    weight: 3,
    primarySources: ["AAFP", "CDC"],
    secondarySources: [],
  },
];

export function getDomainById(id: string): ABFMDomain | undefined {
  return ABFM_DOMAINS.find((d) => d.id === id);
}

export function getDomainList(): string {
  return ABFM_DOMAINS.map(
    (d) =>
      `- ${d.name} (~${d.weight}% of exam) | Primary sources: ${d.primarySources.join(", ")}${d.limitationNote ? ` | NOTE: ${d.limitationNote}` : ""}`
  ).join("\n");
}

export function getSourceForDomain(domainId: string): string[] {
  const domain = getDomainById(domainId);
  if (!domain) return [];
  return [...domain.primarySources, ...domain.secondarySources];
}
