const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const {PGlite}=require(process.env.FM_TEST_PGLITE_MODULE || '@electric-sql/pglite');
const cache=new Map();
function load(file,overrides={}) {
 file=path.resolve(file);if(cache.has(file)) return cache.get(file).exports;
 const m={exports:{}};cache.set(file,m);
 function req(name){
  if(name in overrides)return overrides[name];
  if(name.startsWith('.')){
   let f=path.resolve(path.dirname(file),name);
   if(fs.existsSync(f)&&f.endsWith('.json'))return JSON.parse(fs.readFileSync(f,'utf8'));
   if(!fs.existsSync(f))f+='.ts';
   return load(f,overrides);
  }
  return require(name);
 }
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText;
 new Function('exports','require','module',js)(m.exports,req,m);return m.exports;
}
module.exports={load};
async function main(){
 const pg=new PGlite();
 // PGlite executes actual PostgreSQL SQL locally; the adapter provides Pool's
 // query/connect interface. This does not emulate Railway's connection pool.
 let failAfter=-1;
 const client={release(){},async query(sql,args){
  if(sql.startsWith('INSERT INTO reference_entries')&&failAfter===0)throw new Error('Injected insertion failure');
  if(sql.startsWith('INSERT INTO reference_entries')&&failAfter>0)failAfter--;
  if(!args&&sql.includes(';')){const rows=await pg.exec(sql);return rows.at(-1)||{rows:[]};}
  return pg.query(sql,args);
 }};
 const pool={query:(...a)=>client.query(...a),connect:async()=>client};
 const v=load('artifacts/api-server/src/rag/versions.ts');
 const c=load('artifacts/api-server/src/rag/sources/candidate.ts');
 const {SEED_CHUNKS}=load('artifacts/api-server/src/rag/sources/seed-data.ts');
 const store=load('artifacts/api-server/src/rag/store.ts',{'@workspace/db':{pool}});
 const {CitationFilter,citationMetadata}=load('artifacts/api-server/src/rag/evidence-context.ts');
 const results=[];
 async function check(name,fn){await fn();results.push({name,result:'pass'});}
 await pg.exec('CREATE SCHEMA fm_refresh_test; SET search_path=fm_refresh_test; CREATE TABLE guideline_chunks(id serial, source text,tier int,guideline_title text,guideline_year text,abfm_domain text,section text,content text,url text)');
 for(const e of SEED_CHUNKS)await pg.query('INSERT INTO guideline_chunks(source,tier,guideline_title,guideline_year,abfm_domain,section,content,url) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[e.source,e.tier,e.guideline_title,e.guideline_year,e.abfm_domain,e.section,e.content,e.url]);
 await check('Baseline snapshot preserves all 156 original rows',async()=>{
  await v.initializeVersions(pool);assert.equal(await store.getChunkCount(),156);
  assert.equal((await pg.query('SELECT count(*)::int AS n FROM guideline_chunks')).rows[0].n,156);
 });
 const original=(await v.referenceStatus(pool)).state.active_version;
 await check('Candidate preserves section identities and domains',async()=>{
  assert.equal(c.CANDIDATE_ENTRIES.length,156);
  assert.deepEqual(c.CANDIDATE_ENTRIES.map(e=>e.section),SEED_CHUNKS.map(e=>e.section));
  assert.deepEqual(c.CANDIDATE_ENTRIES.map(e=>e.abfm_domain),SEED_CHUNKS.map(e=>e.abfm_domain));
 });
 await check('Staging is idempotent and leaves active baseline unchanged',async()=>{
  await v.stageVersion(pool,c.CANDIDATE_VERSION,c.CANDIDATE_ENTRIES);await v.stageVersion(pool,c.CANDIDATE_VERSION,c.CANDIDATE_ENTRIES);
  assert.equal((await v.referenceStatus(pool)).state.active_version,original);
  assert.equal((await pg.query('SELECT count(*)::int AS n FROM reference_entries')).rows[0].n,312);
 });
 await check('Immutable IDs reject changed content',async()=>{
  const changed=structuredClone(c.CANDIDATE_ENTRIES);changed[0].content+='bad';
  await assert.rejects(v.stageVersion(pool,c.CANDIDATE_VERSION,changed),/Immutable/);
 });
 await check('Evidence metadata is immutable with its reference version',async()=>{
  const changed=structuredClone(c.CANDIDATE_ENTRIES);
  changed.find(e=>e.evidence_records?.length).evidence_records[0].title='Changed later title';
  await assert.rejects(v.stageVersion(pool,c.CANDIDATE_VERSION,changed),/Immutable/);
  const stored=await pg.query('SELECT evidence_records FROM reference_entries WHERE version_id=$1 AND key=$2',[c.CANDIDATE_VERSION,c.CANDIDATE_ENTRIES[0].key]);
  assert.notEqual(stored.rows[0].evidence_records[0].title,'Changed later title');
 });
 await check('Empty and duplicate candidates are rejected',async()=>{
  await assert.rejects(v.stageVersion(pool,'empty',[]),/Empty/);
  await assert.rejects(v.stageVersion(pool,'duplicate',[c.CANDIDATE_ENTRIES[0],c.CANDIDATE_ENTRIES[0]]),/Duplicate/);
 });
 await check('Incomplete candidate cannot activate in production',async()=>{
  await assert.rejects(v.activateVersion(pool,c.CANDIDATE_VERSION,'test'),/not approved/);
  process.env.FM_REFERENCE_PREVIEW='1';process.env.FM_REFERENCE_SCHEMA='fm_copilot_restored';
  await assert.rejects(v.activateVersion(pool,c.CANDIDATE_VERSION,'unsafe preview',true),/isolated/);
 });
 await check('Failed staging rolls back candidate rows and active pointer',async()=>{
  failAfter=3;
  await assert.rejects(v.stageVersion(pool,'broken',c.CANDIDATE_ENTRIES),/Injected/);failAfter=-1;
  assert.equal((await pg.query("SELECT count(*)::int AS n FROM reference_versions WHERE id='broken'")).rows[0].n,0);
  assert.equal((await v.referenceStatus(pool)).state.active_version,original);
 });
 await check('Isolated preview activates candidate and rollback restores baseline',async()=>{
  process.env.FM_REFERENCE_SCHEMA='fm_refresh_test';
  await v.activateVersion(pool,c.CANDIDATE_VERSION,'test candidate',true);
  assert.equal((await v.referenceStatus(pool)).state.previous_version,original);
  assert.equal(await store.getChunkCount(),156);
  await v.activateVersion(pool,original,'test rollback');
  assert.equal((await v.referenceStatus(pool)).state.active_version,original);
  await v.activateVersion(pool,c.CANDIDATE_VERSION,'test restore',true);
 });
 await check('Restart/staging does not undo a selected rollback',async()=>{
  await v.activateVersion(pool,original,'Persist rollback test');
  const ingestion=load('artifacts/api-server/src/rag/ingest.ts',{'@workspace/db':{pool}});
  await ingestion.runIngestion();
  assert.equal((await v.referenceStatus(pool)).state.active_version,original);
  await v.activateVersion(pool,c.CANDIDATE_VERSION,'Restore candidate for search tests',true);
 });
 await check('Full-text search uses the selected version and corrected renal dose',async()=>{
  const found=await store.searchByText('Influenza',10);
  assert(found.some(e=>e.content.includes('11–30 mL/min, 30 mg PO daily')));
  assert(found.every(e=>e.version_id===c.CANDIDATE_VERSION));
 });
 await check('Correction anchors and evidence links are internally valid',async()=>{
  const ids=new Set(c.EVIDENCE.map(e=>e.id));
  for(const change of c.CORRECTIONS)for(const id of change.evidence)assert(ids.has(id));
  for(const e of c.EVIDENCE)assert.equal(new URL(e.url).protocol,'https:');
  assert(c.CANDIDATE_ENTRIES.every(e=>e.review!=='verified'));
 });
 await check('Model citation footer is suppressed across every split boundary',async()=>{
  const raw='Clinical prose.%%FM_CITE%%{"source":"invented"}%%/FM_CITE%%';
  for(let split=0;split<raw.length;split++){
   const f=new CitationFilter();assert.equal(f.push(raw.slice(0,split))+f.push(raw.slice(split))+f.finish(),'Clinical prose.');
  }
 });
 await check('Ordinary prose including percent characters is preserved',async()=>{
  const raw='A1c 7%; 100% useful. %%FM is plain text.';const f=new CitationFilter();
  assert.equal([...raw].map(x=>f.push(x)).join('')+f.finish(),raw);
 });
 await check('Evidence footer does not claim whole-topic verification',async()=>{
  const found=await store.searchByText('Influenza',10);const meta=citationMetadata(found);
  assert(meta.citations.some(e=>e.url.includes('cdc.gov')));
  assert(meta.limitation.includes('incomplete'));assert(meta.citations.every(e=>e.confidence!=='direct'));
 });
 const inventory={baseline:SEED_CHUNKS.length,candidate:c.CANDIDATE_ENTRIES.length,domains:new Set(SEED_CHUNKS.map(e=>e.abfm_domain)).size,
  changedEntries:c.CANDIDATE_ENTRIES.filter(e=>e.review==='partially_corrected').length,corrections:c.CORRECTIONS.length,
  evidenceRecords:c.EVIDENCE.length,fullyVerifiedEntries:0,candidateVersion:c.CANDIDATE_VERSION,
  baselineCharacters:SEED_CHUNKS.reduce((n,e)=>n+e.content.length,0),candidateCharacters:c.CANDIDATE_ENTRIES.reduce((n,e)=>n+e.content.length,0)};
 fs.writeFileSync('docs/guideline-refresh/validation.json',JSON.stringify({engine:'PGlite PostgreSQL WASM; no production database accessed',inventory,checks:results},null,2)+'\n');
 fs.writeFileSync('docs/guideline-refresh/candidate-library.json',JSON.stringify(c.CANDIDATE_ENTRIES,null,2)+'\n');
 console.log(JSON.stringify({inventory,checks:results},null,2));await pg.close();
}
if(require.main===module)main().catch(err=>{console.error(err);process.exit(1)});
