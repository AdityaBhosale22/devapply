import express from "express";
import multer from "multer";

import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { checkCredits } from "../middlewares/credits.middleware.js";
import { analyzeJobFit } from "../controllers/jobFit.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post(
  "/",
  requireAuthMiddleware,
  checkCredits(10),      // ⭐ ADD THIS
  upload.single("resume"),
  analyzeJobFit
);

export default router;