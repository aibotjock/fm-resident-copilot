import { test } from "node:test";
import assert from "node:assert/strict";
import { IncomingMessage, ServerResponse } from "node:http";
import { PassThrough } from "node:stream";
import app from "./server";
import { topics, instructions } from "./core";
import {
  lessons,
  clinicalSources,
  curriculumInstructions,
  scheduleCurriculumReview,
  medicationSafetyProfiles,
  medicationSafetyInstructions,
  matchingMedicationSafety,
  criteriaForTopics,
  regimensForTopics,
  curriculumCatalog,
} from "./curriculum";
import {
  medicationInventory,
  medicationSearch,
  extractLabelSections,
} from "./medication-reference";
import { antibioticCoverage } from "./coverage";
import { learningSummary } from "./learning";
process.env.FM_TUTOR_ACCESS_TOKEN = "curriculum-test-private-code-123456";

test("antibiotic expansion counts actual regimens and loads every combination component", () => {
  const catalog = curriculumCatalog();
  assert.equal(catalog.medicationRegimenCount, 130);
  assert.equal(catalog.antibioticRegimenCount, 123);
  assert.equal(catalog.antibioticDrugCount, 39);
  for (const l of lessons.filter((l) => l.regimen)) {
    assert.deepEqual(
      l.medication_safety!.map((p) => p.drug).sort(),
      [...l.medication_names!].sort(),
      l.id,
    );
  }
  assert.deepEqual(
    matchingMedicationSafety("amoxicillin-clavulanate").map((p) => p.drug),
    ["amoxicillin-clavulanate"],
  );
  assert.deepEqual(
    matchingMedicationSafety(
      "IV vancomycin with oral levofloxacin for sepsis",
    ).filter((p) => p.drug === "vancomycin"),
    [],
  );
  assert.equal(
    lessons.find((l) => l.id === "med-amoxclav-cystitis")!.medication_safety!
      .length,
    1,
  );
});

test("condition cases load scoped antibiotic prescriptions without leaking into assessments", () => {
  const uti = topics.find((t) => t.title === "UTI Diagnosis and Treatment")!;
  assert.equal(regimensForTopics([uti.id]).length, 11);
  const guided = instructions([uti.id], {}, [], "teaching", true);
  assert.match(guided, /CONDITION-LINKED STORED REGIMENS/);
  assert.match(guided, /med-fosfomycin-cystitis/);
  assert.ok(!guided.includes('"id":"med-fidaxomicin-cdi"'));
  assert.ok(
    !instructions([uti.id], {}, [], "assessment", false).includes(
      "CONDITION-LINKED STORED REGIMENS",
    ),
  );
  assert.match(
    curriculumInstructions("med-pid-outpatient"),
    /LABEL-METRONIDAZOLE/,
  );
  assert.match(
    curriculumInstructions("med-pid-outpatient"),
    /LABEL-DOXYCYCLINE/,
  );
  assert.match(
    curriculumInstructions("med-pid-outpatient"),
    /LABEL-CEFTRIAXONE/,
  );
});

