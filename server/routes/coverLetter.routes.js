import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { generateCoverLetter } from "../controllers/coverLetter.controller.js";

const router = express.Router();

router.post("/", requireAuthMiddleware, generateCoverLetter);

export default router;