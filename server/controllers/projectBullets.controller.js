import { generateAIResponse } from "../services/ai.service.js";
import { deductCredits, getUserCredits } from "../utils/credits.js"; // Added getUserCredits
import { logActivity } from "../utils/activityLogger.js";

export const generateProjectBullets = async (req, res) => {
  try {
    // FIX 1: req.auth is an object, not a function
    const userId = req.auth()?.userId; 
    const { projectName, techStack, description } = req.body;

    // FIX 2: Validate inputs so you don't waste AI calls on empty data
    if (!projectName || !description) {
      return res.status(400).json({
        success: false,
        message: "Project name and description are required",
      });
    }

    // FIX 3: Check credits BEFORE calling the AI
    const currentCredits = await getUserCredits(userId);
    if (currentCredits < 5) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits. Generating bullets requires 5 credits.",
      });
    }

    const prompt = `
    Create strong resume bullet points.

    Project: ${projectName}
    Technologies: ${techStack || "Not specified"}
    Description: ${description}

    Make them ATS-friendly and impactful.
    `;

    const aiResponse = await generateAIResponse(prompt);

    // Deduct credits
    await deductCredits(userId, 5);

    // FIX 4: Pass an object to match your activity logger signature
    await logActivity({
      userId,
      feature: "Project Bullets",
      prompt: `Bullets for ${projectName}`,
      result: aiResponse,
      creditsUsed: 5,
    });

    res.json({
      success: true,
      data: aiResponse,
    });

  } catch (err) {
    console.error("BULLETS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to generate bullets",
    });
  }
};