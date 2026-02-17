import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { upgradePlan } from "../controllers/subscription.controller.js";

const router = express.Router();

router.post(
  "/upgrade",
  requireAuthMiddleware,
  upgradePlan
);

export default router;
