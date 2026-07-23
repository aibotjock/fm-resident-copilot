import { openai } from "@workspace/integrations-openai-ai-server";

const EMBED_MODEL = "text-embedding-3-small";
const MAX_INPUT_CHARS = 8000;
const BATCH_SIZE = 100;

export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: text.slice(0, MAX_INPUT_CHARS),
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE).map((t) =>
      t.slice(0, MAX_INPUT_CHARS)
    );
    const response = await openai.embeddings.create({
      model: EMBED_MODEL,
      input: batch,
    });
    results.push(...response.data.map((d: { embedding: number[] }) => d.embedding));
    if (i + BATCH_SIZE < texts.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return results;
}
