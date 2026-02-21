import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateAIResponse = async (prompt) => {
  const result = await model.generateContent(prompt);
  const response = result.response; // ⭐ Removed the 'await' here
  return response.text();
};

export const analyzeResumeWithAI = async (resumeText) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key Missing");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
Analyze this resume and respond ONLY in valid JSON.

Format:

{
  "summary": "short professional summary",
  "strengths": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "missing_keywords": ["keyword 1", "keyword 2"],
  "ats_optimization": ["tip 1", "tip 2"]
}

Resume:
${resumeText}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();

    console.log("Gemini RAW Response:", text);

    // Remove markdown wrappers if present
    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.log("⚠ JSON Parse Failed. Cleaned Response:");
      console.log(cleaned);

      return {
        summary: "AI response parsing failed",
        strengths: [],
        improvements: [],
        missing_keywords: [],
        ats_optimization: []
      };
    }

  } catch (error) {
    console.error("Gemini Error:", error.message);

    return {
      summary: "AI analysis temporarily unavailable",
      strengths: [],
      improvements: [],
      missing_keywords: [],
      ats_optimization: []
    };
  }
};
