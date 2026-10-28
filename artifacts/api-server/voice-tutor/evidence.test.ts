import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { officialSource, allowedDomains } from "./source-registry";
import {
  cleanClinicalText,
  speechText,
  speechChunks,
  updateScenario,
  scenarioFromUtterance,
  affectedStudyItems,
} from "./presentation";
import { calculateWeightDose } from "./dose-arithmetic";
import {
  answerWithEvidence,
  assembleAnswer,
  readOfficialDocument,
  medicationSupported,
  researchQuery,
  relevantPassages,
  localEvidence,
  type EvidenceDocument,
} from "./evidence";

// Engineering fixtures use invented Agent Z; no dose below is clinical guidance.
const quote =
  "For the synthetic training exercise, adults take Agent Z 5 mg per dose by oral route every 12 hours for 3 days. Maximum 10 mg per day. Renal and hepatic adjustments are not established.";
const doc: EvidenceDocument = {
  id: "test-source",
  url: "https://www.cdc.gov/synthetic-fixture",
  organization: "CDC",
  title: "Synthetic engineering fixture",
  jurisdiction: "US",
  publicationDate: null,
  updateDate: null,
  retrievedAt: "2026-10-28T00:00:00Z",
  version: "fixture-v1",
  documentType: "other",
  access: "read",
  review: "not_clinically_reviewed",
  text: quote,
  section: "Engineering fixture, not clinical guidance",
};
const base = {
  cards: [],
  claims: [
    {
      text: "Agent Z is used in this synthetic exercise.",
      passages: [{ source_id: doc.id, quote }],
    },
  ],
  medications: [],
  gaps: [],
  clarifying_question: null,
  next_question: null,
  document_notes: [],
};
const info = {
  attempted: true,
  query: "synthetic exercise",
  status: "read_official_documents",
  read: 1,
  failures: [],
};
const resolve: any = async () => [{ address: "142.250.72.14", family: 4 }];

