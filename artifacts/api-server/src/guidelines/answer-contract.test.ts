import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAnswerPrompt,
  buildGroundedCitationBlock,
  buildVignettePrompt,
  CitationStreamFilter,
  getModeContract,
  noEvidenceAnswer,
  OVERVIEW_SECTIONS,
} from "./answer-contract";

test("condition overviews require every requested clinical section and preserve evidence gaps", () => {
  const contract = getModeContract("point_of_care");
  for (const heading of OVERVIEW_SECTIONS) assert.ok(contract.includes(`## ${heading}`));
  assert.match(contract, /focused question should use only the relevant headings/i);
  assert.match(contract, /evidence gap rather than filling it from memory/);
});

test("every mode inherits direct-excerpt, dosing-population and currentness limits", () => {
  for (const mode of ["point_of_care", "board_prep", "documentation", "flashcards", "ddx"]) {
    const prompt = buildAnswerPrompt({ mode, studyDomains: "Cardiovascular", context: "[REF 1] Verified source excerpt" });
    assert.match(prompt, /Use ONLY the supplied \[REF N\] excerpts/);
    assert.match(prompt, /Naming a reputable organization is not evidence/);
    assert.match(prompt, /Separate adult and pediatric regimens/);
    assert.match(prompt, /mg\/kg\/dose from mg\/kg\/day/);
    assert.match(prompt, /do not infer a universal first-, second-, third-line sequence/i);
    assert.match(prompt, /never invent a third-line treatment/);
    assert.match(prompt, /Publication year, retrieval time, and update-check time alone do not establish clinical currentness/);
    assert.match(prompt, /%%FM_CITE%%/);
    assert.doesNotMatch(prompt, /drawn from .* guideline knowledge|ACPE-approved sources only|exactly 6 Anki/);
  }
});

test("study outputs can decline unsupported cards/questions and cannot assert exam preferences", () => {
  assert.match(getModeContract("flashcards"), /Fewer cards, including zero/);
  assert.match(getModeContract("board_prep"), /omit the MCQ/);
  const prompt = buildVignettePrompt({ domain: "Cardiovascular", studyDomains: "Cardiovascular", context: "[REF 1] Limited evidence" });
  assert.match(prompt, /"error":"insufficient_evidence"/);
  assert.match(prompt, /reason every distractor is wrong/);
  assert.match(prompt, /not an official ABFM question/);
  assert.match(getModeContract("documentation"), /bracketed placeholders/);
});

test("no-evidence result preserves citation schema without manufacturing a source", () => {
  const answer = noEvidenceAnswer();
  const match = answer.match(/%%FM_CITE%%(.*?)%%\/FM_CITE%%/);
  assert.ok(match);
  const citation = JSON.parse(match[1]);
  assert.deepEqual(citation.citations, []);
  assert.equal(citation.weight, "Not verified");
  assert.match(citation.limitation, /currentness could not be verified/);
});

test("fragmented model citation metadata never leaks into visible streamed text", () => {
  const answer = "Supported answer [REF 1].\n\n";
  const metadata = '%%FM_CITE%%{"source":"invented"}%%/FM_CITE%%';
  for (let split = 0; split <= metadata.length; split++) {
    const filter = new CitationStreamFilter();
    const visible = filter.push(answer + metadata.slice(0, split)) + filter.push(metadata.slice(split)) + filter.finish();
    assert.equal(visible, answer);
  }
  const filter = new CitationStreamFilter();
  assert.equal(filter.push("Answer ending with %") + filter.finish(), "Answer ending with %");
});

test("citation source identity and dates are copied from real excerpts and fake refs excluded", () => {
  const generated = 'Sourced claim [REF 1]. Unavailable claim [REF 99].\n%%FM_CITE%%{"domain":"Cardiovascular","weight":"10%","citations":[{"source":"Fake society","year":"2099","guideline":"Fake title","url":"https://fake.invalid","reviewedAt":"2099-01-01","note":"[REF 1]","confidence":"direct"}],"limitation":"Dose duration missing."}%%/FM_CITE%%';
  const block = buildGroundedCitationBlock(generated, [{
    source: "Actual source",
    guideline_title: "Actual guideline",
    guideline_year: "2025",
    url: "https://example.org/actual",
    reviewed_at: "2026-10-15",
    publication_date: "2025-04-01",
  }], ["Cardiovascular"]);
  const parsed = JSON.parse(block.slice("%%FM_CITE%%".length, -"%%/FM_CITE%%".length));
  assert.equal(parsed.weight, "Not verified");
  assert.equal(parsed.citations.length, 1);
  assert.equal(parsed.citations[0].source, "Actual source");
  assert.equal(parsed.citations[0].year, "2025");
  assert.equal(parsed.citations[0].url, "https://example.org/actual");
  assert.equal(parsed.citations[0].reviewedAt, "2026-10-15");
  assert.equal(parsed.citations[0].publicationDate, "2025-04-01");
  assert.match(parsed.limitation, /REF 99/);
  assert.match(parsed.limitation, /Dose duration missing/);
  assert.doesNotMatch(block, /Fake|2099/);
});

test("malformed or absent metadata yields honest uncited-answer limitation", () => {
  const block = buildGroundedCitationBlock("No sources. %%FM_CITE%%bad JSON", [], []);
  const parsed = JSON.parse(block.slice("%%FM_CITE%%".length, -"%%/FM_CITE%%".length));
  assert.deepEqual(parsed.citations, []);
  assert.match(parsed.limitation, /No valid supplied reference/);
  assert.equal(parsed.domain, "Multisystem & Other");
});
