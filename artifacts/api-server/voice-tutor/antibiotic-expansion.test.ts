import { test } from "node:test";
import assert from "node:assert/strict";
import expansion from "./antibiotic-expansion.json";
import reconciliations from "./antibiotic-reconciliations.json";
import {
  lessons,
  regimensForTopics,
  curriculumInstructions,
  clinicalSources,
  regimenInstructions,
  antibioticPathways,
} from "./curriculum";
import { antibioticCoverage } from "./coverage";
import { instructions, topics } from "./core";
import { medicationSearch } from "./medication-reference";
import { CANDIDATE_ENTRIES } from "../src/rag/sources/candidate";
import { reconcileAntibioticTeaching } from "./teaching-evidence";

test("all audited original/supplemental entries have explicit relevance and every flagged entry loads a decision pathway", () => {
  assert.equal(expansion.relevance.length, 168);
  assert.equal(antibioticPathways.length, 32);
  assert.equal(
    antibioticCoverage().filter((r) => r.antimicrobial_signal).length,
    28,
  );
  assert.equal(new Set(expansion.relevance.map((r) => r.topic_id)).size, 168);
  for (const row of antibioticPathways) {
    const text = regimenInstructions([row.topic_id]);
    assert.ok(text.includes(row.topic_id));
    assert.ok(text.includes(row.facts[0]));
    for (const id of row.source_ids)
      assert.ok(text.includes(`"id":"${id}"`), `${row.title} source ${id}`);
    assert.ok(!row.status.includes("complete"));
  }
  const bp = antibioticCoverage().find(
    (r) => r.title === "Blood Pressure Classification and Thresholds",
  )!;
  assert.equal(bp.antimicrobial_signal, false);
});

test("new condition regimens have full component safety/provenance and no orphan topic mappings", () => {
  const valid = new Set([
    ...topics.map((t) => t.id),
    ...lessons.filter((l) => l.track === "condition").map((l) => l.id),
  ]);
  const sources = new Set(clinicalSources.map((s) => s.id));
  assert.equal(sources.size, clinicalSources.length);
  for (const stored of expansion.lessons) {
    const l = lessons.find((l) => l.id === stored.id)!;
    assert.ok(l.regimen && l.topic_ids!.length);
    assert.ok(
      l.topic_ids!.every((id) => valid.has(id)),
      l.id,
    );
    assert.deepEqual(
      l.medication_safety!.map((p) => p.drug).sort(),
      [...l.medication_names!].sort(),
      l.id,
    );
    for (const field of Object.values(l.regimen!))
      assert.ok(typeof field === "string" && field.length, l.id);
    assert.ok(
      l.source_ids.every((id) => sources.has(id)),
      l.id,
    );
  }
});

test("ordinary and supplemental teaching load new regimens without leaking into assessment", () => {
  const aom = topics.find((t) => t.title.startsWith("AOM Diagnosis"))!;
  assert.match(
    instructions([aom.id], {}, [], "teaching", true),
    /abx-aom-amoxclav/,
  );
  assert.ok(
    !instructions([aom.id], {}, [], "assessment", false).includes(
      '"id":"abx-aom-amoxclav"',
    ),
  );
  assert.ok(
    !instructions([aom.id], {}, [], "assessment", true).includes(
      "CONDITION-LINKED STORED REGIMENS",
    ),
  );
  for (const [id, expected] of [
    ["condition-otitis-externa", "abx-otic-ciprodex"],
    ["condition-endocarditis", "abx-endo-strep"],
    ["condition-upper-gi-bleeding", "abx-variceal-prophylaxis"],
    ["condition-rheumatic-fever", "abx-strep-benzathine"],
  ]) {
    assert.ok(curriculumInstructions(id).includes(expected), id);
    assert.ok(
      !curriculumInstructions(id).includes('"id":"abx-preg-nitro"'),
      id,
    );
  }
});

test("known antibiotic contradictions are removed only in voice teaching, preserving assessment snapshots", () => {
  assert.equal(reconciliations.length, 10);
  for (const patch of reconciliations) {
    const base = CANDIDATE_ENTRIES.find((e) => e.key === patch.topic_id)!;
    assert.ok(base.content.includes(patch.old));
    const changed = reconcileAntibioticTeaching(base);
    assert.ok(!changed.content.includes(patch.old), patch.old);
    assert.ok(changed.content.includes(patch.new));
    assert.ok(base.content.includes(patch.old), "original must stay immutable");
  }
});

test("pregnancy pyelonephritis, lower UTI and CDI route lessons remain distinct", () => {
  const get = (id: string) => lessons.find((l) => l.id === id)!;
  assert.match(get("abx-preg-pyelo").regimen!.duration, /14/);
  assert.match(get("abx-preg-nitro").regimen!.duration, /5-7/);
  assert.match(get("abx-preg-nitro").facts.join(" "), /Not for pyelonephritis/);
  assert.match(
    get("abx-cdi-fulminant").regimen!.route,
    /vancomycin oral\/NG; metronidazole IV/,
  );
  assert.match(
    get("abx-cdi-fulminant").facts.join(" "),
    /IV vancomycin does not replace/,
  );
  assert.equal(get("abx-hp-optimized-bqt").medication_safety!.length, 4);
  assert.match(get("abx-hp-talicia").regimen!.dose, /4 Talicia capsules/);
});

test("medication and condition navigation expose actual newly stored lessons", () => {
  for (const [query, id] of [
    ["Ciprodex", "abx-otic-ciprodex"],
    ["Talicia", "abx-hp-talicia"],
    ["cefdinir", "abx-aom-cefdinir"],
  ])
    assert.ok(
      medicationSearch(query).some((m) => m.regimen_lesson_ids.includes(id)),
      query,
    );
  const aom = topics.find((t) => t.title.startsWith("AOM Diagnosis"))!;
  assert.ok(medicationSearch("cefdinir", aom.id).length);
  assert.equal(medicationSearch("cefdinir", topics[0].id).length, 0);
});

test("coverage keeps the undosed perianal complication and specialist exclusions explicit", () => {
  const ibd = antibioticCoverage().find((r) => r.title.startsWith("Crohn's"))!;
  assert.equal(ibd.status, "pathway_only_regimens_pending");
  assert.match(ibd.pending_scenarios.join(" "), /perianal-abscess/);
  assert.ok(antibioticPathways.some((r) => r.pending_scenarios.length));
  const lyme = topics.find((t) => t.title.startsWith("Lyme Disease"))!;
  assert.ok(regimensForTopics([lyme.id]).some((l) => l.id === "abx-lyme-pep"));
});
