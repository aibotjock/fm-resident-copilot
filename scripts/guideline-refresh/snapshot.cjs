const fs = require('node:fs');
const ts = require('typescript');
function loadTS(file) {
 const m={exports:{}};
 new Function('exports','require','module',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m.exports,require,m);
 return m.exports;
}
module.exports={loadTS};
if(require.main===module) {
 const {SEED_CHUNKS}=loadTS('artifacts/api-server/src/rag/sources/seed-data.ts');
 console.log(JSON.stringify({entries:SEED_CHUNKS.length,domains:[...new Set(SEED_CHUNKS.map(c=>c.abfm_domain))]},null,2));
}
