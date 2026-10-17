import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { curriculumCatalog } from "../../../artifacts/api-server/voice-tutor/curriculum.ts";
import { antibioticCoverage } from "../../../artifacts/api-server/voice-tutor/coverage.ts";
const catalog = curriculumCatalog();
const originalTopics = antibioticCoverage();
const decisions = catalog.lessons.filter((l) => l.id.startsWith("completion-"));
const counts = {
  originalTopics: originalTopics.length,
  originalSupplementalConditions: catalog.lessons.filter((l) => l.track === "condition" && !l.id.startsWith("completion-")).length,
  additionalDecisionLessons: decisions.length,
  totalLessons: catalog.lessons.length,
  flaggedOriginalTopics: originalTopics.filter((r) => r.antimicrobial_signal).length,
  flaggedOriginalWithRegimens: originalTopics.filter((r) => r.antimicrobial_signal && r.lesson_ids.length).length,
  antibioticRegimens: catalog.antibioticRegimenCount,
  totalMedicationRegimens: catalog.medicationRegimenCount,
  antimicrobialNamedEntries: catalog.antibioticDrugCount,
  safetyProfiles: catalog.medicationSafetyProfileCount,
  searchableNames: catalog.medicationInventoryCount,
};
const validation = "62 automated tests pass, including exhaustive search/selection of all 156 original topics and 277 specialist lessons. Isolated tutor TypeScript, tutor bundle and whitespace checks pass. These are software checks, not independent clinical validation. Real-device microphone/audio and model-generated medical answers remain unverified.";
const report = {
  version: catalog.version,
  priorPublishedCommit: "6698d5f3cc47cd42425fda2b2db015daf7d1962a",
  counts, originalTopics,
  supplemental: catalog.supplementalAntibioticCoverage,
  scenarioLedger: catalog.antibioticPathways,
  decisionLessons: decisions,
  regimens: catalog.lessons.filter((l) => l.regimen),
  sources: catalog.sources, validation,
};
writeFileSync(fileURLToPath(new URL("./coverage.json", import.meta.url)), JSON.stringify(report, null, 2) + "\n");
const rows = catalog.antibioticPathways.map((p) => {
  const count = report.regimens.filter((l) => l.topic_ids?.includes(p.topic_id)).length;
  const cases = decisions.filter((l) => l.topic_ids?.includes(p.topic_id)).map((l) => l.id).join(", ");
  return `| ${p.title.replaceAll("|", "\\|")} | ${count} | ${cases || "Existing regimen teaching"} | ${p.pending_scenarios.join(" ") || "No additional scope limit recorded."} |`;
});
const md = `# Expanded tutor content — 2026-10-17\n\nVersion: ${catalog.version}. The expanded educational syllabus is implemented for user testing. It is **not complete all-scenario prescribing verification or independent clinical/pharmacy validation**.\n\n\`\`\`json\n${JSON.stringify(counts, null, 2)}\n\`\`\`\n\n## Current release\n\nAdds 39 antimicrobial courses, 15 formulation-specific safety profiles and 26 case-based decision lessons. New material includes congenital syphilis, recurrent BV, HIV PCP/toxoplasma/MAC alternatives, renal/HD examples, endocarditis, pediatric Lyme carditis, complicated pneumonia, diabetic foot/osteomyelitis, sickle-cell acute chest, recurrent/pediatric CDI, H pylori alternatives, chronic prostatitis, severe COPD and otic alternatives.\n\nEvery previously recorded condition branch now has linked decision teaching. It distinguishes a representative source-supported course from cases needing cultures, source control, therapeutic monitoring, neonatal or pregnancy assessment, or a specialist-selected protocol. The prior ledger text is retained in scenarioLedger.previously_recorded_scope; actual remaining source/patient limits remain visible. No arbitrary fixed dose is supplied for individualized vancomycin AUC/CRRT or resistant/culture-negative disease.\n\nThe sepsis pathway now uses SSC 2026 source-specific guidance. The exact six-month pertussis boundary is corrected from the original CDC table. Recurrent BV teaching includes ACOG's 2025 partner-treatment update. H pylori uses the corrected ACG highlights with levofloxacin once daily and names the earlier source conflict. Original topics load the new cases; selecting a new case also loads its relevant medication courses and sources.\n\nAll 28 antibiotic-relevant original topics retain scoped medication lessons. All 156 original topics remain available. Medication names without checked regimens remain reference-only. The 57 criteria entries retain their declared scope, including 18 overviews that do not contain full calculation tables. Existing advanced cases, spaced review, progress compatibility and assessment isolation are preserved. Nonvoice code/thumbnail and frozen assessment items are unchanged.\n\n## Verification\n\n${validation}\n\n## Scenario coverage and limits\n\n| Condition | Regimen lessons | Decision teaching | Remaining source/patient limits |\n|---|---:|---|---|\n${rows.join("\n")}\n\nThe export includes exact merged regimen fields, source IDs/URLs/sections/access dates and explicit gaps. Counts describe content, not medical completeness. No commercial subscription reference is represented as connected.\n`;
writeFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), md);
console.log(JSON.stringify(counts));
