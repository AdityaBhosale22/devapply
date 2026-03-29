import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import {
  upgradePlan,
  getCurrentSubscription,   // ⭐ ADD THIS
} from "../controllers/subscription.controller.js";

const router = express.Router();

router.post("/upgrade", requireAuthMiddleware, upgradePlan);

router.get("/", requireAuthMiddleware, getCurrentSubscription);  // ⭐ ADD

export default router;