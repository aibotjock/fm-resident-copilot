import "dotenv/config";
import { createApp } from "./app.js";
import { ensureIngested } from "./rag/ingest.js";

const PORT = Number(process.env.PORT) || 3001;

async function main() {
  // Ensure RAG data is ingested
  try {
    await ensureIngested();
  } catch (err) {
    console.warn("[startup] RAG ingestion skipped (DB may not be ready):", err);
  }

  const app = createApp();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] FM Resident Copilot API running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
