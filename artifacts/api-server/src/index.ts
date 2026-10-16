import app from "./app";
import { initializeRestoredDatabase } from "@workspace/db";
import { ensureIngested } from "./rag/ingest";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function main() {
  await initializeRestoredDatabase();
  app.listen(port, "0.0.0.0", () => {
    console.log(`FM Resident Copilot restored app listening on port ${port}`);
  });
  await ensureIngested();
}
main().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
