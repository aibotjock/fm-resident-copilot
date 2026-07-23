import { Router, type Request, type Response } from "express";
import { chunkCount, getMeta } from "../rag/store.js";

const router = Router();

router.get("/healthz", async (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

router.get("/admin/rag/status", async (_req: Request, res: Response) => {
  try {
    const count = await chunkCount();
    const version = await getMeta("ingest_version");
    const timestamp = await getMeta("ingest_timestamp");
    res.json({ chunks: count, version, timestamp });
  } catch (e) {
    res.status(500).json({ error: "Failed to get RAG status" });
  }
});

export default router;
