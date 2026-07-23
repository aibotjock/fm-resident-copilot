import type { Request } from "express";
import OpenAI from "openai";

/**
 * Build an OpenAI client for a request.
 * Priority: `x-api-key` request header (user-provided key from the app's
 * Settings screen) > OPENAI_API_KEY from the server environment.
 */
export function getOpenAIForRequest(req: Request): OpenAI {
  const headerKey = req.header("x-api-key")?.trim();
  const apiKey = headerKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "No OpenAI API key available. Provide one in the app Settings (x-api-key header) or set OPENAI_API_KEY on the server."
    );
  }
  return new OpenAI({ apiKey });
}
