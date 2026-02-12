import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../configs/multer.js";
import { analyzeResume } from "../controllers/resume.controller.js";

const router = express.Router();

router.post(
  "/analyze",
  requireAuthMiddleware,
  upload.single("resume"),
  analyzeResume
);

export default router;
