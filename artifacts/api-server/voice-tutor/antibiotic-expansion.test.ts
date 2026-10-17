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
  matchingMedicationSafety,
  medicationSafetyProfiles,
  searchCurriculum,
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

test("pediatric courses retain daily versus per-dose units and distinct disease durations", () => {
  const get = (id: string) => lessons.find((l) => l.id === id)!.regimen!;
  assert.match(get("abx-sinus-amox-peds").dose, /45 mg\/kg per dose/);
  assert.equal(get("abx-sinus-amox-peds").duration, "10 days");
  assert.equal(get("abx-cap-amox-peds").duration, "5 days");
  assert.match(get("abx-cap-ceftriaxone-peds").population, />3 months/);
  assert.match(get("abx-lyme-em-doxy-peds").dose, /per DAY divided into 2/);
  assert.match(get("abx-lyme-arthritis-doxy-peds").population, />=8 years/);
  assert.equal(get("abx-lyme-arthritis-doxy-peds").duration, "28 days");
  assert.match(get("abx-lyme-neuro-ceftriaxone-peds").maximum, /2 g\/day/);
  assert.match(get("abx-pertussis-tmpsmx-peds").population, />=2 months/);
});

test("IV component matching and search never substitute oral route profiles", () => {
  for (const drug of ["vancomycin", "metronidazole", "clindamycin"]) {
    for (const wording of [`IV ${drug}`, `intravenous ${drug}`, `${drug} IV`])
      assert.deepEqual(
        matchingMedicationSafety(wording).map((p) => p.drug),
        [`${drug} IV`],
      );
  }
  assert.deepEqual(
    matchingMedicationSafety("oral vancomycin").map((p) => p.drug),
    ["vancomycin"],
  );
  const cdi = lessons.find((l) => l.id === "abx-cdi-fulminant")!;
  assert.deepEqual(cdi.medication_safety!.map((p) => p.drug).sort(), [
    "metronidazole IV",
    "vancomycin",
  ]);
  assert.ok(
    medicationSearch("IV vancomycin").some((m) =>
      m.regimen_lesson_ids.includes("abx-gbs-vanc"),
    ),
  );
  assert.ok(
    searchCurriculum("pediatric sinusitis").lessons.some(
      (l) => l.id === "abx-sinus-amox-peds",
    ),
  );
});

test("HIV treatment, maintenance and primary prevention cannot collapse to the same dose", () => {
  const get = (id: string) => lessons.find((l) => l.id === id)!;
  assert.match(
    get("abx-hiv-toxo-treatment").regimen!.dose,
    /TMP 5 mg\/kg per DOSE/,
  );
  assert.match(get("abx-hiv-toxo-treatment").regimen!.duration, /6 weeks/);
  assert.equal(
    get("abx-hiv-toxo-maintenance").regimen!.frequency,
    "twice daily",
  );
  assert.equal(get("abx-hiv-toxo-proph").regimen!.frequency, "once daily");
  assert.equal(get("abx-hiv-mac-proph").regimen!.frequency, "once weekly");
  assert.match(
    get("abx-hiv-mac-proph").facts.join(" "),
    /No primary prophylaxis if ART starts immediately/,
  );
  assert.equal(get("abx-hiv-mac-treatment").medication_safety!.length, 2);
  assert.match(get("abx-hiv-mac-treatment").regimen!.duration, /12 months/);
});

test("allergy, indexed renal measures and unsupported organ tables remain scoped", () => {
  const profile = (drug: string) =>
    medicationSafetyProfiles.find((p) => p.drug === drug)!;
  assert.match(profile("cefadroxil").population, /mL\/min\/1.73 m2/);
  assert.match(
    profile("cefuroxime axetil").renal.guidance,
    /Do not extrapolate to children/,
  );
  assert.match(
    profile("cefuroxime axetil").interactions.join(" "),
    /axetil >=1 h before or >=2 h after/,
  );
  assert.match(
    profile("cefazolin").contraindications.join(" "),
    /guideline permits selected low-risk/,
  );
  assert.match(
    profile("vancomycin IV").renal.guidance,
    /No universal fixed renal dose/,
  );
  assert.equal(profile("ethambutol").renal.status, "individualize_monitor");
  const prenatal = antibioticPathways.find((p) =>
    p.title.includes("Prenatal"),
  )!;
  assert.ok(!prenatal.pending_scenarios.join(" ").includes("prostatitis"));
  const atopic = antibioticPathways.find((p) =>
    p.title.includes("Atopic Dermatitis"),
  )!;
  assert.ok(!atopic.pending_scenarios.join(" ").includes("osteomyelitis"));
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

test("coverage loads the scoped perianal course and keeps specialist exclusions explicit", () => {
  const ibd = antibioticCoverage().find((r) => r.title.startsWith("Crohn's"))!;
  assert.equal(ibd.status, "scoped_regimens_available");
  assert.ok(ibd.lesson_ids.includes("abx-perianal-inpatient"));
  assert.match(ibd.pending_scenarios.join(" "), /Crohn fistula/);
  assert.ok(antibioticPathways.some((r) => r.pending_scenarios.length));
  const lyme = topics.find((t) => t.title.startsWith("Lyme Disease"))!;
  assert.ok(regimensForTopics([lyme.id]).some((l) => l.id === "abx-lyme-pep"));
});
