import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { AccessError, admit, authenticate, authenticateAdmin, boundMessages, readLimits, RESERVED_TOKENS, validateClinicalBody } from "../src/security/access-policy.ts";
import { PostgresUsageStore } from "../src/security/usage-store.ts";

const token = "a".repeat(48); // Synthetic local fixture; never a provider key.
const env = { CLINICAL_ACCESS_TOKENS_SHA256: JSON.stringify({ operator: createHash("sha256").update(token).digest("hex") }) };
const limits = readLimits({});
const denied = (fn: () => unknown, status: number) => assert.throws(fn, (error: unknown) => error instanceof AccessError && error.status === status);

test("missing, forged and unconfigured credentials deny access; identity comes only from the server mapping", () => {
  denied(() => authenticate(undefined, env), 401);
  denied(() => authenticate(`Bearer ${"b".repeat(48)}`, env), 401);
  denied(() => authenticate(`Bearer ${token}`, {}), 503);
  denied(() => authenticate(`Bearer ${token}`, { CLINICAL_ACCESS_TOKENS_SHA256: "[]" }), 503);
  assert.equal(authenticate(`Bearer ${token}`, env), "operator");
  denied(() => authenticate(`Bearer ${token}`, {CLINICAL_ACCESS_TOKENS_SHA256:JSON.stringify({one:createHash("sha256").update(token).digest("hex"),two:createHash("sha256").update(token).digest("hex")})}),503);
  denied(() => authenticateAdmin(undefined, {}), 403);
  denied(() => authenticateAdmin("Bearer short", { FM_REFERENCE_ADMIN_TOKEN: "short" }), 403);
  authenticateAdmin(`Bearer ${token}`, { FM_REFERENCE_ADMIN_TOKEN: token });
});
test("body and full provider prompt bounds reject oversized or malformed work before provider use", () => {
  denied(() => validateClinicalBody({ query: {}, mode: "board" }, "query"), 400);
  denied(() => validateClinicalBody({ query: "x".repeat(16001), mode: "board" }, "query"), 400);
  denied(() => validateClinicalBody({ topic: "x".repeat(301) }, "vignette"), 400);
  denied(() => boundMessages([{ role: "user", content: "x".repeat(64001) }], 8192), 413);
  denied(() => boundMessages([{ role: "user", content: "ok" }], 8193), 413);
  denied(() => readLimits({ CLINICAL_GLOBAL_TOKENS_PER_DAY: "Infinity" }), 503);
  assert.equal(boundMessages([{ role: "user", content: "ok" }], 2048).length, 1);
});

// SQL adapter fixture: exercises the production transaction path with shared state,
// rollback and session/xact advisory locks. It has no network or real credentials.
import { Database } from "./helpers/usage-db.ts";
const rejection = async (promise: Promise<unknown>, status: number) => assert.rejects(promise, (error: unknown) => error instanceof AccessError && error.status === status);

test("parallel admission enforces principal and global concurrency; release is idempotent", async () => {
  const db = new Database(); const store = new PostgresUsageStore(db);
  const first = await admit(store, "one", { ...limits, globalConcurrency: 1 });
  await rejection(admit(store, "one", limits), 429);
  await rejection(admit(store, "two", { ...limits, globalConcurrency: 1 }), 429);
  await first.release(); await first.release();
  const again = await admit(store, "two", limits); await again.release();
  assert.equal(db.rows.get("global").requests, 2);
});
test("parallel quota contenders cannot overrun a durable global token budget, including across store instances", async () => {
  const db = new Database(); const cap = { ...limits, globalTokens: RESERVED_TOKENS, globalConcurrency: 4 };
  const results = await Promise.allSettled([new PostgresUsageStore(db).reserve("one", "one", cap, RESERVED_TOKENS), new PostgresUsageStore(db).reserve("two", "two", cap, RESERVED_TOKENS)]);
  assert.equal(results.filter(x => x.status === "fulfilled").length, 1);
  assert.equal(db.rows.get("global").tokens, RESERVED_TOKENS);
  await new PostgresUsageStore(db).release("one"); await new PostgresUsageStore(db).release("two");
  await rejection(new PostgresUsageStore(db).reserve("three", "three", cap, RESERVED_TOKENS), 429);
});
test("request rate, daily count, principal tokens and lifetime ceilings reject before the paid stub runs", async () => {
  for (const change of [{ principalMinute: 1 }, { globalMinute: 1 }, { principalRequests: 1 }, { globalRequests: 1 }, { principalTokens: RESERVED_TOKENS }, { principalLifetime: RESERVED_TOKENS }, { globalLifetime: RESERVED_TOKENS }]) {
    const db = new Database(); const store = new PostgresUsageStore(db); const cap = { ...limits, ...change }; let providerCalls = 0;
    const paid = async () => { const permit = await admit(store, "one", cap); try { providerCalls++; } finally { await permit.release(); } };
    await paid(); await rejection(paid(), 429); assert.equal(providerCalls, 1); assert.equal(db.rows.get("global").requests,1);
  }
});
test("UTC daily rollover does not reset lifetime usage, and rejected reservations roll back both scopes", async () => {
  const db = new Database(); const store = new PostgresUsageStore(db); const cap = { ...limits, principalLifetime: RESERVED_TOKENS };
  await store.reserve("one", "one", cap, RESERVED_TOKENS); await store.release("one"); db.clock += 86400000;
  await rejection(store.reserve("two", "one", cap, RESERVED_TOKENS), 429);
  assert.equal(db.rows.get("global").lifetime_tokens, RESERVED_TOKENS);
});
test("administrative tasks serialize and their hourly rate survives store recreation", async () => {
  const db = new Database(); const store = new PostgresUsageStore(db);
  const release = await store.admin(); await rejection(new PostgresUsageStore(db).admin(), 429); await release();
  await rejection(new PostgresUsageStore(db).admin(), 429); db.clock += 3600001;
  const next = await new PostgresUsageStore(db).admin(); await next();
});
test("timeout aborts provider work and release clears the local lease", async () => {
  const db = new Database(); const store = new PostgresUsageStore(db); const permit = await admit(store, "one", { ...limits, durationMs: 10 });
  await new Promise(resolve => setTimeout(resolve, 20)); assert.equal(permit.signal.aborted, true); await permit.release(); assert.equal(db.leases.size, 0);
});
