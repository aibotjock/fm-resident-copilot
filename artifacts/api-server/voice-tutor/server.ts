import express from "express";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  instructions,
  tools,
  topics,
  topicEvidence,
  validLearning,
  version,
} from "./core";
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use((_req, res, next) => {
  res.set({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "microphone=(self)",
  });
  next();
});
const sessions = new Map<
  string,
  { expires: number; calls: number; busy: boolean; ids: string[] }
>();
setInterval(() => {
  for (const [k, v] of sessions) if (v.expires < Date.now()) sessions.delete(k);
}, 60000).unref();
app.get("/api/healthz", (_req, res) =>
  res.json({
    status: "ok",
    experiment: true,
    version,
    credentialsConfigured: !!(
      process.env.OPENAI_API_KEY || process.env.OPEAI_API_KEY
    ),
    accessConfigured: !!process.env.FM_TUTOR_ACCESS_TOKEN,
  }),
);
app.get("/", async (_req, res) =>
  res
    .type("html")
    .send(
      await readFile("artifacts/api-server/voice-tutor/index.html", "utf8"),
    ),
);
const attempts = new Map<string, { time: number; count: number }>();
app.post("/api/login", (req, res) => {
  const ip = req.ip || "unknown";
  const old = attempts.get(ip);
  const rate =
    old && old.time > Date.now() - 60000 ? old : { time: Date.now(), count: 0 };
  rate.count++;
  attempts.set(ip, rate);
  if (attempts.size > 10000) attempts.clear();
  if (rate.count > 10) {
    res.status(429).json({ error: "Wait a minute before trying again" });
    return;
  }
  const expected = Buffer.from(process.env.FM_TUTOR_ACCESS_TOKEN || "");
  const actual = Buffer.from(
    typeof req.body.code === "string" ? req.body.code : "",
  );
  if (
    expected.length < 16 ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    res
      .status(403)
      .json({ error: "Private tutor access code is missing or incorrect" });
    return;
  }
  const id = randomBytes(32).toString("hex");
  sessions.set(id, {
    expires: Date.now() + 3600000,
    calls: 0,
    busy: false,
    ids: [],
  });
  res
    .cookie("fm_tutor", id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
      path: "/",
    })
    .json({ ok: true });
});
app.use("/api", (req, res, next) => {
  const id = req.headers.cookie?.match(
    /(?:^|;\s*)fm_tutor=([a-f0-9]{64})(?:;|$)/,
  )?.[1];
  const session = id ? sessions.get(id) : undefined;
  if (!session || session.expires < Date.now()) {
    res.status(401).json({ error: "Unlock the private tutor first" });
    return;
  }
  if (
    req.method !== "GET" &&
    req.get("origin") &&
    req.get("origin") !== `${req.protocol}://${req.get("host")}`
  ) {
    res.status(403).json({ error: "Cross-origin request blocked" });
    return;
  }
  res.locals.session = session;
  next();
});
// Railway terminates TLS at its trusted proxy.
app.set("trust proxy", 1);
app.get("/api/topics", (_req, res) =>
  res.json({
    topics,
    version,
    voiceEnrollment: false,
    externalLookup: "explicit-official-url-only",
  }),
);
app.post("/api/context", (req, res) => {
  try {
    const prompt = instructions(
      req.body.ids,
      req.body.progress,
      req.body.history,
    );
    res.locals.session.ids = req.body.ids;
    res.json({
      instructions: prompt,
      tools,
      entries: topicEvidence(req.body.ids),
      version,
    });
  } catch {
    res.status(400).json({ error: "Select valid library topics" });
  }
});
app.post("/api/learning", (req, res) => {
  if (!validLearning(req.body, res.locals.session.ids)) {
    res
      .status(400)
      .json({ error: "Assessment lacks selected-topic evidence; not scored" });
    return;
  }
  res.json({ ok: true, version });
});
app.post("/api/session", async (req, res) => {
  const session = res.locals.session;
  if (session.busy || session.calls >= 10) {
    res
      .status(429)
      .json({
        error:
          "Session limit reached; wait for the current connection or unlock again later",
      });
    return;
  }
  let prompt: string;
  try {
    prompt = instructions(req.body.ids, req.body.progress, req.body.history);
    if (
      typeof req.body.sdp !== "string" ||
      req.body.sdp.length > 60000 ||
      !req.body.sdp.startsWith("v=0")
    )
      throw Error();
  } catch {
    res.status(400).json({ error: "Invalid topic selection or voice offer" });
    return;
  }
  const key = process.env.OPENAI_API_KEY || process.env.OPEAI_API_KEY;
  if (!key) {
    res
      .status(503)
      .json({
        error:
          "Existing deployed OpenAI key is not configured on this separate tutor service",
      });
    return;
  }
  session.busy = true;
  session.calls++;
  try {
    const fd = new FormData();
    fd.set("sdp", req.body.sdp);
    fd.set(
      "session",
      JSON.stringify({
        type: "realtime",
        model: process.env.FM_TUTOR_REALTIME_MODEL || "gpt-realtime-2.1",
        instructions: prompt,
        tools,
        tool_choice: "auto",
        max_output_tokens: 1200,
        audio: {
          input: {
            noise_reduction: { type: "near_field" },
            transcription: { model: "gpt-4o-mini-transcribe" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.6,
              prefix_padding_ms: 300,
              silence_duration_ms: 650,
              create_response: true,
              interrupt_response: true,
            },
          },
          output: { voice: "marin" },
        },
      }),
    );
    const response = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: fd,
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) {
      res
        .status(502)
        .json({
          error: `OpenAI voice connection failed (${response.status}); verify Realtime model access and billing on the existing key`,
        });
      return;
    }
    session.ids = req.body.ids;
    res.type("application/sdp").send(await response.text());
  } catch {
    res
      .status(502)
      .json({
        error: "Voice service could not be reached; retry the connection",
      });
  } finally {
    session.busy = false;
  }
});
// Only exact official source URLs already listed in the frozen app can be fetched.
// No model-callable browser tool exists. Each fetch needs its own explicit approval.
app.post("/api/lookup", async (req, res) => {
  const { url, approved } = req.body;
  const allowed = topicEvidence(
    res.locals.session.ids.length ? res.locals.session.ids : [topics[0].id],
  ).flatMap((e) => (e.evidence_records || []).map((r) => r.url));
  if (approved !== true || typeof url !== "string" || !allowed.includes(url)) {
    res
      .status(403)
      .json({
        error:
          "Explicit approval and an exact listed official evidence URL are required",
      });
    return;
  }
  const session = res.locals.session;
  if (session.calls >= 10) {
    res.status(429).json({ error: "Session request limit reached" });
    return;
  }
  session.calls++;
  try {
    const r = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(12000),
      headers: { Accept: "text/html,text/plain" },
    });
    if (
      !r.ok ||
      !/(text\/html|text\/plain)/.test(r.headers.get("content-type") || "")
    )
      throw Error();
    const reader = r.body!.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 500000) {
        await reader.cancel();
        throw Error();
      }
      chunks.push(value);
    }
    const text = Buffer.concat(chunks)
      .toString("utf8")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 18000);
    res.json({
      url,
      text,
      accessed: new Date().toISOString(),
      notice:
        "Approved external lookup only; not a verified summary or library update. Open the official page to confirm applicability.",
    });
  } catch {
    res
      .status(502)
      .json({
        error:
          "Official page could not be read safely (redirect, format, size, access or timeout); open its source link instead",
      });
  }
});
app.use((_req, res) =>
  res.status(404).json({ error: "Tutor route not found" }),
);
if (process.env.FM_TUTOR_TEST !== "1")
  app.listen(Number(process.env.PORT) || 8080, "0.0.0.0", () =>
    console.log("Independent FM voice tutor listening"),
  );
export default app;