test("expanded regimens preserve route, sex, organ thresholds and conflicting source scopes", () => {
  const get = (id: string) => lessons.find((l) => l.id === id)!;
  assert.match(get("med-vancomycin-cdi").regimen!.route, /oral/);
  assert.match(get("med-vancomycin-cdi").gaps.join(" "), /Not a fulminant/);
  assert.equal(
    get("med-metronidazole-trich-women").regimen!.duration,
    "7 days",
  );
  assert.equal(
    get("med-metronidazole-trich-men").regimen!.duration,
    "single dose",
  );
  assert.match(
    get("med-benzathine-penicillin-latent").regimen!.duration,
    /7.2 million/,
  );
  assert.match(
    get("med-nitrofurantoin-cystitis").medication_safety![0].renal.guidance,
    /CrCl <60/,
  );
  assert.match(
    get("med-metronidazole-bv").medication_safety![0].hepatic.guidance,
    /50%/,
  );
  assert.equal(
    get("med-fosfomycin-cystitis").medication_safety![0].renal.status,
    "not_established",
  );
  assert.match(get("med-amoxicillin-cap").regimen!.duration, /ATS 2025/);
  assert.ok(
    get("med-amoxicillin-cap").source_ids.includes("ATS-CAP-DURATION-2025"),
  );
});
function request(path: string, body?: unknown, cookie = ""): Promise<Response> {
  return new Promise((resolve) => {
    const raw = body === undefined ? undefined : JSON.stringify(body);
    const req = new IncomingMessage(new PassThrough() as any);
    req.url = path;
    req.method = raw === undefined ? "GET" : "POST";
    req.headers = {
      host: "localhost",
      ...(raw === undefined
        ? {}
        : {
            "content-type": "application/json",
            "content-length": String(Buffer.byteLength(raw)),
          }),
      ...(cookie ? { cookie } : {}),
    };
    const res = new ServerResponse(req);
    res.end = ((value: any) => {
      resolve(
        new Response(value || null, {
          status: res.statusCode,
          headers: res.getHeaders() as any,
        }),
      );
      return res;
    }) as any;
    (app as any).handle(req, res);
    if (raw !== undefined) req.push(raw);
    req.push(null);
  });
}
async function unlocked() {
  const r = await request("/api/login", {
    code: process.env.FM_TUTOR_ACCESS_TOKEN,
  });
  assert.equal(r.status, 200);
  const cookie = r.headers.get("set-cookie")!.split(";")[0];
  return (path: string, body?: unknown) => request(path, body, cookie);
}

test("curriculum data preserves scoped regimens, source provenance and clinical uncertainty", () => {
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
  const sourceIds = new Set(clinicalSources.map((s) => s.id));
  for (const l of lessons) {
    assert.ok(
      l.source_ids.length && l.source_ids.every((id) => sourceIds.has(id)),
      l.id,
    );
    assert.ok(l.gaps.length, l.id);
    if (l.track === "medication") {
      for (const key of [
        "indication",
        "population",
        "drug",
        "dose",
        "route",
        "frequency",
        "duration",
        "adjustment",
        "maximum",
      ])
        assert.ok((l.regimen as any)?.[key], `${l.id}: ${key}`);
    }
    if (l.track === "advanced") {
      assert.ok(l.reveals?.length);
      assert.ok(l.stages.at(-1)?.includes("oral synthesis"));
    }
  }
  const pediatric = lessons.find((l) => l.id === "med-amoxicillin-strep")!;
  assert.match(pediatric.regimen!.dose, /per dose/);
  assert.match(pediatric.regimen!.maximum, /1000/);
  assert.equal(
    lessons.find((l) => l.id === "safe-siadh")!.category,
    "adverse_effect",
  );
  assert.equal(
    lessons.find((l) => l.id === "safe-maoi")!.category,
    "contraindication",
  );
});

test("all stored medication regimens expose contraindications and scoped organ-safety evidence", () => {
  const sources = new Map(clinicalSources.map((s) => [s.id, s]));
  for (const lesson of lessons.filter((l) => l.track === "medication")) {
    assert.ok(lesson.medication_safety?.length, lesson.id);
    for (const profile of lesson.medication_safety!) {
      assert.ok(profile.contraindications.length, lesson.id);
      assert.ok(profile.renal.status && profile.renal.guidance);
      assert.ok(profile.hepatic.status && profile.hepatic.guidance);
      assert.ok(profile.population && profile.gaps.length);
      for (const id of profile.source_ids) {
        const source = sources.get(id)!;
        assert.ok(source?.url && source.sections && source.access_date, id);
        assert.ok(lesson.source_ids.includes(id), id);
        assert.ok(!source.organization.includes("Lexidrug"));
      }
    }
  }
  assert.equal(medicationSafetyProfiles.length, 46);
});

test("organ safety keeps unknown guidance, age limits and indication-specific rules explicit", () => {
  const profile = (drug: string) =>
    medicationSafetyProfiles.find((p) => p.drug === drug)!;
  assert.equal(profile("penicillin V").renal.status, "not_established");
  assert.equal(profile("doxycycline").renal.status, "no_adjustment");
  assert.match(profile("cephalexin").population, /at least 15/);
  assert.match(profile("cephalexin").renal.guidance, /maximum 1 g\/day/);
  assert.equal(profile("metformin").hepatic.status, "avoid_use");
  assert.match(profile("sertraline").hepatic.guidance, /halve/);
  assert.match(profile("apixaban").renal.guidance, /do not apply AF criteria/);
  assert.match(profile("apixaban").hepatic.guidance, /B: label cannot provide/);
  assert.match(profile("ceftriaxone").population, /CDC, not the older label/);
});

