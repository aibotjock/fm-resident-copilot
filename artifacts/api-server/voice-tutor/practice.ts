import rawBank from "./questions.json";
import { CANDIDATE_ENTRIES, EVIDENCE } from "../src/rag/sources/candidate";
import {
  BLUEPRINT,
  Domain,
  LearningEvent,
  selectQuestion,
  ERROR_TYPES,
} from "./learning";
export type Question = (typeof rawBank)[number] & {
  domain: Domain;
  topic_id: string;
};
export const bank: Question[] = rawBank.map((q) => {
  const entry = CANDIDATE_ENTRIES.find((e) =>
    e.evidence.includes(q.evidence_id),
  );
  const evidence = EVIDENCE.find((e) => e.id === q.evidence_id);
  if (
    !entry ||
    !evidence ||
    evidence.url !== q.source_url ||
    q.answer < 0 ||
    q.answer >= q.options.length ||
    new Set(q.options).size !== q.options.length ||
    !(q.domain in BLUEPRINT)
  )
    throw Error(`Invalid reviewed question ${q.id}`);
  return { ...q, domain: q.domain as Domain, topic_id: entry.key };
});
export type Practice = {
  mode: "teaching" | "assessment";
  scope: "selected" | "mixed";
  ids: string[];
  events: LearningEvent[];
  seen: string[];
  current?: {
    q: Question;
    started: number;
    first?: number;
    assisted: boolean;
    confidence?: string;
  };
  answers: { q: Question; event: LearningEvent }[];
  limit: number;
  deadline: number;
  ended: boolean;
};
export function startPractice(
  input: any,
  ids: string[],
  now = Date.now(),
): Practice {
  if (
    !["teaching", "assessment"].includes(input.mode) ||
    !["selected", "mixed"].includes(input.scope)
  )
    throw Error("Select a valid practice mode and scope.");
  const limit = Number(input.limit ?? 5),
    seconds = Number(input.seconds ?? 450);
  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 20 ||
    !Number.isInteger(seconds) ||
    seconds < 60 ||
    seconds > 1200
  )
    throw Error("Choose 1–20 questions and 1–20 minutes.");
  return {
    mode: input.mode,
    scope: input.scope,
    ids,
    events: [],
    seen: [],
    answers: [],
    limit,
    deadline: now + seconds * 1000,
    ended: false,
  };
}
function publicQuestion(q: Question) {
  return {
    id: q.id,
    concept_id: q.concept_id,
    topic_id: q.topic_id,
    domain: q.domain,
    stem: q.stem,
    options: q.options,
    review: q.review,
    review_note: q.review_note,
    source: {
      id: q.evidence_id,
      url: q.source_url,
      lastChecked: q.source_date,
    },
  };
}
function feedback(q: Question, event: LearningEvent) {
  return {
    question_id: q.id,
    stem: q.stem,
    options: q.options,
    correct_option: String.fromCharCode(65 + q.answer),
    rationale: q.rationale,
    transfer: q.transfer,
    event,
    source: {
      id: q.evidence_id,
      url: q.source_url,
      lastChecked: q.source_date,
    },
    review_note: q.review_note,
  };
}
export function finishPractice(p: Practice) {
  p.ended = true;
  return {
    done: true,
    mode: p.mode,
    results: p.answers.map((a) => feedback(a.q, a.event)),
    events: p.events,
    notice:
      "Snapshot-scoped practice results only; no ABFM percentile, pass probability or clinical competence is inferred.",
  };
}
export function nextPractice(p: Practice, now = Date.now()): any {
  if (
    p.ended ||
    p.answers.length >= p.limit ||
    (p.mode === "assessment" && now >= p.deadline)
  )
    return finishPractice(p);
  if (p.current)
    return {
      question: publicQuestion(p.current.q),
      mode: p.mode,
      remaining: p.limit - p.answers.length,
      deadline: p.mode === "assessment" ? p.deadline : null,
    };
  const eligible =
    p.scope === "mixed" ? bank : bank.filter((q) => p.ids.includes(q.topic_id));
  const excluded =
    p.mode === "assessment"
      ? [...new Set([...p.seen, ...p.events.map((e) => e.question_id)])]
      : [
          ...new Set([
            ...p.seen,
            ...p.events
              .filter((e) => Date.parse(e.at) > now - 86400000)
              .map((e) => e.question_id),
          ]),
        ];
  const q = selectQuestion(eligible, p.events, excluded, now);
  if (!q)
    return {
      ...finishPractice(p),
      gap: "No more reviewed items are available for this selection. Unreviewed generated questions remain unscored.",
    };
  p.seen.push(q.id);
  p.current = { q, started: now, assisted: false };
  return {
    question: publicQuestion(q),
    mode: p.mode,
    remaining: p.limit - p.answers.length,
    deadline: p.mode === "assessment" ? p.deadline : null,
  };
}
export function answerPractice(p: Practice, a: any, now = Date.now()): any {
  if (p.ended) throw Error("This practice block has ended.");
  if (p.mode === "assessment" && now >= p.deadline) return finishPractice(p);
  const c = p.current;
  if (!c || a.question_id !== c.q.id)
    throw Error("Answer the current practice question.");
  if (
    !["low", "medium", "high", "unspecified"].includes(
      a.confidence ?? "unspecified",
    )
  )
    throw Error("Invalid confidence.");
  const choice =
    typeof a.choice === "string" && /^[A-E]$/i.test(a.choice)
      ? a.choice.toUpperCase().charCodeAt(0) - 65
      : -1;
  if (choice < 0 || choice >= c.q.options.length)
    throw Error("Choose one listed answer option.");
  const correct = choice === c.q.answer;
  if (c.first === undefined) {
    c.first = choice;
    c.confidence = a.confidence ?? "unspecified";
  }
  if (
    !correct &&
    p.mode === "teaching" &&
    !c.assisted &&
    a.skip_retry !== true
  ) {
    c.assisted = true;
    return {
      retry: true,
      hint: "Re-read the patient-specific qualifier and the exact decision requested. You can retry once or request the explanation.",
      question_id: c.q.id,
    };
  }
  const firstCorrect = c.first === c.q.answer;
  const event: LearningEvent = {
    question_id: c.q.id,
    concept_id: c.q.concept_id,
    topic_id: c.q.topic_id,
    domain: c.q.domain,
    result: c.assisted ? "assisted" : correct ? "correct" : "incorrect",
    first_correct: firstCorrect,
    assisted: c.assisted,
    confidence: c.confidence || "unspecified",
    error_type: firstCorrect
      ? "none"
      : ERROR_TYPES.includes(a.error_type)
        ? a.error_type
        : "uncertain",
    at: new Date(now).toISOString(),
    mode: p.mode,
    elapsed_ms: now - c.started,
    evidence_ids: [c.q.evidence_id],
  };
  p.events.push(event);
  p.answers.push({ q: c.q, event });
  p.current = undefined;
  if (p.answers.length >= p.limit) return finishPractice(p);
  return p.mode === "assessment"
    ? { recorded: true, mode: p.mode }
    : { recorded: true, event, feedback: feedback(c.q, event), mode: p.mode };
}
