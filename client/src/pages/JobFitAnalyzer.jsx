import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { 
  UploadCloud, 
  FileText, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Loader2, 
  ArrowRight 
} from "lucide-react";

export default function JobFitAnalyzer() {
  const { getToken } = useAuth();

  const [file, setFile] = useState(null); // Back to using a file!
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!file || !jd) {
      toast.error("Please upload a resume and paste the job description");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      // ⭐ Use FormData to send both the file and the text
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jd);

      const baseUrl = import.meta.env.VITE_API_URL || "";
      const { data } = await axios.post(
        `${baseUrl}/api/job-fit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Tell Express a file is coming
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        const payload = data.data;

        if (payload && typeof payload === "object") {
          setResult(payload);
        } else if (typeof payload === "string") {
          const cleanedString = payload.replace(/```json|```/g, "").trim();
          setResult(JSON.parse(cleanedString));
        } else {
          throw new Error("Unexpected response format from server");
        }

        toast.success("Job fit analysis complete!");
      }

    } catch (err) {
      console.error("Job Fit Error:", err);
      toast.error(err.response?.data?.message || "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-text-light dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Target className="text-primary" size={28} /> 
            </div>
            Job Fit Analyzer
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mt-2">
            Upload your resume and paste a job description to see how well you match the role.
          </p>
        </div>

        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Resume Upload (Restored!) */}
          <div className="glass-panel p-6 flex flex-col h-full">
            <h3 className="font-semibold text-text-light dark:text-white mb-4 flex items-center gap-2">
              <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Upload Resume
            </h3>
            <div className={`
              flex-grow relative group border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center
              ${file ? "border-primary bg-primary/5 dark:bg-primary/20" : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50/50 dark:hover:bg-gray-800/30"}
            `}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className={`p-3 rounded-full mb-3 ${file ? "bg-primary/20 text-primary" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"} transition-colors`}>
                {file ? <FileText size={24} /> : <UploadCloud size={24} />}
              </div>
              <p className="text-sm font-medium text-text-light dark:text-white">
                {file ? file.name : "Drop PDF here or click to upload"}
              </p>
            </div>
          </div>

          {/* Card 2: Job Description Textarea */}
          <div className="glass-panel p-6 flex flex-col h-full">
            <h3 className="font-semibold text-text-light dark:text-white mb-4 flex items-center gap-2">
               <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
               Paste Job Description
            </h3>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="flex-grow w-full p-4 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none text-sm"
              placeholder="Paste the full job description text here..."
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`
              flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-white text-lg transition-all transform shadow-3d hover-3d
              ${loading 
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed shadow-none" 
                : "bg-primary hover:bg-primary-dark"}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Analyzing Fit...</span>
              </>
            ) : (
              <>
                <span>Run Analysis (10 Credits)</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Score Banner */}
            <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-text-light dark:text-white">Match Score</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Based on keyword matching and semantic analysis</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className={`
                  relative w-32 h-32 rounded-full flex items-center justify-center border-8 shadow-inner bg-white dark:bg-bg-dark
                  ${getScoreColor(result.score)}
                `}>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-text-light dark:text-white">{result.score}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6">
                <div className="flex items-center gap-2 mb-4 text-emerald-600">
                  <CheckCircle2 size={20} />
                  <h3 className="font-bold text-text-light dark:text-white">Matched Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6">
                <div className="flex items-center gap-2 mb-4 text-rose-500">
                  <XCircle size={20} />
                  <h3 className="font-bold text-text-light dark:text-white">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-full border border-rose-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="glass-panel bg-primary/5 dark:bg-primary/10 border-primary/20 p-6">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Lightbulb size={20} />
                <h3 className="font-bold text-text-light dark:text-white">How to Improve Your Odds</h3>
              </div>
              <ul className="space-y-3">
                {result.suggestions?.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    <span className="leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}