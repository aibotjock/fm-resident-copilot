import { Router, type IRouter, type Request, type Response } from "express";
import { openai, CLINICAL_MODEL } from "@workspace/integrations-openai-ai-server/client";
import { ABFM_DOMAINS } from "../guidelines/abfm";
import {
  buildAnswerPrompt,
  buildGroundedCitationBlock,
  buildVignettePrompt,
  CitationStreamFilter,
  noEvidenceAnswer,
} from "../guidelines/answer-contract";
import { retrieveContext } from "../rag/retrieval";

const router: IRouter = Router();
const STUDY_DOMAINS = ABFM_DOMAINS.map((domain) => domain.name);
const STUDY_TAXONOMY = STUDY_DOMAINS.map((name) => `- ${name}`).join("\n");
const CLINICAL_MODES = new Set(["point_of_care", "board_prep", "documentation", "flashcards", "ddx"]);

router.post("/clinical/vignette", async (req: Request, res: Response) => {
  const { domain, topic } = req.body;
  if ((domain !== undefined && (typeof domain !== "string" || !STUDY_DOMAINS.includes(domain))) ||
      (topic !== undefined && typeof topic !== "string")) {
    res.status(400).json({ error: "domain must be a supported study domain and topic must be text" });
    return;
  }

  const targetDomain = domain || STUDY_DOMAINS[Math.floor(Math.random() * STUDY_DOMAINS.length)];
  const ragQuery = topic ? `${topic} ${targetDomain}` : `high-yield ABFM board exam ${targetDomain}`;

  try {
    const ragCtx = await retrieveContext(ragQuery, 8);

    if (ragCtx.empty) {
      res.status(422).json({
        error: "No verified guideline excerpts are available to generate a supported practice question for this topic.",
        code: "insufficient_evidence",
      });
      return;
    }

    const systemPrompt = buildVignettePrompt({
      domain: targetDomain,
      studyDomains: STUDY_TAXONOMY,
      context: ragCtx.formattedContext,
    });

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

    if (vignette.error === "insufficient_evidence") {
      res.status(422).json({
        error: "The supplied excerpts do not support an unambiguous question and distractor explanations for this topic.",
        code: "insufficient_evidence",
      });
      return;
    }

    if (typeof vignette.question !== "string" || !vignette.options ||
        !["a", "b", "c", "d"].every((key) => typeof vignette.options[key] === "string" && vignette.options[key].trim()) ||
        !["a", "b", "c", "d"].includes(vignette.answer) ||
        typeof vignette.explanation !== "string" || typeof vignette.source !== "string") {
      res.status(500).json({ error: "Incomplete vignette generated" });
      return;
    }

    const usedReferences = [...new Set(
      [...vignette.explanation.matchAll(/\[REF\s+(\d+)\]/g)]
        .map((match) => Number(match[1])),
    )];
    if (usedReferences.length === 0 || usedReferences.some((number) => number < 1 || number > ragCtx.chunks.length)) {
      res.status(422).json({ error: "The generated question did not cite valid supplied evidence.", code: "insufficient_evidence" });
      return;
    }
    // Do not pass model-authored source identities or exam-domain claims to the client.
    vignette.domain = targetDomain;
    vignette.source = usedReferences.map((number) => {
      const reference = ragCtx.chunks[number - 1];
      return `${reference.source} — ${reference.guideline_title} (${reference.guideline_year}) [REF ${number}]`;
    }).join("; ");

    res.json(vignette);
  } catch (error) {
    console.error("Vignette generation error:", error);
    res.status(500).json({ error: "Failed to generate vignette. Please try again." });
  }
});

router.post("/clinical/query", async (req: Request, res: Response) => {
  const { query, mode, condition } = req.body;

  if (typeof query !== "string" || !query.trim() ||
      typeof mode !== "string" || !CLINICAL_MODES.has(mode) ||
      (condition !== undefined && typeof condition !== "string")) {
    res.status(400).json({ error: "A text query, supported mode, and optional text condition are required" });
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
      const refusal = noEvidenceAnswer();
      res.write(`data: ${JSON.stringify({ content: refusal })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    const systemPrompt = buildAnswerPrompt({
      mode,
      studyDomains: STUDY_TAXONOMY,
      condition,
      context: ragCtx.formattedContext,
    });

    const stream = await openai.chat.completions.create({
      model: CLINICAL_MODEL,
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      stream: true,
    });

    const citationFilter = new CitationStreamFilter();
    let generatedText = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        generatedText += content;
        const visible = citationFilter.push(content);
        if (visible) res.write(`data: ${JSON.stringify({ content: visible })}\n\n`);
      }
    }

    const remaining = citationFilter.finish();
    if (remaining) res.write(`data: ${JSON.stringify({ content: remaining })}\n\n`);
    res.write(`data: ${JSON.stringify({ content: buildGroundedCitationBlock(generatedText, ragCtx.chunks, STUDY_DOMAINS) })}\n\n`);
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
