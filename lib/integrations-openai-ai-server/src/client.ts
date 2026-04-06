import OpenAI from "openai";

const directApiKey = process.env.OPENAI_API_KEY;
const integrationBaseUrl = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
const integrationApiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

if (!directApiKey && !integrationBaseUrl) {
  throw new Error(
    "No OpenAI credentials found. Set OPENAI_API_KEY for a direct connection, or provision the OpenAI AI integration.",
  );
}

export const openai = directApiKey
  ? new OpenAI({ apiKey: directApiKey })
  : new OpenAI({
      apiKey: integrationApiKey,
      baseURL: integrationBaseUrl,
    });

export const CLINICAL_MODEL = directApiKey ? "gpt-4o" : "gpt-5.2";
