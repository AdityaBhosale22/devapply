export const analyzeResume = async (resumeText) => {
  const prompt = `
You are a technical recruiter.

Analyze the resume and respond ONLY in valid JSON:

{
  "strengths": [],
  "weaknesses": [],
  "missing_skills": [],
  "ats_improvements": [],
  "summary": ""
}

Resume:
${resumeText}
  `;

  // call OpenAI / Gemini here
};
