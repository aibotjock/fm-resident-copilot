import { requireClinicalAccess } from "../security/access";
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clinicalRouter from "./clinical";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.get("/clinical/access", requireClinicalAccess, (_req, res) => res.json({ authenticated: true }));
router.use(clinicalRouter);
router.use(adminRouter);

export default router;
