import { extractTextFromPDF } from "../utils/pdfParser.js";
import { analyzeResumeWithAI } from "../services/ai.service.js";
import { deductCredits } from "../utils/credits.js";
import { logActivity } from "../utils/activityLogger.js";
import { validateSubscription } from "../utils/subscriptionGuard.js";

const REQUIRE_SUBSCRIPTION_FOR_RESUME =
  process.env.REQUIRE_SUBSCRIPTION_FOR_RESUME === "true";

export const analyzeResume = async (req, res) => {
  try {
    console.log("=== CONTROLLER START: analyzeResume ===");

    if (!req.file) {
      console.log("❌ No file found on req.file");
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    console.log("📄 File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const authData = typeof req.auth === "function" ? req.auth() : req.auth;
    const userId = authData?.userId || req.userId || null;

    if (!userId) {
      console.log("❌ Missing userId from auth");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: userId missing in auth context",
      });
    }

    console.log("✅ userId:", userId);

    const resumeText = await extractTextFromPDF(req.file.buffer);
    console.log("✅ PDF text extracted. length:", resumeText?.length || 0);

    const aiResult = await analyzeResumeWithAI(resumeText);
    console.log("✅ AI analysis completed");

    // Subscription check
    const subCheck = await validateSubscription(userId);
    console.log("🔎 Subscription check result:", subCheck);

    // Require subscription only if enabled via env
    if (REQUIRE_SUBSCRIPTION_FOR_RESUME && !subCheck?.valid) {
      return res.status(403).json({
        success: false,
        code: "SUBSCRIPTION_REQUIRED",
        message: "An active subscription is required to use Resume Analyzer.",
      });
    }

    // Credits remain mandatory
    await deductCredits(userId, 5);
    console.log("✅ Deducted 5 credits");

    await logActivity({
      userId,
      feature: "resume_analyzer",
      prompt: resumeText.slice(0, 500),
      result: JSON.stringify(aiResult),
      creditsUsed: 5,
    });
    console.log("✅ Activity logged");

    return res.json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error("❌ analyzeResume error:", error);
    return res.status(500).json({
      success: false,
      message: "Resume analysis failed",
      debug:
        process.env.NODE_ENV !== "production"
          ? String(error?.message || error)
          : undefined,
    });
  }
};

// Local debug helper
export const analyzeResumeText = async (req, res) => {
  try {
    console.log("=== CONTROLLER START (text) ===");

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    let aiResult;
    if (process.env.SKIP_SUBSCRIPTION_CHECK === "true") {
      aiResult = {
        summary:
          "(debug) Mock analysis: strong backend experience, Node.js, Postgres",
        suggestions: [
          "Highlight specific project outcomes",
          "Quantify impact with numbers",
        ],
      };
    } else {
      aiResult = await analyzeResumeWithAI(text);
    }

    const userId = req.auth ? req.auth()?.userId : "debug_user";

    // Subscription check
    const subCheck = await validateSubscription(userId);

    // Require subscription only if enabled
    if (
      process.env.SKIP_SUBSCRIPTION_CHECK !== "true" &&
      REQUIRE_SUBSCRIPTION_FOR_RESUME &&
      !subCheck?.valid
    ) {
      return res.status(403).json({
        success: false,
        code: "SUBSCRIPTION_REQUIRED",
        message: "An active subscription is required to use Resume Analyzer.",
      });
    }

    // Credits remain mandatory (unless in debug mode)
    if (process.env.SKIP_SUBSCRIPTION_CHECK !== "true") {
      await deductCredits(userId, 5);
    }

    await logActivity({
      userId,
      feature: "resume_analyzer_debug",
      prompt: text.slice(0, 500),
      result: JSON.stringify(aiResult),
      creditsUsed:
        process.env.SKIP_SUBSCRIPTION_CHECK === "true" ? 0 : 5,
    });

    return res.json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Resume analysis (text) failed",
    });
  }
};