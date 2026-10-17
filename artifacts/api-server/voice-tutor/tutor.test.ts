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
    assert.deepEqual(config.tools.map((tool: any) => tool.name).sort(), [
      "answer_practice_question",
      "finish_practice",
      "get_practice_question",
      "mark_practice_assisted",
      "record_learning",
      "save_lesson",
      "search_curriculum",
      "search_library",
      "select_curriculum_lesson",
      "select_library_topic",
    ]);
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
  assert.equal(nodes.get("start").disabled, true); // No topic has been selected in this fixture.
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
    saved = new Map<string, string>(),
    apiCalls: Array<{ path: string; body: any }> = [];
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
        if (
          [
            "topic",
            "lookupUrl",
            "curriculumLesson",
            "medicationChoice",
            "medicationLabelChoice",
          ].includes(id) &&
          !this.value
        )
          this.value = children[0]?.value || "";
      },
      replaceChildren(...children: any[]) {
        this.children = children;
        if (
          [
            "topic",
            "lookupUrl",
            "curriculumLesson",
            "medicationChoice",
            "medicationLabelChoice",
          ].includes(id)
        )
          this.value = "";
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
    fetch: async (path: string, opts: any) => {
      const body = opts.body ? JSON.parse(opts.body) : undefined;
      apiCalls.push({ path, body });
      if (path === "/api/medications/labels")
        return Response.json({
          choices: [
            {
              setid: "5073c482-952c-400c-afff-64380f133bc8",
              title: "METFORMIN TABLET — UI fixture",
              published_date: "Oct 16, 2026",
            },
          ],
          notice: "Choose the exact product",
        });
      if (path === "/api/medications/load")
        return Response.json({
          title: "METFORMIN TABLET — UI fixture",
          published_date: "Oct 16, 2026",
          spl_version: "4",
          label_effective_date: "20261016",
          accessed: "2026-10-17",
          url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5073c482-952c-400c-afff-64380f133bc8",
          sections: [
            {
              title: "4 CONTRAINDICATIONS",
              text: "UNIQUE-SESSION-SOURCE-FIXTURE",
            },
          ],
          omitted: [],
          notice: "Missing sections are gaps",
        });
      return path === "/api/session"
        ? new Response("v=0\r\nmock-sdp", {
            headers: { "content-type": "application/sdp" },
          })
        : request(path, body);
    },
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
  assert.equal(nodes.get("topic").options.length, 156);
  for (const [query, parent] of [
    ["pyelonephritis", "2ddb34532433626f2090b51b"],
    ["inpatient pneumonia", "6bdba761b977cff2f575e630"],
    ["impatient pneumonia", "6bdba761b977cff2f575e630"],
  ]) {
    nodes.get("filter").value = query;
    nodes.get("filter").oninput();
    assert.ok(
      nodes.get("topic").options.some((o: any) => o.value === parent),
      query,
    );
    assert.equal(nodes.get("start").disabled, false);
  }
  nodes.get("filter").value = "  AsThMa  ";
  nodes.get("filter").oninput();
  assert.ok(nodes.get("topic").options.length > 0);
  assert.ok(
    nodes.get("topic").options.every((o: any) => /asthma/i.test(o.textContent)),
  );
  const asthmaId = nodes.get("topic").value;
  // Begin on the original first topic to reproduce the reported hypertension lock.
  nodes.get("filter").value = "";
  nodes.get("filter").oninput();
  nodes.get("topic").value = topics[0].id;
  nodes.get("topic").onchange();
  assert.equal(nodes.get("topic").value, topics[0].id);
  nodes.get("practiceScope").value = "mixed";
  nodes.get("practiceMode").value = "teaching";
  vm.runInContext(
    `
    globalThis.outgoing = [];
    globalThis.track = {enabled:true,stopped:false,stop(){this.stopped=true}};
    globalThis.navigator={mediaDevices:{getUserMedia:async()=>{
      track={enabled:true,stopped:false,stop(){this.stopped=true}};
      return {getAudioTracks:()=>[track],getTracks:()=>[track]};
    }}};
    globalThis.crypto={randomUUID:()=>"test-voice-session"};
    globalThis.RTCPeerConnection=class {
      createDataChannel(){this.channel={readyState:"open",send(message){outgoing.push(JSON.parse(message))},close(){}};return this.channel;}
      async createOffer(){return {sdp:"v=0\\r\\nmock-offer"};}
      async setLocalDescription(){}
      async setRemoteDescription(){this.channel.onopen?.();}
      close(){}
      addTrack(){}
    };
    window.RTCPeerConnection=RTCPeerConnection;
  `,
    sandbox,
  );
  // Conversation starts are guided cases; scored practice requires its own button.
  await nodes.get("start").onclick();
  const freshSession = apiCalls.find((call) => call.path === "/api/session");
  assert.equal(freshSession?.body.guided, true);
  assert.equal(
    apiCalls.some((call) => call.path === "/api/practice/start"),
    false,
  );
  assert.equal(vm.runInContext("practiceRunning", sandbox), false);
  assert.equal(vm.runInContext("practiceCurrent", sandbox), null);
  const initialMessages: any[] = vm.runInContext("outgoing", sandbox);
  const initialPrompt = initialMessages.find(
    (message) => message.item?.role === "user",
  ).item.content[0].text;
  assert.match(initialPrompt, /guided, unscored clinical case/);
  assert.match(initialPrompt, /introduction\/vignette/);
  assert.ok(!initialPrompt.includes("get_practice_question"));
  nodes.get("case").onclick();
  const caseMessages: any[] = vm.runInContext("outgoing", sandbox);
  assert.match(
    caseMessages.at(-2).item.content[0].text,
    /same guided clinical case.*next unfinished stage/,
  );
  nodes.get("stop").onclick();
  assert.equal(vm.runInContext("track.stopped", sandbox), true);

  for (const [query, focus] of [
    ["pyelonephritis", "pyelonephritis"],
    ["inpatient pneumonia", "inpatient community-acquired pneumonia"],
  ]) {
    nodes.get("filter").value = query;
    nodes.get("filter").oninput();
    await nodes.get("start").onclick();
    const sent: any[] = vm.runInContext("outgoing", sandbox);
    assert.ok(sent.at(-2).item.content[0].text.includes("focused on " + focus));
    nodes.get("stop").onclick();
  }
  nodes.get("filter").value = "";
  nodes.get("filter").oninput();
  nodes.get("topic").value = topics[0].id;
  nodes.get("topic").onchange();

  await nodes.get("practiceStart").onclick();
  assert.equal(vm.runInContext("practiceRunning", sandbox), true);
  await nodes.get("start").onclick();
  const reviewedSession = apiCalls
    .filter((call) => call.path === "/api/session")
    .at(-1);
  assert.equal(reviewedSession?.body.guided, false);
  const reviewedMessages: any[] = vm.runInContext("outgoing", sandbox);
  assert.match(
    reviewedMessages.at(-2).item.content[0].text,
    /active reviewed practice block.*get_practice_question/,
  );
  assert.equal(vm.runInContext("!!pc", sandbox), true);
  assert.equal(
    nodes.get("filter").disabled,
    false,
    "search stays enabled during voice",
  );
  assert.equal(
    nodes.get("topic").disabled,
    false,
    "dropdown stays enabled during voice",
  );
  const emit = (event: unknown) => {
    sandbox.incomingEvent = event;
    vm.runInContext("onEvent({data:JSON.stringify(incomingEvent)})", sandbox);
  };
  const dispatchTool = async (
    name: string,
    args: unknown,
    id: string,
    queueOldCheckpoint = false,
  ) => {
    emit({ type: "response.created", response: { id } });
    emit({
      type: "response.function_call_arguments.done",
      response_id: id,
      name,
      call_id: id + "-call",
      arguments: JSON.stringify(args),
    });
    if (queueOldCheckpoint)
      emit({
        type: "response.function_call_arguments.done",
        response_id: id,
        name: "save_lesson",
        call_id: id + "-old-checkpoint",
        arguments: JSON.stringify({
          checkpoint: "Stale queued hypertension",
          plan: [],
        }),
      });
    emit({
      type: "response.done",
      response: {
        id,
        output: [
          // Library navigation must continue even after "I'll look for that."
          { type: "message", role: "assistant", content: [] },
          { type: "function_call", call_id: id + "-call" },
          ...(queueOldCheckpoint
            ? [{ type: "function_call", call_id: id + "-old-checkpoint" }]
            : []),
        ],
      },
    });
    await vm.runInContext("toolChain", sandbox);
    const messages: any[] = vm.runInContext("outgoing", sandbox);
    const result = messages.find((m) => m.item?.call_id === id + "-call");
    assert.ok(result, "every accepted library tool must receive a result");
    return JSON.parse(result.item.output);
  };
  const beforeSearch = vm.runInContext("activeTopic", sandbox);
  const found = await dispatchTool(
    "search_library",
    { query: "asthma" },
    "search-asthma",
  );
  assert.ok(found.topics.some((topic: any) => topic.id === asthmaId));
  assert.ok(found.total > 0);
  assert.equal(vm.runInContext("activeTopic", sandbox), beforeSearch);
  assert.equal(vm.runInContext("track.stopped", sandbox), false);
  assert.equal(
    vm.runInContext("outgoing.some(m => m.type === 'session.update')", sandbox),
    false,
    "catalog search must not change the clinical context",
  );
  const noMatch = await dispatchTool(
    "search_library",
    { query: "no-such-topic-xyz" },
    "search-empty",
  );
  assert.equal(noMatch.total, 0);
  assert.equal(noMatch.topics.length, 0);
  const invalidSelection = await dispatchTool(
    "select_library_topic",
    { topic_id: "fake-topic" },
    "select-invalid",
  );
  assert.equal(invalidSelection.ok, false);
  assert.match(invalidSelection.error, /Unknown library topic/);
  assert.equal(vm.runInContext("activeTopic", sandbox), beforeSearch);

  const beforeFailedSelectionFetch = sandbox.fetch;
  const originalTopicEpoch = vm.runInContext("topicEpoch", sandbox);
  const originalPractice = vm.runInContext("practiceCurrent.id", sandbox);
  sandbox.fetch = async (path: string, opts: any) =>
    path === "/api/library/select"
      ? new Response(
          JSON.stringify({ error: "Temporary library request failure" }),
          {
            status: 500,
            headers: { "content-type": "application/json" },
          },
        )
      : beforeFailedSelectionFetch(path, opts);
  const failedSelection = await dispatchTool(
    "select_library_topic",
    { topic_id: asthmaId },
    "select-server-error",
  );
  assert.equal(failedSelection.ok, false);
  assert.match(failedSelection.error, /Temporary library request failure/);
  assert.equal(vm.runInContext("topicEpoch", sandbox), originalTopicEpoch);
  assert.equal(vm.runInContext("activeTopic", sandbox), beforeSearch);
  assert.equal(
    vm.runInContext("practiceCurrent.id", sandbox),
    originalPractice,
  );
  assert.equal(vm.runInContext("practiceRunning", sandbox), true);
  assert.equal(nodes.get("practiceOptions").children[0].disabled, false);
  assert.equal(vm.runInContext("track.stopped", sandbox), false);
  sandbox.fetch = beforeFailedSelectionFetch;

  // Keep an old practice answer in flight across a voice-driven context change.
  const beforeSwitchFetch = sandbox.fetch;
  let releaseOldAnswer!: () => void, oldAnswerArrived!: () => void;
  const oldAnswerPending = new Promise<void>((r) => (oldAnswerArrived = r));
  sandbox.fetch = async (path: string, opts: any) => {
    const response = await beforeSwitchFetch(path, opts);
    if (path === "/api/practice/answer") {
      oldAnswerArrived();
      await new Promise<void>((r) => (releaseOldAnswer = r));
    }
    return response;
  };
  const oldCase = bank.find(
    (q) => q.id === vm.runInContext("practiceCurrent.id", sandbox),
  )!;
  const oldAnswer = nodes
    .get("practiceOptions")
    .children[(oldCase.answer + 1) % oldCase.options.length].onclick();
  await oldAnswerPending;

  vm.runInContext(
    `data.checkpoint="Old hypertension case";data.plan=["Old hypertension plan"];data.history=[{role:"assistant",content:"Old hypertension teaching"}];`,
    sandbox,
  );
  const selectedByVoice = await dispatchTool(
    "select_library_topic",
    { topic_id: asthmaId },
    "select-asthma",
    true,
  );
  assert.equal(selectedByVoice.ok, true);
  assert.equal(selectedByVoice.topic.id, asthmaId);
  assert.equal(selectedByVoice.entries[0].key, asthmaId);
  assert.ok(selectedByVoice.entries[0].content.length > 0);
  assert.equal(vm.runInContext("activeTopic", sandbox), asthmaId);
  assert.equal(nodes.get("practiceMode").value, "teaching");
  assert.equal(nodes.get("practiceScope").value, "selected");
  assert.equal(nodes.get("topic").value, asthmaId);
  assert.equal(nodes.get("filter").value, "");
  assert.equal(nodes.get("topic").options.length, 156);
  assert.match(nodes.get("topicStatus").textContent, /Studying.*Asthma/i);
  assert.ok(nodes.get("sources").children.length > 0);
  assert.equal(vm.runInContext("entries[0].key", sandbox), asthmaId);
  assert.equal(vm.runInContext("data.checkpoint", sandbox), "");
  assert.equal(vm.runInContext("data.plan.length", sandbox), 0);
  assert.equal(vm.runInContext("data.history.length", sandbox), 0);
  assert.equal(vm.runInContext("data.lessonTopic", sandbox), asthmaId);
  assert.equal(vm.runInContext("practiceCurrent", sandbox), null);
  assert.equal(vm.runInContext("practiceRunning", sandbox), false);
  assert.equal(nodes.get("practiceOptions").children.length, 0);
  assert.equal(nodes.get("practiceFeedback").children.length, 0);
  assert.equal(nodes.get("practiceTimer").textContent, "");
  const switchedQuestion = nodes.get("practiceQuestion").textContent;
  releaseOldAnswer();
  await oldAnswer;
  sandbox.fetch = beforeSwitchFetch;
  assert.equal(nodes.get("practiceQuestion").textContent, switchedQuestion);
  assert.equal(nodes.get("practiceFeedback").children.length, 0);
  assert.equal(nodes.get("practiceOptions").children.length, 0);
  assert.equal(vm.runInContext("track.stopped", sandbox), false);
  assert.equal(vm.runInContext("!!pc", sandbox), true);
  const sent: any[] = vm.runInContext("outgoing", sandbox);
  const updateAt = sent.findIndex((m) => m.type === "session.update");
  const selectedOutputAt = sent.findIndex(
    (m) => m.item?.call_id === "select-asthma-call",
  );
  assert.ok(updateAt >= 0 && updateAt < selectedOutputAt);
  assert.ok(
    sent[updateAt].session.instructions.includes("[REF " + asthmaId + "]"),
  );
  assert.ok(!sent[updateAt].session.instructions.includes("Old hypertension"));
  assert.ok(
    sent[updateAt].session.tools.some((t: any) => t.name === "search_library"),
  );
  assert.equal(sent[updateAt].session.tool_choice, "auto");
  assert.equal(sent[selectedOutputAt + 1].type, "response.create");

  // Old response events must not restore its checkpoint, transcript or case.
  emit({
    type: "response.function_call_arguments.done",
    response_id: "search-asthma",
    name: "save_lesson",
    call_id: "late-hypertension-save",
    arguments: JSON.stringify({ checkpoint: "Stale hypertension", plan: [] }),
  });
  emit({
    type: "response.output_audio_transcript.done",
    response_id: "search-asthma",
    item_id: "old-hypertension-transcript",
    transcript: "Stale hypertension transcript",
  });
  const countBeforeOldDone = vm.runInContext("outgoing.length", sandbox);
  emit({
    type: "response.done",
    response: {
      id: "search-asthma",
      output: [{ type: "function_call", call_id: "late-hypertension-save" }],
    },
  });
  await vm.runInContext("toolChain", sandbox);
  assert.equal(vm.runInContext("data.checkpoint", sandbox), "");
  assert.equal(vm.runInContext("data.history.length", sandbox), 0);
  assert.equal(vm.runInContext("outgoing.length", sandbox), countBeforeOldDone);

  // An old source fetch settling after the voice switch must not replace asthma.
  const priorFetch = sandbox.fetch;
  let releaseContext!: () => void, contextArrived!: () => void;
  const contextPending = new Promise<void>((r) => (contextArrived = r));
  sandbox.fetch = async (path: string, opts: any) => {
    const response = await priorFetch(path, opts);
    if (path === "/api/context") {
      contextArrived();
      await new Promise<void>((r) => (releaseContext = r));
    }
    return response;
  };
  const pendingEvidence = vm.runInContext("refreshEvidence()", sandbox);
  await contextPending;
  await dispatchTool(
    "select_library_topic",
    { topic_id: topics[0].id },
    "select-back",
  );
  releaseContext();
  await pendingEvidence;
  assert.equal(vm.runInContext("entries[0].key", sandbox), topics[0].id);
  assert.equal(vm.runInContext("activeTopic", sandbox), topics[0].id);
  sandbox.fetch = priorFetch;
  await dispatchTool(
    "select_library_topic",
    { topic_id: asthmaId },
    "select-asthma-again",
  );
  nodes.get("filter").value = "diabetes";
  nodes.get("filter").oninput();
  assert.equal(vm.runInContext("track.stopped", sandbox), true);
  assert.equal(vm.runInContext("pc", sandbox), null);
  assert.notEqual(nodes.get("topic").value, asthmaId);
  assert.equal(vm.runInContext("practiceCurrent", sandbox), null);
  nodes.get("filter").value = "no-such-topic-xyz";
  nodes.get("filter").oninput();
  assert.equal(nodes.get("topic").options.length, 0);
  assert.equal(nodes.get("start").disabled, true);
  assert.equal(nodes.get("practiceStart").disabled, true);
  assert.match(nodes.get("topicStatus").textContent, /No matching/);
  assert.equal(nodes.get("sources").children.length, 0);
  nodes.get("filter").value = "";
  nodes.get("filter").oninput();
  assert.equal(nodes.get("topic").options.length, 156);
  assert.equal(nodes.get("start").disabled, false);
  const selected = nodes.get("topic").options[1].value;
  nodes.get("topic").value = selected;
  nodes.get("topic").onchange();
  assert.equal(nodes.get("topic").value, selected);
  assert.equal(nodes.get("start").disabled, false);
  nodes.get("random").onclick();
  assert.ok(topics.some((t) => t.id === nodes.get("topic").value));
  nodes.get("weak").onclick();
  assert.match(nodes.get("error").textContent, /No weak areas/);
  // Permission failures must restore all topic controls and stop connection setup.
  vm.runInContext(
    `navigator.mediaDevices.getUserMedia=async()=>{throw Error("Microphone denied")}`,
    sandbox,
  );
  await nodes.get("start").onclick();
  assert.match(nodes.get("error").textContent, /Microphone denied/);
  assert.equal(nodes.get("filter").disabled, false);
  assert.equal(nodes.get("topic").disabled, false);
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

  let exported: Blob | undefined;
  sandbox.Blob = Blob;
  sandbox.URL = class extends URL {
    static createObjectURL(blob: Blob) {
      exported = blob;
      return "blob:test-export";
    }
    static revokeObjectURL() {}
  };
  nodes.get("export").onclick();
  const archive = await exported!.text();
  assert.equal(JSON.parse(archive).iteReports[0].score, reports[0].score);
  nodes.get("clear").onclick();
  assert.equal(vm.runInContext("data.events.length", sandbox), 0);
  await nodes.get("importFile").onchange({
    target: { files: [{ size: archive.length, text: async () => archive }] },
  });
  assert.equal(vm.runInContext("data.iteReports.length", sandbox), 1);
  assert.ok(vm.runInContext("data.events.length", sandbox) > 0);
  const checkpoint = vm.runInContext("data.checkpoint", sandbox);
  vm.runInContext(
    `onEvent({data:JSON.stringify({type:"response.function_call_arguments.done",call_id:"stale-call",name:"save_lesson",arguments:JSON.stringify({checkpoint:"stale checkpoint",plan:[]})})});stop();`,
    sandbox,
  );
  await vm.runInContext("toolChain", sandbox);
  assert.equal(vm.runInContext("data.checkpoint", sandbox), checkpoint);
  vm.runInContext(
    `$("text").value="Keep my draft";$("typed").onsubmit({preventDefault(){}});`,
    sandbox,
  );
  assert.equal(nodes.get("text").value, "Keep my draft");
  assert.match(nodes.get("error").textContent, /Start a conversation/);

  nodes.get("practiceScope").value = "mixed";
  nodes.get("practiceMode").value = "teaching";
  await nodes.get("practiceStart").onclick();
  const lateQuestion = bank.find(
    (q) => q.id === vm.runInContext("practiceCurrent.id", sandbox),
  )!;
  const originalFetch = sandbox.fetch;
  let releaseAnswer!: () => void, answerArrived!: () => void;
  const arrived = new Promise<void>((r) => (answerArrived = r));
  sandbox.fetch = async (path: string, opts: any) => {
    const response = await originalFetch(path, opts);
    if (path === "/api/practice/answer") {
      answerArrived();
      await new Promise<void>((r) => (releaseAnswer = r));
    }
    return response;
  };
  const pendingAnswer = nodes
    .get("practiceOptions")
    .children[lateQuestion.answer].onclick();
  await arrived;
  nodes.get("filter").value = "asthma";
  nodes.get("filter").oninput();
  const topicMessage = nodes.get("practiceQuestion").textContent;
  releaseAnswer();
  await pendingAnswer;
  assert.equal(
    nodes.get("practiceQuestion").textContent,
    topicMessage,
    "late answer must not restore the old case",
  );
  assert.equal(nodes.get("practiceOptions").children.length, 0);
  sandbox.fetch = originalFetch;

  // Specialist controls run through the same application and mocked voice channel.
  const scoredBefore = vm.runInContext("data.events.length", sandbox);
  nodes.get("learningTrack").value = "medication";
  nodes.get("learningTrack").onchange();
  assert.equal(nodes.get("curriculumLesson").options.length, 94);
  for (const [query, expected] of [
    ["pyelonephritis", "abx-pyelo-levo"],
    ["inpatient pneumonia", "abx-cap-ward"],
    ["impatient pneumonia", "abx-cap-ward"],
  ]) {
    nodes.get("curriculumFilter").value = query;
    nodes.get("curriculumFilter").oninput();
    assert.ok(
      nodes
        .get("curriculumLesson")
        .options.some((o: any) => o.value === expected),
      query,
    );
    assert.ok(nodes.get("curriculumSources").children.length);
    assert.equal(nodes.get("start").disabled, false);
  }
  nodes.get("curriculumFilter").value = "amoxicillin";
  nodes.get("curriculumFilter").oninput();
  assert.equal(nodes.get("curriculumLesson").value, "med-amoxicillin-strep");
  assert.ok(nodes.get("curriculumSources").children.length);
  const safetyNotes = nodes
    .get("curriculumNotes")
    .children.map((p: any) => p.textContent)
    .join("\n");
  assert.match(safetyNotes, /Contraindication:/);
  assert.match(safetyNotes, /Renal \(adjustment required\)/);
  assert.match(safetyNotes, /Hepatic \(not established\)/);
  assert.match(safetyNotes, /LABEL-AMOXICILLIN/);
  nodes.get("curriculumFilter").value = "absent-medication-zzzz";
  nodes.get("curriculumFilter").oninput();
  assert.equal(nodes.get("curriculumLesson").options.length, 0);
  assert.equal(nodes.get("start").disabled, true);
  assert.equal(nodes.get("curriculumSources").children.length, 0);
  nodes.get("learningTrack").value = "safety";
  nodes.get("learningTrack").onchange();
  nodes.get("curriculumFilter").value = "SIADH";
  nodes.get("curriculumFilter").oninput();
  assert.equal(nodes.get("curriculumLesson").value, "safe-siadh");
  vm.runInContext('$("curriculumRating").value = "good"', sandbox);
  nodes.get("curriculumReview").onclick();
  assert.equal(vm.runInContext("data.curriculumReviews.length", sandbox), 1);
  assert.equal(vm.runInContext("data.events.length", sandbox), scoredBefore);
  assert.match(
    nodes.get("curriculumReviewStatus").textContent,
    /Excluded from exam scores/,
  );
  nodes.get("learningTrack").value = "advanced";
  nodes.get("learningTrack").onchange();
  assert.equal(nodes.get("curriculumLesson").options.length, 4);
  nodes.get("curriculumReveal").onclick();
  assert.match(nodes.get("curriculumFinding").textContent, /124/);
  nodes.get("curriculumReveal").onclick();
  assert.match(nodes.get("curriculumFinding").textContent, /138/);
  nodes.get("curriculumReveal").onclick();
  assert.equal(nodes.get("curriculumReveal").disabled, true);
  apiCalls.length = 0;
  vm.runInContext(
    `navigator.mediaDevices.getUserMedia=async()=>{track={enabled:true,stopped:false,stop(){this.stopped=true}};return {getTracks:()=>[track],getAudioTracks:()=>[track]};}`,
    sandbox,
  );
  await nodes.get("start").onclick();
  const specialistSession = apiCalls.find((c) => c.path === "/api/session");
  assert.equal(specialistSession?.body.curriculum_id, "advanced-confusion");
  assert.equal(specialistSession?.body.guided, true);
  vm.runInContext(
    `outgoing.length=0;
    onEvent({data:JSON.stringify({type:"response.created",response:{id:"specialist-switch"}})});
    onEvent({data:JSON.stringify({type:"response.function_call_arguments.done",response_id:"specialist-switch",call_id:"new-specialist",name:"select_curriculum_lesson",arguments:JSON.stringify({lesson_id:"safe-siadh"})})});
    onEvent({data:JSON.stringify({type:"response.done",response:{id:"specialist-switch",output:[{type:"message"},{type:"function_call",call_id:"new-specialist"}]}})});`,
    sandbox,
  );
  await vm.runInContext("toolChain", sandbox);
  await Promise.resolve();
  assert.equal(nodes.get("curriculumLesson").value, "safe-siadh");
  assert.equal(nodes.get("learningTrack").value, "safety");
  assert.ok(
    vm.runInContext(
      "outgoing.some(m=>m.type==='session.update' && m.session.instructions.includes('ACTIVE SPECIALIST CURRICULUM'))",
      sandbox,
    ),
  );
  assert.ok(
    vm.runInContext("outgoing.some(m=>m.type==='response.create')", sandbox),
  );
  vm.runInContext(
    `tool({call_id:"specialist-checkpoint",name:"save_lesson",arguments:JSON.stringify({checkpoint:"Safety stage 3",plan:["monitoring"]})})`,
    sandbox,
  );
  assert.equal(
    vm.runInContext(
      "data.curriculumCheckpoints['safe-siadh'].checkpoint",
      sandbox,
    ),
    "Safety stage 3",
  );
  nodes.get("learningTrack").value = "advanced";
  nodes.get("learningTrack").onchange();
  nodes.get("learningTrack").value = "safety";
  nodes.get("learningTrack").onchange();
  nodes.get("curriculumLesson").value = "safe-siadh";
  nodes.get("curriculumLesson").onchange();
  assert.equal(vm.runInContext("data.checkpoint", sandbox), "Safety stage 3");
  vm.runInContext(
    "data.curriculumReviews[0].due='2020-01-01T00:00:00Z'",
    sandbox,
  );
  nodes.get("curriculumDue").onclick();
  assert.equal(nodes.get("curriculumLesson").value, "safe-siadh");
  nodes.get("export").onclick();
  const specialistArchive = await exported!.text();
  assert.equal(JSON.parse(specialistArchive).curriculumReviews.length, 1);
  nodes.get("clear").onclick();
  await nodes.get("importFile").onchange({
    target: {
      files: [
        {
          size: specialistArchive.length,
          text: async () => specialistArchive,
        },
      ],
    },
  });
  assert.equal(vm.runInContext("data.curriculumReviews.length", sandbox), 1);
  assert.equal(
    vm.runInContext(
      "data.curriculumCheckpoints['safe-siadh'].checkpoint",
      sandbox,
    ),
    "Safety stage 3",
  );
  assert.equal(vm.runInContext("data.events.length", sandbox), scoredBefore);
  // Navigate a rule through the real UI handlers, then exercise product-selection guards.
  nodes.get("curriculumFilter").value = "";
  nodes.get("learningTrack").value = "criteria";
  nodes.get("learningTrack").onchange();
  assert.equal(nodes.get("curriculumLesson").options.length, 57);
  nodes.get("curriculumFilter").value = "HEART";
  nodes.get("curriculumFilter").oninput();
  assert.equal(nodes.get("curriculumLesson").value, "criteria-heart");
  assert.ok(
    nodes
      .get("curriculumNotes")
      .children.some((n: any) => /omits troponin/.test(n.textContent)),
  );
  nodes.get("curriculumFilter").value = "NEWS2";
  nodes.get("curriculumFilter").oninput();
  assert.ok(
    nodes
      .get("curriculumNotes")
      .children.some((n: any) =>
        /Full calculation inputs are not loaded/.test(n.textContent),
      ),
  );
  vm.runInContext(
    '["medicationQuery","medicationChoice","medicationLabelChoice","medicationTopicOnly","medicationProductConfirmed"].forEach(id=>document.getElementById(id))',
    sandbox,
  );
  nodes.get("medicationQuery").value = "metformin";
  await nodes.get("medicationSearch").onclick();
  assert.equal(nodes.get("medicationChoice").value, "metformin");
  await nodes.get("medicationLabels").onclick();
  assert.ok(nodes.get("medicationLabelChoice").value);
  const loads = () =>
    apiCalls.filter((c) => c.path === "/api/medications/load").length;
  const beforeLoad = loads();
  await nodes.get("medicationLoad").onclick();
  assert.equal(
    loads(),
    beforeLoad,
    "formulation confirmation required before load",
  );
  nodes.get("medicationProductConfirmed").checked = true;
  await nodes.get("medicationLoad").onclick();
  assert.match(
    nodes.get("medicationResult").textContent,
    /Version 4.*Label effective date 20261016/,
  );
  assert.match(
    nodes.get("medicationResult").textContent,
    /UNIQUE-SESSION-SOURCE-FIXTURE/,
  );
  assert.ok(
    [...saved.values()].every(
      (v) => !v.includes("UNIQUE-SESSION-SOURCE-FIXTURE"),
    ),
    "source text not persisted",
  );
  nodes.get("topic").onchange();
  assert.equal(nodes.get("medicationResult").textContent, "");
  assert.equal(nodes.get("medicationProductConfirmed").checked, false);
});
