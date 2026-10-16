import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildReviewedExcerpts,
  isReviewedCurrent,
  isOfficialSourceUrl,
} from "./review-policy";
const excerpt = {
  source: "CDC",
  tier: 1,
  guideline_title: "Checked source",
  guideline_year: "2025",
  abfm_domain: "Infectious Disease",
  section: "Limited facts",
  content: "A checked educational excerpt.",
  url: "https://www.cdc.gov/example",
};
test("legacy and rights-restricted material never becomes reviewed evidence", () => {
  assert.equal(
    buildReviewedExcerpts(
      [
        {
          index: 0,
          status: "unverified",
          reason: "not checked",
          lastChecked: "2026-10-15",
          rightsStatus: "public_federal",
        },
      ],
      [excerpt],
    ).length,
    0,
  );
  assert.equal(
    buildReviewedExcerpts(
      [
        {
          index: 0,
          status: "superseded",
          reason: "restricted",
          lastChecked: "2026-10-15",
          rightsStatus: "restricted_ai",
          replacement: excerpt,
        },
      ],
      [excerpt],
    ).length,
    0,
  );
});
test("checks distinguish publication year from actual review date and expire", () => {
  const result = buildReviewedExcerpts(
    [
      {
        index: 0,
        status: "superseded",
        reason: "checked narrowly",
        lastChecked: "2026-10-15",
        publicationDate: "2025-06-01",
        rightsStatus: "public_federal",
        replacement: excerpt,
      },
    ],
    [excerpt],
  );
  assert.equal(result[0].guideline_year, "2025");
  assert.equal(
    isReviewedCurrent(result[0], new Date("2026-10-15T12:00:00Z")),
    true,
  );
  assert.equal(
    isReviewedCurrent(result[0], new Date("2027-02-01T12:00:00Z")),
    false,
  );
  assert.equal(
    isReviewedCurrent(result[0], new Date("2026-10-14T12:00:00Z")),
    false,
  );
});
test("historical audit reasons cannot become clinical evidence", () => {
  const result = buildReviewedExcerpts(
    [
      {
        index: 0,
        status: "superseded",
        reason: "Obsolete dose 999 mg from historical text",
        lastChecked: "2026-10-15",
        rightsStatus: "public_federal",
        replacement: excerpt,
      },
    ],
    [excerpt],
  );
  assert.ok(!JSON.stringify(result).includes("999 mg"));
});
test("only official publisher domains can enter clinical evidence", () => {
  assert.equal(isOfficialSourceUrl("https://www.cdc.gov/example"), true);
  for (const url of [
    "https://www.reddit.com/r/medicine/",
    "https://cdc.gov.example.com/",
    "https://example.com/?source=cdc.gov",
    "https://pubmed.ncbi.nlm.nih.gov/123/",
    "http://www.cdc.gov/example",
  ]) {
    assert.equal(isOfficialSourceUrl(url), false);
    assert.equal(
      buildReviewedExcerpts(
        [
          {
            index: 0,
            status: "superseded",
            reason: "not official",
            lastChecked: "2026-10-15",
            rightsStatus: "public_federal",
            replacement: { ...excerpt, url },
          },
        ],
        [excerpt],
      ).length,
      0,
    );
  }
});
