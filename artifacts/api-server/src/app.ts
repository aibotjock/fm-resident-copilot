import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import path from "node:path";
import fs from "node:fs";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// One origin serves the restored Expo web UI and its API.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});
const webDist = path.resolve(process.env.WEB_DIST || "artifacts/mobile/dist");
if (fs.existsSync(path.join(webDist, "index.html"))) {
  app.use(express.static(webDist));
  app.get("/{*path}", (_req, res) => res.sendFile(path.join(webDist, "index.html")));
}

export default app;
