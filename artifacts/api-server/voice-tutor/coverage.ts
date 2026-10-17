import { CANDIDATE_ENTRIES } from "../src/rag/sources/candidate";
import { lessons } from "./curriculum";

// Discovery only. A mention of antibiotics is NOT an indication to prescribe.
const signals =
  /antibiotic|antimicrobial|\bCAP\b|\bUTI\b|\bSTI\b|cellulitis|abscess|necrotizing|h\. pylori|otitis|\bAOM\b|lyme|difficile|gonorrhea|chlamydia|syphilis|sepsis|bacterial rhinosinusitis|pharyngitis|\bSBP\b/i;
export function antibioticCoverage() {
  return CANDIDATE_ENTRIES.map((e) => {
    const title = e.section;
    const linked = /pharyngitis/i.test(title)
      ? lessons.filter(
          (l) => l.track === "medication" && l.id.endsWith("-strep"),
        )
      : /STI|Gonorrhea, Chlamydia/i.test(title)
        ? lessons.filter(
            (l) =>
              l.track === "medication" &&
              /chlamydia|pregnancy|gonorrhea/.test(l.id),
          )
        : [];
    return {
      topic_id: e.key,
      title,
      antimicrobial_signal: signals.test(title + " " + e.content),
      status: linked.length
        ? "scoped_regimens_available"
        : "complete_regimen_not_verified",
      scope: /pharyngitis/i.test(title)
        ? "Confirmed group A strep only; stated allergy and population limits apply."
        : linked.length
          ? "Uncomplicated chlamydia/gonorrhea only; not syphilis, PID, dissemination or all pregnancy scenarios."
          : "Stored topic remains available; no claim of a complete checked antibiotic regimen.",
      lesson_ids: linked.map((l) => l.id),
      official_lookup_urls: [
        ...new Set((e.evidence_records || []).map((r) => r.url)),
      ],
      review: e.review,
    };
  });
}
