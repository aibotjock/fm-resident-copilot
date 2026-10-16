import { Router, type IRouter, type Request, type Response } from "express";
import {
  runIngestion,
  getContentReviewStatus,
  isReviewedIndexReady,
} from "../rag/ingest";
import { getChunkCount, getMetadata } from "../rag/store";

const router: IRouter = Router();

router.get("/content/status", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (!(await isReviewedIndexReady())) {
      res.status(503).json({ error: "Checked reference index is not ready" });
      return;
    }
    res.json(getContentReviewStatus());
  } catch {
    res
      .status(503)
      .json({ error: "Unable to confirm reference review status" });
  }
});

router.get("/admin/rag/status", async (_req: Request, res: Response) => {
  try {
    const count = await getChunkCount();
    const version = await getMetadata("ingest_version");
    const timestamp = await getMetadata("ingest_timestamp");
    const total = await getMetadata("total_chunks");
    res.json({ count, version, timestamp, totalIngested: total });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/admin/rag/reindex", async (_req: Request, res: Response) => {
  try {
    res.json({ status: "started", message: "Re-indexing in background" });
    runIngestion(true).catch((err) =>
      console.error("[RAG] Admin re-index failed:", err),
    );
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
