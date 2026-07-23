import { Router, type Request, type Response } from "express";
import { retrieveContext, formatContextForPrompt } from "../rag/retrieval.js";
import { getOpenAIForRequest } from "../lib/openai.js";

const router = Router();

const SYSTEM_PROMPTS: Record<string, string> = {
  point_of_care: `You are FM Resident Copilot, a fact-based clinical decision support tool for family medicine residents. You answer point-of-care questions using ONLY the guideline references provided below. If a question cannot be answered from the references, say so. Always cite your sources using [REF N] format. Be concise, clinically actionable, and evidence-based.`,
  documentation: `You are FM Resident Copilot assisting with clinical documentation. Help the resident write clear, accurate clinical notes based on guideline-concordant care. Use the references below. Always cite sources with [REF N].`,
  board_prep: `You are FM Resident Copilot in Board Prep mode. Help the resident study for the ABFM board exam. Explain clinical concepts using the guideline references below. Be thorough but focused. Always cite sources with [REF N]. Structure answers with key teaching points.`,
  flashcards: `You are FM Resident Copilot in Flashcard mode. Generate concise Q&A flashcard-style responses based on the guideline references below. Format: Question on one line, Answer below. Always cite sources with [REF N].`,
};

// POST /api/clinical/query — streaming SSE
router.post("/clinical/query", async (req: Request, res: Response) => {
  try {
    const { query, mode, condition } = req.body;
    if (!query || !mode) {
      res.status(400).json({ error: "query and mode are required" });
      return;
    }

    const systemBase = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.point_of_care;

    // RAG retrieval
    const searchQuery = condition ? `${condition} ${query}` : query;
    const chunks = await retrieveContext(searchQuery, 10);
    const contextBlock = formatContextForPrompt(chunks);

    const systemPrompt = contextBlock
      ? `${systemBase}\n\n--- GUIDELINE REFERENCES ---\n${contextBlock}\n--- END REFERENCES ---`
      : `${systemBase}\n\nNo specific guideline references were found for this query. Answer based on general medical knowledge and clearly state that no indexed sources matched.`;

    // Set up SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const openai = getOpenAIForRequest(req);
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      stream: true,
      temperature: 0.3,
      max_tokens: 2048,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        const event = JSON.stringify({ type: "transcript", data: content });
        res.write(`data: ${event}\n\n`);
      }
    }

    // Send sources
    if (chunks.length > 0) {
      const sources = chunks.map((c) => ({
        source: c.source,
        title: c.guideline_title,
        section: c.section,
        domain: c.abfm_domain,
        url: c.url,
      }));
      const srcEvent = JSON.stringify({ type: "sources", data: sources });
      res.write(`data: ${srcEvent}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: unknown) {
    console.error("[clinical/query] Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      res.write(`data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`);
      res.end();
    }
  }
});

// POST /api/clinical/vignette — structured MCQ
router.post("/clinical/vignette", async (req: Request, res: Response) => {
  try {
    const { domain } = req.body;

    // Pick domain or random
    const DOMAINS = [
      "Cardiovascular", "Endocrine", "Respiratory", "Infectious Disease",
      "Maternity Care", "Pediatrics", "Renal", "Behavioral Health",
      "Preventive Medicine", "Musculoskeletal", "Neurology",
      "Gastroenterology", "Dermatology", "Geriatrics", "Male Reproductive",
      "Hematology/Oncology",
    ];
    const selectedDomain = domain && domain !== "random"
      ? domain
      : DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

    const chunks = await retrieveContext(selectedDomain, 5);
    const contextBlock = formatContextForPrompt(chunks);

    const openai = getOpenAIForRequest(req);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an ABFM board exam question writer. Generate a clinical vignette MCQ in the domain: ${selectedDomain}. Use the guideline references below for accuracy.\n\n${contextBlock}\n\nReturn ONLY valid JSON with this exact structure:\n{"question":"...","options":{"a":"...","b":"...","c":"...","d":"..."},"answer":"a|b|c|d","explanation":"...","domain":"${selectedDomain}","source":"..."}`,
        },
        {
          role: "user",
          content: `Generate a board-style clinical vignette question for the ${selectedDomain} domain.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const vignette = JSON.parse(content);
    res.json(vignette);
  } catch (err) {
    console.error("[clinical/vignette] Error:", err);
    res.status(500).json({ error: "Failed to generate vignette" });
  }
});

export default router;
