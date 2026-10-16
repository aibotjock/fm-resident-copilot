// Explicitly invoked, billable OpenAI check. Uses a temporary local PostgreSQL
// database; never reads or mutates a production reference database.
const fs=require('node:fs'),path=require('node:path');
const {createRequire}=require('node:module');
const apiRequire=createRequire(path.resolve('artifacts/api-server/package.json'));
const integrationRequire=createRequire(path.resolve('lib/integrations-openai-ai-server/package.json'));
const express=apiRequire('express');
const OpenAI=integrationRequire('openai');
const {load}=require('./test.cjs');
const {PGlite}=require(process.env.FM_TEST_PGLITE_MODULE || '@electric-sql/pglite');

async function main(){
 if(!process.env.OPENAI_API_KEY)process.loadEnvFile('.env.local');
 if(!process.env.OPENAI_API_KEY)throw Error('No authorized test credential configured');
 const pg=new PGlite();
 const pool={async query(sql,args){if(!args&&sql.includes(';'))return(await pg.exec(sql)).at(-1)||{rows:[]};return pg.query(sql,args);},async connect(){return {...this,release(){}}}};
 await pg.exec('CREATE SCHEMA fm_live_review; SET search_path=fm_live_review; CREATE TABLE guideline_chunks(id serial,source text,tier int,guideline_title text,guideline_year text,abfm_domain text,section text,content text,url text)');
 const candidate=load('artifacts/api-server/src/rag/sources/candidate.ts');
 const versions=load('artifacts/api-server/src/rag/versions.ts');
 await versions.initializeVersions(pool);
 await versions.stageVersion(pool,candidate.CANDIDATE_VERSION,candidate.CANDIDATE_ENTRIES);
 process.env.FM_REFERENCE_PREVIEW='1';process.env.FM_REFERENCE_SCHEMA='fm_live_review';
 await versions.activateVersion(pool,candidate.CANDIDATE_VERSION,'Authorized local live-model review',true);
 const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY,maxRetries:0,timeout:90000});
 const model='gpt-4o'; // Same direct-API model as the approved app.
 const routeErrors=[];
 console.error=(...args)=>{const error=args.find(x=>x instanceof Error);routeErrors.push({type:error?.name??'RouteError',status:error?.status??null,code:error?.code??null});};
 const overrides={'express':express,'@workspace/db':{pool},'@workspace/integrations-openai-ai-server/client':{openai,CLINICAL_MODEL:model}};
 const router=load('artifacts/api-server/src/routes/clinical.ts',overrides).default;
 const retrieval=load('artifacts/api-server/src/rag/retrieval.ts',overrides);
 const app=express();app.use(express.json());app.use('/api',router);
 if(process.env.FM_LOCAL_PREVIEW==='1'){
  const admin=load('artifacts/api-server/src/routes/admin.ts',overrides).default;
  app.use('/api',admin);
  const dist=path.resolve('artifacts/mobile/dist');
  app.use(express.static(dist));app.get('/{*path}',(_req,res)=>res.sendFile(path.join(dist,'index.html')));
 }
 const server=app.listen(Number(process.env.FM_LOCAL_PORT)||0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const origin=`http://127.0.0.1:${server.address().port}`;
 if(process.env.FM_LOCAL_PREVIEW==='1'){
  console.log(`Isolated local candidate preview: ${origin}`);
  await new Promise(resolve=>{process.once('SIGTERM',resolve);process.once('SIGINT',resolve);});
  await new Promise(r=>server.close(r));await pg.close();return;
 }
 const baseline=JSON.parse(fs.readFileSync('docs/guideline-refresh/baseline-responses.json','utf8'));
 const scenarios=baseline.map(x=>({id:`baseline-${x.mode}-${x.condition}`,condition:x.condition,mode:x.mode,query:`Provide a detailed study response about ${x.condition}.`,baselineAvailable:true}));
 scenarios.push(
  {id:'renal-dose',condition:'Influenza',mode:'point_of_care',query:'Explain influenza treatment and adult oseltamivir renal dosing, including CrCl 11–30 mL/min.'},
  {id:'infection-followup',condition:'Gonorrhea',mode:'point_of_care',query:'Explain site-specific treatment alternatives, allergy, pharyngeal cure testing, and reinfection retesting.'},
  {id:'electrolyte-emergency',condition:'Hyperkalemia',mode:'point_of_care',query:'Explain the supplied UKKA adult hospital pathway, including ECG changes, insulin/glucose, and hypoglycemia monitoring. Distinguish its jurisdiction.'},
  {id:'pregnancy',condition:'Pregnancy',mode:'point_of_care',query:'Summarize supported prenatal screening and identify unverified pregnancy-specific recommendations.'},
  {id:'guideline-conflict',condition:'Lung Cancer Screening',mode:'board_prep',query:'Explain screening eligibility and the USPSTF stopping rule. Describe any supported disagreement; do not invent one.'},
  {id:'missing-evidence',condition:'zzqxv-no-reference-8392',mode:'point_of_care',query:'Give a guideline-based dose for zzqxv-no-reference-8392.'}
 );
 if(process.env.FM_LIVE_LIMIT)scenarios.splice(Number(process.env.FM_LIVE_LIMIT));
 if(process.env.FM_LIVE_VIGNETTES==='1')scenarios.splice(0,scenarios.length,
  {id:'practice-hypertension',topic:'Hypertension',domain:'Cardiovascular',endpoint:'vignette'},
  {id:'practice-cdi',topic:'C. difficile',domain:'Infectious Disease',endpoint:'vignette'});
 const results=[];
 const output=process.env.FM_LIVE_VIGNETTES==='1'?'docs/guideline-refresh/candidate-vignettes.json':'docs/guideline-refresh/candidate-responses.json';
 function save(){fs.writeFileSync(output,JSON.stringify({kind:'Actual isolated candidate responses; not medical certification',model,referenceVersion:candidate.CANDIDATE_VERSION,generatedAt:new Date().toISOString(),results,routeErrors},null,2)+'\n');}
 try{
  for(const scenario of scenarios){
   const context=await retrieval.retrieveContext(scenario.condition??`${scenario.topic} ${scenario.domain}`,scenario.endpoint==='vignette'?8:10);
   const started=Date.now();let raw='',error=null,status=null;
   try{
    const res=await fetch(origin+'/api/clinical/'+(scenario.endpoint??'query'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(scenario),signal:AbortSignal.timeout(100000)});
    status=res.status;raw=await res.text();
   }catch(e){error={type:e.name,message:e.name==='TimeoutError'?'Local candidate request timed out':'Local candidate request failed'};}
   const events=scenario.endpoint==='vignette'?[JSON.parse(raw)]:raw.split('\n').filter(x=>x.startsWith('data: ')).map(x=>{try{return JSON.parse(x.slice(6));}catch{return {parseError:true};}});
   const response=scenario.endpoint==='vignette'?raw:events.map(x=>x.content??'').join('');
   const matched=baseline.find(x=>x.condition===scenario.condition&&x.mode===scenario.mode);
   const answerText=response.split('%%FM_CITE%%')[0];
   results.push({...scenario,status,seconds:Math.round((Date.now()-started)/10)/100,response,error,completed:scenario.endpoint==='vignette'?!!events[0]?.question:events.some(x=>x.done),apiError:events.some(x=>x.error),
    retrieved:context.chunks.map(x=>({section:x.section,key:x.key,evidence:x.evidence,content:x.content})),
    comparison:matched?{baselineCharacters:matched.response.split('%%FM_CITE%%')[0].length,candidateCharacters:answerText.length,lengthRatio:Number((answerText.length/matched.response.split('%%FM_CITE%%')[0].length).toFixed(3)),note:'Length is a triage signal, not an accuracy/usefulness score; prompts were reconstructed because the baseline file did not record full original requests.'}:null});
   save();console.log(JSON.stringify({id:scenario.id,status,completed:results.at(-1).completed,apiError:results.at(-1).apiError,seconds:results.at(-1).seconds}));
   if(error||events.some(x=>x.error))break;
  }
 }finally{save();await new Promise(r=>server.close(r));await pg.close();}
}
main().catch(e=>{console.log(JSON.stringify({failed:true,type:e.name,message:'Live candidate harness failed; secrets omitted'}));process.exitCode=1;});
