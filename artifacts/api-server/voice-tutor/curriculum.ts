import content from "./curriculum.json";
import expansion from "./expanded-curriculum.json";
import antibiotics from "./antibiotic-expansion.json";
import inventory from "./medication-inventory.json";
import { navigationTerms, matchesNavigation } from "./navigation";

export type Track =
  | "medication"
  | "safety"
  | "advanced"
  | "criteria"
  | "condition";
export type MedicationSafety =
  (typeof content.medication_safety_profiles)[number];
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
  medication_safety?: MedicationSafety[];
  topic_ids?: string[];
  medication_names?: string[];
  search_terms?: string;
  criteria_ids?: string[];
  study_scope?: "rule_summary" | "purpose_and_interpretation";
  practice_cases?: {
    id: string;
    presentation: string;
    components: {
      eye: number | string;
      verbal: number | string;
      motor: number | string;
    };
    total: number | null;
    explanation: string;
  }[];
};
export const curriculumVersion = antibiotics.version;
export const medicationSafetyProfiles = [
  ...content.medication_safety_profiles,
  ...antibiotics.medication_safety_profiles,
];
export const antibioticPathways = antibiotics.pathways;
export const antibioticRelevance = antibiotics.relevance;
export const lessons = (
  [...content.lessons, ...expansion.lessons, ...antibiotics.lessons] as Lesson[]
).map((lesson) => {
  const medication_safety = medicationSafetyProfiles.filter((p) =>
    lesson.regimen
      ? lesson.medication_names?.includes(p.drug)
      : lesson.track === "safety" &&
        p.source_ids.some((id) => lesson.source_ids.includes(id)),
  );
  return {
    ...lesson,
    search_terms: navigationTerms(
      [
        lesson.title,
        ...lesson.tags,
        lesson.regimen?.indication || "",
        lesson.id === "abx-cap-severe"
          ? "inpatient pneumonia severe CAP ICU"
          : "",
      ].join(" "),
    ),
    medication_safety,
    source_ids: [
      ...new Set([
        ...lesson.source_ids,
        ...medication_safety.flatMap((p) => p.source_ids),
      ]),
    ],
  };
});
export function searchCurriculum(query: unknown) {
  if (typeof query !== "string" || query.length > 200)
    throw new Error("Search with at most 200 characters");
  const matches = lessons.filter((l) =>
    matchesNavigation(l.search_terms, query),
  );
  return {
    lessons: matches.map(({ id, title, track, tags, search_terms }) => ({
      id,
      title,
      track,
      tags,
      search_terms,
    })),
    total: matches.length,
  };
}
export const referenceRegistry = content.references;
export const clinicalSources = [
  ...content.sources,
  ...expansion.sources,
  ...antibiotics.sources,
];
export const medicationSafetyFlow = `MEDICATION SAFETY PRACTICE: Apply to every medication-containing guided lesson, antibiotic or otherwise. Ask ONE decision at a time: usual full regimen; absolute contraindications; renal function measure and dose/interval decision; liver severity and dose adjustment versus avoid-use/precaution; relevant interactions and monitoring. Elicit the learner's answer BEFORE explaining; revisit one supported decision with changed simulated patient factors. Never recite the answer before asking. Do not interrupt an active assessment or turn this into scored practice.
Use only explicitly loaded evidence for each drug, formulation, population and indication. Missing guidance is NOT no adjustment needed. Distinguish contraindicated, not recommended/avoid, caution/monitor, no adjustment needed, and not established. Never infer a Child-Pugh reduction, equate CrCl with indexed eGFR, apply adult renal tables to small children, transfer AF apixaban criteria to VTE, or extrapolate to dialysis. These profiles are selective teaching, not exhaustive contraindication/interaction screening. No supported profile: identify the exact gap, continue supported teaching and offer the existing scoped lookup; never fill it from memory.
Retain exact source ID, URL, section, source date when known and access date. Give exact provenance on request; do not routinely read citations aloud. Keep citation IDs in the written transcript. Access date is not guideline publication date and does not prove latest evidence or approval. Never claim AAFP/ABFM endorsement without documented evidence. Disease guidance determines indication-specific antibiotic selection/duration; product labeling supplies scoped safety. If sources disagree, identify the conflict and their scopes, never silently blend regimens. Historical label STI doses must not override the loaded CDC regimen. Commercial sources are not connected.`;

