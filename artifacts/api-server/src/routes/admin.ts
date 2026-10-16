import { timingSafeEqual } from "node:crypto";
import { Router,type IRouter,type Request,type Response,type NextFunction } from "express";
import { pool } from "@workspace/db";
import { runIngestion } from "../rag/ingest";
import { getChunkCount } from "../rag/store";
import { referenceStatus,activateVersion } from "../rag/versions";
import { CANDIDATE_VERSION } from "../rag/sources/candidate";
const router:IRouter=Router();
function requireAdmin(req:Request,res:Response,next:NextFunction) {
  const token=process.env.FM_REFERENCE_ADMIN_TOKEN;
  const actual=Buffer.from(req.get("authorization") ?? "");
  const expected=Buffer.from(`Bearer ${token ?? ""}`);
  if(!token || actual.length!==expected.length || !timingSafeEqual(actual,expected)) {
    res.status(403).json({error:"Reference administration is disabled or unauthorized"});return;
  }
  next();
}
router.get("/admin/rag/status",async(_req:Request,res:Response)=>{
  try {
    const status=await referenceStatus(pool);
    res.json({count:await getChunkCount(),version:status.state?.active_version ?? null,
      timestamp:status.state?.changed_at ?? null,candidateVersion:CANDIDATE_VERSION,
      clinicalReview:"incomplete",liveUSPSTFFeed:"disabled: prior API endpoints are unverified and failed",
      ...status});
  } catch {res.status(500).json({error:"Unable to read reference status"});}
});
router.post("/admin/rag/reindex",requireAdmin,async(_req:Request,res:Response)=>{
  try {await runIngestion(true);res.json({status:"staged",candidateVersion:CANDIDATE_VERSION});}
  catch {res.status(500).json({error:"Candidate staging failed; active version was not replaced"});}
});
router.post("/admin/rag/activate",requireAdmin,async(req:Request,res:Response)=>{
  const {version,reason}=req.body;
  if(typeof version!=="string" || typeof reason!=="string" || !reason.trim()) {
    res.status(400).json({error:"version and reason are required"});return;
  }
  try {await activateVersion(pool,version,reason);res.json(await referenceStatus(pool));}
  catch(err) {res.status(409).json({error:err instanceof Error ? err.message : "Activation failed"});}
});
router.post("/admin/rag/preview",requireAdmin,async(req:Request,res:Response)=>{
  const {version,reason}=req.body;
  if(typeof version!=="string" || typeof reason!=="string" || !reason.trim()) {
    res.status(400).json({error:"version and reason are required"});return;
  }
  try {await activateVersion(pool,version,reason,true);res.json(await referenceStatus(pool));}
  catch(err) {res.status(409).json({error:err instanceof Error ? err.message : "Preview activation failed"});}
});
export default router;
