import { build } from "esbuild";
await build({
  entryPoints: ["artifacts/api-server/voice-tutor/server.ts"],
  platform: "node",
  bundle: true,
  format: "cjs",
  outfile: "artifacts/api-server/voice-tutor/dist/server.cjs",
});
