import { extractTextFromPDF } from "../utils/pdfParser.js";
import { generateAIResponse, parseJsonFromText } from "../services/ai.service.js";
import { deductCredits, getUserCredits } from "../utils/credits.js";
import { logActivity } from "../utils/activityLogger.js";

export const analyzeJobFit = async (req, res) => {
  try {
    const userId = req.auth()?.userId; 
    const jobDescription = req.body.jobDescription; // JD comes from body

    // 1. Validate inputs (File + JD)
    if (!req.file || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Both a Resume PDF and a Job Description are required",
      });
    }

    // 2. Check credits
    const currentCredits = await getUserCredits(userId);
    if (currentCredits < 10) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits. Premium Job Fit Analysis requires 10 credits.",
      });
    }

    // ⭐ 3. Extract text from the uploaded PDF buffer
    const resumeText = await extractTextFromPDF(req.file.buffer);
    // 4. Send to Gemini
    const prompt = `
    You are an expert ATS and recruiter. Compare this resume with the job description.
    Respond ONLY in valid JSON format. Do not include markdown formatting or backticks.

    Expected JSON Format:
    {
      "score": (number 0-100),
      "matchedSkills": ["skill1", "skill2"],
      "missingSkills": ["skill1", "skill2"],
      "suggestions": ["suggestion1", "suggestion2"]
    }

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}
    `;

    const aiResponse = await generateAIResponse(prompt);
    const parsedResponse = parseJsonFromText(aiResponse, {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      suggestions: ["AI response could not be parsed. Please try again."],
    });

    // 5. Deduct credits and log
    await deductCredits(userId, 10);
    await logActivity({
      userId,
      feature: "job_fit",
      prompt: "Job Fit Analysis",
      result: JSON.stringify(parsedResponse),
      creditsUsed: 10,
    });

    res.json({
      success: true,
      data: parsedResponse,
    });

  } catch (err) {
    console.error("JOB FIT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to analyze job fit",
    });
  }
};