import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../configs/multer.js";
import { analyzeResume } from "../controllers/resume.controller.js";
import { checkCredits } from "../middlewares/credits.middleware.js";

const router = express.Router();

console.log("✅ Resume routes loaded");


router.post("/analyze", (req, res, next) => {
   console.log("✅ Analyze route hit");
   next();
},
requireAuthMiddleware,
checkCredits(5),
upload.single("resume"),
analyzeResume
);


router.get("/ping", (req, res) => {
  res.send("✅ Resume routes working");
});

export default router;
