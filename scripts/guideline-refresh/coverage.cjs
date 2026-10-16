const fs=require('node:fs');const {load}=require('./test.cjs');
const {PGlite}=require(process.env.FM_TEST_PGLITE_MODULE || '@electric-sql/pglite');
(async()=>{
 const pg=new PGlite();const pool={async query(sql,args){if(!args&&sql.includes(';'))return(await pg.exec(sql)).at(-1)||{rows:[]};return pg.query(sql,args);},async connect(){return {...this,release(){}}}};
 await pg.exec('CREATE SCHEMA fm_coverage; SET search_path=fm_coverage; CREATE TABLE guideline_chunks(id serial,source text,tier int,guideline_title text,guideline_year text,abfm_domain text,section text,content text,url text)');
 const v=load('artifacts/api-server/src/rag/versions.ts');await v.initializeVersions(pool);
 const candidate=load('artifacts/api-server/src/rag/sources/candidate.ts');
 const {SEED_CHUNKS}=load('artifacts/api-server/src/rag/sources/seed-data.ts');
 const {CONDITIONS}=load('artifacts/mobile/types/index.ts');
 const store=load('artifacts/api-server/src/rag/store.ts',{'@workspace/db':{pool}});
 const baseline=SEED_CHUNKS.map(e=>({...e,key:v.entryKey(e),review:'unresolved',evidence:[],limitations:'Historical baseline'}));
 process.env.FM_REFERENCE_PREVIEW='1';process.env.FM_REFERENCE_SCHEMA='fm_coverage';
 const out=[];
 for(const [name,entries] of [['baseline',baseline],['candidate',candidate.CANDIDATE_ENTRIES]]){
  await v.stageVersion(pool,name,entries);await v.activateVersion(pool,name,'Coverage comparison',true);
  for(const c of CONDITIONS){let rows=await store.searchByText(c.name,10);const fallback=!rows.length;if(!rows.length)rows=await store.searchByTextFallback(c.name,10);
   out.push({version:name,condition:c.name,matches:rows.length,fallback,sections:rows.map(r=>r.section)});
  }
 }
 const baselineMissing=out.filter(x=>x.version==='baseline'&&!x.matches).map(x=>x.condition);
 const candidateMissing=out.filter(x=>x.version==='candidate'&&!x.matches).map(x=>x.condition);
 const report={description:'Actual PostgreSQL full-text retrieval coverage. A match is not semantic relevance or medical verification.',conditionCount:CONDITIONS.length,baselineMissing,candidateMissing,newMissing:candidateMissing.filter(x=>!baselineMissing.includes(x)),results:out};
 fs.writeFileSync('docs/guideline-refresh/retrieval-coverage.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({...report,results:undefined},null,2));await pg.close();
})().catch(e=>{console.error(e);process.exit(1)});
