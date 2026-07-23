import { Router, type Request, type Response } from "express";
import OpenAI from "openai";
import { retrieveContext, formatContextForPrompt } from "../rag/retrieval.js";

const router = Router();

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required");
  return new OpenAI({ apiKey });
}

// POST /api/voice/chat — accepts { audio: base64 }, returns SSE with transcript + audio
router.post("/voice/chat", async (req: Request, res: Response) => {
  try {
    const { audio, mode = "point_of_care" } = req.body;
    if (!audio) {
      res.status(400).json({ error: "audio (base64) is required" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const openai = getOpenAI();

    // 1. Speech-to-text
    const audioBuffer = Buffer.from(audio, "base64");
    const audioFile = new File([audioBuffer], "recording.webm", { type: "audio/webm" });
    
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
    });

    const userText = transcription.text;
    res.write(`data: ${JSON.stringify({ type: "user_transcript", data: userText })}\n\n`);

    // 2. RAG retrieval
    const chunks = await retrieveContext(userText, 8);
    const contextBlock = formatContextForPrompt(chunks);

    // 3. LLM response (streaming text)
    const systemPrompt = `You are FM Resident Copilot, a clinical AI assistant for family medicine residents. Answer concisely and cite guideline sources.\n\n${contextBlock ? `--- REFERENCES ---\n${contextBlock}\n--- END ---` : "No specific references found."}`;

    const chatStream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      stream: true,
      temperature: 0.3,
      max_tokens: 1024,
    });

    let fullResponse = "";
    for await (const chunk of chatStream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ type: "transcript", data: content })}\n\n`);
      }
    }

    // 4. Text-to-speech (generate audio response)
    try {
      const ttsResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: fullResponse.slice(0, 4096), // TTS limit
        response_format: "pcm",
        speed: 1.0,
      });

      const ttsBuffer = Buffer.from(await ttsResponse.arrayBuffer());
      // Send audio in chunks (~4800 samples = 0.2s at 24kHz)
      const CHUNK_SIZE = 9600; // bytes (4800 samples * 2 bytes)
      for (let i = 0; i < ttsBuffer.length; i += CHUNK_SIZE) {
        const slice = ttsBuffer.subarray(i, Math.min(i + CHUNK_SIZE, ttsBuffer.length));
        res.write(`data: ${JSON.stringify({ type: "audio", data: slice.toString("base64") })}\n\n`);
      }
    } catch (ttsErr) {
      console.warn("[voice/chat] TTS failed, sending text-only response:", ttsErr);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: unknown) {
    console.error("[voice/chat] Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Voice processing failed" });
    } else {
      res.write(`data: ${JSON.stringify({ type: "error", error: "Voice processing failed" })}\n\n`);
      res.end();
    }
  }
});

export default router;
