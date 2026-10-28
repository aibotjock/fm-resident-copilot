import { build } from "esbuild";
await build({
  entryPoints: ["artifacts/api-server/voice-tutor/server.ts"],
  platform: "node",
  external: ["pdf-parse/lib/pdf-parse.js"],
  bundle: true,
  format: "cjs",
  outfile: "artifacts/api-server/voice-tutor/dist/server.cjs",
});

await build({
  entryPoints: ["artifacts/api-server/voice-tutor/learning.ts"],
  bundle: true,
  format: "iife",
  globalName: "FMLearning",
  outfile: "artifacts/api-server/voice-tutor/dist/learning.js",
});
for (const name of ["presentation", "conversation"]) {
  await build({entryPoints:[`artifacts/api-server/voice-tutor/${name}.ts`], bundle:true,format:"iife",globalName:name==="presentation"?"FMPresentation":"FMConversation",outfile:`artifacts/api-server/voice-tutor/dist/${name}.js`});
}
