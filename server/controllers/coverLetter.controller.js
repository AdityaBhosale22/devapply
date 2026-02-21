import { generateAIResponse } from "../services/ai.service.js";
import { deductCredits, getUserCredits } from "../utils/credits.js"; // ⭐ Import a function to check balance
import { logActivity } from "../utils/activityLogger.js";

export const generateCoverLetter = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { role, company, jd, tone } = req.body;

    if (!role || !company || !jd) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ⭐ FIX: Check if user has enough credits BEFORE calling Gemini
    const currentCredits = await getUserCredits(userId); 
    if (currentCredits < 3) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits to generate a cover letter.",
      });
    }

    const prompt = `
You are an expert career assistant.

Write a ${tone || "professional"} cover letter.

Role: ${role}
Company: ${company}
Job Description: ${jd}

Make it concise, confident, and modern.
`;

    const aiResponse = await generateAIResponse(prompt);

    // Deduct credits AFTER success
    await deductCredits(userId, 3);

    // Save activity
    await logActivity({
      userId,
      feature: "Cover Letter",
      prompt: `${role} at ${company}`,
      result: aiResponse,
      creditsUsed: 3,
    });

    res.json({
      success: true,
      data: aiResponse,
    });

  } catch (err) {
    console.error("COVER LETTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate cover letter",
    });
  }
};