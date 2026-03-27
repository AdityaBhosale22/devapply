import { extractTextFromPDF } from "../utils/pdfParser.js";
import { analyzeResumeWithAI } from "../services/ai.service.js";
import { deductCredits } from "../utils/credits.js";
import { logActivity } from "../utils/activityLogger.js";
import { validateSubscription } from "../utils/subscriptionGuard.js";

export const analyzeResume = async (req, res) => {
  try {
    console.log("=== CONTROLLER START ===");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    // FIX 1 — call auth once
    const { userId, sessionClaims } = req.auth();

    // FIX 2 — validate subscription properly
    const subCheck = await validateSubscription(
   userId,
   sessionClaims,
   "u:resume_analyzer"
);

    if (!subCheck.valid) {
      return res.status(403).json({
        success: false,
        message: "Subscription expired. Please upgrade 😏",
      });
    }

    console.log("User ID:", userId);
    console.log("Plan:", sessionClaims?.pla);

    const resumeText = await extractTextFromPDF(req.file.buffer);

    const aiResult = await analyzeResumeWithAI(resumeText);

    await deductCredits(userId, 5);

    await logActivity({
      userId,
      feature: "resume_analyzer",
      prompt: resumeText.slice(0, 500),
      result: JSON.stringify(aiResult),
      creditsUsed: 5,
    });

    res.json({
      success: true,
      data: aiResult,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Resume analysis failed",
    });
  }
};