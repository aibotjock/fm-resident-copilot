import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

export class AccessError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}
export const MAX_PROMPT_BYTES = 64_000;
export const MAX_OUTPUT_TOKENS = 8192;
export const RESERVED_TOKENS = MAX_PROMPT_BYTES + MAX_OUTPUT_TOKENS + 2048;
export interface Limits {
  principalMinute: number; globalMinute: number;
  principalRequests: number; globalRequests: number;
  principalTokens: number; globalTokens: number;
  principalLifetime: number; globalLifetime: number;
  principalConcurrency: number; globalConcurrency: number;
  durationMs: number;
}
export function readLimits(env: Record<string, string | undefined>): Limits {
  const n = (key: string, fallback: number, max = 1_000_000_000) => {
    if (env[key] === undefined) return fallback;
    const value = Number(env[key]);
    if (!Number.isSafeInteger(value) || value < 1 || value > max) throw new AccessError(503, "Invalid access-limit configuration");
    return value;
  };
  return {
    principalMinute: n("CLINICAL_PRINCIPAL_REQUESTS_PER_MINUTE", 5), globalMinute: n("CLINICAL_GLOBAL_REQUESTS_PER_MINUTE", 20),
    principalRequests: n("CLINICAL_PRINCIPAL_REQUESTS_PER_DAY", 100), globalRequests: n("CLINICAL_GLOBAL_REQUESTS_PER_DAY", 300),
    principalTokens: n("CLINICAL_PRINCIPAL_TOKENS_PER_DAY", 1_000_000), globalTokens: n("CLINICAL_GLOBAL_TOKENS_PER_DAY", 5_000_000),
    principalLifetime: n("CLINICAL_PRINCIPAL_LIFETIME_TOKENS", 10_000_000), globalLifetime: n("CLINICAL_GLOBAL_LIFETIME_TOKENS", 50_000_000),
    principalConcurrency: n("CLINICAL_PRINCIPAL_CONCURRENCY", 1, 8), globalConcurrency: n("CLINICAL_GLOBAL_CONCURRENCY", 4, 32),
    durationMs: n("CLINICAL_MAX_DURATION_MS", 90_000, 120_000),
  };
}
export function authenticate(header: string | undefined, env: Record<string, string | undefined>): string {
  if (!header || !/^Bearer [A-Za-z0-9._~-]{32,512}$/.test(header)) throw new AccessError(401, "Clinical access token required");
  let entries: [string, unknown][];
  try {
    const raw: unknown = JSON.parse(env.CLINICAL_ACCESS_TOKENS_SHA256 || "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error();
    entries = Object.entries(raw);
    if (!entries.length || entries.length > 64 || new Set(entries.map(([, hash]) => hash)).size !== entries.length || entries.some(([id, hash]) => !/^[a-zA-Z0-9_-]{1,64}$/.test(id) || typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash))) throw new Error();
  } catch { throw new AccessError(503, "Clinical access is not configured"); }
  const actual = createHash("sha256").update(header.slice(7)).digest();
  let principal: string | undefined;
  for (const [id, hash] of entries) if (timingSafeEqual(actual, Buffer.from(hash as string, "hex"))) principal = id;
  if (!principal) throw new AccessError(401, "Invalid clinical access token");
  return principal;
}
export function authenticateAdmin(header: string | undefined, env: Record<string, string | undefined>): void {
  const expected = env.FM_REFERENCE_ADMIN_TOKEN;
  if (!expected || expected.length < 32 || !header || header.length > 520 || !timingSafeEqual(createHash("sha256").update(header).digest(), createHash("sha256").update(`Bearer ${expected}`).digest())) throw new AccessError(403, "Reference administration is disabled or unauthorized");
}
export function validateClinicalBody(body: unknown, kind: "query" | "vignette"): void {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new AccessError(400, "Invalid clinical request");
  const b = body as Record<string, unknown>;
  const field = (key: string, max: number, required = false) => {
    const value = b[key];
    if (value === undefined && !required) return;
    if (typeof value !== "string" || !value.trim() || Buffer.byteLength(value, "utf8") > max) throw new AccessError(400, `Invalid ${key}`);
  };
  if (kind === "query") { field("query", 16_000, true); field("mode", 80, true); field("condition", 300); }
  else { field("domain", 80); field("topic", 300); }
  if (Buffer.byteLength(JSON.stringify(body), "utf8") > 20_000) throw new AccessError(413, "Clinical request is too large");
}
export function boundMessages(messages: { role: "system" | "user"; content: string }[], maxOutput: number): { role: "system" | "user"; content: string }[] {
  if (!Number.isSafeInteger(maxOutput) || maxOutput < 1 || maxOutput > MAX_OUTPUT_TOKENS || messages.reduce((n, m) => n + Buffer.byteLength(m.content, "utf8"), 0) > MAX_PROMPT_BYTES) throw new AccessError(413, "Reference context exceeds the safe request limit");
  return messages;
}
export interface UsageStore {
  reserve(id: string, principal: string, limits: Limits, tokens: number): Promise<void>;
  release(id: string): Promise<void>;
  admin(): Promise<() => Promise<void>>;
}
export async function admit(store: UsageStore, principal: string, limits: Limits) {
  const id = randomUUID();
  await store.reserve(id, principal, limits, RESERVED_TOKENS);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), limits.durationMs);
  timer.unref();
  let released = false;
  return { signal: controller.signal, abort: () => controller.abort(), release: async () => {
    if (released) return; released = true; clearTimeout(timer); await store.release(id);
  } };
}
