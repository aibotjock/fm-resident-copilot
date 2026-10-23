import type { Request, Response, NextFunction } from "express";
import { pool } from "@workspace/db";
import { AccessError, admit, authenticate, authenticateAdmin, readLimits, validateClinicalBody } from "./access-policy";
import { PostgresUsageStore } from "./usage-store";

const store = new PostgresUsageStore(pool);
export function accessError(res: Response, error: unknown) {
  const status = error instanceof AccessError ? error.status : 503;
  if (status === 429) res.setHeader("Retry-After", "60");
  res.status(status).json({ error: error instanceof AccessError ? error.message : "Clinical access is temporarily unavailable" });
}
export function requireClinicalAccess(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store");
  res.vary("Authorization");
  try { res.locals.principal = authenticate(req.get("authorization"), process.env); next(); }
  catch (error) { accessError(res, error); }
}
export function clinicalGate(kind: "query" | "vignette") {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cache-Control", "no-store");
    res.vary("Authorization");
    try {
      const principal = authenticate(req.get("authorization"), process.env);
      validateClinicalBody(req.body, kind);
      const permit = await admit(store, principal, readLimits(process.env));
      res.locals.clinicalPermit = permit;
      // Abort upstream work on disconnect; handler finally releases after it settles.
      res.once("close", permit.abort);
      next();
    } catch (error) { accessError(res, error); }
  };
}
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store");
  res.vary("Authorization");
  try { authenticateAdmin(req.get("authorization"), process.env); next(); }
  catch (error) { accessError(res, error); }
}
export async function withAdminTask(res: Response, work: () => Promise<void>) {
  let release: (() => Promise<void>) | undefined;
  try { release = await store.admin(); await work(); }
  catch (error) { if (!res.headersSent) accessError(res, error); }
  finally { if (release) await release().catch(() => {}); }
}
