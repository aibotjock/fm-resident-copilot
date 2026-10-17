import { CANDIDATE_ENTRIES } from "../src/rag/sources/candidate";
import { regimensForTopics } from "./curriculum";

// Discovery only. A mention of antibiotics is NOT an indication to prescribe.
const signals =
  /antibiotic|antimicrobial|\bCAP\b|\bUTI\b|\bSTI\b|cellulitis|abscess|necrotizing|h\. pylori|otitis|\bAOM\b|lyme|difficile|gonorrhea|chlamydia|syphilis|sepsis|bacterial rhinosinusitis|pharyngitis|\bSBP\b/i;
export function antibioticCoverage() {
  return CANDIDATE_ENTRIES.map((e) => {
    const linked = regimensForTopics([e.key]);
    return {
      topic_id: e.key,
      title: e.section,
      antimicrobial_signal: signals.test(e.section + " " + e.content),
      status: linked.length
        ? "scoped_regimens_available"
        : "complete_regimen_not_verified",
      scope: linked.length
        ? "Selected indication-specific regimens only; check each lesson's population, source date, formulation and gaps. This is not complete antibiotic coverage for the condition."
        : "Stored topic remains available; no claim of a complete checked antibiotic regimen.",
      lesson_ids: linked.map((l) => l.id),
      official_lookup_urls: [
        ...new Set((e.evidence_records || []).map((r) => r.url)),
      ],
      review: e.review,
    };
  });
}
