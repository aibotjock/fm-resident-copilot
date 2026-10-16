import assert from "node:assert/strict";
import { test } from "node:test";
import { expandExactTopicAlias } from "./search-query";

test("exact app topic aliases expose checked abbreviation-only excerpts", () => {
  assert.equal(
    expandExactTopicAlias("Hypertension"),
    'hypertension OR "blood pressure"',
  );
  assert.equal(
    expandExactTopicAlias(" Heart   Failure "),
    '"heart failure" OR HFrEF OR HFpEF',
  );
  assert.equal(
    expandExactTopicAlias("Atrial Fibrillation"),
    '"atrial fibrillation" OR AF',
  );
  assert.equal(
    expandExactTopicAlias("Peripheral Arterial Disease"),
    '"peripheral arterial disease" OR PAD',
  );
  assert.equal(
    expandExactTopicAlias("Major Depressive Disorder"),
    '"major depressive disorder" OR "major depression" OR MDD',
  );
});

test("qualifying populations, negation and focused questions are never expanded away", () => {
  for (const query of [
    "Hypertension in pregnancy",
    "Hypertension Screening",
    "pediatric heart failure",
    "not atrial fibrillation",
    "Major depressive disorder with psychosis",
    "PAD dose",
    "What is the next best test for hypertension?",
    "chronic kidney disease",
    "",
  ]) {
    assert.equal(expandExactTopicAlias(query), query);
  }
});
