/** Discovery registry, not a certification of every page or recommendation. */
export const sourceRegistry = [
  [
    "AAFP",
    "Family medicine",
    "aafp.org",
    "https://www.aafp.org/clinical-recommendations.html",
    "US",
  ],
  [
    "ABFM",
    "Exam blueprint",
    "theabfm.org",
    "https://www.theabfm.org/family-medicine-exam-blueprint/",
    "US",
  ],
  [
    "USPSTF",
    "Prevention",
    "uspreventiveservicestaskforce.org",
    "https://www.uspreventiveservicestaskforce.org/uspstf/",
    "US",
  ],
  [
    "CDC / ACIP",
    "Public health and immunization",
    "cdc.gov",
    "https://www.cdc.gov/acip-recs/",
    "US",
  ],
  ["ACC", "Cardiology", "acc.org", "https://www.acc.org/guidelines", "US"],
  [
    "AHA / ASA",
    "Cardiology and stroke",
    "heart.org",
    "https://professional.heart.org/guidelines-and-statements",
    "US",
  ],
  [
    "American Diabetes Association",
    "Diabetes",
    "diabetes.org",
    "https://professional.diabetes.org/standards-of-care",
    "US",
  ],
  [
    "Endocrine Society",
    "Endocrinology",
    "endocrine.org",
    "https://www.endocrine.org/clinical-practice-guidelines",
    "US",
  ],
  [
    "ATS",
    "Pulmonology",
    "thoracic.org",
    "https://site.thoracic.org/clinicians-researchers/clinical-practice-guidelines-statements-reports",
    "US",
  ],
  [
    "CHEST",
    "Pulmonology",
    "chestnet.org",
    "https://www.chestnet.org/guidelines-and-topic-collections/guidelines",
    "US",
  ],
  [
    "GINA",
    "Asthma",
    "ginasthma.org",
    "https://ginasthma.org/reports/",
    "International",
  ],
  ["GOLD", "COPD", "goldcopd.org", "https://goldcopd.org/", "International"],
  [
    "IDSA",
    "Infectious diseases",
    "idsociety.org",
    "https://www.idsociety.org/practice-guideline/alphabetical-guidelines/",
    "US",
  ],
  [
    "ACOG",
    "Obstetrics and gynecology",
    "acog.org",
    "https://www.acog.org/clinical",
    "US",
  ],
  [
    "AAP",
    "Pediatrics",
    "aap.org",
    "https://www.aap.org/en/quality-improvement/clinical-practice-guidelines/",
    "US",
  ],
  [
    "AAN",
    "Neurology",
    "aan.com",
    "https://www.aan.com/practice/guidelines",
    "US",
  ],
  [
    "KDIGO",
    "Kidney disease",
    "kdigo.org",
    "https://kdigo.org/guidelines/",
    "International",
  ],
  [
    "AGA",
    "Gastroenterology",
    "gastro.org",
    "https://gastro.org/clinical-guidance/",
    "US",
  ],
  [
    "ACG",
    "Gastroenterology",
    "gi.org",
    "https://gi.org/clinical-guidelines/",
    "US",
  ],
  [
    "AASLD",
    "Hepatology",
    "aasld.org",
    "https://www.aasld.org/practice-guidelines",
    "US",
  ],
  [
    "American College of Rheumatology",
    "Rheumatology",
    "rheumatology.org",
    "https://rheumatology.org/clinical-practice-guidelines",
    "US",
  ],
  [
    "AAOS",
    "Musculoskeletal",
    "aaos.org",
    "https://www.aaos.org/quality/quality-programs/clinical-practice-guidelines/",
    "US",
  ],
  [
    "American Psychiatric Association",
    "Psychiatry",
    "psychiatry.org",
    "https://www.psychiatry.org/guidelines",
    "US",
  ],
  [
    "AAD",
    "Dermatology",
    "aad.org",
    "https://www.aad.org/member/clinical-quality",
    "US",
  ],
  [
    "AAO-HNS",
    "ENT",
    "entnet.org",
    "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/",
    "US",
  ],
  [
    "AUA",
    "Urology",
    "auanet.org",
    "https://www.auanet.org/guidelines-and-quality/guidelines",
    "US",
  ],
  [
    "ASH",
    "Hematology",
    "hematology.org",
    "https://www.hematology.org/education/clinicians/guidelines-and-quality-care",
    "US",
  ],
  [
    "AGS",
    "Geriatrics",
    "americangeriatrics.org",
    "https://www.americangeriatrics.org/publications-tools/guidelines-recommendations",
    "US",
  ],
  ["FDA", "Drug labeling", "fda.gov", "https://www.fda.gov/drugs", "US"],
  [
    "DailyMed / NLM",
    "Drug labeling",
    "dailymed.nlm.nih.gov",
    "https://dailymed.nlm.nih.gov/dailymed/",
    "US",
  ],
].map(([organization, specialty, domain, hub, jurisdiction]) => ({
  organization: organization!,
  specialty: specialty!,
  domain: domain!,
  hub: hub!,
  jurisdiction: jurisdiction!,
  access:
    "Check document access and reuse terms; registry membership is not clinical review",
}));

// Explicit publication destinations. These do not grant access or establish endorsement.
const publishers: Record<string, string> = {
  "ahajournals.org": "AHA / ASA",
  "jacc.org": "ACC",
  "diabetesjournals.org": "American Diabetes Association",
  "atsjournals.org": "ATS",
  "publications.aap.org": "AAP",
  "journals.lww.com": "Society journal publication",
  "academic.oup.com": "Society journal publication",
  "journal.chestnet.org": "CHEST",
  "gastrojournal.org": "AGA",
  "neurology.org": "AAN",
  "agsjournals.onlinelibrary.wiley.com": "AGS",
  "accessdata.fda.gov": "FDA",
};
export const allowedDomains = [
  ...new Set([
    ...sourceRegistry.map((s) => s.domain),
    ...Object.keys(publishers),
  ]),
];
export function officialSource(raw: string) {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw Error("Invalid source address");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443")
  )
    throw Error("Only public HTTPS source addresses are allowed");
  const host = url.hostname.toLowerCase();
  const org = sourceRegistry.find(
    (s) => host === s.domain || host.endsWith(`.${s.domain}`),
  );
  const publisher = Object.entries(publishers).find(
    ([domain]) => host === domain || host.endsWith(`.${domain}`),
  );
  if (!org && !publisher)
    throw Error("Source is outside the official-source registry");
  url.hash = "";
  return {
    url: url.href,
    organization: org?.organization || publisher![1],
    jurisdiction:
      org?.jurisdiction || "Check source population and jurisdiction",
  };
}
