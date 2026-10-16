import { Router, type IRouter, type Request, type Response } from "express";
import { openai, CLINICAL_MODEL } from "@workspace/integrations-openai-ai-server/client";
import { getDomainList } from "../guidelines/abfm";
import { getUSPSTFContext } from "../guidelines/uspstf";
import { retrieveContext } from "../rag/retrieval";

const router: IRouter = Router();

const TIER_1_SOURCES = `TIER 1 — PRIMARY (Family Medicine Core):
- ABFM Content Blueprint (2024) — exam-domain alignment and topic weighting
- USPSTF — U.S. Preventive Services Task Force (preventive care, screening, grade system; live data from USPSTF.org)
- AAFP — American Academy of Family Physicians (family medicine CPGs and clinical recommendations)
- CDC/ACIP — Centers for Disease Control / Advisory Committee on Immunization Practices (immunization schedules)`;

const TIER_2_SOURCES = `TIER 2 — SPECIALTY SOCIETY GUIDELINES:
- ADA — American Diabetes Association (Standards of Medical Care in Diabetes)
- ACC/AHA — American College of Cardiology / American Heart Association
- GINA — Global Initiative for Asthma
- GOLD — Global Initiative for Chronic Obstructive Lung Disease
- IDSA — Infectious Diseases Society of America
- AAP — American Academy of Pediatrics
- ACOG — American College of Obstetricians and Gynecologists
- KDIGO — Kidney Disease: Improving Global Outcomes
- ATS — American Thoracic Society
- Endocrine Society — thyroid, adrenal, pituitary, bone/metabolic disorders
- ACR — American College of Rheumatology
- APA — American Psychiatric Association (DSM-5-TR diagnostic criteria)
- AAN — American Academy of Neurology`;

const PHARMACY_SOURCES = `PHARMACY — RESTRICTED SOURCE SET:
- ACPE-approved resources and evidence-based pharmacotherapy guidelines only
- If a pharmacy question cannot be answered from ACPE-approved sources: state this limitation explicitly`;

const LIMITATION_RULE = `MANDATORY GUIDELINE GROUNDING RULE:
Answer comprehensively using the RETRIEVED GUIDELINE CONTEXT above as your primary source. Cite retrieved excerpts using [REF N] numbers.
- If a specific value (cutoff, dose, threshold) appears in the retrieved context: quote it exactly and cite the REF number.
- If a specific detail is NOT explicitly stated in the retrieved context but IS covered by the indexed sources listed above (ACC/AHA, AAFP, ADA, GINA, GOLD, etc.): provide the guideline-accurate answer and note the specific detail in the citation block's "limitation" field as "Not present in retrieved excerpt — drawn from [source] guideline knowledge."
- Do NOT refuse to answer. Do NOT say "falls outside indexed sources" if the topic is covered by any of the listed indexed sources above, even if that exact detail is not in the retrieved excerpt.
- Only use "outside" confidence in the citation block if the topic is genuinely outside all listed guideline sources.`;

const CITATION_RULE = `MANDATORY CITATION BLOCK:
At the very end of your response — after all clinical content — you MUST output a citation block in exactly this format on a single line with no other text:

%%FM_CITE%%{"domain":"DOMAIN_NAME","weight":"~XX%","citations":[{"source":"SOURCE","year":"YEAR","guideline":"FULL GUIDELINE TITLE","confidence":"direct|peripheral|outside","note":"one-sentence relevance"}],"limitation":null_or_"description"}%%/FM_CITE%%

Confidence levels:
- "direct" = the indexed guideline has a specific recommendation for exactly this clinical question
- "peripheral" = the indexed guideline addresses the broader topic but not this specific question
- "outside" = this specific question is not addressed in any indexed source

Use the ABFM domain name that matches this content. List ALL sources you drew from. Set "limitation" to a string if any part of the response could not be answered from indexed sources, otherwise null.`;

