import reconciliations from "./antibiotic-reconciliations.json";
import type { CANDIDATE_ENTRIES } from "../src/rag/sources/candidate";

// Voice teaching overlay only. Shared library and frozen assessment items stay intact.
export function reconcileAntibioticTeaching(
  entry: (typeof CANDIDATE_ENTRIES)[number],
) {
  let content = entry.content;
  const changes = reconciliations.filter((r) => r.topic_id === entry.key);
  for (const change of changes) {
    if (!content.includes(change.old))
      throw Error(`Antibiotic reconciliation no longer matches ${entry.key}`);
    content = content.replace(
      change.old,
      `${change.new} [MED ${change.source_ids.join(", ")}]`,
    );
  }
  return changes.length ? { ...entry, content } : entry;
}
