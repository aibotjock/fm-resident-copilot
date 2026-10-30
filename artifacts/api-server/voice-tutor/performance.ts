/** Local engineering measurements. Never record questions, answers, access codes or source text here. */
export type ProviderMeasurement = {
  model: string;
  phase: "search" | "answer";
  elapsedMs: number;
  httpStatus: number;
  inputTokens: number | null;
  cachedInputTokens: number | null;
  outputTokens: number | null;
  reasoningTokens: number | null;
  webSearchCalls: number;
};
const count = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
export function providerMeasurement(
  model: string,
  phase: "search" | "answer",
  elapsedMs: number,
  httpStatus: number,
  response?: any,
): ProviderMeasurement {
  return {
    model,
    phase,
    elapsedMs,
    httpStatus,
    inputTokens: count(response?.usage?.input_tokens),
    cachedInputTokens: count(
      response?.usage?.input_tokens_details?.cached_tokens,
    ),
    outputTokens: count(response?.usage?.output_tokens),
    reasoningTokens: count(
      response?.usage?.output_tokens_details?.reasoning_tokens,
    ),
    webSearchCalls: (response?.output || []).filter(
      (item: any) => item.type === "web_search_call",
    ).length,
  };
}
export type PerformanceSample = {
  kind: "answer" | "playback" | "speech_preparation" | "voice_connection";
  model: string;
  reasoning?: string;
  elapsedMs: number;
  status?: "ok" | "failed";
  input?: "typed" | "speech_stop_event";
  support?: string;
  contextTurns?: number;
  archiveTurns?: number;
  audioCharacters?: number;
  providers?: ProviderMeasurement[];
};
export function recordPerformance(
  data: any,
  input: PerformanceSample,
  at = new Date().toISOString(),
) {
  const sample = {
    at,
    kind: input.kind,
    model: input.model,
    reasoning: input.reasoning,
    elapsedMs: Math.max(0, input.elapsedMs),
    status: input.status || "ok",
    input: input.input,
    support: input.support,
    contextTurns: input.contextTurns,
    archiveTurns: input.archiveTurns,
    audioCharacters: input.audioCharacters,
    providers: input.providers?.map((p) => ({
      model: p.model,
      phase: p.phase,
      elapsedMs: p.elapsedMs,
      httpStatus: p.httpStatus,
      inputTokens: p.inputTokens,
      cachedInputTokens: p.cachedInputTokens,
      outputTokens: p.outputTokens,
      reasoningTokens: p.reasoningTokens,
      webSearchCalls: p.webSearchCalls,
    })),
  };
  const metrics = (data.performanceMetrics ||= {
    version: "fm-performance-v1",
    dailyTimezone: "UTC",
    clinicalAccuracy: "not_measured",
    costStatus: "token_and_search_usage_only_not_a_complete_bill",
    samples: [],
    daily: {},
  });
  metrics.samples = [...metrics.samples, sample].slice(-500);
  const key = `${at.slice(0, 10)}|${sample.model}|${sample.reasoning || "unknown"}|${sample.kind}`;
  const day = (metrics.daily[key] ||= {
    count: 0,
    totalMs: 0,
    maxMs: 0,
    failures: 0,
    inputTokens: 0,
    cachedInputTokens: 0,
    outputTokens: 0,
    reasoningTokens: 0,
    webSearchCalls: 0,
    providerCallsWithoutUsage: 0,
  });
  day.count++;
  day.totalMs += sample.elapsedMs;
  day.maxMs = Math.max(day.maxMs, sample.elapsedMs);
  if (sample.status === "failed") day.failures++;
  for (const p of sample.providers || []) {
    day.inputTokens += p.inputTokens || 0;
    day.cachedInputTokens += p.cachedInputTokens || 0;
    day.outputTokens += p.outputTokens || 0;
    day.reasoningTokens += p.reasoningTokens || 0;
    day.webSearchCalls += p.webSearchCalls;
    if (p.inputTokens === null || p.outputTokens === null)
      day.providerCallsWithoutUsage++;
  }
  const keys = Object.keys(metrics.daily).sort();
  for (const old of keys.slice(0, Math.max(0, keys.length - 2000)))
    delete metrics.daily[old];
  return sample;
}
