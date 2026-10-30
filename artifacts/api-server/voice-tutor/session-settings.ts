export const SESSION_IDLE_MS = 60 * 60 * 1000;
export const DEFAULT_ANSWER_MODEL = "gpt-6.1-terra";
export function answerModel() {
  return process.env.FM_EVIDENCE_ANSWER_MODEL || DEFAULT_ANSWER_MODEL;
}
export function searchModel() {
  return process.env.FM_EVIDENCE_SEARCH_MODEL || DEFAULT_ANSWER_MODEL;
}
export function reasoningEffort() {
  const value = process.env.FM_EVIDENCE_REASONING_EFFORT || "medium";
  if (!["none", "low", "medium", "high", "xhigh", "max"].includes(value))
    throw Error("Invalid evidence reasoning effort");
  return value;
}
export function reasoningOptions(model: string) {
  return /^gpt-(?:5|6)/.test(model)
    ? { reasoning: { effort: reasoningEffort() } }
    : {};
}
/** Zero disables a cumulative session cap; authentication and input guards remain. */
export function sessionLimitReached(count: number, name: string) {
  const limit = Number(process.env[name] || 0);
  return Number.isFinite(limit) && limit > 0 && count >= limit;
}
