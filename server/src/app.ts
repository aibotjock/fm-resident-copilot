import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
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
  const indexHtml = path.join(clientDist, "index.html");
  const hasClient = fs.existsSync(indexHtml);
  if (!hasClient) {
    console.warn(`[server] Client build not found at ${clientDist} — serving API only.`);
  }
  app.use(express.static(clientDist));
  app.get("/{*splat}", (_req, res) => {
    if (hasClient) {
      res.sendFile(indexHtml);
    } else {
      res
        .status(200)
        .send("FM Resident Copilot API is running. (Web UI not bundled in this deployment.)");
    }
  });

  return app;
}
