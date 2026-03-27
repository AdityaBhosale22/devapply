import { extractTextFromPDF } from "../utils/pdfParser.js";
import { generateAIResponse } from "../services/ai.service.js";
import { deductCredits, getUserCredits } from "../utils/credits.js";
import { logActivity } from "../utils/activityLogger.js";
import { validateSubscription } from "../utils/subscriptionGuard.js";

export const analyzeJobFit = async (req, res) => {

  try {

    console.log("=== JOB FIT CONTROLLER START ===");

    const { userId, sessionClaims } = req.auth();

    const jobDescription = req.body.jobDescription;

    // validate inputs
    if (!req.file || !jobDescription) {

      return res.status(400).json({
        success:false,
        message:"Resume + Job Description required"
      });

    }

    // ⭐ IMPORTANT
    const subCheck = await validateSubscription(
      userId,
      sessionClaims,
      "u:job_fit_analysis"
    );

    if (!subCheck.valid) {

      return res.status(403).json({
        success:false,
        message:"Your plan does not include Job Fit Analysis"
      });

    }

    // check credits
    const credits = await getUserCredits(userId);

    if (credits < 10) {

      return res.status(403).json({
        success:false,
        message:"10 credits required"
      });

    }

    // extract pdf
    const resumeText = await extractTextFromPDF(req.file.buffer);

    const prompt = `
Compare resume with job description.

Return JSON:

{
 "score": 0-100,
 "matchedSkills": [],
 "missingSkills": [],
 "suggestions": []
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

    const aiResponse = await generateAIResponse(prompt);

    await deductCredits(userId,10);

    await logActivity({

      userId,
      feature: "job_fit",
      prompt:jobDescription.slice(0,200),
      result:JSON.stringify(aiResponse),
      creditsUsed:10

    });

    res.json({

      success:true,
      data:aiResponse

    });

  }

  catch(err){

    console.log("JOB FIT ERROR",err);

    res.status(500).json({

      success:false,
      message:"Job fit failed"

    });

  }

};