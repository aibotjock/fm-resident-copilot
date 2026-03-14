import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import { ensureIngested } from "./rag/ingest";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

ensureIngested().catch((err) => {
  console.error("[RAG] Background ingestion failed:", err);
});

export default app;