test("ordinary guided lessons load matching drug safety only and assessments remain unchanged", () => {
  assert.deepEqual(
    matchingMedicationSafety("metformin-like-word").map((p) => p.drug),
    ["metformin"],
  );
  assert.deepEqual(matchingMedicationSafety("unrelated asthma lesson"), []);
  assert.deepEqual(matchingMedicationSafety("pseudoamoxicillin"), []);
  const loaded = medicationSafetyInstructions("amoxicillin");
  assert.match(loaded, /LABEL-AMOXICILLIN/);
  assert.ok(!loaded.includes('"id":"LABEL-APIXABAN"'));
  assert.match(loaded, /Missing guidance is NOT no adjustment needed/);
  assert.match(loaded, /BEFORE explaining/);
  assert.match(loaded, /Access date is not guideline publication date/);
  const guided = instructions([topics[0].id], {}, [], "teaching", true);
  assert.match(guided, /MEDICATION SAFETY PRACTICE/);
  const assessed = instructions([topics[0].id], {}, [], "assessment", false);
  assert.ok(!assessed.includes("MEDICATION SAFETY PRACTICE"));
});

test("criteria are searchable separately and condition-linked facts preserve rule limits", () => {
  const pleural = topics.find((t) => /Pleural Effusion/.test(t.title))!;
  const linked = criteriaForTopics([pleural.id]);
  assert.ok(linked.some((l) => l.id === "criteria-lights"));
  const prompt = instructions([pleural.id], {}, [], "teaching", true);
  assert.match(prompt, /CONDITION-SPECIFIC CRITERIA/);
  assert.match(prompt, /two-thirds the laboratory upper limit/);
  assert.ok(
    !instructions([pleural.id], {}, [], "assessment", false).includes(
      "LOADED CRITERIA SOURCES",
    ),
  );
  assert.ok(
    !criteriaForTopics([topics[0].id]).some((l) => l.id === "criteria-lights"),
  );
  const ankle = lessons.find((l) => l.id === "criteria-ottawa-ankle")!;
  assert.match(ankle.facts.join(" "), /both immediately/);
  assert.match(ankle.facts.join(" "), /not a fracture diagnosis/);
  const duke = lessons.find((l) => l.id === "criteria-duke")!;
  assert.match(duke.facts.join(" "), /2 major.*3 minor.*5 minor/);
  assert.equal(duke.study_scope, "purpose_and_interpretation");
  assert.match(
    curriculumInstructions(duke.id),
    /supplied verified result only/,
  );
  assert.match(
    curriculumInstructions("condition-ankle-foot-trauma"),
    /criteria-ottawa-foot/,
  );
});

test("criteria have rule-specific provenance and do not mix score versions or unrelated populations", () => {
  const criteria = lessons.filter((l) => l.track === "criteria");
  assert.equal(criteria.length, 57);
  for (const l of criteria) {
    assert.ok(l.facts.length, l.id);
    assert.ok(l.topic_ids?.length, `${l.id}: condition integration`);
    assert.ok(!l.source_ids.some((id) => id.includes("PENDING")), l.id);
    for (const id of l.source_ids) {
      const s = clinicalSources.find((s) => s.id === id)!;
      assert.ok(s.sections && s.access_date, id);
      assert.ok(!s.url.includes("curriculum-guidelines"), id);
    }
  }
  const heart = lessons.find((l) => l.id === "criteria-heart")!;
  assert.match(heart.facts.join(" "), /omits troponin/);
  assert.match(heart.gaps.join(" "), /age 45 or 65/);
  const lupus = topics.find((t) => /Systemic Lupus/.test(t.title))!;
  assert.ok(!criteriaForTopics([lupus.id]).some((l) => l.id === heart.id));
  const gdm = topics.find((t) => /Gestational Diabetes/.test(t.title))!;
  assert.ok(
    !criteriaForTopics([gdm.id]).some((l) => l.id === "criteria-diabetes"),
  );
  for (const id of ["criteria-psi", "criteria-news2", "criteria-child-pugh"]) {
    const l = lessons.find((l) => l.id === id)!;
    assert.equal(l.study_scope, "purpose_and_interpretation");
    assert.match(
      curriculumInstructions(id),
      /Never ask the learner to calculate missing points/,
    );
  }
});

