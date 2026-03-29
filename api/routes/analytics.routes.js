import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { getUsageAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get(
  "/",
  requireAuthMiddleware,
  getUsageAnalytics
);

export default router;