export function matchingMedicationSafety(text: string) {
  // Match longer combination names first, so amoxicillin-clavulanate does
  // not load the amoxicillin-alone profile for the same text occurrence.
  // Canonicalize route-before-drug wording without borrowing the oral profile.
  let remaining = text.replace(
    /\b(?:IV|intravenous)\s+(vancomycin|clindamycin|metronidazole)\b/gi,
    (_, drug: string) => `${drug} IV`,
  );
  const matched = new Set<string>();
  for (const p of [...medicationSafetyProfiles].sort(
    (a, b) => b.drug.length - a.drug.length,
  )) {
    if (
      p.drug === "vancomycin" &&
      !/\boral\s+vancomycin\b|\bvancomycin\s+(?:oral|PO)\b|difficile|\bCDI\b/i.test(
        text,
      )
    )
      continue;
    const pattern = new RegExp(
      `\\b${p.drug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi",
    );
    if (pattern.test(remaining)) {
      matched.add(p.drug);
      remaining = remaining.replace(pattern, " ");
    }
  }
  return medicationSafetyProfiles.filter((p) => matched.has(p.drug));
}

export function regimensForTopics(ids: string[]) {
  return lessons.filter(
    (l) =>
      l.track === "medication" && l.topic_ids?.some((id) => ids.includes(id)),
  );
}

export function regimenInstructions(ids: string[]) {
  const selected = regimensForTopics(ids);
  const pathways = antibioticPathways.filter((p) => ids.includes(p.topic_id));
  if (!selected.length && !pathways.length) return "";
  const selectedDrugs = new Set(
    selected.flatMap((l) => l.medication_names || []),
  );
  const safety = medicationSafetyProfiles.filter((p) =>
    selectedDrugs.has(p.drug),
  );
  const sourceIds = new Set([
    ...selected.flatMap((l) => l.source_ids),
    ...pathways.flatMap((p) => p.source_ids),
  ]);
  return `\nCONDITION-LINKED STORED REGIMENS: These scoped medication lessons are additional loaded evidence for this condition. Select only a regimen whose indication, population, severity, formulation and source scope match the simulated case. Alternatives are conditional choices, not a universal first/second/third-line ladder. Ask ONE prescribing or safety question, wait for the learner, then explain. Never mix separate courses or present all regimens as interchangeable. Explicitly retain historical/institutional snapshots, source conflicts and evidence gaps. A drug-name mention alone does not load any additional regimen. When a medication lesson and the base topic conflict on the same explicitly sourced claim, explain the discrepancy and use the scoped source-backed regimen; do not blend them.\n${JSON.stringify(selected.map(({ id, title, source_ids, regimen, facts, gaps, medication_names }) => ({ id, title, source_ids, regimen, facts, gaps, medication_names })))}\nLOADED REGIMEN SAFETY PROFILES (apply each component once): ${JSON.stringify(safety)}\nCONDITION ANTIBIOTIC DECISIONS AND UNRESOLVED SCENARIOS: ${JSON.stringify(pathways)}. Pending scenarios are NOT established regimens. Never claim this condition is completely covered.\nLOADED REGIMEN SOURCES: ${JSON.stringify(clinicalSources.filter((s) => sourceIds.has(s.id)))}\n`;
}

export function medicationSafetyInstructions(text: string) {
  const profiles = matchingMedicationSafety(text);
  const ids = new Set(profiles.flatMap((p) => p.source_ids));
  return `\n${medicationSafetyFlow}\nADDITIONAL LOADED MEDICATION SAFETY EVIDENCE (only the following drug profiles are medical evidence; cite [MED source_id]): ${JSON.stringify(profiles)}\nLOADED MEDICATION SAFETY SOURCES: ${JSON.stringify(clinicalSources.filter((s) => ids.has(s.id)))}\n`;
}
export function criteriaForTopics(ids: string[]) {
  return lessons.filter(
    (l) =>
      l.track === "criteria" && l.topic_ids?.some((id) => ids.includes(id)),
  );
}
export function criteriaInstructions(ids: string[], explicit: string[] = []) {
  const selected = lessons.filter(
    (l) =>
      l.track === "criteria" &&
      (explicit.includes(l.id) || l.topic_ids?.some((id) => ids.includes(id))),
  );
  if (!selected.length) return "";
  const sourceIds = new Set(
    selected.filter((l) => l.facts.length).flatMap((l) => l.source_ids),
  );
  return `\nCONDITION-SPECIFIC CRITERIA: Integrate a relevant supported rule at the diagnostic, testing, severity, treatment or disposition stage of this same condition lesson. Ask whether it applies, then elicit the inputs/interpretation BEFORE explaining. One question at a time; do not change topics or force every listed rule into every case. These are original unscored exercises. Separate screening, diagnosis, prognosis, classification and treatment criteria. Eligibility and exclusions come before calculation. A positive imaging rule is not a fracture diagnosis. An absent input or incomplete rule is not a negative result. Never calculate a missing score from memory or invent accuracy/exam-frequency claims. Source dates are not proof of current endorsement. Entries with no facts are discovery metadata ONLY and must be described as source verification pending. Do not teach those rule details unless separate explicitly loaded evidence supports them. Cite [MED source_id] for the following scoped facts; exact links/sections available on request.\n${JSON.stringify(selected.map((l) => ({ id: l.id, title: l.title, study_scope: l.study_scope, facts: l.facts, gaps: l.gaps, source_ids: l.facts.length ? l.source_ids : [] })))}\nLOADED CRITERIA SOURCES: ${JSON.stringify(clinicalSources.filter((s) => sourceIds.has(s.id)))}\n`;
}
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
    antibioticPathways,
    supplementalAntibioticCoverage: antibioticPathways
      .filter((p) => p.topic_id.startsWith("condition-"))
      .map((p) => ({
        topic_id: p.topic_id,
        title: p.title,
        antimicrobial_signal: true,
        lesson_ids: regimensForTopics([p.topic_id]).map((l) => l.id),
        pending_scenarios: p.pending_scenarios,
        scope:
          "Supplemental condition: source-scoped teaching; all-scenario verification pending.",
      })),
    antibioticCoverageReview: antibiotics.review,
    medicationInventoryCount: new Set([
      ...content.medication_safety_profiles.map((p) => p.drug),
      ...antibiotics.medication_safety_profiles.map((p) => p.drug),
      ...inventory.map((m) => m.name),
    ]).size,
    medicationSafetyProfileCount: medicationSafetyProfiles.length,
    medicationRegimenCount: lessons.filter((l) => l.track === "medication")
      .length,
    antibioticRegimenCount: lessons.filter(
      (l) => l.track === "medication" && l.tags.includes("antibiotic"),
    ).length,
    antibioticDrugCount: new Set(
      lessons
        .filter(
          (l) => l.track === "medication" && l.tags.includes("antibiotic"),
        )
        .flatMap((l) => l.medication_names || [])
        .filter(
          (name) => !["omeprazole", "bismuth subsalicylate"].includes(name),
        ),
    ).size,
    criteria: lessons
      .filter((l) => l.track === "criteria")
      .map((l) => ({
        id: l.id,
        title: l.title,
        topic_ids: l.topic_ids,
        study_scope: l.study_scope,
        status: l.facts.length
          ? "scoped_facts_available"
          : "source_verification_pending",
      })),
    notice:
      "Educational snapshots and source-directed study; check each entry's scope and evidence gaps. An overview or rule summary is not a complete validated calculator. Independent clinician/pharmacist review pending; generated teaching and self-ratings are unscored.",
    gaps: content.gaps
      .filter((g) => !g.startsWith("Medication safety covers"))
      .concat(
        "Medication safety is selective and formulation-specific. See condition pathway pending scenarios; no complete all-drug safety checker or endorsement is claimed.",
      ),
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
${medicationSafetyFlow}
Scoped medication safety evidence: ${JSON.stringify(l.medication_safety || [])}
RECOGNITION AND SCORING EXERCISES: ${JSON.stringify(l.practice_cases || [])}. These are simulated case premises, not clinical evidence. Choose one case, present only its presentation and ask for ONE component at a time, then the total if all components are testable. Keep components, total and explanation hidden until the learner attempts the answer. Explain a mismatch with the loaded source, offer a retry with another case, and keep this recognition practice unscored and outside exam statistics. Never score a not-testable response as 1 or invent a total when total is null.
CRITERIA TRACK: Study scope for this entry: ${l.study_scope || "scoped summary"}. A purpose_and_interpretation entry has no complete calculation table: teach purpose/eligibility and interpret a supplied verified result only. Never ask the learner to calculate missing points or reconstruct missing diagnostic checklists. Use the loaded rule facts only. First establish purpose, population and exclusions, then ask for inputs/thresholds, interpretation and a supported next step. Revisit with changed simulated values. A partial summary is not a complete validated calculator. Enforce each entry study_scope: purpose_and_interpretation means no full calculation inputs are loaded; use supplied verified results or classified findings only. If facts are empty, explain that this is a discovery entry with verification pending; do not invent the missing rule. Offer available sourced criteria or the listed source link.
ADDITIONAL CONDITION TRACK: Use the original guided case stages within this condition, using only these scoped facts and linked criteria; do not teach unrelated currently selected base-topic evidence as if it described this condition. Missing dosing or workup steps remain gaps.
${l.track === "condition" ? criteriaInstructions([], l.criteria_ids) + regimenInstructions([l.id]) : ""}
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
