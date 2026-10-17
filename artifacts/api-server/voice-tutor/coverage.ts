import { CANDIDATE_ENTRIES } from "../src/rag/sources/candidate";
import {
  regimensForTopics,
  antibioticPathways,
  antibioticRelevance,
} from "./curriculum";

// Explicit audit decisions, not antibiotic-name mentions or an ambiguous SBP regex.
export function antibioticCoverage() {
  return CANDIDATE_ENTRIES.map((e) => {
    const linked = regimensForTopics([e.key]);
    const decision = antibioticRelevance.find((r) => r.topic_id === e.key);
    const pathway = antibioticPathways.find((r) => r.topic_id === e.key);
    return {
      topic_id: e.key,
      title: e.section,
      antimicrobial_signal: !!pathway,
      relevance: decision?.relevance || "Not audited",
      status: linked.length
        ? "scoped_regimens_available"
        : pathway
          ? "pathway_only_regimens_pending"
          : "no_direct_regimen_scope_identified",
      scope: pathway
        ? "Selected source-scoped teaching; condition-wide coverage and independent clinical review remain incomplete."
        : "Audit found no direct antibacterial regimen scope in this topic; reassess if a specific infectious syndrome is established.",
      pending_scenarios: pathway?.pending_scenarios || [],
      lesson_ids: linked.map((l) => l.id),
      official_lookup_urls: [
        ...new Set((e.evidence_records || []).map((r) => r.url)),
      ],
      review: e.review,
    };
  });
}
