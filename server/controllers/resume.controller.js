import { extractTextFromPDF } from "../utils/pdfParser.js";
import { analyzeResumeWithAI } from "../services/ai.service.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const resumeText = await extractTextFromPDF(req.file.buffer);

    const aiResult = await analyzeResumeWithAI(resumeText);

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