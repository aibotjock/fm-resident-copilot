import {
  bank,
  startPractice,
  nextPractice,
  answerPractice,
  finishPractice,
  type Practice,
} from "./practice";
import { BLUEPRINT } from "./learning";
import {
  curriculumCatalog,
  curriculumVersion,
  clinicalSources,
  lessonById,
  lessons,
  medicationSafetyProfiles,
  searchCurriculum,
} from "./curriculum";
import { antibioticCoverage } from "./coverage";
import {
  medicationInventory,
  medicationSearch,
  searchOfficialLabels,
  readOfficialLabel,
  type LabelChoice,
} from "./medication-reference";
import express from "express";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { z } from "zod/v4";
import {
  answerWithEvidence,
  cachedEvidenceVersions,
  EVIDENCE_RELEASE,
  type EvidenceAnswer,
} from "./evidence";
import { sourceRegistry } from "./source-registry";
import {
  updateScenario,
  scenarioFromUtterance,
  cleanClinicalText,
  speechChunks,
  type Scenario,
} from "./presentation";
import { releaseSmoke, runReleaseSmoke } from "./release-smoke";
import { calculateWeightDose } from "./dose-arithmetic";
import type { ProviderMeasurement } from "./performance";
import {
  retainConversation,
  conversationContext,
  CONTEXT_BYTES,
  ARCHIVE_BYTES,
} from "./conversation-memory";
import {
  answerModel,
  searchModel,
  reasoningEffort,
  SESSION_IDLE_MS,
  sessionLimitReached,
} from "./session-settings";
import {
  instructions,
  tools,
  topics,
  topicEvidence,
  validLearning,
  version,
  searchLibrary,
} from "./core";
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));
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
  {
    expires: number;
    calls: number;
    busy: boolean;
    ids: string[];
    contextRevision: number;
    practice?: Practice;
    labelChoices?: { revision: number; choices: LabelChoice[] };
    referenceCalls?: number;
    conversation?: { role: string; content: string }[];
    conversationRevision?: number;
    evidenceBusy?: boolean;
    evidenceCalls?: number;
    scenario?: Scenario;
    latestAnswer?: EvidenceAnswer;
    evidenceController?: AbortController;
    pendingGeneratedQuiz?: string;
    clientCaseId?: string;
  }
