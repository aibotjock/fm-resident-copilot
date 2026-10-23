import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import path from "node:path";
import fs from "node:fs";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ extended: false, limit: "24kb" }));

app.use("/api", router);

// One origin serves the restored Expo web UI and its API.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});
const webDist = path.resolve(process.env.WEB_DIST || "artifacts/mobile/dist");
if (fs.existsSync(path.join(webDist, "index.html"))) {
  // Expo keeps exported fonts under assets/__node_modules/.pnpm/.
  // Allow those public build assets without exposing other dot paths.
  app.use("/assets", express.static(path.join(webDist, "assets"), { dotfiles: "allow" }));
  app.use(express.static(webDist));
  app.get("/{*path}", (_req, res) => res.sendFile(path.join(webDist, "index.html")));
}

export default app;
