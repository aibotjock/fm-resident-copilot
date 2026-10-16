import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bank,
  startPractice,
  nextPractice,
  answerPractice,
  finishPractice,
} from "./practice";
import {
  reviewQueue,
  learningSummary,
  selectQuestion,
  BLUEPRINT,
  UNREVIEWED_FOUNDATIONS,
  LearningEvent,
} from "./learning";
import iteHelpers from "../../mobile/utils/ite";
const { compareITE, reportValue } = iteHelpers;
const now = Date.UTC(2026, 9, 16),
  day = 86400000;
const event = (patch: Partial<LearningEvent> = {}): LearningEvent => ({
  question_id: "crc45",
  concept_id: "crc-grades",
  topic_id: bank.find((q) => q.id === "crc45")!.topic_id,
  domain: "Preventive Care",
  result: "incorrect",
  first_correct: false,
  assisted: false,
  confidence: "high",
  error_type: "knowledge_gap",
  at: new Date(now).toISOString(),
  mode: "teaching",
  elapsed_ms: 5000,
  evidence_ids: ["crc-grades"],
  ...patch,
});
test("ITE values preserve scaled scores, blank fields and decimal percentages without truncation", () => {
  assert.equal(reportValue("430", "scaled"), 430);
  assert.equal(reportValue("", "scaled"), undefined);
  assert.equal(reportValue("67.5", "percent_correct"), 67.5);
  assert.equal(reportValue("100", "percentile"), 100);
  for (const bad of ["52junk", "-1", "NaN", "1e2"])
    assert.throws(() => reportValue(bad, "scaled"));
  assert.throws(() => reportValue("430", "percentile"));
});
test("ITE comparisons enforce year, metric and domain; other PGYs are explicitly contextual", () => {
  const r = {
      examYear: 2025,
      pgy: 1,
      metric: "scaled" as const,
      domain: "Overall",
    },
    b = {
      ...r,
      mean: 400,
      sd: 50,
      sourceUrl: "https://portfolio.theabfm.org/report",
      sourceLabel: "2025 Table 1",
    };
  assert.equal(compareITE(450, r, b).difference, 50);
  assert.equal(compareITE(450, r, b).z, 1);
  assert.throws(() => compareITE(450, r, { ...b, examYear: 2024 }));
  assert.throws(() => compareITE(450, r, { ...b, pgy: 2 }));
  assert.throws(() => compareITE(450, r, { ...b, metric: "percentile" }));
  assert.throws(() => compareITE(450, r, { ...b, domain: "Preventive Care" }));
  assert.throws(() =>
    compareITE(450, r, { ...b, sourceUrl: "https://example.com" }),
  );
  assert.throws(() => compareITE(450, r, { ...b, sd: 0 }));
  assert.equal(compareITE(450, r, { ...b, pgy: 3 }, true).sameLevel, false);
  assert.ok(compareITE(450, r, b).notice.includes("not an exact percentile"));
});
test("review intervals require delayed independent retrieval and retain confidence/error signals", () => {
  const missed = event(),
    q = reviewQueue([missed], now)[0];
  assert.equal(q.due, now + day);
  assert.equal(q.high_confidence_miss, true);
  const assisted = event({
    at: new Date(now + day).toISOString(),
    result: "assisted",
    first_correct: true,
    assisted: true,
  });
  assert.equal(reviewQueue([missed, assisted])[0].delayed_correct, 0);
  const correct = event({
    question_id: "crc49",
    at: new Date(now + 2 * day).toISOString(),
    result: "correct",
    first_correct: true,
    assisted: false,
  });
  const r = reviewQueue([missed, assisted, correct])[0];
  assert.equal(r.delayed_correct, 1);
  assert.equal(r.interval, 3);
  const immediate = event({
    at: new Date(now + 1000).toISOString(),
    result: "correct",
    first_correct: true,
  });
  assert.equal(reviewQueue([missed, immediate])[0].delayed_correct, 0);
  const summary = learningSummary([missed, assisted, correct]);
  assert.equal(summary.first_attempt_correct, 1);
  assert.equal(summary.high_confidence_misses, 1);
  assert.equal(summary.errors.knowledge_gap, 1);
});
test("blueprint scheduler reaches exact target proportions when all domains have sufficient items", () => {
  const pool = Object.keys(BLUEPRINT).flatMap((d) =>
      Array.from({ length: 50 }, (_, i) => ({
        id: d + i,
        concept_id: d + i,
        domain: d as keyof typeof BLUEPRINT,
      })),
    ),
    events: LearningEvent[] = [],
    seen: string[] = [];
  for (let i = 0; i < 100; i++) {
    const q = selectQuestion(pool, events, seen, now)!;
    seen.push(q.id);
    events.push(
      event({ question_id: q.id, concept_id: q.concept_id, domain: q.domain }),
    );
  }
  assert.deepEqual(learningSummary(events).domains, BLUEPRINT);
});
test("teaching uses immutable answer keys, one retry, and no independent credit after assistance", () => {
  const p = startPractice(
      { mode: "teaching", scope: "selected", limit: 2 },
      [bank[0].topic_id],
      now,
    ),
    v = nextPractice(p, now),
    q = p.current!.q;
  assert.equal(v.question.answer, undefined);
  assert.equal(v.question.rationale, undefined);
  const wrong = String.fromCharCode(65 + ((q.answer + 1) % q.options.length));
  assert.throws(() =>
    answerPractice(p, { question_id: "fake", choice: wrong }, now + 100),
  );
  assert.equal(
    answerPractice(
      p,
      { question_id: q.id, choice: wrong, confidence: "high" },
      now + 1000,
    ).retry,
    true,
  );
  const result = answerPractice(
    p,
    { question_id: q.id, choice: String.fromCharCode(65 + q.answer) },
    now + 2000,
  );
  assert.equal(result.event.first_correct, false);
  assert.equal(result.event.result, "assisted");
  assert.ok(result.feedback.source.url);
  assert.throws(() =>
    answerPractice(p, { question_id: q.id, choice: "A" }, now + 3000),
  );
});
test("assessment withholds correctness and explanations, and ends at its deadline", () => {
  const p = startPractice(
    { mode: "assessment", scope: "mixed", limit: 3, seconds: 60 },
    [bank[0].topic_id],
    now,
  );
  nextPractice(p, now);
  const q = p.current!.q;
  const r = answerPractice(p, { question_id: q.id, choice: "A" }, now + 1000);
  assert.deepEqual(r, { recorded: true, mode: "assessment" });
  assert.equal(nextPractice(p, now + 60001).done, true);
  assert.equal(finishPractice(p).results.length, 1);
  assert.throws(() =>
    answerPractice(p, { question_id: q.id, choice: "A" }, now + 60002),
  );
});
test("fresh assessment excludes previously answered items and displays a coverage gap when exhausted", () => {
  const p = startPractice(
    { mode: "assessment", scope: "selected", limit: 3 },
    [bank[0].topic_id],
    now,
  );
  p.events = bank
    .filter((q) => q.topic_id === bank[0].topic_id)
    .map((q) => event({ question_id: q.id, concept_id: q.concept_id }));
  const v = nextPractice(p, now);
  assert.equal(v.done, true);
  assert.ok(v.gap.includes("No more reviewed items"));
  const empty = startPractice(
    { mode: "teaching", scope: "selected" },
    ["no-reviewed-items"],
    now,
  );
  assert.equal(nextPractice(empty, now).done, true);
});

test("draft Foundations questions remain self-contained and outside scored practice", () => {
  assert.equal(UNREVIEWED_FOUNDATIONS.length, 5);
  for (const q of UNREVIEWED_FOUNDATIONS) {
    assert.ok(!bank.some((item) => item.id === q.id));
    assert.ok(q.answer >= 0 && q.answer < q.options.length);
    assert.ok(q.rationale.length > 10);
  }
});
