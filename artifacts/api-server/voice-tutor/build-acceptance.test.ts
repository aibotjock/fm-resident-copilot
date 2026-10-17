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
  assert.equal(advanced.length, 4);
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
