import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import healthRoutes from "./routes/health.js";
import clinicalRoutes from "./routes/clinical.js";
import voiceRoutes from "./routes/voice.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use("/api", healthRoutes);
  app.use("/api", clinicalRoutes);
  app.use("/api", voiceRoutes);

  // Serve static frontend in production
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });

  return app;
}
