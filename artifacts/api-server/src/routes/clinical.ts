import { Router, type IRouter, type Request, type Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const INDEXED_SOURCES = `
Indexed Guideline Sources:
- AAFP (American Academy of Family Physicians) — Tier 1
- USPSTF (US Preventive Services Task Force) — Tier 1  
- CDC/ACIP (Centers for Disease Control, Advisory Committee on Immunization Practices) — Tier 1
- ACC/AHA (American College of Cardiology / American Heart Association) — Tier 2
- ADA (American Diabetes Association) — Tier 2
- IDSA (Infectious Diseases Society of America) — Tier 2
- AAP (American Academy of Pediatrics) — Tier 2
- ACOG (American College of Obstetricians and Gynecologists) — Tier 2
- GINA (Global Initiative for Asthma) — Tier 2
- GOLD (Global Initiative for Chronic Obstructive Lung Disease) — Tier 2
- ATS (American Thoracic Society) — Tier 2
- KDIGO (Kidney Disease: Improving Global Outcomes) — Tier 2
- AAN (American Academy of Neurology) — Tier 2
`;

function getSystemPrompt(mode: string, condition?: string): string {
  const conditionContext = condition ? `\nCondition focus: ${condition}` : "";

  const baseInstructions = `You are a clinical knowledge assistant for family medicine residents. Provide evidence-based, concise clinical information.
${INDEXED_SOURCES}
${conditionContext}

SAFETY RULE: Never hallucinate specific drug doses, thresholds, or values not supported by indexed sources. If information is not supported by the indexed sources, state: "Insufficient support in indexed sources." 

Always include source citations at the end using this format:
SOURCES: [Source Name] (Tier 1 or Tier 2) — brief relevance note`;

  switch (mode) {
    case "point_of_care":
      return `${baseInstructions}

Format your response with these exact sections using markdown headers:

## DIAGNOSIS
Key diagnostic criteria and clinical features

## CLASSIFICATION
Staging, grading, or severity classification if applicable

## INITIAL TREATMENT
First-line management steps

## ESCALATION
When and how to step up therapy

## HOSPITALIZATION CRITERIA
Specific indications for inpatient admission

## BOARD PEARL
One high-yield clinical insight

## SOURCE OVERLAP
Areas of agreement/disagreement between major guidelines

Keep each section concise and scannable for point-of-care use.`;

    case "documentation":
      return `${baseInstructions}

Format your response with these exact sections:

## RELEVANT HISTORY
Key history elements to document (HPI, PMH, medications, allergies, social/family)

## PHYSICAL EXAM
Focused exam findings to document

## LABS & WORKUP
Relevant laboratory and diagnostic studies

## ASSESSMENT & PLAN
Documentation prompts for the A&P section

## COUNSELING POINTS
Patient education elements to document

## FOLLOW-UP
Return visit timing and monitoring parameters

Provide practical, copy-paste-friendly documentation prompts.`;

    case "board_prep":
      return `${baseInstructions}

Format your response with these exact sections:

## HIGH-YIELD PEARLS
3-5 must-know facts for ABFM boards

## COMMON TRAPS
Frequent exam mistakes and how to avoid them

## BOARD VIGNETTE
Write a realistic 4-option multiple choice question in this exact format:

**Question:** [clinical vignette 3-4 sentences]

**A)** [option]
**B)** [option]  
**C)** [option]
**D)** [option]

**Answer:** [letter]

**Explanation:** [2-3 sentence explanation of why the answer is correct and why distractors are wrong]

Make the vignette realistic and test clinical reasoning, not just recall.`;

    case "flashcards":
      return `${baseInstructions}

Generate exactly 5 Anki-style flashcards. Format each card exactly like this:

---CARD---
FRONT: [concise clinical question or prompt]
BACK: [complete answer with key details]
---END---

Topics to cover: key diagnosis criteria, treatment thresholds, common medications, classic presentations, and board-relevant facts.
Make cards concise but complete. Each back should be 1-3 sentences maximum.`;

    default:
      return baseInstructions;
  }
}

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
    const systemPrompt = getSystemPrompt(mode, condition);

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
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
      `data: ${JSON.stringify({ error: "Failed to generate clinical response" })}\n\n`
    );
    res.end();
  }
});

export default router;
