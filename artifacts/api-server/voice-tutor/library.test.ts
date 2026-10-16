import { test } from "node:test";
import assert from "node:assert/strict";
import { IncomingMessage, ServerResponse } from "node:http";
import { PassThrough } from "node:stream";
import app from "./server";
import { topics, topicEvidence, version } from "./core";

process.chdir(new URL("../../../", import.meta.url).pathname);
process.env.FM_TUTOR_ACCESS_TOKEN = "library-navigation-test-private-code";

// These identifiers name the real frozen library, so navigation is tested against
// the same catalog and evidence used in a voice session, without a live AI call.
const hypertension = "444400516b7fb142fc4454e3";
const asthma = "ae8313ae8e54ea25af25ca48";
const diabetes = "19fcd6ed9d652e4403ee405f";
const copd = "38266a21ba131875fcb5fc6e";
const uti = "2ddb34532433626f2090b51b";

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

function learning(topic: string) {
  return {
    question_id: "library-navigation-unscored-question",
    topic_id: topic,
    skill: "diagnosis",
    result: "unscored",
    evidence_ids: [topic],
    note: "Original teaching supported by the currently selected topic only",
  };
}

function assertPromptCatalog(prompt: string, selected: string) {
  assert.equal(topics.length, 156);
  for (const topic of topics) {
    assert.ok(
      prompt.includes(`${topic.id} | ${topic.title} | ${topic.domain}`),
      `Voice prompt is missing catalog metadata for ${topic.title}`,
    );
  }
  assert.ok(prompt.includes(`CURRENTLY LOADED TOPICS: ${selected}`));
  const evidence = prompt.slice(prompt.indexOf(`LIBRARY snapshot ${version}`));
  assert.ok(evidence.includes(topicEvidence([selected])[0].content));
  assert.ok(evidence.includes(`[REF ${selected}]`));
  for (const topic of topics.filter((topic) => topic.id !== selected))
    assert.ok(
      !evidence.includes(`[REF ${topic.id}]`),
      `Unselected ${topic.title} must stay metadata, not loaded medical evidence`,
    );
}

test("voice health identifies catalog navigation and private endpoints reject unauthenticated requests", async () => {
  const response = await request("/api/healthz");
  assert.equal(response.status, 200);
  const health: any = await response.json();
  assert.equal(health.libraryTopics, 156);
  assert.equal(health.libraryNavigation, "voice-search-and-select-v1");
  assert.equal(health.version, version);
  assert.equal(
    (await request("/api/library/search", { query: "asthma" })).status,
    401,
  );
  assert.equal(
    (await request("/api/library/select", { topic_id: asthma })).status,
    401,
  );
});

test("initial context exposes all catalog metadata, eight tools, and only selected-topic evidence", async () => {
  const api = await unlocked();
  const response = await api("/api/context", {
    ids: [hypertension],
    progress: {},
    history: [],
  });
  assert.equal(response.status, 200);
  const context: any = await response.json();
  assert.equal(context.version, version);
  assert.deepEqual(
    context.entries.map((entry: any) => entry.key),
    [hypertension],
  );
  assertPromptCatalog(context.instructions, hypertension);
  assert.equal(context.tools.length, 8);
  for (const name of ["search_library", "select_library_topic"])
    assert.ok(context.tools.some((tool: any) => tool.name === name));
});

