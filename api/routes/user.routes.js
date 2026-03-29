import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { getUserCredits } from "../controllers/user.controller.js";

const router = express.Router();

router.get(
  "/credits",
  requireAuthMiddleware,
  getUserCredits
);

export default router;
