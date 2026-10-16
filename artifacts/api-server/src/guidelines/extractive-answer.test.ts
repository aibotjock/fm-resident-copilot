import assert from "node:assert/strict";
import { test } from "node:test";
import { OVERVIEW_SECTIONS } from "./answer-contract";
import {
  buildExtractionPrompt,
  CHECKED_EXCERPT_INTRO,
  checkedSentences,
  parseExtractionPlan,
  renderExtractiveAnswer,
  type CheckedSummary,
} from "./extractive-answer";

const references: CheckedSummary[] = [
  {
    source: "CDC",
    guideline_title: "Chlamydia — checked summary",
    guideline_year: "2021",
    abfm_domain: "Infectious Disease",
    section: "Chlamydia diagnosis and treatment",
    content:
      "Diagnosis: use NAAT at the relevant exposure site. Recommended nonpregnant adolescent/adult regimen: doxycycline 100 mg orally twice daily for 7 days. Alternatives are not ranked as second-line or third-line therapy in this checked summary.",
    url: "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm",
    reviewed_at: "2026-10-15",
  },
];

function render(rawPlan: string, mode = "point_of_care") {
  return renderExtractiveAnswer({
    mode,
    rawPlan,
    references,
    studyDomains: ["Infectious Disease"],
  });
}

test("invented presentation and modified doses never reach the rendered answer", () => {
  const raw = JSON.stringify({
    sections: {
      DIAGNOSIS: [
        {
          ref: 1,
          sentences: [1],
          text: "Purulent discharge and pelvic pain are diagnostic.",
        },
      ],
    },
    presentation: "Purulent discharge and pelvic pain are diagnostic.",
    dose: "Give doxycycline 900 mg daily.",
    limitation: "Everything is clinically verified.",
  });
  const result = render(raw);
  assert.ok(result.startsWith(CHECKED_EXCERPT_INTRO));
  assert.doesNotMatch(
    result,
    /Purulent discharge|pelvic pain|900 mg|Everything is clinically verified/,
  );
  assert.ok(
    result.includes(
      "Diagnosis: use NAAT at the relevant exposure site. [REF 1]",
    ),
  );
  assert.ok(
    result.includes("doxycycline 100 mg orally twice daily for 7 days."),
  );
});

test("out-of-range and malformed selectors fall back to original checked summaries", () => {
  for (const raw of [
    "not JSON",
    JSON.stringify({ sections: { DIAGNOSIS: [{ ref: 99, sentences: [1] }] } }),
    JSON.stringify({ sections: { DIAGNOSIS: [{ ref: 1, sentences: [0] }] } }),
    JSON.stringify({ sections: { DIAGNOSIS: [{ ref: 1, sentences: [999] }] } }),
    JSON.stringify({ sections: { DIAGNOSIS: [{ ref: 1, sentences: [1.5] }] } }),
    JSON.stringify({ sections: { invented: [{ ref: 1, sentences: [1] }] } }),
    JSON.stringify({ sections: { PRESENTATION: "invented symptoms" } }),
  ]) {
    assert.equal(parseExtractionPlan(raw, references), null);
    const result = render(raw);
    assert.match(result, /selection was unavailable or invalid/);
    assert.ok(result.includes(references[0].content));
    assert.doesNotMatch(result, /invented symptoms/);
  }
});

test("all requested headings and explicit gaps survive empty or invalid selection", () => {
  const result = render(JSON.stringify({ sections: {} }));
  for (const heading of OVERVIEW_SECTIONS)
    assert.ok(result.includes(`## ${heading}`));
  assert.match(
    result,
    /Not established in the supplied checked summary excerpts/,
  );
  assert.match(result, /No treatment-line ranking is inferred/);
  assert.equal(result.split(references[0].content).length - 1, 1);
});

test("selection cannot manufacture a treatment hierarchy from an unranked regimen", () => {
  for (const heading of [
    "FIRST-LINE TREATMENT",
    "SECOND-LINE TREATMENT",
    "THIRD-LINE TREATMENT",
  ]) {
    assert.equal(
      parseExtractionPlan(
        JSON.stringify({
          sections: { [heading]: [{ ref: 1, sentences: [2] }] },
        }),
        references,
      ),
      null,
    );
  }
});

test("sentence segmentation preserves decimal doses and full original scope context", () => {
  const text =
    "Scope: adults only. Dose: 0.5 mg orally twice daily. Do not use this regimen in children.";
  assert.ok(
    checkedSentences(text).includes("Dose: 0.5 mg orally twice daily."),
  );
  const result = render(
    JSON.stringify({
      sections: {
        "DOSING & SPECIAL POPULATIONS": [{ ref: 1, sentences: [2] }],
      },
    }),
  );
  assert.ok(result.includes(references[0].content));
  assert.ok(
    result.includes(
      "doxycycline 100 mg orally twice daily for 7 days. [REF 1]",
    ),
  );
  const metadata = JSON.parse(
    result.match(/%%FM_CITE%%(.*?)%%\/FM_CITE%%/)![1],
  );
  assert.equal(metadata.citations[0].source, references[0].source);
  assert.equal(metadata.citations[0].url, references[0].url);
  assert.equal(metadata.citations[0].reviewedAt, references[0].reviewed_at);
});

test("flashcards and documentation contain fixed templates and selected checked text only", () => {
  const raw = JSON.stringify({
    sections: { DIAGNOSIS: [{ ref: 1, sentences: [1] }] },
  });
  const cards = render(raw, "flashcards");
  assert.match(cards, /FRONT: Checked summary review: DIAGNOSIS/);
  assert.match(
    cards,
    /BACK: Diagnosis: use NAAT at the relevant exposure site\. \[REF 1\]/,
  );
  assert.match(
    render(raw, "documentation"),
    /Assessment: \[clinician assessment\]/,
  );
  assert.match(buildExtractionPrompt(references), /never write clinical prose/);
});