test("broad medication inventory reports names separately from checked safety and supports topic filtering", () => {
  assert.equal(medicationInventory.length, 501);
  assert.equal(
    medicationInventory.filter((m) => m.status === "scoped_safety_profile")
      .length,
    46,
  );
  assert.equal(
    new Set(medicationInventory.map((m) => m.id)).size,
    medicationInventory.length,
  );
  assert.ok(medicationSearch("Eliquis").some((m) => m.name === "apixaban"));
  assert.deepEqual(medicationSearch("impossible-medication-zzzz"), []);
  assert.throws(() => medicationSearch({}));
  const med = medicationInventory.find((m) => m.name === "apixaban")!;
  assert.ok(med.topics.length);
  assert.ok(medicationSearch("apixaban", med.topics[0].topic_id).length);
  assert.equal(medicationSearch("apixaban", "unknown-topic").length, 0);
});

test("GCS recognition exercises distinguish response components and untestable totals", () => {
  const gcs = lessons.find((l) => l.id === "criteria-glasgow-coma")!;
  const cases = gcs.practice_cases!;
  assert.equal(cases.length, 3);
  for (const c of cases) {
    const values = Object.values(c.components);
    if (values.includes("NT")) assert.equal(c.total, null);
    else
      assert.equal(
        c.total,
        values.reduce<number>((sum, v) => sum + Number(v), 0),
      );
  }
  assert.equal(cases.find((c) => c.id === "gcs-flexion")!.components.motor, 4);
  assert.match(
    curriculumInstructions(gcs.id),
    /Keep components, total and explanation hidden until the learner attempts/,
  );
  assert.match(
    curriculumInstructions(gcs.id),
    /Never score a not-testable response as 1/,
  );
  assert.ok(
    criteriaForTopics(["condition-minor-head-injury"]).some(
      (l) => l.id === gcs.id,
    ),
  );
});

test("label extraction preserves complete table cells and rejects unsafe or nonhuman documents", () => {
  const xml = `<document><code displayName="HUMAN PRESCRIPTION DRUG LABEL"/><section><title>2 DOSAGE</title><text><table><tr><th>CrCl mL/min</th><th>Dose</th></tr><tr><td>&lt;30</td><td>250 mg q12h</td></tr></table></text></section><section><title>5.1 Lactic acidosis</title><text>Warnings apply.<script>evil()</script></text></section></document>`;
  const result = extractLabelSections(xml);
  assert.match(result.sections[0].text, /CrCl mL\/min \| Dose \|/);
  assert.match(result.sections[0].text, /<30 \| 250 mg q12h/);
  assert.ok(!result.sections.some((s) => s.text.includes("evil()")));
  assert.ok(result.sections.some((s) => /Lactic/.test(s.title)));
  assert.throws(() => extractLabelSections("<!DOCTYPE x><document/>"));
  assert.throws(() =>
    extractLabelSections(xml.replace("HUMAN PRESCRIPTION", "VETERINARY")),
  );
  const huge = xml.replace("Warnings apply.", "x".repeat(21000));
  assert.ok(extractLabelSections(huge).omitted.includes("5.1 Lactic acidosis"));
  const nested =
    '<document><code displayName="HUMAN PRESCRIPTION DRUG LABEL"/><section><title>5 WARNINGS</title><component><section><title>5.1 Renal</title><text>Child section only</text></section></component></section></document>';
  assert.deepEqual(extractLabelSections(nested).sections, [
    { title: "5.1 Renal", text: "Child section only" },
  ]);
});

