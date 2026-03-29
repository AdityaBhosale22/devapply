import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { getUserActivities } from "../controllers/activity.controller.js";

const router = express.Router();

router.get(
  "/",
  requireAuthMiddleware,
  getUserActivities
);

export default router;