test("registry rejects lookalikes, credentials, ports, non-HTTPS and arbitrary hosts", () => {
  assert.equal(
    officialSource("https://professional.heart.org/guidelines").organization,
    "AHA / ASA",
  );
  assert.equal(
    officialSource("https://diabetesjournals.org/care").organization,
    "American Diabetes Association",
  );
  for (const url of [
    "http://www.cdc.gov/a",
    "https://cdc.gov.evil.test/a",
    "https://evilcdc.gov/a",
    "https://user:pass@cdc.gov/a",
    "https://cdc.gov:8443/a",
    "https://127.0.0.1/a",
  ])
    assert.throws(() => officialSource(url));
  assert.ok(allowedDomains.includes("acog.org"));
  assert.ok(allowedDomains.includes("dailymed.nlm.nih.gov"));
});
test("display and speech remove internal codes and URLs while retaining medication tables, digits and negations", () => {
  const text =
    '## Regimen\n| Drug | Dose |\n|---|---|\n| Agent Z | 5 mg/kg/day; NOT 5 mg/kg/dose | [REF abc123] [EVID 34ab] [MED LABEL-X]\n[CDC](https://www.cdc.gov/a)\n%%FM_CITE%%{"secret":"metadata"}%%/FM_CITE%%';
  for (const clean of [cleanClinicalText(text), speechText(text)]) {
    assert.match(clean, /5 mg\/kg\/day/);
    assert.match(clean, /NOT 5 mg\/kg\/dose/);
    assert.ok(!/REF|EVID|LABEL-X|abc123|https:|FM_CITE|secret/.test(clean));
  }
});
test("hypothetical variants preserve confirmed facts; restore and reset are distinct", () => {
  let scenario: import("./presentation").Scenario = { confirmed: {}, hypothetical: {}, revision: 0 };
  scenario = updateScenario(scenario, "set", {
    pregnancy: "not pregnant",
    renal_function: "unknown",
  });
  scenario = updateScenario(scenario, "vary", { pregnancy: "pregnant" });
  assert.equal(scenario.confirmed.pregnancy, "not pregnant");
  assert.equal(scenario.hypothetical.pregnancy, "pregnant");
  scenario = updateScenario(scenario, "restore");
  assert.deepEqual(scenario.hypothetical, {});
  assert.equal(scenario.confirmed.pregnancy, "not pregnant");
  assert.deepEqual(updateScenario(scenario, "reset").confirmed, {});
});
test("spoken what-if changes remain hypothetical and retain renal measure names", () => {
  const old = {
    confirmed: { pregnancy: "not pregnant" },
    hypothetical: {},
    revision: 0,
  };
  const varied = scenarioFromUtterance(
    old,
    "What if she is pregnant and her CrCl is 25 mL/min?",
  );
  assert.equal(varied.confirmed.pregnancy, "not pregnant");
  assert.match(varied.hypothetical.pregnancy!, /pregnant/);
  assert.equal(varied.hypothetical.renal_function, "CrCl is 25 mL/min");
  assert.equal(scenarioFromUtterance(old, "Explain pregnancy screening"), old);
});
test("speech chunking preserves all text instead of truncating late qualifications", () => {
  const text = (
    "A supported statement with 5 mg per dose. ".repeat(300) +
    "Do not use if the supplied contraindication applies."
  ).trim();
  const chunks = speechChunks(text);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((c) => c.length <= 3500));
  assert.equal(chunks.join(" "), text);
});
test("weight-based arithmetic distinguishes daily and per-dose quantities and applies only scoped caps", () => {
  const m: any = {
    dose: "5",
    unit: "mg/kg",
    dose_basis: "per_day",
    frequency: "twice daily",
    maximum: "100 mg per day",
    drug: "Synthetic Agent Z",
  };
  const daily = calculateWeightDose(m, 10);
  assert.equal(daily.doseMg, 25);
  assert.equal(daily.dailyTotalMg, 50);
  const perDose = calculateWeightDose(
    { ...m, dose_basis: "per_dose", maximum: "100 mg per dose" },
    10,
  );
  assert.equal(perDose.doseMg, 50);
  assert.equal(perDose.dailyTotalMg, 100);
  const capped = calculateWeightDose(m, 30);
  assert.equal(capped.doseMg, 50);
  assert.equal(capped.capped, true);
  assert.throws(
    () => calculateWeightDose({ ...m, maximum: null }, 10),
    /maximum/,
  );
  assert.throws(
    () => calculateWeightDose({ ...m, dose_basis: "not_established" }, 10),
    /distinguish/,
  );
  assert.throws(() => calculateWeightDose(m, -1), /kilograms/);
});
test("changed evidence suspends a saved item without deleting its text or review history", () => {
  const old = [
    {
      answer: "prior answer",
      history: ["good"],
      evidence: [{ url: doc.url, version: "old" }],
    },
  ];
  const changed = affectedStudyItems(old, { [doc.url]: "new" });
  assert.equal((changed[0] as any).needsReview, true);
  assert.equal(changed[0]!.answer, "prior answer");
  assert.deepEqual(changed[0]!.history, ["good"]);
  assert.equal((old[0] as any).needsReview, undefined);
});
test("claims require literal supporting passages and matching numerical details", () => {
  const good = assembleAnswer(base, [doc], "quick", info);
  assert.equal(good.support, "passage_linked");
  assert.equal(good.clinicalReview, "not_clinically_reviewed");
  assert.ok(!good.text.includes(doc.id));
  const bad = assembleAnswer(
    {
      ...base,
      claims: [{ ...base.claims[0]!, text: "Agent Z 50 mg is recommended." }],
    },
    [doc],
    "quick",
    info,
  );
  assert.equal(bad.claims.length, 0);
  assert.match(bad.text, /omitted/);
  const fabricated = assembleAnswer(
    {
      ...base,
      claims: [
        {
          text: "A clinical claim",
          passages: [
            { source_id: doc.id, quote: "A fabricated supporting quotation" },
          ],
        },
      ],
    },
    [doc],
    "quick",
    info,
  );
  assert.equal(fabricated.claims.length, 0);
});
test("structured regimens reject unsupported fields and ambiguous pediatric dose bases", () => {
  const record = {
    drug: "Agent Z",
    indication: "synthetic training exercise",
    population: "adults",
    dose: "5",
    unit: "mg",
    dose_basis: "per_dose" as const,
    route: "oral",
    frequency: "every 12 hours",
    duration: "3 days",
    maximum: null,
    formulation: null,
    adjustments: null,
    precautions: null,
    labeling: "not_established" as const,
    passages: [{ source_id: doc.id, quote }],
  };
  assert.equal(medicationSupported(record, [doc]), true);
  assert.equal(
    medicationSupported({ ...record, duration: "10 days" }, [doc]),
    false,
  );
  assert.equal(
    medicationSupported(
      { ...record, unit: "mg/kg", dose_basis: "not_established" },
      [doc],
    ),
    false,
  );
  const result = assembleAnswer(
    { ...base, claims: [], medications: [record] },
    [doc],
    "quick",
    info,
  );
  assert.equal(result.medications.length, 1);
  assert.match(result.text, /Duration: 3 days/);
  assert.match(result.text, /Adjustments: not established/);
  assert.equal(result.speech, speechText(result.text));
});
test("quiz output never leaks a generated explanation or medication answer before the user responds", () => {
  const result = assembleAnswer(
    {
      ...base,
      next_question:
        "In this supplied synthetic exercise, which option fits? A. Option one. B. Option two.",
    },
    [doc],
    "quiz",
    info,
  );
  assert.equal(result.claims.length, 0);
  assert.equal(result.medications.length, 0);
  assert.ok(!result.text.includes("5 mg"));
  assert.match(result.text, /which option/);
});
test("flashcards retain supporting passages and reject invented source support",()=>{
  const card={front:"What does the synthetic exercise discuss?",back:"The synthetic exercise discusses Agent Z.",passages:[{source_id:doc.id,quote}]};
  const supported=assembleAnswer({...base,claims:[],cards:[card]},[doc],"teach",info);assert.equal(supported.cards.length,1);assert.equal(supported.sources[0]?.id,doc.id);
  const invalid=assembleAnswer({...base,claims:[],cards:[{...card,passages:[{source_id:"invented",quote}]}]},[doc],"teach",info);assert.equal(invalid.cards.length,0);
});
test("unknown subjects do not retrieve an arbitrary condition and query minimization removes direct identifiers", () => {
  assert.equal(
    localEvidence("zxqv nonexistent raretreatment", "zxqv").length,
    0,
  );
  const query = researchQuery(
    "UTI dosing; MRN: 123456; email chris@example.com; 555-555-5555",
    "",
    [],
  );
  assert.match(query, /urinary/);
  assert.ok(!/123456|example|555|@/.test(query));
});
test("document reader strips executable markup, retains table headings and does not invent dates", async () => {
  const html = `<html><title>Training document</title><body><main><h1>Exercise</h1><script>malicious()</script><table><tr><th>Agent</th><th>Dose</th></tr><tr><td>Agent Z</td><td>5 mg</td></tr></table><p>${quote.repeat(3)}</p></main></body></html>`;
  const result = await readOfficialDocument(doc.url, {
    resolve,
    fetch: (async () =>
      new Response(html, { headers: { "content-type": "text/html" } })) as any,
  });
  assert.match(result.text, /Agent \| Dose/);
  assert.ok(!result.text.includes("malicious"));
  assert.equal(result.publicationDate, null);
  assert.equal(result.updateDate, null);
  assert.equal(result.access, "read");
});
test("document reader rejects redirects outside registry, private DNS, unsupported format and challenge pages", async () => {
  await assert.rejects(
    () =>
      readOfficialDocument(doc.url, {
        resolve,
        fetch: (async () =>
          new Response(null, {
            status: 302,
            headers: { location: "https://attacker.example/a" },
          })) as any,
      }),
    /outside/,
  );
  await assert.rejects(
    () =>
      readOfficialDocument(doc.url, {
        resolve: (async () => [{ address: "127.0.0.1", family: 4 }]) as any,
      }),
    /not public/,
  );
  await assert.rejects(
    () =>
      readOfficialDocument(doc.url, {
        resolve,
        fetch: (async () =>
          new Response("image", {
            headers: { "content-type": "image/png" },
          })) as any,
      }),
    /format/,
  );
  await assert.rejects(
    () =>
      readOfficialDocument(doc.url, {
        resolve,
        fetch: (async () =>
          new Response("Verify you are human. ".repeat(30), {
            headers: { "content-type": "text/html" },
          })) as any,
      }),
    /inaccessible/,
  );
});
test("online fallback discovers a URL then reads actual content before extracting claims", async () => {
  const url = "https://www.cdc.gov/test-fallback-20261028",
    sourceId =
      "source-" + createHash("sha256").update(url).digest("hex").slice(0, 16);
  let searches = 0,
    reads = 0,
    answers = 0;
  const f: any = async (address: string, opts: any) => {
    if (address === url) {
      reads++;
      return new Response(
        `<html><title>Fixture</title><main>${quote.repeat(4)}</main></html>`,
        { headers: { "content-type": "text/html" } },
      );
    }
    assert.equal(address, "https://api.openai.com/v1/responses");
    const request = JSON.parse(opts.body);
    assert.equal(request.store, false);
    if (request.tools) {
      searches++;
      assert.ok(request.tools[0].filters.allowed_domains.includes("cdc.gov"));
      return Response.json({
        output: [
          {
            type: "web_search_call",
            action: {
              sources: [{ url }, { url: "https://bad.example/snippet" }],
            },
          },
        ],
      });
    }
    answers++;
    assert.equal(reads, 1);
    assert.match(request.input[1].content, /synthetic training exercise/);
    return Response.json({
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: JSON.stringify({
                ...base,
                claims: [
                  {
                    text: "Agent Z is used in this synthetic exercise.",
                    passages: [{ source_id: sourceId, quote }],
                  },
                ],
              }),
            },
          ],
        },
      ],
    });
  };
  const result = await answerWithEvidence(
    { query: "Agent Z zxqv-fixture-20261028 dose", forceLookup: true },
    { apiKey: "fixture-key", fetch: f, resolve },
  );
  assert.equal(searches, 1);
  assert.equal(reads, 1);
  assert.equal(answers, 1);
  assert.equal(result.sources[0]?.url, url);
  assert.equal(result.support, "passage_linked");
});
test("an inaccessible official source never becomes snippet-supported medical advice", async () => {
  const f: any = async (address: string, opts: any) => {
    if (address.includes("api.openai.com"))
      return Response.json({
        output: [
          {
            type: "web_search_call",
            action: {
              sources: [{ url: "https://www.cdc.gov/blocked-fixture" }],
            },
          },
        ],
      });
    return new Response("Paywall", { status: 403 });
  };
  const result = await answerWithEvidence(
    { query: "zxqv-paywall-fixture-dose", forceLookup: true },
    { apiKey: "fixture", fetch: f, resolve },
  );
  assert.equal(result.claims.length, 0);
  assert.equal(result.lookup.read, 0);
  assert.match(result.gaps.join(" "), /readable/);
  assert.equal(result.clinicalReview, "not_clinically_reviewed");
});
test("passage selection keeps relevant material from later in a document", () => {
  const text = "unrelated preface ".repeat(2000) + quote;
  assert.match(relevantPassages(text, "Agent Z dose"), /5 mg/);
});
