import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../configs/multer.js";
import { analyzeResume } from "../controllers/resume.controller.js";
import { checkCredits } from "../middlewares/credits.middleware.js";

const router = express.Router();

console.log("✅ Resume routes loaded");

router.post(
  "/analyze",
  (req, res, next) => {
    console.log("✅ [resume/analyze] route hit");
    next();
  },

  // Auth guard wrapper
  async (req, res, next) => {
    try {
      console.log("➡️ [resume/analyze] entering requireAuthMiddleware");
      return requireAuthMiddleware(req, res, (err) => {
        if (err) return next(err);
        const authUserId =
          (typeof req.auth === "function" && req.auth()?.userId) ||
          req.auth?.userId ||
          req.userId ||
          null;
        console.log("✅ [resume/analyze] auth passed. userId:", authUserId);
        next();
      });
    } catch (e) {
      console.error("❌ [resume/analyze] auth failed:", e);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: auth middleware failed",
      });
    }
  },

  // Credits guard wrapper
  async (req, res, next) => {
    try {
      console.log("➡️ [resume/analyze] entering checkCredits(5)");
      const middleware = checkCredits(5);
      return middleware(req, res, (err) => {
        if (err) return next(err);
        console.log("✅ [resume/analyze] credits check passed");
        next();
      });
    } catch (e) {
      console.error("❌ [resume/analyze] credits check failed:", e);
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient credits or credits middleware failed",
      });
    }
  },

  // Upload wrapper
  (req, res, next) => {
    console.log("➡️ [resume/analyze] entering upload.single('resume')");
    upload.single("resume")(req, res, (err) => {
      if (err) {
        console.error("❌ [resume/analyze] multer upload failed:", err);
        return res.status(400).json({
          success: false,
          message: `Upload failed: ${err.message || "unknown multer error"}`,
        });
      }

      console.log("✅ [resume/analyze] upload passed. file?", !!req.file);
      if (req.file) {
        console.log("📄 [resume/analyze] file meta:", {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        });
      }
      next();
    });
  },

  analyzeResume
);

// Local-only debug endpoint: accepts JSON { text: '...' }
if (process.env.SKIP_SUBSCRIPTION_CHECK === "true") {
  router.post("/analyze-debug", express.json(), async (req, res) => {
    const { analyzeResumeText } = await import("../controllers/resume.controller.js");
    return analyzeResumeText(req, res);
  });
}

router.get("/ping", (req, res) => {
  res.send("✅ Resume routes working");
});

export default router;