import iteHelpers from "../../mobile/utils/ite";
export const { ITE_ACTIVITY_DOMAINS, reportValue, compareITE } = iteHelpers;
export const BLUEPRINT = {
  "Acute Care and Diagnosis": 35,
  "Chronic Care Management": 25,
  "Emergent and Urgent Care": 20,
  "Preventive Care": 15,
  "Foundations of Care": 5,
};
export type Domain = keyof typeof BLUEPRINT;
export const ERROR_TYPES = [
  "knowledge_gap",
  "case_misread",
  "wrong_next_step",
  "missed_contraindication",
  "reasoning_gap",
  "uncertain",
];
export type LearningEvent = {
  question_id: string;
  concept_id: string;
  topic_id: string;
  domain: Domain;
  result: string;
  first_correct: boolean;
  assisted: boolean;
  confidence: string;
  error_type: string;
  at: string;
  mode: string;
  elapsed_ms: number;
  evidence_ids: string[];
};
const DAY = 86400000;
export function reviewQueue(events: LearningEvent[], now = Date.now()) {
  const groups = new Map<string, LearningEvent[]>();
  for (const e of events) {
    if (
      !e.concept_id ||
      e.result === "unscored" ||
      !Number.isFinite(Date.parse(e.at))
    )
      continue;
    const group = groups.get(e.concept_id) || [];
    group.push(e);
    groups.set(e.concept_id, group);
  }
  return [...groups]
    .map(([concept_id, items]) => {
      items.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
      const last = items[items.length - 1];
      let streak = 0;
      for (let i = items.length - 1; i >= 0; i--) {
        if (!items[i].first_correct || items[i].assisted) break;
        streak++;
      }
      const interval =
        streak === 0
          ? 1
          : streak === 1
            ? 3
            : streak === 2
              ? 7
              : streak === 3
                ? 14
                : 30;
      const delayed = items.filter(
        (e, i) =>
          i > 0 &&
          e.first_correct &&
          !e.assisted &&
          e.question_id !== items[i - 1].question_id &&
          Date.parse(e.at) - Date.parse(items[i - 1].at) >= DAY,
      );
      return {
        concept_id,
        topic_id: last.topic_id,
        domain: last.domain,
        due: Date.parse(last.at) + interval * DAY,
        interval,
        independent_streak: streak,
        delayed_correct: delayed.length,
        high_confidence_miss: items.some(
          (e) => e.confidence === "high" && !e.first_correct,
        ),
        last_question_id: last.question_id,
      };
    })
    .sort(
      (a, b) =>
        (a.due <= now ? 0 : 1) - (b.due <= now ? 0 : 1) ||
        Number(b.high_confidence_miss) - Number(a.high_confidence_miss) ||
        a.due - b.due,
    );
}
export function learningSummary(events: LearningEvent[]) {
  const scored = events.filter((e) => e.concept_id && e.result !== "unscored");
  const reviews = reviewQueue(scored);
  return {
    total: scored.length,
    first_attempt_correct: scored.filter((e) => e.first_correct && !e.assisted)
      .length,
    delayed_correct: reviews.reduce((n, r) => n + r.delayed_correct, 0),
    high_confidence_misses: scored.filter(
      (e) => e.confidence === "high" && !e.first_correct,
    ).length,
    errors: Object.fromEntries(
      ERROR_TYPES.map((t) => [
        t,
        scored.filter((e) => !e.first_correct && e.error_type === t).length,
      ]),
    ),
    domains: Object.fromEntries(
      Object.keys(BLUEPRINT).map((d) => [
        d,
        scored.filter((e) => e.domain === d).length,
      ]),
    ),
  };
}
// Largest deficit from official domain targets, then weakest/due concept within that domain.
// Missing domains are reported as gaps rather than silently reassigned official weight.
export function selectQuestion<
  T extends { id: string; concept_id: string; domain: Domain },
>(
  bank: T[],
  events: LearningEvent[],
  seen: string[] = [],
  now = Date.now(),
): T | undefined {
  const available = bank.filter((q) => !seen.includes(q.id));
  if (!available.length) return undefined;
  const s = learningSummary(events),
    q = reviewQueue(events, now);
  return [...available].sort((a, b) => {
    const deficit = (d: Domain) =>
      ((s.total + 1) * BLUEPRINT[d]) / 100 - (s.domains[d] || 0);
    const domain = deficit(b.domain) - deficit(a.domain);
    if (Math.abs(domain) > 0.0001) return domain;
    const priority = (item: T) => {
      const r = q.find((r) => r.concept_id === item.concept_id);
      return r
        ? Number(r.due <= now) * 100 +
            Number(r.high_confidence_miss) * 10 -
            r.independent_streak -
            (item.id === r.last_question_id ? 50 : 0)
        : 1;
    };
    return priority(b) - priority(a);
  })[0];
}

// Self-contained draft exercises: definitions and numbers are supplied in each stem.
// These are not clinical recommendations and never enter the scored event stream.
export const UNREVIEWED_FOUNDATIONS = [
  {
    id: "draft-sensitivity",
    stem: "A diagnostic study includes 100 participants with the target disease: 80 test positive and 20 test negative. For this exercise, sensitivity is true positives divided by all participants with disease. What is the sensitivity?",
    options: ["20%", "40%", "80%", "100%"],
    answer: 2,
    rationale:
      "80 / (80 + 20) = 80%. The denominator is participants with disease, not everyone tested.",
  },
  {
    id: "draft-specificity",
    stem: "Among 200 participants without a target disease, 180 test negative and 20 test positive. Specificity is true negatives divided by everyone without disease. What is the specificity?",
    options: ["10%", "80%", "90%", "180%"],
    answer: 2,
    rationale:
      "180 / (180 + 20) = 90%. These are supplied study numbers, not an estimate of any real test.",
  },
  {
    id: "draft-ppv",
    stem: "Of 50 positive tests in a study, 30 occur in participants with disease and 20 in participants without disease. Positive predictive value is true positives divided by all positive tests. What is it?",
    options: ["30%", "40%", "50%", "60%"],
    answer: 3,
    rationale:
      "30 / (30 + 20) = 60%. This differs from sensitivity because the denominator is positive tests.",
  },
  {
    id: "draft-arr",
    stem: "An original study exercise reports an event risk of 10% in the comparison group and 6% in the treatment group over the same period. Absolute risk reduction is comparison risk minus treatment risk. What is the absolute risk reduction?",
    options: [
      "4 percentage points",
      "6 percentage points",
      "40 percentage points",
      "60 percentage points",
    ],
    answer: 0,
    rationale:
      "10% minus 6% = 4 percentage points. A relative reduction would use a different denominator.",
  },
  {
    id: "draft-nnt",
    stem: "In a study exercise, an intervention reduces absolute event risk by 0.05 over one year. Define number needed to treat as 1 divided by the absolute risk reduction expressed as a proportion. What is the one-year NNT?",
    options: ["5", "10", "20", "50"],
    answer: 2,
    rationale:
      "1 / 0.05 = 20 over the specified one-year period. This exercise does not establish a treatment recommendation.",
  },
];
