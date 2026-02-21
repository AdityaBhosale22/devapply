import express from "express";
import multer from "multer"; // ⭐ Import multer
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { analyzeJobFit } from "../controllers/jobFit.controller.js";

const router = express.Router();

// Store file in memory so we can extract text from it
const upload = multer({ storage: multer.memoryStorage() });

// ⭐ Add the upload.single('resume') middleware before your controller
router.post("/", requireAuthMiddleware, upload.single('resume'), analyzeJobFit);

export default router;