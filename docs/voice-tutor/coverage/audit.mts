import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CANDIDATE_ENTRIES } from "../../../artifacts/api-server/src/rag/sources/candidate.ts";
const here = new URL("./", import.meta.url);
const read = (name: string) =>
  JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const inventory = read(
  "../../../artifacts/api-server/voice-tutor/medication-inventory.json",
);
const base = read("../../../artifacts/api-server/voice-tutor/curriculum.json");
const expanded = read(
  "../../../artifacts/api-server/voice-tutor/expanded-curriculum.json",
);
const normalized = (s: string) => s.toLowerCase().replace(/[‐‑–—]/g, "-");
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const matched = (text: string, names: string[]) =>
  names.some((name) =>
    new RegExp("\\b" + escape(normalized(name)) + "\\b", "i").test(
      normalized(text),
    ),
  );
const regimenText = JSON.stringify(base.lessons);
const names = inventory.map((m: any) => {
  const topicMatches = CANDIDATE_ENTRIES.filter((e) =>
    matched(e.content, m.aliases),
  );
  return {
    name: m.name,
    status: m.status,
    matchingOriginalTopicIds: topicMatches.map((e) => e.key),
    foundInRegimenLessons: matched(regimenText, m.aliases),
  };
});
const criteria = expanded.lessons.filter((l: any) => l.track === "criteria");
const sources = new Map(
  [...base.sources, ...expanded.sources].map((s: any) => [s.id, s]),
);
const report = {
  auditDate: expanded.audit_date,
  originalTopics: CANDIDATE_ENTRIES.length,
  namedMedicationEntities: inventory.length,
  countingLimit:
    "Lexicon-assisted named entities, not a comprehensive formulary or unique-active-ingredient count; combination entities and components coexist. Brand aliases are collapsed. Mentions and label lookup do not constitute checked dosing coverage.",
  storedSafetyProfiles: base.medication_safety_profiles.length,
  originalRegimenLessons: base.lessons.filter(
    (l: any) => l.track === "medication",
  ).length,
  criteriaEntries: criteria.length,
  criteriaWithScopedFacts: criteria.filter((l: any) => l.facts.length).length,
  criteriaOverviews: criteria.filter(
    (l: any) => l.study_scope === "purpose_and_interpretation",
  ).length,
  supplementalConditions: expanded.lessons.filter(
    (l: any) => l.track === "condition",
  ).length,
  totalSpecialistLessons: base.lessons.length + expanded.lessons.length,
  unresolvedNames: names.filter(
    (m: any) => !m.matchingOriginalTopicIds.length && !m.foundInRegimenLessons,
  ),
  criteria: criteria.map((l: any) => ({
    id: l.id,
    title: l.title,
    scope: l.study_scope,
    topicIds: l.topic_ids,
    gaps: l.gaps,
    sources: l.source_ids.map((id: string) => sources.get(id)),
  })),
  medications: names,
};
if (process.argv.includes("--write"))
  writeFileSync(
    new URL("audit.json", here),
    JSON.stringify(report, null, 2) + "\n",
  );
console.log(
  JSON.stringify(
    { ...report, criteria: undefined, medications: undefined },
    null,
    2,
  ),
);
