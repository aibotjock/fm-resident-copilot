import test from "node:test";
import assert from "node:assert/strict";
import { providerMeasurement, recordPerformance } from "./performance";

test("provider measurements distinguish missing usage from a reported zero", () => {
  const unknown = providerMeasurement("gpt-6.1-terra", "answer", 100, 503);
  assert.equal(unknown.inputTokens, null);
  const measured = providerMeasurement("gpt-6.1-terra", "answer", 1500, 200, {
    usage: {
      input_tokens: 200,
      output_tokens: 30,
      input_tokens_details: { cached_tokens: 0 },
      output_tokens_details: { reasoning_tokens: 12 },
    },
  });
  assert.equal(measured.inputTokens, 200);
  assert.equal(measured.cachedInputTokens, 0);
  assert.equal(measured.reasoningTokens, 12);
});
test("daily measurements preserve separate models and do not record question or answer text", () => {
  const data: any = {};
  const sample: any = {
    kind: "answer",
    model: "gpt-6.1-terra",
    reasoning: "medium",
    elapsedMs: 1200,
    question: "private case text",
    answer: "private answer",
  };
  recordPerformance(data, sample, "2026-10-30T15:00:00Z");
  recordPerformance(
    data,
    { ...sample, model: "gpt-6.1-sol", elapsedMs: 2400 },
    "2026-10-30T15:01:00Z",
  );
  assert.equal(Object.keys(data.performanceMetrics.daily).length, 2);
  assert.ok(!JSON.stringify(data.performanceMetrics).includes("private"));
  assert.equal(data.performanceMetrics.clinicalAccuracy, "not_measured");
  assert.equal(data.performanceMetrics.samples[0].elapsedMs, 1200);
});
test("rolling samples remain bounded while daily totals retain previous measurements", () => {
  const data: any = {};
  for (let i = 0; i < 510; i++)
    recordPerformance(
      data,
      { kind: "answer", model: "gpt-6.1-terra", elapsedMs: 100 },
      "2026-10-30T15:00:00Z",
    );
  assert.equal(data.performanceMetrics.samples.length, 500);
  const day: any = Object.values(data.performanceMetrics.daily)[0];
  assert.equal(day.count, 510);
  assert.equal(day.totalMs, 51000);
});
