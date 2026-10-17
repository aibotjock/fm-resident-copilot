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
} from "./curriculum";
import { antibioticCoverage } from "./coverage";
import { learningSummary } from "./learning";
process.env.FM_TUTOR_ACCESS_TOKEN = "curriculum-test-private-code-123456";
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
  assert.equal(pneumonia.status, "complete_regimen_not_verified");
  const sti = rows.find((r) => r.title.includes("Gonorrhea, Chlamydia"))!;
  assert.match(sti.scope, /not syphilis/);
  assert.ok(sti.lesson_ids.length);
  const strep = rows.find((r) => r.title.includes("Acute Pharyngitis"))!;
  assert.equal(strep.lesson_ids.length, 3);
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
