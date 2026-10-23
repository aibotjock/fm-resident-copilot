import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { test } from "node:test";
import { build } from "esbuild";
import express from "express";
import { Database } from "./helpers/usage-db.ts";
const require = createRequire(import.meta.url);

test("real routes reject anonymous calls before provider/DB work, admit authenticated work, enforce quota and admin serialization", async () => {
  const token = "c".repeat(48); const db = new Database(); let providerCalls = 0, ingestionCalls = 0;
  let unblock: (() => void) | undefined;
  const original = { ...process.env };
  process.env.CLINICAL_ACCESS_TOKENS_SHA256 = JSON.stringify({ operator: createHash("sha256").update(token).digest("hex") });
  process.env.FM_REFERENCE_ADMIN_TOKEN = "d".repeat(48);
  process.env.CLINICAL_PRINCIPAL_REQUESTS_PER_DAY = "2";
  process.env.CLINICAL_PRINCIPAL_CONCURRENCY = "1";
  (globalThis as any).__clinicalTestDb = db;
  (globalThis as any).__clinicalTestIngest = async () => { ingestionCalls++; await new Promise<void>(r => { unblock = r; }); };
  (globalThis as any).__clinicalTestProvider = { chat: { completions: { create: async (body: any, options: any) => {
    providerCalls++; assert.equal(options.maxRetries, 0); assert.ok(options.signal instanceof AbortSignal);
    assert.ok(body.max_completion_tokens <= 8192);
    if (body.stream) return (async function* () { yield { choices: [{ delta: { content: "stub response" } }] }; })();
    return { choices: [{ message: { content: JSON.stringify({ question: "Stub?", options: { a: "A", b: "B", c: "C", d: "D" }, answer: "a", explanation: "Stub fixture" }) } }] };
  } } } };
  const temporary = await mkdtemp(resolve(tmpdir(), "clinical-route-test-"));
  let server: ReturnType<ReturnType<typeof express>["listen"]> | undefined;
  try {
    const stubs: Record<string, string> = {
      "@workspace/db": "export const pool=globalThis.__clinicalTestDb;",
      "@workspace/api-zod": "export const HealthCheckResponse={parse:x=>x};",
      "provider": "export const CLINICAL_MODEL='stub';export const openai=globalThis.__clinicalTestProvider;",
      "retrieval": "export async function retrieveContext(){return {empty:false,formattedContext:'stub references',chunks:[],sourceList:''}}",
      "uspstf": "export async function getUSPSTFContext(){return ''}",
      "ingest": "export const runIngestion=(...args)=>globalThis.__clinicalTestIngest(...args);",
      "store": "export async function getChunkCount(){return 0}export async function getMetadata(){return null}",
      "versions": "export async function referenceStatus(){return {state:null}}export async function activateVersion(){}",
      "candidate": "export const CANDIDATE_VERSION='stub';",
    };
    await build({ entryPoints: [resolve(dirname(fileURLToPath(import.meta.url)), "../src/routes/index.ts")], outfile: resolve(temporary, "routes.mjs"), bundle: true, platform: "node", format: "esm", packages: "external", logLevel: "silent", plugins: [{ name: "isolated-stubs", setup(builder) {
      builder.onResolve({ filter: /.*/ }, args => {
        if (args.path === "express") return { path: require.resolve("express"), external: true };
        const key = args.path.startsWith("@workspace/integrations-openai") ? "provider" : args.path.endsWith("/rag/retrieval") ? "retrieval" : args.path.endsWith("/guidelines/uspstf") ? "uspstf" : args.path.endsWith("/rag/ingest") ? "ingest" : args.path.endsWith("/rag/store") ? "store" : args.path.endsWith("/rag/versions") ? "versions" : args.path.endsWith("/rag/sources/candidate") ? "candidate" : args.path;
        if (key in stubs) return { path: key, namespace: "test-stub" };
      });
      builder.onLoad({ filter: /.*/, namespace: "test-stub" }, args => ({ contents: stubs[args.path], loader: "js" }));
    } }] });
    const router = (await import(pathToFileURL(resolve(temporary, "routes.mjs")).href)).default;
    const app = express(); app.use(express.json()); app.use("/api", router);
    server = app.listen(0, "127.0.0.1"); await new Promise<void>(r => server!.once("listening", r));
    const port = (server.address() as any).port; const base = `http://127.0.0.1:${port}/api`;
    const call = (path: string, body?: unknown, auth?: string) => fetch(base + path, { method: body === undefined ? "GET" : "POST", headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    for (const path of ["/clinical/query", "/clinical/vignette"]) assert.equal((await call(path, { query: "test", mode: "board" })).status, 401);
    assert.equal(providerCalls, 0); assert.equal(db.rows.size, 0);
    assert.equal((await call("/admin/rag/status")).status, 403);
    assert.equal((await call("/admin/rag/status",undefined,token)).status,403);
    assert.equal((await call("/admin/rag/status",undefined,process.env.FM_REFERENCE_ADMIN_TOKEN)).status,200);
    assert.equal((await call("/admin/rag/reindex", {})).status, 403); assert.equal(ingestionCalls, 0);
    assert.equal((await call("/clinical/access", undefined, token)).status, 200);
    assert.equal((await call("/clinical/query", { query: "test", mode: "board" }, token)).status, 200);
    assert.equal((await call("/clinical/vignette", {}, token)).status, 200);
    assert.equal(providerCalls, 2);
    assert.equal((await call("/clinical/query", { query: "test", mode: "board", principal: "other" }, token)).status, 429); assert.equal(providerCalls, 2);
    const connect = db.connect.bind(db);
    db.connect = async () => { throw new Error("simulated database outage"); };
    assert.equal((await call("/clinical/query", { query: "test", mode: "board" }, token)).status, 503); assert.equal(providerCalls, 2);
    db.connect = connect;
    const started = call("/admin/rag/reindex", {}, process.env.FM_REFERENCE_ADMIN_TOKEN);
    while (!unblock) await new Promise(r => setTimeout(r, 1));
    assert.equal((await call("/admin/rag/reindex", {}, process.env.FM_REFERENCE_ADMIN_TOKEN)).status, 429);
    unblock(); assert.equal((await started).status, 200);
    assert.equal((await call("/admin/rag/reindex", {}, process.env.FM_REFERENCE_ADMIN_TOKEN)).status, 429); assert.equal(ingestionCalls, 1);
  } finally {
    if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
    process.env = original;
    delete (globalThis as any).__clinicalTestDb; delete (globalThis as any).__clinicalTestProvider; delete (globalThis as any).__clinicalTestIngest;
    await rm(temporary, { recursive: true, force: true });
  }
});
