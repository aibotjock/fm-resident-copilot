const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const {createRequire}=require('node:module');
const apiRequire=createRequire(path.resolve('artifacts/api-server/package.json'));
const express=apiRequire('express');const {load}=require('./test.cjs');
const {PGlite}=require(process.env.FM_TEST_PGLITE_MODULE || '@electric-sql/pglite');
(async()=>{
 const pg=new PGlite();
 const pool={async query(sql,args){if(!args&&sql.includes(';'))return(await pg.exec(sql)).at(-1)||{rows:[]};return pg.query(sql,args);},async connect(){return {...this,release(){}}}};
 await pg.exec('CREATE SCHEMA fm_api_smoke; SET search_path=fm_api_smoke; CREATE TABLE guideline_chunks(id serial,source text,tier int,guideline_title text,guideline_year text,abfm_domain text,section text,content text,url text)');
 const candidate=load('artifacts/api-server/src/rag/sources/candidate.ts');const v=load('artifacts/api-server/src/rag/versions.ts');
 await v.initializeVersions(pool);await v.stageVersion(pool,candidate.CANDIDATE_VERSION,candidate.CANDIDATE_ENTRIES);
 process.env.FM_REFERENCE_PREVIEW='1';process.env.FM_REFERENCE_SCHEMA='fm_api_smoke';
 await v.activateVersion(pool,candidate.CANDIDATE_VERSION,'Isolated API smoke test',true);
 const prompts=[];
 const openai={chat:{completions:{async create(input){
  prompts.push({stream:input.stream,prompt:input.messages[0].content});
  if(!input.stream)return {choices:[{message:{content:JSON.stringify({question:'Transport test fixture, not a medical question',options:{a:'A',b:'B',c:'C',d:'D'},answer:'a',explanation:'Test fixture only',domain:'Cardiovascular',source:'Fixture'})}}]};
  return(async function*(){for(const content of ['Transport fixture. ','%%FM_','CITE%%{"source":"invented"}%%/FM_CITE%%'])yield{choices:[{delta:{content}}]};})();
 }}}};
 const overrides={'express':express,'@workspace/db':{pool},'@workspace/integrations-openai-ai-server/client':{openai,CLINICAL_MODEL:'transport-fixture'}};
 const clinical=load('artifacts/api-server/src/routes/clinical.ts',overrides).default;
 const admin=load('artifacts/api-server/src/routes/admin.ts',overrides).default;
 const app=express();app.use(express.json());app.use('/api',clinical,admin);
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const origin=`http://127.0.0.1:${server.address().port}`;const results=[];
 for(const mode of ['point_of_care','board_prep','documentation','ddx','flashcards']){
  const response=await fetch(origin+'/api/clinical/query',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'Study hypertension',condition:'Hypertension',mode})});
  const raw=await response.text();assert.equal(response.status,200);assert(!raw.includes('invented'));assert(raw.includes('bp-2025')||raw.includes('2025 High Blood Pressure'));
  assert(raw.includes('done'));assert(raw.includes('incomplete'));results.push({mode,transport:'pass',medicalAccuracy:'not tested: deterministic model fixture'});
 }
 const vignette=await fetch(origin+'/api/clinical/vignette',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:'Cardiovascular',topic:'Hypertension'})});
 const question=await vignette.json();assert.equal(question.answer,'a');assert(question.evidence.limitation.includes('incomplete'));
 const denied=await fetch(origin+'/api/admin/rag/reindex',{method:'POST'});assert.equal(denied.status,403);
 const status=await(await fetch(origin+'/api/admin/rag/status')).json();assert.equal(status.count,156);
 assert(prompts.every(p=>p.prompt.includes('Never repeat a known erroneous')));
 assert(prompts[0].prompt.includes('PRESENTATION & DIFFERENTIAL'));
 assert(prompts[0].prompt.includes('NEXT BEST TEST'));
 fs.writeFileSync('docs/guideline-refresh/api-smoke.json',JSON.stringify({description:'Real Express routes and PostgreSQL retrieval; deterministic OpenAI fixture, not generated candidate clinical answers',results,vignetteTransport:'pass',unauthorizedReferenceMutation:'denied 403',referenceCount:status.count},null,2)+'\n');
 console.log('Five response-mode transports, vignette transport, server evidence footer and unauthorized-admin rejection passed. Medical generation not tested.');
 await new Promise(r=>server.close(r));await pg.close();
})().catch(e=>{console.error(e);process.exit(1)});
