import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { monthlySummary } from "../controllers/dashboard.controller";

const router = Router();

router.use(authenticate);

router.get("/monthly", monthlySummary);

export { router as dashboardRoutes };