>();
setInterval(() => {
  for (const [k, v] of sessions) if (v.expires < Date.now()) sessions.delete(k);
}, 60000).unref();
app.get("/api/healthz", (_req, res) =>
  res.json({
    status: "ok",
    evidenceRelease: EVIDENCE_RELEASE,
    onlineEvidenceConfigured: !!process.env.OPENAI_API_KEY,
    answerModel: answerModel(),
    searchModel: searchModel(),
    reasoningEffort: reasoningEffort(),
    conversationMemory: {
      contextBytes: CONTEXT_BYTES,
      archiveBytes: ARCHIVE_BYTES,
      verbatim: true,
    },
    voiceSessionPolicy: "renew-connection-with-checkpoint",
    clinicalReview: "not_clinically_reviewed",
    releaseSmoke,
    experiment: true,
    version,
    credentialsConfigured: !!(
      process.env.OPENAI_API_KEY || process.env.OPEAI_API_KEY
    ),
    accessConfigured: !!process.env.FM_TUTOR_ACCESS_TOKEN,
    libraryTopics: topics.length,
    libraryNavigation: "voice-search-and-select-v1",
    navigationVersion: "condition-aliases-v1",
    guidedCase: "vignette-to-conclusion-v1",
    curriculumVersion,
    releaseCommit:
      process.env.RAILWAY_GIT_COMMIT_SHA ||
      process.env.FM_TUTOR_RELEASE_COMMIT ||
      null,
    antibioticRegimenCount: curriculumCatalog().antibioticRegimenCount,
    antibioticConditionPathways: curriculumCatalog().antibioticPathways.length,
    curriculumLessons: lessons.length,
    advancedCases: lessons.filter((l) => l.track === "advanced").length,
    medicationSafetyProfiles: medicationSafetyProfiles.length,
    medicationInventory: medicationInventory.length,
    criteriaEntries: lessons.filter((l) => l.track === "criteria").length,
    criteriaOverviews: lessons.filter(
      (l) =>
        l.track === "criteria" &&
        l.study_scope === "purpose_and_interpretation",
    ).length,
    supplementalConditions: lessons.filter((l) => l.track === "condition")
      .length,
  }),
);
app.get("/learning.js", async (_req, res) =>
  res
    .type("js")
    .send(
      await readFile(
        "artifacts/api-server/voice-tutor/dist/learning.js",
        "utf8",
      ),
    ),
);
app.get("/tutor", async (_req, res) =>
  res
    .type("html")
    .send(
      await readFile("artifacts/api-server/voice-tutor/index.html", "utf8"),
    ),
);
app.get("/presentation.js", async (_req, res) =>
  res
    .type("js")
    .send(
      await readFile(
        "artifacts/api-server/voice-tutor/dist/presentation.js",
        "utf8",
      ),
    ),
);
app.get("/conversation.js", async (_req, res) =>
  res
    .type("js")
    .send(
      await readFile(
        "artifacts/api-server/voice-tutor/dist/conversation.js",
        "utf8",
      ),
    ),
);
if (process.env.FM_COMBINED_APP !== "1")
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
    expires: Date.now() + SESSION_IDLE_MS,
    calls: 0,
    busy: false,
    ids: [],
    contextRevision: 0,
  });
  res
    .cookie("fm_tutor", id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_IDLE_MS,
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
  // An active study session renews its idle timeout, preserving its case and history.
  session.expires = Date.now() + SESSION_IDLE_MS;
  res.cookie("fm_tutor", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_IDLE_MS,
    path: "/",
  });
  next();
});
// Railway terminates TLS at its trusted proxy.
app.set("trust proxy", 1);
const conversationInput = z.object({
  query: z.string().trim().min(1).max(3000),
  mode: z.enum(["quick", "teach", "quiz"]).default("quick"),
  topic: z.string().max(300).optional(),
  forceLookup: z.boolean().optional(),
  caseId: z.string().min(1).max(80).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(50000),
      }),
    )
    .max(5000)
    .optional(),
  resumeScenario: z
    .object({
      confirmed: z.record(z.string(), z.string().max(300)),
      hypothetical: z.record(z.string(), z.string().max(300)),
      revision: z.number().int().nonnegative(),
    })
    .optional(),
});
app.get("/api/session/keepalive", (_req, res) => res.json({ ok: true }));
const scenarioInput = z.object({
  action: z.enum(["set", "vary", "restore", "reset"]),
  values: z.record(z.string(), z.string().max(300)).default({}),
});
const initialScenario = (): Scenario => ({
  confirmed: {},
  hypothetical: {},
  revision: 0,
});
app.get("/api/evidence/status", (_req, res) =>
  res.json({
    release: EVIDENCE_RELEASE,
    sources: sourceRegistry,
    versions: cachedEvidenceVersions(),
    clinicalReview: "not_clinically_reviewed",
    onlineConfigured: !!process.env.OPENAI_API_KEY,
    answerModel: answerModel(),
    reasoningEffort: reasoningEffort(),
  }),
);
app.get("/api/conversation/state", (_req, res) =>
  res.json({
    caseId: res.locals.session.clientCaseId || null,
    scenario: res.locals.session.scenario || initialScenario(),
    latestAnswer: res.locals.session.latestAnswer || null,
    question:
      (res.locals.session.conversation || [])
        .filter((t: any) => t.role === "user")
        .at(-1)?.content || "",
  }),
);
app.post("/api/conversation/scenario", (req, res) => {
  const parsed = scenarioInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Use set, vary, restore or reset with short scenario fields",
    });
    return;
  }
  const s = res.locals.session;
  try {
    s.scenario = updateScenario(
      s.scenario || initialScenario(),
      parsed.data.action,
      parsed.data.values,
    );
    s.conversationRevision = (s.conversationRevision || 0) + 1;
    if (parsed.data.action === "reset") {
      s.conversation = [];
      s.latestAnswer = undefined;
    }
    res.json(s.scenario);
  } catch {
    res.status(400).json({ error: "Invalid scenario fields" });
  }
});
app.post("/api/conversation/reset", (_req, res) => {
  const s = res.locals.session;
  s.conversation = [];
  s.clientCaseId = undefined;
  s.pendingGeneratedQuiz = undefined;
  s.latestAnswer = undefined;
  s.scenario = initialScenario();
  s.conversationRevision = (s.conversationRevision || 0) + 1;
  res.json({ ok: true, scenario: s.scenario });
});
app.post("/api/conversation/cancel", (_req, res) => {
  const s = res.locals.session;
  s.conversationRevision = (s.conversationRevision || 0) + 1;
  s.evidenceController?.abort();
  res.json({ ok: true });
});
async function conversationAnswer(
  req: express.Request,
  res: express.Response,
  input: z.infer<typeof conversationInput>,
) {
  const s = res.locals.session;
  if (sessionLimitReached(s.evidenceCalls || 0, "FM_EVIDENCE_SESSION_LIMIT")) {
    res
      .status(429)
      .json({ error: "Evidence request limit reached. Unlock again later." });
    return null;
  }
  if (input.caseId && s.clientCaseId && input.caseId !== s.clientCaseId) {
    res.status(409).json({
      error:
        "The active case changed. Start a new case or reload before continuing.",
    });
    return null;
  }
  if (input.caseId) s.clientCaseId = input.caseId;
  if (!s.conversation?.length) {
    if (input.history?.length)
      s.conversation = retainConversation(input.history);
    if (input.resumeScenario) {
      // Device checkpoints carry explicit case facts, never inferred medical evidence.
      let restored = updateScenario(
        initialScenario(),
        "set",
        input.resumeScenario.confirmed,
      );
      restored = updateScenario(
        restored,
        "vary",
        input.resumeScenario.hypothetical,
      );
      s.scenario = { ...restored, revision: input.resumeScenario.revision };
    }
  }
  if (s.evidenceBusy) {
    s.evidenceController?.abort();
    s.conversationRevision = (s.conversationRevision || 0) + 1;
  }
  s.evidenceBusy = true;
  s.evidenceCalls = (s.evidenceCalls || 0) + 1;
  const previousScenario = s.scenario || initialScenario();
  s.scenario = scenarioFromUtterance(previousScenario, input.query);
  if (s.scenario !== previousScenario)
    s.conversationRevision = (s.conversationRevision || 0) + 1;
  const revision = s.conversationRevision || 0;
  const controller = new AbortController();
  s.evidenceController = controller;
  res.on("close", () => {
    if (!res.writableEnded) controller.abort();
  });
  try {
    const quizPhase =
      input.mode === "quiz" &&
      s.pendingGeneratedQuiz &&
      !/[?]|\b(next|another|new|quiz|hint|question)\b/i.test(input.query)
        ? "feedback"
        : "question";
    const started = Date.now(),
      providers: ProviderMeasurement[] = [];
    const context = conversationContext(
      input.history || s.conversation || [],
      input.query,
    );
    const result = await answerWithEvidence(
      {
        ...input,
        quizPhase,
        history: context,
        scenario: s.scenario || initialScenario(),
      },
      { observe: (measurement) => providers.push(measurement) },
      controller.signal,
    );
    if ((s.conversationRevision || 0) !== revision) {
      if (!res.headersSent)
        res.status(409).json({
          error:
            "The case changed or the answer was cancelled. Ask again using the current scenario.",
        });
      return null;
    }
    s.conversation = retainConversation([
      ...(s.conversation || []),
      { role: "user", content: input.query },
      { role: "assistant", content: result.text },
    ]);
    result.performance = {
      model: answerModel(),
      reasoning: reasoningEffort(),
      elapsedMs: Date.now() - started,
      contextTurns: context.length,
      archiveTurns: s.conversation.length,
      providers,
    };
    s.latestAnswer = result;
    s.pendingGeneratedQuiz =
      input.mode === "quiz" ? result.nextQuestion : undefined;
    return result;
  } finally {
    if (s.evidenceController === controller) {
      s.evidenceBusy = false;
      s.evidenceController = undefined;
    }
  }
}
app.post("/api/conversation", async (req, res) => {
  const parsed = conversationInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error:
        "Enter a question of 1–3000 characters and choose quick, teach or quiz",
    });
    return;
  }
  try {
    const result = await conversationAnswer(req, res, parsed.data);
    if (result) res.json({ ...result, scenario: res.locals.session.scenario });
  } catch {
    if (!res.headersSent)
      res.status(502).json({
        error:
          "The evidence service could not complete this request. Retry; no substitute recommendation was generated.",
      });
  }
});
app.post("/api/conversation/speech", async (_req, res) => {
  const audioStarted = Date.now();
  const s = res.locals.session,
    answer: EvidenceAnswer | undefined = s.latestAnswer;
  if (!answer) {
    res.status(409).json({ error: "Ask a question before reading its answer" });
    return;
  }
  if (
    sessionLimitReached(s.referenceCalls || 0, "FM_REFERENCE_SESSION_LIMIT")
  ) {
    res.status(429).json({ error: "Speech limit reached for this session" });
    return;
  }
  s.referenceCalls = (s.referenceCalls || 0) + 1;
  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({ error: "Server speech is not configured" });
    return;
  }
  try {
    const chunks = speechChunks(answer.speech);
    if (chunks.length > 8) {
      res.status(413).json({
        error:
          "This answer is too long for one audio request. Ask for a shorter explanation; the full text remains available.",
      });
      return;
    }
    const audio: Buffer[] = [];
    for (const chunk of chunks) {
      const r = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.FM_SPEECH_MODEL || "gpt-4o-mini-tts",
          voice: "marin",
          input: chunk,
          response_format: "mp3",
          instructions:
            "Read the supplied clinical text faithfully and clearly. Preserve every medication name, number, unit, negation and qualification. Do not add commentary.",
        }),
        signal: AbortSignal.timeout(60000),
      });
      if (!r.ok) {
        await r.body?.cancel();
        throw Error();
      }
      if (s.latestAnswer !== answer) {
        await r.body?.cancel();
        res
          .status(409)
          .json({ error: "Answer changed while speech was being prepared" });
        return;
      }
      audio.push(Buffer.from(await r.arrayBuffer()));
    }
    res.set({
      "X-FM-Speech-Preparation-Ms": String(Date.now() - audioStarted),
      "X-FM-Speech-Model": process.env.FM_SPEECH_MODEL || "gpt-4o-mini-tts",
      "X-FM-Speech-Characters": String(answer.speech.length),
    });
    res.type("audio/mpeg").send(Buffer.concat(audio));
  } catch {
    res.status(502).json({
      error:
        "Audio could not be prepared. The displayed answer remains available.",
    });
  }
});
app.post("/api/conversation/calculate", (req, res) => {
  const parsed = z
    .object({
      medication_index: z.number().int().min(0).max(5),
      weight_kg: z.number().finite(),
      population_confirmed: z.literal(true),
      adjustments_confirmed: z.literal(true),
    })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error:
        "Confirm population and adjustment applicability, select the supported regimen, and supply weight in kilograms",
    });
    return;
  }
  const medication =
    res.locals.session.latestAnswer?.medications[parsed.data.medication_index];
  if (!medication) {
    res.status(409).json({
      error:
        "No supported medication record is available from the latest answer",
    });
    return;
  }
  try {
    res.json(calculateWeightDose(medication, parsed.data.weight_kg));
  } catch (e) {
    res.status(422).json({ error: (e as Error).message });
  }
});
// Compatibility adapter: the preserved Expo interface uses the same evidence service.
app.post("/api/clinical/query", async (req, res) => {
  const format: Record<string, string> = {
    flashcards:
      "Create up to six focused source-supported question-and-answer flashcards in cards, each with exact supporting passages. ",
    documentation:
      "Explain source-supported documentation elements and a conditional assessment/plan structure. Never invent patient findings or unverified billing codes. ",
    ddx: "Provide a conditional differential and supported distinguishing findings or next steps. Do not rank patient-specific likelihood without a case. ",
    board_prep:
      "Teach evidence-supported ABFM-style reasoning without claiming actual exam frequency or endorsement. ",
  };
  const parsed = conversationInput.safeParse({
    query:
      typeof req.body.query === "string"
        ? (format[req.body.mode] || "") + req.body.query
        : req.body.query,
    topic: req.body.condition,
    mode: req.body.mode === "point_of_care" ? "quick" : "teach",
  });
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a clinical question" });
    return;
  }
  try {
    const result = await conversationAnswer(req, res, parsed.data);
    if (!result) return;
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });
    const visible =
      req.body.mode === "flashcards"
        ? result.cards
            .map(
              (c) =>
                `---CARD---\nFRONT: ${cleanClinicalText(c.front)}\nBACK: ${cleanClinicalText(c.back)}\n---END---`,
            )
            .join("\n") || result.text
        : result.text;
    res.write(`data: ${JSON.stringify({ content: visible })}\n\n`);
    const meta = {
      domain:
        topics.find((t) => t.title === req.body.condition)?.domain ||
        "Family medicine",
      weight: "",
      citations: result.sources.map((s) => ({
        source: s.organization,
        year: s.publicationDate?.slice(0, 4) || "",
        guideline: s.title,
        url: s.url,
        accessed: s.retrievedAt,
        confidence: "peripheral",
        reviewStatus: "Passage-linked; independent clinical review pending",
        note: result.passages
          .filter((p) => p.source_id === s.id)
          .map((p) => p.quote)
          .join("\n"),
      })),
      limitation:
        result.gaps.join(" ") ||
        "Passage linkage is not independent clinical validation.",
      referenceVersion: result.evidenceFingerprint,
      evidence: result.sources.map((s) => ({ url: s.url, version: s.version })),
    };
    res.write(
      `data: ${JSON.stringify({ content: `\n\n%%FM_CITE%%${JSON.stringify(meta)}%%/FM_CITE%%` })}\n\n`,
    );
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch {
    if (!res.headersSent)
      res.status(502).json({
        error: "Evidence lookup failed; retry your clinical question",
      });
  }
});
app.post("/api/clinical/vignette", (req, res) => {
  const terms = String(req.body.topic || req.body.domain || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((w: string) => w.length > 3);
  const eligible = bank.filter(
    (q) =>
      !terms.length ||
      terms.some((w: string) =>
        `${q.stem} ${q.domain}`.toLowerCase().includes(w),
      ),
  );
  if (!eligible.length) {
    res.status(422).json({
      error:
        "No source-scoped bank item matches. Open the conversational tutor and choose Quiz me for unscored evidence-supported practice.",
    });
    return;
  }
  const q = eligible[Math.floor(Math.random() * eligible.length)]!;
  res.json({
    question: cleanClinicalText(q.stem),
    options: Object.fromEntries(
      q.options.map((o, i) => [
        String.fromCharCode(97 + i),
        cleanClinicalText(o),
      ]),
    ),
    answer: String.fromCharCode(97 + q.answer),
    explanation: cleanClinicalText(q.rationale),
    domain: q.domain,
    source:
      "Stored source-scoped practice; independent clinical review and currency check pending",
    reviewStatus: "not_clinically_reviewed",
  });
});
app.get("/api/topics", (_req, res) =>
  res.json({
    topics,
    version,
    voiceEnrollment: false,
    externalLookup: "automatic-official-source-evidence-service",
    practice: {
      count: bank.length,
      blueprint: BLUEPRINT,
      coveredDomains: [...new Set(bank.map((q) => q.domain))],
      review: "snapshot_claim_checked; independent clinical review pending",
    },
  }),
);
app.post("/api/context", (req, res) => {
  try {
    const prompt = instructions(
      req.body.ids,
      req.body.progress,
      req.body.history,
      "teaching",
      true,
      req.body.curriculum_id,
    );
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
app.get("/api/curriculum", (_req, res) =>
  res.json({
    ...curriculumCatalog(),
    antibioticCoverage: antibioticCoverage(),
  }),
);
app.post("/api/medications/search", (req, res) => {
  try {
    res.json({
      medications: medicationSearch(req.body.query, req.body.topic_id),
      total: medicationInventory.length,
      notice:
        "Inventory of named drug entities, not a verified formulary. Brand aliases are collapsed; some combination entities and component names coexist. Names alone are not dosing evidence.",
    });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});
app.post("/api/medications/labels", async (req, res) => {
  const session = res.locals.session;
  if (req.body.approved !== true) {
    res.status(403).json({ error: "Approve this official label search first" });
    return;
  }
  if (
    sessionLimitReached(
      session.referenceCalls || 0,
      "FM_REFERENCE_SESSION_LIMIT",
    )
  ) {
    res.status(429).json({ error: "Reference request limit reached" });
    return;
  }
  session.referenceCalls = (session.referenceCalls || 0) + 1;
  const revision = session.contextRevision;
  try {
    const result = await searchOfficialLabels(req.body.drug_id);
    if (revision !== session.contextRevision) {
      res
        .status(409)
        .json({ error: "Topic changed during reference search; search again" });
      return;
    }
    session.labelChoices = { revision, choices: result.choices };
    res.json(result);
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
});
app.post("/api/medications/load", async (req, res) => {
  const session = res.locals.session;
  const revision = session.contextRevision;
  if (req.body.approved !== true || req.body.formulation_confirmed !== true) {
    res.status(403).json({
      error: "Confirm this exact product, formulation and route before loading",
    });
    return;
  }
  if (session.practice) {
    res.status(409).json({
      error:
        "Finish reviewed practice before loading supplementary teaching evidence",
    });
    return;
  }
  const choice =
    session.labelChoices?.revision === revision
      ? session.labelChoices.choices.find(
          (c: LabelChoice) => c.setid === req.body.setid,
        )
      : undefined;
  if (!choice) {
    res.status(403).json({
      error: "Choose an exact label returned by this session's current search",
    });
    return;
  }
  if (
    sessionLimitReached(
      session.referenceCalls || 0,
      "FM_REFERENCE_SESSION_LIMIT",
    )
  ) {
    res.status(429).json({ error: "Reference request limit reached" });
    return;
  }
  session.referenceCalls = (session.referenceCalls || 0) + 1;
  try {
    const result = await readOfficialLabel(choice);
    if (revision !== session.contextRevision) {
      res
        .status(409)
        .json({ error: "Topic changed during lookup; no evidence loaded" });
      return;
    }
    res.json(result);
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
});
app.post("/api/curriculum/search", (req, res) => {
  try {
    res.json(searchCurriculum(req.body.query));
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});
app.post("/api/curriculum/select", (req, res) => {
  try {
    const lesson = lessonById(req.body.lesson_id);
    const ids = req.body.ids || res.locals.session.ids;
    const prompt = instructions(
      ids,
      req.body.progress,
      [],
      "teaching",
      true,
      lesson.id,
    );
    res.locals.session.contextRevision++;
    res.locals.session.ids = ids;
    res.locals.session.practice = undefined;
    res.json({
      lesson,
      instructions: prompt,
      tools,
      version: curriculumVersion,
    });
  } catch {
    res
      .status(400)
      .json({ error: "Choose a valid specialist lesson and library topic" });
  }
});
app.post("/api/library/search", (req, res) => {
  try {
    res.json(searchLibrary(req.body.query));
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});
app.post("/api/library/select", (req, res) => {
  try {
    const ids = [req.body.topic_id];
    const entries = topicEvidence(ids);
    // A prior-topic transcript/checkpoint must not become the new topic's context.
    const prompt = instructions(ids, req.body.progress, [], "teaching");
    res.locals.session.contextRevision++;
    res.locals.session.ids = ids;
    res.locals.session.practice = undefined;
    res.json({
      instructions: prompt,
      tools,
      entries,
      version,
      topic: topics.find((topic) => topic.id === req.body.topic_id),
    });
  } catch {
    res
      .status(400)
      .json({ error: "Choose an exact topic ID from the stored library" });
  }
});
app.post("/api/practice/start", (req, res) => {
  try {
    topicEvidence(req.body.ids);
    const p = startPractice(req.body, req.body.ids);
    const history = Array.isArray(req.body.events)
      ? req.body.events
          .filter(
            (e: any) =>
              bank.some(
                (q) =>
                  q.id === e.question_id &&
                  q.concept_id === e.concept_id &&
                  q.domain === e.domain &&
                  q.topic_id === e.topic_id,
              ) &&
              ["correct", "incorrect", "assisted"].includes(e.result) &&
              typeof e.first_correct === "boolean" &&
              typeof e.assisted === "boolean" &&
              Number.isFinite(Date.parse(e.at)),
          )
          .slice(-2000)
      : [];
    p.events = history;
    res.locals.session.practice = p;
    res.json(nextPractice(p));
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});
app.post("/api/practice/:action", (req, res) => {
  try {
    const p: Practice = res.locals.session.practice;
    if (!p) throw Error("Start a practice block first.");
    if (req.params.action === "next") res.json(nextPractice(p));
    else if (req.params.action === "answer")
      res.json(answerPractice(p, req.body));
    else if (req.params.action === "finish") res.json(finishPractice(p));
    else if (req.params.action === "assist") {
      if (p.mode !== "teaching" || !p.current)
        throw Error(
          "Hints are unavailable in this mode or no question is active.",
        );
      p.current.assisted = true;
      res.json({ assisted: true, question_id: p.current.q.id });
    } else res.status(404).json({ error: "Unknown practice action" });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});
app.post("/api/learning", (req, res) => {
  if (req.body.result !== "unscored") {
    res.status(400).json({
      error:
        "Generated teaching is unscored. Use reviewed practice for scoring.",
    });
    return;
  }
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
  if (
    session.busy ||
    sessionLimitReached(session.calls, "FM_VOICE_SESSION_LIMIT")
  ) {
    res.status(429).json({
      error:
        "Session limit reached; wait for the current connection or unlock again later",
    });
    return;
  }
  let prompt: string;
  const guided = req.body.guided === true;
  const practice = guided ? undefined : session.practice;
  try {
    prompt = instructions(
      req.body.ids,
      req.body.progress,
      req.body.history,
      practice?.mode || "teaching",
      guided,
      guided ? req.body.curriculum_id : undefined,
    );
    if (practice?.scope === "mixed") {
      prompt +=
        "\nReviewed mixed-block answer rationales may use ONLY the scoped evidence claims supplied by practice tools. Do not extend other medical claims beyond selected LIBRARY.\n";
      // Tools return the exact source for each scored answer; no whole unreviewed corpus is added.
    }
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
    res.status(503).json({
      error:
        "Existing deployed OpenAI key is not configured on this separate tutor service",
    });
    return;
  }
  session.busy = true;
  session.calls++;
  const contextRevision = ++session.contextRevision;
  try {
    const evidenceOnly = req.body.evidenceOnly === true;
    const fd = new FormData();
    fd.set("sdp", req.body.sdp);
    fd.set(
      "session",
      JSON.stringify({
        type: "realtime",
        model: process.env.FM_TUTOR_REALTIME_MODEL || "gpt-realtime-2.1",
        instructions: evidenceOnly
          ? "Capture the user's spoken input. The application provides evidence-supported answers separately. Do not generate an answer unless explicitly requested by the application."
          : prompt,
        tools: evidenceOnly ? [] : tools,
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
              create_response: !evidenceOnly,
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
      res.status(502).json({
        error: `OpenAI voice connection failed (${response.status}); verify Realtime model access and billing on the existing key`,
      });
      return;
    }
    if (session.contextRevision !== contextRevision) {
      res.status(409).json({
        error:
          "The selected topic changed while voice was connecting; start the conversation again",
      });
      return;
    }
    session.ids = req.body.ids;
    if (guided) session.practice = undefined;
    res.type("application/sdp").send(await response.text());
  } catch {
    res.status(502).json({
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
  let allowed: string[] = [];
  try {
    allowed = topicEvidence(
      req.body.topic_id === undefined
        ? res.locals.session.ids
        : [req.body.topic_id],
    ).flatMap((e) => (e.evidence_records || []).map((r) => r.url));
    if (req.body.curriculum_id) {
      const lesson = lessonById(req.body.curriculum_id);
      allowed.push(
        ...clinicalSources
          .filter((s) => lesson.source_ids.includes(s.id))
          .map((s) => s.url),
      );
    }
  } catch {
    // Invalid or absent topic selection authorizes no external URL.
    allowed = [];
  }
  if (approved !== true || typeof url !== "string" || !allowed.includes(url)) {
    res.status(403).json({
      error:
        "Explicit approval and an exact listed official evidence URL are required",
    });
    return;
  }
  const session = res.locals.session;
  if (sessionLimitReached(session.calls, "FM_VOICE_SESSION_LIMIT")) {
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
    res.status(502).json({
      error:
        "Official page could not be read safely (redirect, format, size, access or timeout); open its source link instead",
    });
  }
});
app.use("/api", (_req, res) =>
  res.status(404).json({ error: "API route not found" }),
);
if (process.env.FM_COMBINED_APP === "1") {
  const webDist = path.resolve("artifacts/mobile/dist");
  if (existsSync(path.join(webDist, "index.html"))) {
    app.use(
      "/assets",
      express.static(path.join(webDist, "assets"), { dotfiles: "allow" }),
    );
    app.use(express.static(webDist));
    app.get("/{*path}", (_req, res) =>
      res.sendFile(path.join(webDist, "index.html")),
    );
  }
}
app.use((_req, res) =>
  res.status(404).json({ error: "Tutor route not found" }),
);
if (process.env.FM_TUTOR_TEST !== "1")
  app.listen(Number(process.env.PORT) || 8080, "0.0.0.0", () => {
    console.log("FM conversational evidence preview listening");
    void runReleaseSmoke(Number(process.env.PORT) || 8080);
  });
export default app;
