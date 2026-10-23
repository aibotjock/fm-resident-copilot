import { requireAdmin, withAdminTask } from "../security/access";
import { Router,type IRouter,type Request,type Response,type NextFunction } from "express";
import { pool } from "@workspace/db";
import { runIngestion } from "../rag/ingest";
import { getChunkCount } from "../rag/store";
import { referenceStatus,activateVersion } from "../rag/versions";
import { CANDIDATE_VERSION } from "../rag/sources/candidate";
const router:IRouter=Router();
router.get("/admin/rag/status",requireAdmin,async(_req:Request,res:Response)=>{
  try {
    const status=await referenceStatus(pool);
    res.json({count:await getChunkCount(),version:status.state?.active_version ?? null,
      timestamp:status.state?.changed_at ?? null,candidateVersion:CANDIDATE_VERSION,
      clinicalReview:"incomplete",liveUSPSTFFeed:"disabled: prior API endpoints are unverified and failed",
      ...status});
  } catch {res.status(500).json({error:"Unable to read reference status"});}
});
router.post("/admin/rag/reindex",requireAdmin,async(_req:Request,res:Response)=>{
  await withAdminTask(res, async () => {
    await runIngestion(true); res.json({status:"staged",candidateVersion:CANDIDATE_VERSION});
  });
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
