import { test } from "node:test";
import assert from "node:assert/strict";
import app from "./server";
import {
  topics,
  topicEvidence,
  instructions,
  validLearning,
  version,
} from "./core";
process.chdir(new URL("../../../", import.meta.url).pathname);
process.env.FM_TUTOR_ACCESS_TOKEN = "test-only-private-code-123456789";
import { IncomingMessage, ServerResponse } from "node:http";
import { PassThrough } from "node:stream";
let cookie = "";
async function request(
  path: string,
  body?: unknown,
  auth = true,
): Promise<Response> {
  return new Promise((resolve) => {
    const req = new IncomingMessage(new PassThrough() as any);
    req.url = path;
    req.method = body ? "POST" : "GET";
    req.headers = {
      host: "localhost",
      ...(body
        ? {
            "content-type": "application/json",
            "content-length": String(Buffer.byteLength(JSON.stringify(body))),
          }
        : {}),
      ...(auth ? { cookie } : {}),
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
    if (body) req.push(JSON.stringify(body));
    req.push(null);
  });
}
test("frozen corpus and teaching contract", () => {
  assert.equal(topics.length, 156);
  assert.throws(() => topicEvidence(["made-up"]));
  assert.throws(() => topicEvidence([]));
  const p = instructions([topics[0].id], {}, []);
  for (const rule of [
    "ONE question",
    "hint",
    "Historical",
    "ABFM approval",
    "Random quizzes ONLY",
    "LIBRARY snapshot",
  ])
    assert.ok(p.includes(rule));
  assert.ok(p.includes(version));
});
test("assessment requires selected-topic evidence", () => {
  const a = {
    question_id: "q1",
    topic_id: topics[0].id,
    skill: "diagnosis",
    result: "assisted",
    evidence_ids: [topics[0].id],
    note: "hint used",
  };
  assert.equal(validLearning(a, [topics[0].id]), true);
  assert.equal(
    validLearning({ ...a, evidence_ids: ["fake"] }, [topics[0].id]),
    false,
  );
  assert.equal(validLearning(a, [topics[1].id]), false);
  assert.equal(
    validLearning({ ...a, result: "mastered" }, [topics[0].id]),
    false,
  );
});
test("private access, input guards, unavailable key and explicit source boundary", async () => {
  assert.equal((await request("/api/topics", undefined, false)).status, 401);
  assert.equal(
    (await request("/api/login", { code: "wrong" }, false)).status,
    403,
  );
  const login = await request(
    "/api/login",
    { code: process.env.FM_TUTOR_ACCESS_TOKEN },
    false,
  );
  assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie")!.split(";")[0];
  assert.ok(login.headers.get("set-cookie")!.includes("HttpOnly"));
  const catalog: any = await (await request("/api/topics")).json();
  assert.equal(catalog.topics.length, 156);
  assert.equal(catalog.voiceEnrollment, false);
  assert.equal((await request("/api/context", { ids: ["fake"] })).status, 400);
  const context: any = await (
    await request("/api/context", {
      ids: [topics[0].id],
      progress: {},
      history: [],
    })
  ).json();
  assert.equal(context.entries[0].key, topics[0].id);
  assert.equal(
    (await request("/api/session", { ids: [topics[0].id], sdp: "invalid" }))
      .status,
    400,
  );
  assert.equal(
    (
      await request("/api/lookup", {
        url: "https://example.com",
        approved: true,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request("/api/lookup", {
        url: context.entries[0].evidence_records?.[0]?.url,
        approved: false,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request("/api/learning", {
        question_id: "q",
        topic_id: topics[0].id,
        skill: "diagnosis",
        result: "correct",
        evidence_ids: ["fake"],
        note: "",
      })
    ).status,
    400,
  );
  const page = await (await request("/")).text();
  assert.ok(page.includes("Mute mic"));
  assert.ok(page.includes("localStorage"));
  assert.ok(!page.includes("Bearer ${key}"));
});

test("Realtime handshake uses the existing server key and configured evidence without returning secrets", async () => {
  const originalFetch = globalThis.fetch,
    old = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-only-not-a-real-key";
  globalThis.fetch = (async (url: any, options: any) => {
    assert.equal(String(url), "https://api.openai.com/v1/realtime/calls");
    assert.equal(
      options.headers.Authorization,
      "Bearer test-only-not-a-real-key",
    );
    const config = JSON.parse(options.body.get("session"));
    assert.equal(config.type, "realtime");
    assert.equal(config.audio.input.turn_detection.interrupt_response, true);
    assert.ok(config.instructions.includes(version));
    assert.equal(config.tools.length, 6);
    return new Response("v=0\r\nmock-answer", {
      headers: { "content-type": "application/sdp" },
    });
  }) as any;
  try {
    const r = await request("/api/session", {
      ids: [topics[0].id],
      sdp: "v=0\r\nmock-offer",
      progress: {},
      history: [],
    });
    assert.equal(r.status, 200);
    assert.equal(await r.text(), "v=0\r\nmock-answer");
    const result = await request("/api/learning", {
      question_id: "q1",
      topic_id: topics[0].id,
      skill: "diagnosis",
      result: "assisted",
      evidence_ids: [topics[0].id],
      note: "hint used",
    });
    assert.equal(result.status, 400);
    const unscored = await request("/api/learning", {
      question_id: "u1",
      topic_id: topics[0].id,
      skill: "diagnosis",
      result: "unscored",
      evidence_ids: [topics[0].id],
      note: "Generated teaching, not verified scoring",
    });
    assert.equal(unscored.status, 200);
  } finally {
    globalThis.fetch = originalFetch;
    if (old === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = old;
  }
});
test("official lookup is isolated, approved, and strips executable page content", async () => {
  const entry = topicEvidence([topics[0].id])[0];
  const url = entry.evidence_records![0].url;
  const original = globalThis.fetch;
  globalThis.fetch = (async (target: any) => {
    assert.equal(target, url);
    return new Response("<script>evil()</script><p>Official page text</p>", {
      headers: { "content-type": "text/html" },
    });
  }) as any;
  try {
    const r = await request("/api/lookup", { url, approved: true });
    assert.equal(r.status, 200);
    const v: any = await r.json();
    assert.ok(v.text.includes("Official page text"));
    assert.ok(!v.text.includes("evil()"));
    assert.equal(v.url, url);
    assert.equal(topicEvidence([topics[0].id])[0], entry);
  } finally {
    globalThis.fetch = original;
  }
});

test("browser controls mute capture and release every track on end", async () => {
  const { readFileSync } = await import("node:fs");
  const vm = await import("node:vm");
  const nodes = new Map<string, any>();
  const node = () =>
    ({
      textContent: "",
      value: "",
      disabled: false,
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute(name: string, value: string) {
        this[name] = value;
      },
      replaceChildren() {},
      append() {},
      click() {},
    }) as any;
  const document = {
    getElementById(id: string) {
      if (!nodes.has(id)) nodes.set(id, node());
      return nodes.get(id);
    },
    createElement: node,
    createTextNode: (s: string) => s,
  };
  const sandbox = vm.createContext({
    document,
    window: { addEventListener() {} },
    localStorage: {
      getItem() {
        return null;
      },
      setItem() {},
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    console,
  });
  const html = readFileSync(
    "artifacts/api-server/voice-tutor/index.html",
    "utf8",
  );
  vm.runInContext(
    readFileSync("artifacts/api-server/voice-tutor/dist/learning.js", "utf8"),
    sandbox,
  );
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)![1], sandbox);
  vm.runInContext(
    `globalThis.track={enabled:true,stopped:false,stop(){this.stopped=true}};stream={getAudioTracks:()=>[track],getTracks:()=>[track]};pc={close(){}};dc={readyState:'open',send(){},close(){}};`,
    sandbox,
  );
  nodes.get("mute").onclick();
  assert.equal(vm.runInContext("track.enabled", sandbox), false);
  assert.equal(nodes.get("mute")["aria-pressed"], "true");
  nodes.get("mute").onclick();
  assert.equal(vm.runInContext("track.enabled", sandbox), true);
  nodes.get("stop").onclick();
  assert.equal(vm.runInContext("track.stopped", sandbox), true);
  assert.equal(vm.runInContext("stream", sandbox), null);
  assert.equal(nodes.get("start").disabled, false);
});

test("practice HTTP API enforces delayed assessment feedback and selected-source grading boundaries", async () => {
  const start = await request("/api/practice/start", {
    ids: [topics[0].id],
    mode: "assessment",
    scope: "mixed",
    limit: 2,
    seconds: 60,
  });
  assert.equal(start.status, 200);
  const first: any = await start.json();
  assert.ok(first.question);
  assert.equal(first.question.answer, undefined);
  const hint = await request("/api/practice/assist", {});
  assert.equal(hint.status, 400);
  const answer = await request("/api/practice/answer", {
    question_id: first.question.id,
    choice: "A",
    confidence: "high",
  });
  assert.equal(answer.status, 200);
  assert.deepEqual(await answer.json(), { recorded: true, mode: "assessment" });
  const stale = await request("/api/practice/answer", {
    question_id: first.question.id,
    choice: "A",
  });
  assert.equal(stale.status, 400);
  const end: any = await (await request("/api/practice/finish", {})).json();
  assert.equal(end.results.length, 1);
  assert.ok(end.results[0].rationale);
  assert.ok(end.results[0].source.url.startsWith("https://"));
});
test("tutor interface executes teaching, ITE cohort comparison and local persistence flows", async () => {
  const { readFileSync } = await import("node:fs"),
    vm = await import("node:vm"),
    { bank } = await import("./practice");
  const nodes = new Map<string, any>(),
    saved = new Map<string, string>();
  function makeNode(id = ""): any {
    const n: any = {
      id,
      textContent: "",
      value: "",
      disabled: false,
      children: [],
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute() {},
      append(...children: any[]) {
        this.children.push(...children);
        if ((id === "topic" || id === "lookupUrl") && !this.value)
          this.value = children[0]?.value || "";
      },
      replaceChildren(...children: any[]) {
        this.children = children;
        if (id === "topic" || id === "lookupUrl") this.value = "";
      },
      click() {
        this.onclick?.();
      },
    };
    Object.defineProperty(n, "options", {
      get() {
        return n.children;
      },
    });
    return n;
  }
  const sandbox = vm.createContext({
    document: {
      getElementById(id: string) {
        if (!nodes.has(id)) nodes.set(id, makeNode(id));
        return nodes.get(id);
      },
      createElement() {
        return makeNode();
      },
      createTextNode(s: string) {
        return s;
      },
    },
    localStorage: {
      getItem(k: string) {
        return saved.get(k) || null;
      },
      setItem(k: string, v: string) {
        saved.set(k, v);
      },
    },
    window: { addEventListener() {} },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    URL,
    console,
    alert() {},
    fetch: async (path: string, opts: any) =>
      request(path, opts.body ? JSON.parse(opts.body) : undefined),
    confirm: () => true,
  });
  vm.runInContext(
    readFileSync("artifacts/api-server/voice-tutor/dist/learning.js", "utf8"),
    sandbox,
  );
  vm.runInContext(
    readFileSync("artifacts/api-server/voice-tutor/index.html", "utf8").match(
      /<script>([\s\S]*?)<\/script>/,
    )![1],
    sandbox,
  );
  for (const id of [
    "code",
    "practiceScope",
    "practiceMode",
    "blockSize",
    "blockSeconds",
    "confidence",
    "errorType",
    "iteYear",
    "itePGY",
    "iteScore",
    "iteMean1",
    "iteMean2",
    "iteMean3",
    "iteSource",
    "iteSourceLabel",
  ])
    if (!nodes.has(id)) nodes.set(id, makeNode(id));
  nodes.get("code").value = "test-only-private-code-123456789";
  await nodes.get("login").onsubmit({ preventDefault() {} });
  assert.match(nodes.get("bankCoverage").textContent, /26 original/);
  nodes.get("practiceScope").value = "mixed";
  nodes.get("practiceMode").value = "teaching";
  nodes.get("blockSize").value = "1";
  nodes.get("blockSeconds").value = "60";
  await nodes.get("practiceStart").onclick();
  const id = vm.runInContext("practiceCurrent.id", sandbox),
    q = bank.find((q) => q.id === id)!;
  nodes.get("confidence").value = "high";
  nodes.get("errorType").value = "knowledge_gap";
  await nodes
    .get("practiceOptions")
    .children[(q.answer + 1) % q.options.length].onclick();
  assert.match(nodes.get("practiceFeedback").textContent, /Re-read/);
  await nodes.get("practiceOptions").children[q.answer].onclick();
  assert.match(nodes.get("practiceQuestion").textContent, /Block complete/);
  assert.match(nodes.get("retention").textContent, /first attempts: 0 \/ 1/);
  const values: any = {
    iteYear: "2025",
    itePGY: "1",
    iteScore: "430",
    iteMean1: "400",
    iteMean2: "450",
    iteMean3: "500",
    iteSource: "https://portfolio.theabfm.org/report",
    iteSourceLabel: "Synthetic test fixture — not real national data",
  };
  for (const [k, v] of Object.entries(values)) nodes.get(k).value = v;
  nodes.get("iteSave").onclick();
  const reports = JSON.parse(saved.get("fm-tutor-progress-v1")!).iteReports;
  assert.equal(reports[0].comparisons[0].difference, 30);
  assert.equal(reports[0].comparisons[0].sameLevel, true);
  assert.equal(reports[0].comparisons[2].difference, -70);
  assert.equal(reports[0].comparisons[2].sameLevel, false);
  assert.match(nodes.get("iteComparisons").children[0].textContent, /2025/);
});