test("initial Realtime handshake receives the full catalog and working navigation tool schemas", async () => {
  const api = await unlocked();
  const previousFetch = globalThis.fetch;
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-only-library-session-key";
  let calls = 0;
  globalThis.fetch = (async (url: any, options: any) => {
    calls++;
    assert.equal(String(url), "https://api.openai.com/v1/realtime/calls");
    const session = JSON.parse(options.body.get("session"));
    assertPromptCatalog(session.instructions, hypertension);
    assert.equal(session.tools.length, 8);
    assert.equal(session.tool_choice, "auto");
    const search = session.tools.find(
      (tool: any) => tool.name === "search_library",
    );
    const select = session.tools.find(
      (tool: any) => tool.name === "select_library_topic",
    );
    assert.deepEqual(search.parameters.required, ["query"]);
    assert.deepEqual(select.parameters.required, ["topic_id"]);
    assert.equal(search.parameters.additionalProperties, false);
    assert.equal(select.parameters.additionalProperties, false);
    return new Response("v=0\r\nmock-library-answer", {
      headers: { "content-type": "application/sdp" },
    });
  }) as any;
  try {
    const response = await api("/api/session", {
      ids: [hypertension],
      progress: {},
      history: [],
      sdp: "v=0\r\nmock-library-offer",
    });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "v=0\r\nmock-library-answer");
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test("search ranks stored condition topics, lists the full catalog, and reports genuine no-match results", async () => {
  const api = await unlocked();
  for (const [query, expected] of [
    ["asthma", asthma],
    ["DIABETES", diabetes],
    ["  COPD  ", copd],
    ["UTI", uti],
  ]) {
    const response = await api("/api/library/search", { query });
    assert.equal(response.status, 200);
    const result: any = await response.json();
    assert.equal(
      result.topics[0].id,
      expected,
      `${query} must rank its own topic first`,
    );
    assert.ok(result.total >= result.topics.length);
    assert.equal(result.version, version);
    assert.equal(
      result.entries,
      undefined,
      "Search must not load clinical evidence",
    );
    for (const topic of result.topics) {
      assert.deepEqual(
        topic,
        topics.find((entry) => entry.id === topic.id),
      );
      assert.ok(topic && !("content" in topic));
    }
  }
  for (const query of ["", "   "]) {
    const result: any = await (
      await api("/api/library/search", { query })
    ).json();
    assert.equal(result.total, 156);
    assert.deepEqual(result.topics, topics);
  }
  const absent: any = await (
    await api("/api/library/search", { query: "definitelyabsentconditionzzzz" })
  ).json();
  assert.deepEqual(absent.topics, []);
  assert.equal(absent.total, 0);
});

test("library endpoints reject malformed search and selection inputs", async () => {
  const api = await unlocked();
  for (const body of [
    {},
    { query: null },
    { query: [] },
    { query: 156 },
    { query: "x".repeat(201) },
  ])
    assert.equal((await api("/api/library/search", body)).status, 400);
  for (const body of [
    {},
    { topic_id: null },
    { topic_id: [] },
    { topic_id: 156 },
    { topic_id: "made-up-topic" },
  ])
    assert.equal((await api("/api/library/select", body)).status, 400);
});

test("library search and rejected selections preserve active evidence and the current practice question", async () => {
  const api = await unlocked();
  assert.equal(
    (
      await api("/api/library/select", {
        topic_id: hypertension,
        progress: {},
      })
    ).status,
    200,
  );
  const started = await api("/api/practice/start", {
    ids: [hypertension],
    mode: "teaching",
    scope: "mixed",
    limit: 3,
  });
  assert.equal(started.status, 200);
  const first: any = await started.json();
  assert.ok(
    first.question?.id,
    "Regression fixture must have an active reviewed question",
  );
  assert.equal(
    (await api("/api/library/search", { query: "asthma" })).status,
    200,
  );
  assert.equal(
    (await api("/api/learning", learning(hypertension))).status,
    200,
  );
  assert.equal((await api("/api/learning", learning(asthma))).status, 400);
  let current: any = await (await api("/api/practice/next", {})).json();
  assert.equal(current.question.id, first.question.id);
  for (const topic_id of ["made-up-topic", "", null, [asthma]]) {
    assert.equal((await api("/api/library/select", { topic_id })).status, 400);
    assert.equal(
      (await api("/api/learning", learning(hypertension))).status,
      200,
    );
    assert.equal((await api("/api/learning", learning(asthma))).status, 400);
    const response = await api("/api/practice/next", {});
    assert.equal(response.status, 200);
    current = await response.json();
    assert.equal(current.question.id, first.question.id);
    assert.deepEqual(current.question, first.question);
  }
});

test("selecting asthma loads fresh evidence, changes learning validation, and clears previous-topic practice", async () => {
  const api = await unlocked();
  const checkpoint = "STALE_HYPERTENSION_PENDING_QUESTION_MUST_NOT_RESUME";
  assert.equal(
    (
      await api("/api/library/select", {
        topic_id: hypertension,
        progress: {},
      })
    ).status,
    200,
  );
  const started: any = await (
    await api("/api/practice/start", {
      ids: [hypertension],
      mode: "assessment",
      scope: "mixed",
      limit: 3,
    })
  ).json();
  assert.ok(started.question?.id);
  const response = await api("/api/library/select", {
    topic_id: asthma,
    progress: {},
    history: [{ checkpoint, topic_id: hypertension }],
  });
  assert.equal(response.status, 200);
  const selected: any = await response.json();
  assert.equal(selected.version, version);
  assert.deepEqual(
    selected.topic,
    topics.find((topic) => topic.id === asthma),
  );
  assert.deepEqual(
    selected.entries.map((entry: any) => entry.key),
    [asthma],
  );
  assert.deepEqual(selected.entries, topicEvidence([asthma]));
  assertPromptCatalog(selected.instructions, asthma);
  assert.ok(!selected.instructions.includes(checkpoint));
  assert.ok(
    selected.instructions.includes(
      "Untrusted recent transcript/checkpoint: []",
    ),
  );
  assert.ok(selected.instructions.includes("Practice mode: teaching"));
  assert.equal(selected.tools.length, 8);
  // A slow preview from the old dropdown selection can arrive after a spoken
  // topic switch. Loading that preview must never restore the old active scope.
  const staleContext = await api("/api/context", {
    ids: [hypertension],
    progress: {},
    history: [checkpoint],
  });
  assert.equal(staleContext.status, 200);
  assertPromptCatalog(
    ((await staleContext.json()) as any).instructions,
    hypertension,
  );
  assert.equal((await api("/api/learning", learning(asthma))).status, 200);
  assert.equal(
    (await api("/api/learning", learning(hypertension))).status,
    400,
  );
  const next = await api("/api/practice/next", {});
  assert.equal(next.status, 400);
  assert.match(((await next.json()) as any).error, /Start a practice block/);
  const staleAnswer = await api("/api/practice/answer", {
    question_id: started.question.id,
    choice: "A",
  });
  assert.equal(staleAnswer.status, 400);
  assert.match(
    ((await staleAnswer.json()) as any).error,
    /Start a practice block/,
  );
});

test(
  "a delayed old-topic Realtime handshake cannot overwrite a newer library selection",
  { timeout: 5000 },
  async () => {
    const api = await unlocked();
    const previousFetch = globalThis.fetch;
    const previousKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "test-only-delayed-library-session-key";
    let releaseFetch!: (response: Response) => void;
    let announceFetch!: () => void;
    const pendingFetch = new Promise<Response>((resolve) => {
      releaseFetch = resolve;
    });
    const fetchStarted = new Promise<void>((resolve) => {
      announceFetch = resolve;
    });
    globalThis.fetch = (async (url: any, options: any) => {
      assert.equal(String(url), "https://api.openai.com/v1/realtime/calls");
      const session = JSON.parse(options.body.get("session"));
      assertPromptCatalog(session.instructions, hypertension);
      announceFetch();
      return pendingFetch;
    }) as any;
    let handshake: Promise<Response> | undefined;
    try {
      handshake = api("/api/session", {
        ids: [hypertension],
        progress: {},
        history: [],
        sdp: "v=0\r\ndelayed-hypertension-offer",
      });
      await fetchStarted;
      const switched = await api("/api/library/select", {
        topic_id: asthma,
        progress: {},
      });
      assert.equal(switched.status, 200);
      assert.equal((await api("/api/learning", learning(asthma))).status, 200);
      releaseFetch(
        new Response("v=0\r\nobsolete-hypertension-answer", {
          headers: { "content-type": "application/sdp" },
        }),
      );
      const response = await handshake;
      assert.equal(response.status, 409);
      assert.ok(
        !(await response.text()).includes("obsolete-hypertension-answer"),
      );
      assert.equal((await api("/api/learning", learning(asthma))).status, 200);
      assert.equal(
        (await api("/api/learning", learning(hypertension))).status,
        400,
      );
    } finally {
      releaseFetch(new Response("v=0\r\nreleased-test-answer"));
      await handshake;
      globalThis.fetch = previousFetch;
      if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = previousKey;
    }
  },
);
