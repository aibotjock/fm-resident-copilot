import content from "./curriculum.json";

export type Track = "medication" | "safety" | "advanced";
export type Lesson = {
  id: string;
  track: Track;
  title: string;
  tags: string[];
  source_ids: string[];
  facts: string[];
  gaps: string[];
  opening: string;
  stages: string[];
  regimen?: {
    indication: string;
    population: string;
    drug: string;
    dose: string;
    route: string;
    frequency: string;
    duration: string;
    adjustment: string;
    maximum: string;
  };
  category?:
    | "contraindication"
    | "precaution"
    | "adverse_effect"
    | "prescribing_pitfall";
  reveals?: string[];
};
export const curriculumVersion = "medication-synthesis-2026-10-17-v1";
export const lessons = content.lessons as Lesson[];
export const referenceRegistry = content.references;
export const clinicalSources = content.sources;
export function lessonById(id: unknown) {
  if (typeof id !== "string") throw Error("Choose a valid curriculum lesson");
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) throw Error("Unknown curriculum lesson");
  return lesson;
}
export function curriculumCatalog() {
  return {
    version: curriculumVersion,
    lessons,
    sources: clinicalSources,
    references: referenceRegistry,
    notice:
      "Source-checked educational starter set; independent clinician/pharmacist review pending. Not a comprehensive drug database. Generated teaching and self-ratings are unscored.",
    gaps: content.gaps,
  };
}
export const synthesisRubric = [
  "Concise problem representation connecting symptoms, timeline, comorbidities and medications",
  "Urgency, immediate threats, and justified level of care",
  "Ranked differential with supporting and contradictory findings; multiple contributing causes allowed",
  "Targeted diagnostic steps and how results would change the differential",
  "Medication reconciliation including OTC products, adherence, interactions and potential deprescribing",
  "Problem-based treatment plan with complete supported regimens and competing-condition tradeoffs",
  "Patient goals, affordability, function, adherence and support",
  "Monitoring, follow-up, escalation, uncertainty and a concise oral handoff",
];
export function curriculumInstructions(id: unknown) {
  if (id === undefined || id === null || id === "") return "";
  const l = lessonById(id);
  const linked = clinicalSources.filter((s) => l.source_ids.includes(s.id));
  return `\nACTIVE SPECIALIST CURRICULUM ${curriculumVersion}: ${l.track} / ${l.id} / ${l.title}.
This lesson is additional explicitly loaded medical evidence. Its source-backed facts and regimen may be used alongside the selected LIBRARY, only within their stated indication, formulation, population and limitations. Cite [MED source_id] for these facts; IDs must be from LOADED CURRICULUM SOURCES. Never imply a commercial reference was consulted. Registry metadata is not medical evidence.
This curriculum flow takes precedence over the default GUIDED CASE stages, but never over source, privacy, unscored-practice or safety rules. Do not start a reviewed practice tool for these lessons. Ask ONE question per turn and wait. Keep essential teaching concise; offer optional depth. A learner may request another stage or more explanation. Save lesson stage and pending question using save_lesson; include this curriculum ID. Do not resume a checkpoint for a different lesson.
MEDICATION TRACK: Elicit the indication and full prescription (drug, formulation, dose with units, route, frequency, duration/titration, relevant adjustments, maximum where applicable). Distinguish starting dose, target range and maximum; do not invent absent targets. Always ask a case-specific safety checkpoint and discuss alternatives ONLY when sources establish them. Clearly distinguish mg/kg/dose from mg/kg/day, apply supported caps, and do not generalize adult doses to children.
SAFETY TRACK: Teach the labeled category ${l.category || "as applicable"}. Distinguish absolute contraindications, avoid-use warnings, monitorable interactions, adverse effects and prescribing errors. Elicit risk, susceptible patient factors, action, monitoring and a supported alternative if available. SIADH is a possible mechanism of medication-related hyponatremia, not proof of a diagnosis or a drug-drug contraindication. Use prescribing-error mini-cases and revisit the concept with changed simulated context.
ADVANCED TRACK: Let the learner synthesize before supplying your assessment. Follow the staged case, reveal one supplied result only after the preceding response, keep all patient facts consistent, and do not reveal the final explanation early. Treat demographics, lab values and narrative as simulated case premises, not guideline claims. Never assume a medication association proves causality. Do not force a single diagnosis when several contributors are plausible. Ask what data are missing. Accept multiple defensible approaches; explain evidence limits instead of inventing a gold-standard answer. Elicit medication reconciliation, OTC use, competing goals, patient preferences, cost/support, monitoring and disposition. End with a 30-60 second oral presentation and qualitative feedback using the rubric below: strengths, omissions, one priority improvement, then an opportunity to retry. Distinguish observed reasoning from missing information. Do not fabricate a numerical grade or mastery. Specific emergency treatments or correction rates require explicitly loaded evidence; otherwise identify the gap and discuss escalation without prescribing an unsupported protocol.
Stages: ${l.stages.map((s, i) => `${i + 1}. ${s}`).join(" | ")}
Opening case/question: ${l.opening}
Later simulated findings (withhold until appropriate): ${JSON.stringify(l.reveals || [])}
Source-backed facts: ${JSON.stringify(l.facts)}
Complete scoped regimen, if supplied: ${JSON.stringify(l.regimen || null)}
Known gaps: ${JSON.stringify(l.gaps)}. Keep this lesson available; do not invent missing doses, alternatives, monitoring intervals or diagnostic thresholds.
Feedback rubric: ${JSON.stringify(synthesisRubric)}
LOADED CURRICULUM SOURCES: ${JSON.stringify(linked)}
Current learning activity is original unscored teaching. Learner-selected Again/Hard/Good/Easy review scheduling is self-assessment only and must remain separate from reviewed question scores and ITE comparisons.\n`;
}

export type CurriculumReview = {
  lesson_id: string;
  rating: "again" | "hard" | "good" | "easy";
  at: string;
  due: string;
  interval: number;
};
export function scheduleCurriculumReview(
  id: unknown,
  rating: unknown,
  previous: unknown,
  now = Date.now(),
): CurriculumReview {
  lessonById(id);
  if (!["again", "hard", "good", "easy"].includes(rating as string))
    throw Error("Choose Again, Hard, Good or Easy");
  const old = Number.isFinite(previous)
    ? Math.min(60, Math.max(0, previous as number))
    : 0;
  const interval =
    rating === "again"
      ? 1
      : rating === "hard"
        ? 2
        : rating === "good"
          ? Math.max(3, Math.round(old * 2))
          : Math.max(7, Math.round(old * 3));
  return {
    lesson_id: id as string,
    rating: rating as CurriculumReview["rating"],
    at: new Date(now).toISOString(),
    due: new Date(now + Math.min(90, interval) * 86400000).toISOString(),
    interval: Math.min(90, interval),
  };
}