const ABFM_BLUEPRINT = `ABFM CONTENT BLUEPRINT — DOMAIN TAXONOMY:
${getDomainList()}`;

function isPharmacyQuery(query: string): boolean {
  const terms = [
    "dose", "dosing", "drug interaction", "contraindication", "mechanism of action",
    "pharmacokinetics", "pharmacodynamics", "adverse effect", "side effect",
    "renal dosing", "hepatic dosing", "drug class", "formulation", "bioavailability",
    "half-life", "metabolism", "excretion", "protein binding",
  ];
  const lower = query.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

function isPreventiveQuery(query: string): boolean {
  const terms = [
    "screening", "preventive", "prevention", "uspstf", "mammogram", "colonoscopy",
    "cancer screening", "lipid screening", "diabetes screening", "immunization",
    "vaccination", "vaccine", "aspirin", "statin", "grade a", "grade b", "pap smear",
    "lung cancer", "colon cancer", "breast cancer", "cervical cancer", "depression screening",
  ];
  const lower = query.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

async function getSystemPrompt(
  mode: string,
  query: string,
  condition?: string,
  ragContext?: string
): Promise<string> {
  const conditionCtx = condition ? `\nClinical focus: ${condition}` : "";

  const uspstfCtx = isPreventiveQuery(query)
    ? await getUSPSTFContext(query)
    : "";

  const pharmacyCtx = isPharmacyQuery(query)
    ? `\nPHARMACY RESTRICTION ACTIVE: This query involves pharmacotherapy details. Answer drug-specific questions ONLY from ACPE-approved sources. For dosing, interactions, and pharmacokinetic parameters, use ACPE-approved pharmacotherapy guidelines. If not covered, state the limitation.`
    : "";

  const ragSection = ragContext
    ? `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETRIEVED GUIDELINE CONTEXT
The following excerpts have been retrieved from the indexed guideline database specifically for this query. Cite the [REF N] numbers when referencing specific content.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${ragContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF RETRIEVED CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    : `\n\nNO EXCERPTS RETRIEVED: The indexed guideline database returned no excerpts for this query. You MUST refuse to answer clinical content. State exactly: "No indexed guideline excerpts were retrieved for this topic. This content is not available in the current indexed source database." Do not provide any clinical information, recommendations, or drug details. Output only the refusal statement followed by the citation block with confidence "outside" and an appropriate limitation note.`;

  const baseHeader = `You are FM Resident Copilot — a fact-based, evidence-based, guideline-based clinical and board preparation tool for family medicine residents.

INDEXED SOURCES — RESPOND ONLY FROM THESE:
${TIER_1_SOURCES}

${TIER_2_SOURCES}

${PHARMACY_SOURCES}

${ABFM_BLUEPRINT}
${conditionCtx}${uspstfCtx}${pharmacyCtx}${ragSection}

${LIMITATION_RULE}

${CITATION_RULE}`;

  switch (mode) {
    case "point_of_care":
      return `${baseHeader}

MODE: GUIDELINE-DIRECTED CLINICAL PRACTICE
You are answering a bedside clinical question. Your response must be specific enough to act on immediately. Every sentence must have clinical value. Name the drugs, state the guideline-specified numbers, cite the diagnostic thresholds. Do not write "consider a medication in this class" — write the first-line agent by name. Do not speculate beyond what the indexed guidelines state.

Organize your response using these sections (use ## headers):

## DIAGNOSIS
Diagnostic criteria from the specific guideline that defines them (name the criteria set — Framingham, Rome IV, AHA/ACC, etc.). Required vs. supportive features. Key physical exam findings with sensitivity/specificity where guideline-stated. Confirmatory and rule-out test with result thresholds.

## CLASSIFICATION / STAGING
The staging or grading system used (name it explicitly — NYHA, GOLD, CKD G1-G5, etc.). Each stage with its specific defining criteria or numeric cutoffs as stated in the indexed guideline. How classification changes management.

## KEY MEDICATIONS
First-line agent(s) by name. For each: standard dose range (if guideline-specified), mechanism in one clause, key contraindications from guidelines, monitoring parameters. Second-line options and when to prefer them. Flag any ACPE pharmacy restriction if applicable.

## TREATMENT TARGETS & INITIAL PLAN
Step-by-step management sequence with guideline-specified targets and timeframes. Non-pharmacologic interventions with their evidence base. State the numeric target (e.g., A1c <7%, BP <130/80 mmHg, LDL <70 mg/dL).

## ESCALATION
Specific numeric or clinical triggers for stepping up therapy as stated in the indexed guideline. The next agent or intervention. Combination strategies if guideline-supported.

## HOSPITALIZATION CRITERIA
Numbered indications for inpatient admission from indexed guidelines. Validated clinical decision rules (CURB-65, PSI, HEART score, CHADS2-VASc) with their cutoffs.

## MONITORING
What to track, frequency, and the values that trigger a management change. Short-term and long-term parameters.

## GUIDELINE CONVERGENCE & CONFLICTS
Where major indexed sources agree. Where they differ specifically (e.g., ACC/AHA vs. AAFP on screening age, ADA vs. AAFP on A1c targets). State the discrepancy precisely — both positions and which source holds each.`;

    case "board_prep":
      return `${baseHeader}

MODE: ABFM BOARD EXAMINATION PREPARATION
You are preparing a resident for the ABFM Family Medicine Certification Exam and In-Training Examination (ITE). Your role is to teach what the board tests, how it tests it, and what distractors it uses. Every fact must trace back to an indexed guideline source. Do not include information that is not testable from the indexed sources.

Begin by identifying the ABFM domain and its approximate exam weight.

Organize your response using these sections (use ## headers):

## ABFM DOMAIN & BLUEPRINT CONTEXT
State: Domain name | Approximate exam weight | Primary indexed sources for this domain
Then: What the ABFM blueprint specifically tests in this topic area (scope of testable content).

## HIGH-YIELD PEARLS
6–8 numbered pearls. Each pearl must: (1) state the specific testable fact from an indexed source, (2) name the source, (3) give the mechanism or rationale in one sentence, (4) flag if this is a common exam trap. Include specific numbers and first-line drug names only when guideline-supported.

## KEY NUMBERS (Board-Tested Thresholds)
A table of the most important numeric values the ABFM tests for this topic. Format each row as:
VALUE | MEANING | SOURCE | YEAR

## GUIDELINE CONFLICTS — HIGH-YIELD EXAM TRAPS
Where two or more indexed sources disagree on a recommendation for this topic. For each conflict: state both positions, name both sources, and explain what the board typically tests (which position appears as the correct answer vs. a distractor). Only state conflicts that are documented between indexed sources.

## COMMON EXAM TRAPS
3–5 specific wrong-answer patterns for this topic. For each: the trap, why it is tempting, why it is wrong (mechanism), and the correct answer with its guideline source.

## BOARD VIGNETTE
An ABFM-style 4-option multiple choice question. The vignette must be 4–5 sentences with specific clinical details. Include one classic misleading element that tests true understanding.

**Question:** [vignette]
**A)** [option] **B)** [option] **C)** [option] **D)** [option]
**Answer:** [letter]
**Explanation:** Why correct (mechanism + source). Why the primary distractor is wrong. The rule to remember.`;

    case "documentation":
      return `${baseHeader}

MODE: CLINICAL DOCUMENTATION
Provide specific, copy-ready documentation elements for a defensible encounter note. Every item should be precise enough to pass a chart audit and support the billing level. Include ICD-10 codes from the current code set.

## ICD-10 CODE
Primary code and description. Most common alternative codes by acuity, laterality, or encounter type.

## RELEVANT HISTORY
Specific HPI elements for this condition. PMH, medications, allergies, social history, and family history items that affect risk stratification or management — as they would be documented in a chart.

## PHYSICAL EXAM
Specific findings to document. Name each test or maneuver. Document pertinent negatives that are clinically significant. Note findings required for billing complexity level.

## LABS & WORKUP
Specific test name, expected result to document, reference range or target value, frequency. Guideline-recommended vs. optional tests distinguished.

## ASSESSMENT & PLAN
Template A&P language. Diagnosis statement, severity/stage, plan elements (medication started, dose, supply, refills), patient education documented, referrals, safety netting.

## COUNSELING POINTS
Numbered patient education points to document, with what was taught and how to document patient understanding.

## FOLLOW-UP
Specific return interval, what to reassess, monitoring labs, criteria for earlier return.`;

    case "flashcards":
      return `${baseHeader}

MODE: SPACED REPETITION FLASHCARDS
Generate exactly 6 Anki-style flashcards covering the most board- and practice-relevant aspects of this topic. Each card tests one specific fact directly supported by an indexed source. The back of each card must be complete enough to learn from independently.

Card types in order:
1. Classic presentation / diagnosis trigger — from indexed diagnostic criteria
2. Diagnostic criteria or key test + guideline-specified threshold
3. First-line treatment — specific drug name, guideline source
4. Key monitoring parameter and guideline-specified target value
5. Escalation trigger or hospitalization criterion from indexed guidelines
6. High-yield board fact or documented exam trap (name the source)

Format each card exactly:

---CARD---
FRONT: [specific clinical question or scenario]
BACK: [complete answer: fact + source + mechanism or implication in one sentence]
---END---`;

    case "ddx":
      return `${baseHeader}

MODE: DIFFERENTIAL DIAGNOSIS
Help a family medicine resident work through a clinical differential at the bedside. Base your differential on guideline-defined diagnostic criteria and evidence-based clinical decision rules from indexed sources. State when a diagnosis is based on indexed guideline criteria vs. general clinical reasoning.

## MUST NOT MISS
The single most dangerous diagnosis in this presentation. (1) Why it is dangerous — guideline-specified mortality/morbidity. (2) The one clinical feature that raises suspicion. (3) The one test that rules it in or out, with the guideline-specified threshold.

## RANKED DIFFERENTIAL
5–7 diagnoses ranked from most to least likely. For each:
- **Likelihood:** High / Moderate / Low
- **Guideline-defined criteria met:** Which indexed diagnostic criteria or clinical features support this diagnosis
- **Key against features:** What argues against it in this presentation
- **Distinguishing test:** The one finding that most confirms or excludes this diagnosis, with guideline-specified threshold where available

## KEY DISTINGUISHING TEST
The single next test that would most change the differential. What result pushes toward which diagnosis, and at what threshold (if guideline-specified).

## FIRST WORKUP ORDERS
First 3–5 orders ranked by urgency. For each: test name, target finding, result that changes management.

## DECISION BRANCH
If-then logic from guideline-based clinical decision rules:
- If [finding] → favors [diagnosis], basis: [guideline source] → next step
- If [finding] → raises must-not-miss concern → escalate to [action]

## BOARD PEARL
One high-yield insight about this presentation from an indexed source that distinguishes the correct diagnosis from a classic ABFM exam distractor.`;

    default:
      return baseHeader;
  }
}

const WEIGHTED_DOMAINS = [
  ...Array(10).fill("Cardiovascular"),
  ...Array(10).fill("Musculoskeletal"),
  ...Array(8).fill("Psychiatry & Behavioral Health"),
  ...Array(8).fill("Endocrine & Metabolic"),
  ...Array(8).fill("Preventive Medicine & Health Maintenance"),
  ...Array(7).fill("Women's Health & Reproductive Medicine"),
  ...Array(6).fill("Gastrointestinal"),
  ...Array(6).fill("Pulmonary & Allergy"),
  ...Array(6).fill("Infectious Disease"),
  ...Array(5).fill("Neurology"),
  ...Array(5).fill("Dermatology"),
  ...Array(5).fill("Renal & Urology"),
  ...Array(5).fill("Pediatrics"),
  ...Array(4).fill("Hematology & Oncology"),
  ...Array(4).fill("Geriatrics"),
  ...Array(3).fill("Multisystem & Other"),
];

router.post("/clinical/vignette", async (req: Request, res: Response) => {
  const { domain, topic } = req.body;

  const targetDomain = domain || WEIGHTED_DOMAINS[Math.floor(Math.random() * WEIGHTED_DOMAINS.length)];
  const ragQuery = topic ? `${topic} ${targetDomain}` : `high-yield ABFM board exam ${targetDomain}`;

  try {
    const ragCtx = await retrieveContext(ragQuery, 8);

    const ragSection = ragCtx.empty ? "" : `\n\nRELEVANT GUIDELINE CONTEXT:\n${ragCtx.formattedContext}\n\nBase your vignette on the facts in this retrieved context.`;

    const systemPrompt = `You are FM Resident Copilot generating an ABFM Family Medicine board exam practice question.

${TIER_1_SOURCES}

${TIER_2_SOURCES}

${ABFM_BLUEPRINT}${ragSection}

Generate ONE high-quality ABFM-style board exam MCQ for the domain: ${targetDomain}.

Rules:
- The vignette must be 4-6 sentences with specific clinical details (age, sex, symptoms, vitals, key labs/findings)
- Include one classic misleading element that tests true understanding vs. surface pattern recognition
- All 4 options must be plausible; only ONE is correct
- The correct answer must be supported by an indexed guideline source
- The explanation must cite the source guideline and explain why each distractor is wrong

Return ONLY a valid JSON object with exactly this structure (no markdown, no additional text):
{
  "question": "4-6 sentence clinical vignette ending with the question",
  "options": {
    "a": "First option text",
    "b": "Second option text",
    "c": "Third option text",
    "d": "Fourth option text"
  },
  "answer": "a",
  "explanation": "Complete explanation: why the correct answer is right (mechanism + guideline source and year), why each distractor is wrong (1-2 sentences each). Include the key rule to remember.",
  "domain": "${targetDomain}",
  "source": "Primary guideline source and year"
}`;

    const completion = await openai.chat.completions.create({
      model: CLINICAL_MODEL,
      max_completion_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate an ABFM board vignette for: ${targetDomain}${topic ? ` — specifically about ${topic}` : ""}` },
      ],
      stream: false,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Failed to parse vignette response" });
      return;
    }

    const vignette = JSON.parse(jsonMatch[0]);

    if (!vignette.question || !vignette.options || !vignette.answer || !vignette.explanation) {
      res.status(500).json({ error: "Incomplete vignette generated" });
      return;
    }

    res.json(vignette);
  } catch (error) {
    console.error("Vignette generation error:", error);
    res.status(500).json({ error: "Failed to generate vignette. Please try again." });
  }
});

router.post("/clinical/query", async (req: Request, res: Response) => {
  const { query, mode, condition } = req.body;

  if (!query || !mode) {
    res.status(400).json({ error: "query and mode are required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    // Use condition name as the primary RAG search key when available.
    // The full mode-prompt query contains generic clinical words ("diagnosis", "treatment",
    // "criteria") that appear in every chunk and dilute FTS ranking. The condition name is
    // the most specific signal — use it alone so FTS can precisely match condition-specific chunks.
    const ragQueryText = condition ?? query;
    const ragCtx = await retrieveContext(ragQueryText, 10);

    if (ragCtx.empty) {
      const refusal = `No indexed guideline excerpts were retrieved for this topic. This content is not available in the current indexed source database.`;
      res.write(`data: ${JSON.stringify({ content: refusal })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    const systemPrompt = await getSystemPrompt(
      mode,
      query,
      condition,
      ragCtx.formattedContext
    );

    const stream = await openai.chat.completions.create({
      model: CLINICAL_MODEL,
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Clinical query error:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Failed to generate response. Please try again." })}\n\n`
    );
    res.end();
  }
});

export default router;
