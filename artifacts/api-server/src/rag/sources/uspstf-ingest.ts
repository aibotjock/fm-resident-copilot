import type { GuidelineChunk } from "../store";

const USPSTF_API =
  "https://www.uspreventiveservicestaskforce.org/uspstf/api/json/uspstf";

interface USPSTFRecommendation {
  title: string;
  grade: string;
  text: string;
  clinicalConsiderations?: string;
  tools?: string;
  url?: string;
}

function gradeDescription(grade: string): string {
  const map: Record<string, string> = {
    A: "Strong recommendation — high certainty of substantial net benefit",
    B: "Moderate recommendation — high certainty of moderate or moderate certainty of substantial net benefit",
    C: "Offer selectively — moderate certainty of small net benefit; clinical decision should consider patient circumstances",
    D: "Recommend against — moderate/high certainty of no net benefit or harms outweigh benefits",
    I: "Insufficient evidence — current evidence inadequate to assess balance of benefits and harms",
  };
  return map[grade] ?? grade;
}

function inferABFMDomain(title: string, text: string): string {
  const t = (title + " " + text).toLowerCase();
  if (/(colorectal|colon|rectal|CRC)/i.test(t)) return "Preventive Medicine & Health Maintenance";
  if (/(breast|mammogram)/i.test(t)) return "Preventive Medicine & Health Maintenance";
  if (/(cervical|pap smear|HPV)/i.test(t)) return "Women's Health & Reproductive Medicine";
  if (/(lung cancer|low-dose CT|LDCT)/i.test(t)) return "Preventive Medicine & Health Maintenance";
  if (/(diabetes|A1c|hemoglobin A)/i.test(t)) return "Endocrine & Metabolic";
  if (/(blood pressure|hypertension|cardiovascular)/i.test(t)) return "Cardiovascular";
  if (/(lipid|cholesterol|statin)/i.test(t)) return "Cardiovascular";
  if (/(depression|anxiety|mental health|suicide)/i.test(t)) return "Psychiatry & Behavioral Health";
  if (/(tobacco|smoking|cessation)/i.test(t)) return "Preventive Medicine & Health Maintenance";
  if (/(alcohol|drug use|substance)/i.test(t)) return "Psychiatry & Behavioral Health";
  if (/(obesity|weight|BMI)/i.test(t)) return "Endocrine & Metabolic";
  if (/(fall|elder|older adult|geriatric)/i.test(t)) return "Geriatrics";
  if (/(child|pediatric|infant|adolescent)/i.test(t)) return "Pediatrics";
  if (/(prenatal|pregnancy|maternal|folic acid|GDM)/i.test(t)) return "Women's Health & Reproductive Medicine";
  if (/(skin|UV|sunscreen)/i.test(t)) return "Dermatology";
  if (/(osteoporosis|bone density|DEXA)/i.test(t)) return "Musculoskeletal";
  if (/(hepatitis|HIV|STI|sexually transmitted)/i.test(t)) return "Infectious Disease";
  if (/(vision|hearing|eye)/i.test(t)) return "Preventive Medicine & Health Maintenance";
  return "Preventive Medicine & Health Maintenance";
}

export async function fetchUSPSTFChunks(): Promise<GuidelineChunk[]> {
  const res = await fetch(USPSTF_API, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`USPSTF API returned ${res.status}`);
  }

  const data = (await res.json()) as USPSTFRecommendation[];
  const chunks: GuidelineChunk[] = [];

  for (const rec of data) {
    if (!rec.title || !rec.text || !rec.grade) continue;

    const gradeText = `Grade ${rec.grade}: ${gradeDescription(rec.grade)}`;
    const domain = inferABFMDomain(rec.title, rec.text);
    const year = new Date().getFullYear().toString();

    const mainContent =
      `USPSTF Recommendation: ${rec.title}\n` +
      `Grade: ${gradeText}\n\n` +
      `${rec.text.slice(0, 1800)}`;

    chunks.push({
      source: "USPSTF",
      tier: 1,
      guideline_title: `USPSTF: ${rec.title}`,
      guideline_year: year,
      abfm_domain: domain,
      section: "USPSTF Recommendation",
      content: mainContent,
      url: rec.url ?? USPSTF_API,
    });

    if (rec.clinicalConsiderations && rec.clinicalConsiderations.length > 100) {
      chunks.push({
        source: "USPSTF",
        tier: 1,
        guideline_title: `USPSTF: ${rec.title}`,
        guideline_year: year,
        abfm_domain: domain,
        section: "Clinical Considerations",
        content:
          `USPSTF Clinical Considerations — ${rec.title}\n\n` +
          rec.clinicalConsiderations.slice(0, 1800),
        url: rec.url ?? USPSTF_API,
      });
    }
  }

  return chunks;
}
