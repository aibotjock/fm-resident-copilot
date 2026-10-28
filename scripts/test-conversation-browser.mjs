import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
const { chromium } = await import(
  process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
    ? `${process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES}/playwright/index.mjs`
    : "playwright"
);
const base = process.env.FM_BROWSER_BASE_URL || "http://127.0.0.1:8090";
let server;
if (process.env.FM_BROWSER_SPAWN_LOCAL === "1") {
  server = spawn(
    process.execPath,
    ["artifacts/api-server/voice-tutor/dist/server.cjs"],
    {
      env: {
        ...process.env,
        FM_TUTOR_ACCESS_TOKEN: "local-preview-test-only-token",
        FM_COMBINED_APP: "1",
        PORT: "8090",
      },
      stdio: "ignore",
    },
  );
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base + "/api/healthz")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
}
const browser = await chromium.launch({
  executablePath: process.env.FM_CHROME_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  }),
  page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const checks = [];
try {
  await page.goto(base + "/tutor");
  await page.waitForSelector("#answerMode", { state: "attached" });
  checks.push("Conversation interface initializes on a narrow screen");
  await page.fill(
    "#code",
    process.env.FM_BROWSER_ACCESS_CODE || "local-preview-test-only-token",
  );
  await page.getByRole("button", { name: "Unlock tutor", exact: true }).click();
  await page.waitForSelector("#workspace:not(.hidden)");
  const source = {
    id: "source-fixture",
    organization: "CDC",
    title: "Synthetic browser fixture",
    url: "https://www.cdc.gov/fixture",
    publicationDate: null,
    updateDate: null,
    retrievedAt: "2026-10-28",
    version: "v1",
    jurisdiction: "US",
    access: "read",
    section: "Engineering fixture",
  };
  const answer = {
    text: "A synthetic explanation [EVID hidden123] with an important qualification.",
    speech: "A synthetic explanation with an important qualification.",
    claims: [],
    medications: [],
    sources: [source],
    passages: [
      {
        source_id: source.id,
        quote: "Supporting text from this synthetic fixture only.",
      },
    ],
    gaps: [],
    lookup: {
      attempted: true,
      read: 1,
      status: "read_official_documents",
      failures: [],
    },
    support: "passage_linked",
    clinicalReview: "not_clinically_reviewed",
    mode: "quick",
  };
  await page.route("**/api/conversation", (route) =>
    route.fulfill({ json: answer }),
  );
  await page.evaluate(() =>
    FMConversation.handleTranscript("Agent Z dose 5 mg?"),
  );
  assert.equal(
    await page.locator("#recognizedQuestion").inputValue(),
    "Agent Z dose 5 mg?",
  );
  assert.equal(await page.locator("#evidenceAnswer").textContent(), "");
  await page.click("#confirmRecognized");
  await page.waitForFunction(() =>
    document
      .getElementById("evidenceAnswer")
      .textContent.includes("synthetic explanation"),
  );
  checks.push(
    "Spoken medication wording is held for confirmation before lookup",
  );
  await page.fill("#text", "Explain the synthetic fixture");
  await page.locator("#typed").evaluate((form) => form.requestSubmit());
  await page.waitForFunction(() =>
    document
      .getElementById("evidenceAnswer")
      .textContent.includes("synthetic explanation"),
  );
  assert.ok(
    !(await page.locator("#evidenceAnswer").innerText()).includes("hidden123"),
  );
  assert.equal(
    await page.locator("#evidenceSources a").first().textContent(),
    "Open original source",
  );
  checks.push(
    "Text-only questions show cleaned answers and readable source links",
  );
  await page.waitForFunction(
    () =>
      document.getElementById("evidenceAnswer").dataset.question ===
      "Explain the synthetic fixture",
  );
  await page.click("#saveEvidence");
  assert.equal(await page.locator("#savedEvidence details").count(), 1);
  checks.push("Explicit save creates a source-versioned review item");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("fm-tutor-progress-v1")),
  );
  assert.equal(saved.history.length, 0);
  assert.equal(saved.evidenceSaved.length, 1);
  checks.push("Study items persist while conversation is temporary by default");
  answer.sources = [{ ...source, version: "v2" }];
  answer.text = "A refreshed synthetic explanation with its qualification.";
  answer.claims = [{ text: answer.text, passages: answer.passages }];
  await page.fill("#text", "Explain the synthetic fixture");
  await page.locator("#typed").evaluate((form) => form.requestSubmit());
  await page.waitForFunction(() =>
    document
      .getElementById("savedEvidence")
      .textContent.includes("Update review needed"),
  );
  await page
    .locator("#savedEvidence")
    .evaluate((el) => (el.closest("details").open = true));
  await page
    .locator("#savedEvidence > details")
    .first()
    .evaluate((el) => (el.open = true));
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Replace my study copy after review" })
    .click();
  const revised = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("fm-tutor-progress-v1")).evidenceSaved[0],
  );
  assert.equal(revised.needsReview, false);
  assert.equal(revised.previousVersions.length, 1);
  assert.match(revised.previousVersions[0].answer, /synthetic explanation/);
  checks.push(
    "Changed-source items pause for review and preserve the previous version when replaced",
  );
  await page
    .locator("#caseFacts")
    .evaluate((el) => (el.closest("details").open = true));
  await page.fill("#factValue", "not pregnant");
  await page.click("#confirmFact");
  await page.waitForFunction(() =>
    document.getElementById("caseFacts").textContent.includes("not pregnant"),
  );
  await page.fill("#factValue", "pregnant");
  await page.click("#varyFact");
  await page.waitForFunction(() =>
    document.getElementById("caseVariation").textContent.includes("pregnant"),
  );
  assert.match(await page.locator("#caseFacts").innerText(), /not pregnant/);
  await page.click("#restoreCase");
  await page.waitForFunction(() =>
    document
      .getElementById("caseVariation")
      .textContent.includes("Original scenario"),
  );
  checks.push(
    "Confirmed facts, hypothetical changes and restore work through authenticated APIs",
  );
  await page.selectOption("#answerMode", "quiz");
  await page.fill("#text", "Quiz me");
  await page.locator("#typed").evaluate((form) => form.requestSubmit());
  await page.waitForTimeout(150);
  assert.equal(await page.locator("#answerMode").inputValue(), "quiz");
  checks.push(
    "Mode selection and natural mode commands work without starting microphone capture",
  );
  await page.screenshot({
    path:
      process.env.FM_BROWSER_SCREENSHOT ||
      "/workspace/scratch/84fbc55c1389/tutor-mobile.png",
    fullPage: true,
  });
  await page.goto(base + "/");
  await page.waitForTimeout(1600);
  const skip = page.getByText("Skip", { exact: true });
  if (await skip.count()) {
    await skip.first().click();
    await page
      .getByRole("button", { name: "Skip introduction" })
      .waitFor({ state: "hidden" });
  }
  const start = page.getByText("Get Started", { exact: true });
  if (await start.count()) await start.first().click();
  assert.ok(await page.getByText("Talk to Copilot", { exact: true }).count());
  checks.push(
    "Preserved Expo study interface loads with tutor and backup navigation",
  );
  await page.screenshot({
    path: "/workspace/scratch/84fbc55c1389/study-mobile.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  checks.push("No uncaught browser JavaScript errors observed");
  console.log(
    JSON.stringify({ passed: checks.length, checks, errors }, null, 2),
  );
} finally {
  await browser.close();
  server?.kill();
}
