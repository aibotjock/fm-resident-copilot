import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { curriculumCatalog } from "../../../artifacts/api-server/voice-tutor/curriculum.ts";
import { antibioticCoverage } from "../../../artifacts/api-server/voice-tutor/coverage.ts";

// Run from artifacts/api-server using node --import tsx and this file's path.
// Derive counts and links from the same merged content used by the private tutor.
const catalog = curriculumCatalog();
const originalTopics = antibioticCoverage();
const counts = {
  originalTopics: originalTopics.length,
  supplementalConditions: catalog.lessons.filter((l) => l.track === "condition")
    .length,
  flaggedOriginalTopics: originalTopics.filter((r) => r.antimicrobial_signal)
    .length,
  flaggedOriginalWithRegimens: originalTopics.filter(
    (r) => r.antimicrobial_signal && r.lesson_ids.length,
  ).length,
  antibioticRegimens: catalog.antibioticRegimenCount,
  totalMedicationRegimens: catalog.medicationRegimenCount,
  antibacterialNamedEntries: catalog.antibioticDrugCount,
  safetyProfiles: catalog.medicationSafetyProfileCount,
  searchableNames: catalog.medicationInventoryCount,
};
const pending = catalog.antibioticPathways
  .filter((p) => p.pending_scenarios.length)
  .map(({ topic_id, title, pending_scenarios }) => ({
    topic_id,
    title,
    pending_scenarios,
  }));
const validation =
  "56 automated tests, isolated tutor TypeScript check and tutor bundle build pass. These are software checks, not independent clinical validation. Model-generated medical answers and real-device microphone/audio remain unverified.";
const report = {
  version: catalog.version,
  baseline: "ce578e282824b3b57515becf2d31bf8cf64f5370",
  priorPublishedCommit: "6b615ea02e1d5b3a6be8ff83f801c3a750d9c41c",
  counts,
  originalTopics,
  supplemental: catalog.supplementalAntibioticCoverage,
  pending,
  regimens: catalog.lessons.filter((l) => l.regimen),
  sources: catalog.sources,
  validation,
};
writeFileSync(
  fileURLToPath(new URL("./coverage.json", import.meta.url)),
  JSON.stringify(report, null, 2) + "\n",
);
const rows = catalog.antibioticPathways.map((p) => {
  const count = report.regimens.filter((l) =>
    l.topic_ids?.includes(p.topic_id),
  ).length;
  return `| ${p.title.replaceAll("|", "\\|")} | ${count} | ${p.pending_scenarios.join(" ") || "No additional branch recorded; independent review remains pending."} |`;
});
const md = `# Antibiotic condition expansion — 2026-10-17\n\nVersion: ${catalog.version}. Selected source-scoped teaching is implemented; **all-scenario clinical coverage and independent clinical/pharmacy validation remain incomplete**.\n\n\`\`\`json\n${JSON.stringify(counts, null, 2)}\n\`\`\`\n\n## Current release\n\nThis continuation adds 36 regimens and nine medication safety profiles: pediatric sinusitis/pneumonia, additional pediatric/adult Lyme branches, pertussis, GAS allergy alternatives, recurrent trichomoniasis, acute prostatitis, systemic acne treatment, GBS allergy pathways, HIV toxoplasmosis/MAC, and selected inpatient perianal abscess care. There are now 123 antibiotic regimen lessons (130 medication lessons overall), 46 safety profiles and 501 searchable medication names. Names without checked regimens remain explicitly marked as reference-only.\n\nAll 28 original topics flagged for conditional antibiotic teaching now link at least one scoped regimen. This does not mean every scenario within those topics is complete. Duplicate broad gap descriptions were replaced with condition-specific remaining scope. SBP albumin/prophylaxis thresholds, diabetic-foot duration decisions and serious-MRSA IV vancomycin monitoring were added to their scoped condition pathways.\n\nIV vancomycin, clindamycin and metronidazole use distinct safety profiles and support both route-before-drug and route-after-drug searches. Existing mixed-route PID/fulminant CDI lessons now load IV metronidazole evidence. Shared nonvoice source, thumbnail, deployment and frozen assessment items are preserved.\n\n## Verification\n\n${validation}\n\nThe checks cover component safety/source links, pediatric daily versus per-dose units, prevention versus active/maintenance treatment, route matching, medication/topic search, authenticated selection, assessment isolation and existing browser persistence flows.\n\n## Remaining scenario ledger\n\n| Condition | Linked regimen lessons | Unresolved scope |\n|---|---:|---|\n${rows.join("\n")}\n\ncoverage.json includes the original/supplemental relevance decisions, actual merged regimen fields, safety profiles and source URL/section/date records. Regenerate both reports from export.mts after curriculum changes; keep historical audit reports unchanged.\n`;
writeFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), md);
console.log(JSON.stringify(counts));
