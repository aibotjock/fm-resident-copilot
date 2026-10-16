import { Router, type IRouter, type Request, type Response } from "express";
import {
  openai,
  CLINICAL_MODEL,
} from "@workspace/integrations-openai-ai-server/client";
import { ABFM_DOMAINS } from "../guidelines/abfm";
import { noEvidenceAnswer } from "../guidelines/answer-contract";
import {
  buildExtractionPrompt,
  renderExtractiveAnswer,
} from "../guidelines/extractive-answer";
import { retrieveContext } from "../rag/retrieval";

const router: IRouter = Router();
const STUDY_DOMAINS = ABFM_DOMAINS.map((domain) => domain.name);
const CLINICAL_MODES = new Set([
  "point_of_care",
  "board_prep",
  "documentation",
  "flashcards",
  "ddx",
]);

// Free-form generated vignettes cannot establish clinical validation or source entailment.
router.post("/clinical/vignette", (_req: Request, res: Response) => {
  res.status(422).json({
    error:
      "Clinically validated practice-question coverage is unavailable during source review.",
    code: "validated_questions_unavailable",
  });
});

router.post("/clinical/query", async (req: Request, res: Response) => {
  const { query, mode, condition } = req.body;
  if (
    typeof query !== "string" ||
    !query.trim() ||
    typeof mode !== "string" ||
    !CLINICAL_MODES.has(mode) ||
    (condition !== undefined && typeof condition !== "string")
  ) {
    res
      .status(400)
      .json({
        error:
          "A text query, supported mode, and optional text condition are required",
      });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const ragCtx = await retrieveContext(condition?.trim() || query, 10);
    if (ragCtx.empty) {
      res.write(`data: ${JSON.stringify({ content: noEvidenceAnswer() })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    // The model chooses source sentence indices only. Buffer and validate the
    // complete selector; no model-authored clinical text reaches the response.
    let rawPlan = "";
    try {
      const completion = await openai.chat.completions.create({
        model: CLINICAL_MODEL,
        max_completion_tokens: 2048,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildExtractionPrompt(ragCtx.chunks) },
          { role: "user", content: query },
        ],
        stream: false,
      });
      rawPlan = completion.choices[0]?.message?.content ?? "";
    } catch {
      // Failure falls back to unchanged checked summaries, never a free-form draft.
      console.error(
        "Clinical sentence selection unavailable; returning checked source view.",
      );
    }

    const content = renderExtractiveAnswer({
      mode,
      rawPlan,
      references: ragCtx.chunks,
      studyDomains: STUDY_DOMAINS,
    });
    res.write(`data: ${JSON.stringify({ content })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch {
    res.write(
      `data: ${JSON.stringify({ error: "Checked reference content is unavailable. Please try again." })}\n\n`,
    );
    res.end();
  }
});

export default router;
