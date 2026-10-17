import { test } from "node:test";
import assert from "node:assert/strict";
import { IncomingMessage, ServerResponse } from "node:http";
import { PassThrough } from "node:stream";
import app from "./server";
import { topics, instructions } from "./core";
import {
  lessons,
  synthesisRubric,
  curriculumInstructions,
  medicationSafetyProfiles,
} from "./curriculum";
import { medicationSearch } from "./medication-reference";
import { reconcileAntibioticTeaching } from "./teaching-evidence";

process.env.FM_TUTOR_ACCESS_TOKEN = "build-acceptance-local-test-code";
function request(path: string, body?: unknown, cookie = ""): Promise<Response> {
  return new Promise((resolve) => {
    const serialized = body === undefined ? undefined : JSON.stringify(body);
    const req = new IncomingMessage(new PassThrough() as any);
    req.url = path;
    req.method = serialized === undefined ? "GET" : "POST";
    req.headers = {
      host: "localhost",
      ...(serialized === undefined
        ? {}
        : {
            "content-type": "application/json",
            "content-length": String(Buffer.byteLength(serialized)),
          }),
      ...(cookie ? { cookie } : {}),
    };
    const res = new ServerResponse(req);
    res.end = ((data: any) => {
      resolve(
        new Response(data || null, {
          status: res.statusCode,
          headers: res.getHeaders() as any,
        }),
      );
      return res;
    }) as any;
    (app as any).handle(req, res);
    if (serialized !== undefined) req.push(serialized);
    req.push(null);
  });
}
async function unlocked() {
  const login = await request("/api/login", {
    code: process.env.FM_TUTOR_ACCESS_TOKEN,
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie")!.split(";")[0];
  return (path: string, body?: unknown) => request(path, body, cookie);
}

test("every retained library topic can be found by its title and selected through authenticated APIs", async () => {
  const api = await unlocked();
  for (const topic of topics) {
    const search = await api("/api/library/search", { query: topic.title });
    assert.equal(search.status, 200, topic.title);
    const found: any = await search.json();
    assert.ok(
      found.topics.some((t: any) => t.id === topic.id),
      topic.title,
    );
    const selected = await api("/api/library/select", { topic_id: topic.id });
    assert.equal(selected.status, 200, topic.id);
    const value: any = await selected.json();
    assert.equal(value.topic.id, topic.id);
    assert.equal(value.entries.length, 1);
    assert.equal(value.entries[0].key, topic.id);
    assert.ok(
      value.instructions.includes(
        reconcileAntibioticTeaching(value.entries[0]).content,
      ),
      topic.title,
    );
  }
});

test("every shipped specialist lesson is discoverable and loads its own evidence across all five tracks", async () => {
  const api = await unlocked();
  for (const lesson of lessons) {
    const search = await api("/api/curriculum/search", { query: lesson.title });
    assert.equal(search.status, 200, lesson.id);
    const found: any = await search.json();
    assert.ok(
      found.lessons.some((l: any) => l.id === lesson.id),
      lesson.title,
    );
    const topic =
      lesson.topic_ids?.find((id) => topics.some((t) => t.id === id)) ||
      topics[0].id;
    const selected = await api("/api/curriculum/select", {
      lesson_id: lesson.id,
      ids: [topic],
    });
    assert.equal(selected.status, 200, lesson.id);
    const value: any = await selected.json();
    assert.equal(value.lesson.id, lesson.id);
    assert.ok(value.instructions.includes(` / ${lesson.id} / `), lesson.id);
    for (const source of lesson.source_ids)
      assert.ok(
        value.instructions.includes(`"id":"${source}"`),
        `${lesson.id}: ${source}`,
      );
    assert.ok(
      !instructions([topic], {}, [], "assessment", true, lesson.id).includes(
        "ACTIVE SPECIALIST CURRICULUM",
      ),
      lesson.id,
    );
  }
});

test("advanced case contracts include staged uncertainty, patient constraints and qualitative feedback rather than a fabricated score", () => {
  const advanced = lessons.filter((l) => l.track === "advanced");
  assert.equal(advanced.length, 28);
  assert.equal(synthesisRubric.length, 8);
  for (const lesson of advanced) {
    const prompt = curriculumInstructions(lesson.id);
    assert.equal(lesson.reveals?.length, 3, lesson.id);
    assert.equal(lesson.stages.length, 9, lesson.id);
    assert.match(
      prompt,
      /reveal one supplied result only after the preceding response/,
    );
    assert.match(prompt, /Accept multiple defensible approaches/);
    assert.match(prompt, /patient preferences, cost\/support/);
    assert.match(prompt, /30-60 second oral presentation/);
    assert.match(prompt, /Do not fabricate a numerical grade or mastery/);
    assert.match(prompt, /offer optional depth/);
  }
  const categories = new Set(
    lessons.filter((l) => l.track === "safety").map((l) => l.category),
  );
  for (const category of [
    "contraindication",
    "precaution",
    "adverse_effect",
    "prescribing_pitfall",
  ])
    assert.ok(categories.has(category as any));
});

test("every taught formulation is reachable from medication search and partial rule scope stays explicit", () => {
  for (const profile of medicationSafetyProfiles) {
    const found = medicationSearch(profile.drug).find(
      (m) => m.name === profile.drug,
    );
    assert.ok(found, profile.drug);
    assert.equal(found.status, "scoped_safety_profile", profile.drug);
    const expected = lessons
      .filter((l) => l.regimen && l.medication_names?.includes(profile.drug))
      .map((l) => l.id)
      .sort();
    assert.deepEqual(
      [...found.regimen_lesson_ids].sort(),
      expected,
      profile.drug,
    );
  }
  const overviews = lessons.filter(
    (l) =>
      l.track === "criteria" && l.study_scope === "purpose_and_interpretation",
  );
  assert.equal(overviews.length, 18);
  for (const lesson of overviews)
    assert.match(
      curriculumInstructions(lesson.id),
      /Never ask the learner to calculate missing points/,
    );
  assert.ok(
    lessons.filter((l) => l.track === "criteria").every((l) => l.facts.length),
  );
});

test("all 28 synthesis cases have coherent release packets, reasoning checkpoints and specific feedback", () => {
  const cases = lessons.filter((l) => l.track === "advanced");
  assert.equal(cases.length, 28);
  const packetIds = new Set<string>();
  for (const l of cases) {
    const c = l.advanced_case!;
    assert.ok(c, l.id);
    assert.deepEqual(
      c.data_packets.map((p) => p.after_stage),
      [3, 4, 6],
    );
    assert.deepEqual(
      c.data_packets.map((p) => p.findings),
      l.reveals,
    );
    assert.deepEqual(
      c.reasoning_checkpoints.map((q) => q.stage),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.equal(new Set(c.feedback_anchors.map((a) => a.dimension)).size, 8);
    assert.ok(
      c.differential_guide.length >= 3 && c.unavailable_information.length >= 3,
      l.id,
    );
    assert.ok(
      c.unsafe_shortcuts[0] &&
        c.transfer_challenge &&
        c.oral_handoff.retry_instruction,
      l.id,
    );
    for (const p of c.data_packets) {
      assert.ok(!packetIds.has(p.id));
      packetIds.add(p.id);
      assert.ok(!l.opening.includes(p.findings), l.id);
    }
    const prompt = curriculumInstructions(l.id);
    for (const rule of [
      "Present only the opening initially",
      "unavailable_information remains unknown",
      "Missing responses are not observed",
      "released packet IDs",
      "same facts",
      "Purpose-only criteria",
      "ONE highest-priority improvement",
    ])
      assert.ok(prompt.includes(rule), `${l.id}: ${rule}`);
  }
  assert.equal(packetIds.size, 84);
});

test("synthesis related evidence stays selected, retains scope and never enters assessments", () => {
  for (const l of lessons.filter((l) => l.track === "advanced")) {
    const prompt = curriculumInstructions(l.id);
    for (const id of l.advanced_case!.linked_lesson_ids) {
      const related = lessons.find((r) => r.id === id)!;
      assert.ok(related && related.track !== "advanced", `${l.id}: ${id}`);
      assert.ok(prompt.includes(`"id":"${id}"`), l.id);
      for (const source of related.source_ids)
        assert.ok(prompt.includes(`"id":"${source}"`), `${l.id}: ${source}`);
    }
    assert.deepEqual(
      l.medication_safety!.map((p) => p.drug).sort(),
      [...l.medication_names!].sort(),
      l.id,
    );
    assert.ok(
      !instructions([topics[0].id], {}, [], "assessment", true, l.id).includes(
        "CASE-SPECIFIC SYNTHESIS CONTRACT",
      ),
      l.id,
    );
  }
  const pregnancy = curriculumInstructions("advanced-pregnancy");
  assert.ok(pregnancy.includes('"id":"abx-preg-pyelo"'));
  assert.ok(!pregnancy.includes('"id":"abx-endo-enterococcus"'));
  assert.ok(
    !curriculumInstructions("med-apixaban-af").includes(
      "CASE-SPECIFIC SYNTHESIS CONTRACT",
    ),
  );
});

test("synthesis teaching preserves major eligibility and evolving-urgency distinctions", () => {
  const content = (id: string) =>
    JSON.stringify(lessons.find((l) => l.id === id));
  assert.match(content("advanced-anticoagulant-transition"), /AF.*VTE|VTE.*AF/);
  assert.match(content("advanced-child-pneumonia"), /source control/);
  assert.match(
    content("advanced-congenital-syphilis"),
    /incomplete evaluation or unreliable follow-up/,
  );
  assert.match(content("advanced-hiv"), /G6PD/);
  assert.match(content("advanced-chest-pain"), /one hour/);
  assert.match(
    content("advanced-head-injury"),
    /does not replace individualized assessment/,
  );
  assert.match(content("advanced-pancreatic-necrosis"), /later unstable stage/);
  assert.match(
    content("advanced-mood-activation"),
    /association alone does not establish/i,
  );
});