test("medication reference endpoints require session approval, exact returned product and no active assessment", async () => {
  assert.equal(
    (await request("/api/medications/search", { query: "metformin" })).status,
    401,
  );
  const api = await unlocked();
  assert.equal(
    (
      await api("/api/medications/labels", {
        drug_id: "metformin",
        approved: false,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await api("/api/medications/load", {
        setid: "arbitrary",
        approved: true,
        formulation_confirmed: true,
      })
    ).status,
    403,
  );
  assert.equal(
    (await api("/api/medications/search", { query: {} })).status,
    400,
  );
  const originalFetch = globalThis.fetch;
  let fetched = 0;
  const setid = "5073c482-952c-400c-afff-64380f133bc8";
  globalThis.fetch = (async (url: any) => {
    fetched++;
    const u = new URL(String(url));
    assert.equal(u.hostname, "dailymed.nlm.nih.gov");
    if (u.pathname.endsWith(".json"))
      return new Response(
        JSON.stringify({
          data: [
            {
              setid,
              title: "METFORMIN TABLET",
              published_date: "Oct 16, 2026",
              spl_version: 4,
            },
          ],
        }),
      );
    return new Response(
      '<document><code displayName="HUMAN PRESCRIPTION DRUG LABEL"/><section><title>4 CONTRAINDICATIONS</title><text>Source-scoped example only</text></section></document>',
    );
  }) as any;
  try {
    const search = await api("/api/medications/labels", {
      drug_id: "metformin",
      approved: true,
    });
    assert.equal(search.status, 200);
    const countBefore = fetched;
    assert.equal(
      (
        await api("/api/medications/load", {
          setid,
          approved: true,
          formulation_confirmed: false,
        })
      ).status,
      403,
    );
    assert.equal(fetched, countBefore);
    const loaded = await api("/api/medications/load", {
      setid,
      approved: true,
      formulation_confirmed: true,
    });
    assert.equal(loaded.status, 200);
    const body: any = await loaded.json();
    assert.ok(body.url.includes(setid));
    assert.ok(body.accessed);
    assert.match(body.notice, /not independently checked/);
    await api("/api/library/select", { topic_id: topics[1].id });
    assert.equal(
      (
        await api("/api/medications/load", {
          setid,
          approved: true,
          formulation_confirmed: true,
        })
      ).status,
      403,
    );
    await api("/api/practice/start", {
      ids: [topics[0].id],
      mode: "assessment",
      scope: "mixed",
      limit: 2,
    });
    assert.equal(
      (
        await api("/api/medications/load", {
          setid,
          approved: true,
          formulation_confirmed: true,
        })
      ).status,
      409,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("new endpoints require authentication and specialist search does not claim clinical evidence", async () => {
  assert.equal((await request("/api/curriculum")).status, 401);
  assert.equal(
    (await request("/api/curriculum/select", { lesson_id: lessons[0].id }))
      .status,
    401,
  );
  const api = await unlocked();
  const cat: any = await (await api("/api/curriculum")).json();
  assert.equal(cat.antibioticCoverage.length, topics.length);
  assert.ok(
    cat.references
      .filter((r: any) => r.name === "Lexidrug")
      .every((r: any) => r.status === "commercial_access_not_configured"),
  );
  const found: any = await (
    await api("/api/curriculum/search", { query: "SIADH" })
  ).json();
  assert.ok(found.lessons.some((l: any) => l.id === "safe-siadh"));
  assert.ok(found.lessons.every((l: any) => l.facts === undefined));
  assert.equal(
    (await api("/api/curriculum/search", { query: {} })).status,
    400,
  );
  assert.equal(
    (
      await api("/api/curriculum/select", {
        lesson_id: "unknown",
        ids: [topics[0].id],
      })
    ).status,
    400,
  );
});

test("specialist context loads only the selected specialist evidence and never overrides assessment", () => {
  const p = instructions(
    [topics[0].id],
    {},
    [],
    "teaching",
    true,
    "safe-siadh",
  );
  assert.match(p, /ACTIVE SPECIALIST CURRICULUM/);
  assert.match(p, /not proof of a diagnosis/);
  const loaded = p.slice(p.indexOf("LOADED CURRICULUM SOURCES:"));
  assert.ok(loaded.includes("LABEL-SERTRALINE"));
  assert.ok(!loaded.includes("LABEL-APIXABAN"));
  assert.match(p, /qualitative feedback/);
  assert.match(p, /multiple defensible/);
  assert.throws(() => curriculumInstructions("not-a-lesson"));
  assert.ok(
    !instructions(
      [topics[0].id],
      {},
      [],
      "assessment",
      false,
      "safe-siadh",
    ).includes("ACTIVE SPECIALIST CURRICULUM"),
  );
});

test("switching to specialist curriculum clears the prior reviewed question and ignores old checkpoints", async () => {
  const api = await unlocked();
  await api("/api/library/select", { topic_id: topics[0].id });
  const p: any = await (
    await api("/api/practice/start", {
      ids: [topics[0].id],
      mode: "assessment",
      scope: "mixed",
      limit: 2,
    })
  ).json();
  assert.ok(p.question.id);
  const selected = await api("/api/curriculum/select", {
    lesson_id: "advanced-confusion",
    ids: [topics[0].id],
    history: "STALE-CASE",
  });
  assert.equal(selected.status, 200);
  const value: any = await selected.json();
  assert.match(value.instructions, /advanced-confusion/);
  assert.ok(!value.instructions.includes("STALE-CASE"));
  assert.equal(
    (
      await api("/api/practice/answer", {
        question_id: p.question.id,
        choice: "A",
      })
    ).status,
    400,
  );
});

test("coverage never upgrades an antibiotic mention or partial STI scope to complete verification", () => {
  const rows = antibioticCoverage();
  assert.equal(rows.length, 156);
  const pneumonia = rows.find((r) => r.title.includes("CAP Severity"))!;
  assert.equal(pneumonia.status, "scoped_regimens_available");
  const sti = rows.find((r) => r.title.includes("Gonorrhea, Chlamydia"))!;
  assert.ok(sti.lesson_ids.includes("med-benzathine-penicillin-early"));
  assert.ok(sti.lesson_ids.length);
  const strep = rows.find((r) => r.title.includes("Acute Pharyngitis"))!;
  assert.equal(strep.lesson_ids.length, 9);
  assert.ok(rows.every((r) => r.status !== ("complete" as any)));
});

test("learner-rated review scheduling remains separate from scored progress and rejects invalid inputs", () => {
  const now = Date.parse("2026-10-17T05:00:00Z");
  const first = scheduleCurriculumReview("safe-siadh", "good", 0, now);
  assert.equal(first.interval, 3);
  const next = scheduleCurriculumReview(
    "safe-siadh",
    "easy",
    first.interval,
    now + 86400000,
  );
  assert.equal(next.interval, 9);
  assert.equal(
    scheduleCurriculumReview("safe-siadh", "again", next.interval, now)
      .interval,
    1,
  );
  assert.throws(() => scheduleCurriculumReview("invented", "good", 0, now));
  assert.throws(() =>
    scheduleCurriculumReview("safe-siadh", "mastered", 0, now),
  );
  assert.equal(learningSummary([]).total, 0);
  assert.equal((first as any).first_correct, undefined);
});

test("study-time specialist lookup requires explicit approval and the exact scoped source URL", async () => {
  const api = await unlocked();
  const source = clinicalSources.find((s) => s.id === "LABEL-SERTRALINE")!;
  const base = {
    topic_id: topics[0].id,
    curriculum_id: "safe-siadh",
    url: source.url,
  };
  assert.equal(
    (await api("/api/lookup", { ...base, approved: false })).status,
    403,
  );
  assert.equal(
    (
      await api("/api/lookup", {
        ...base,
        approved: true,
        url: "https://example.org/arbitrary",
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await api("/api/lookup", {
        ...base,
        approved: true,
        curriculum_id: "med-apixaban-af",
      })
    ).status,
    403,
  );
  const oldFetch = globalThis.fetch;
  globalThis.fetch = (async (url: any) => {
    assert.equal(String(url), source.url);
    return new Response(
      "<p>Scoped official lookup data</p><script>notMedicalEvidence()</script>",
      { headers: { "content-type": "text/html" } },
    );
  }) as any;
  try {
    const r = await api("/api/lookup", { ...base, approved: true });
    assert.equal(r.status, 200);
    const result: any = await r.json();
    assert.match(result.notice, /not a verified summary/);
    assert.ok(!result.text.includes("notMedicalEvidence"));
  } finally {
    globalThis.fetch = oldFetch;
  }
});
