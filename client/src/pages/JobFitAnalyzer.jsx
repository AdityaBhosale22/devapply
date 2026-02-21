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

      const { data } = await axios.post(
        "http://localhost:5000/api/job-fit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Tell Express a file is coming
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Parse the Gemini JSON string
        const cleanedString = data.data.replace(/```json|```/g, "").trim();
        const parsedData = JSON.parse(cleanedString);
        
        setResult(parsedData);
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
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Target className="text-indigo-600" /> 
            Job Fit Analyzer
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Upload your resume and paste a job description to see how well you match the role.
          </p>
        </div>

        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Resume Upload (Restored!) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Upload Resume
            </h3>
            <div className={`
              flex-grow relative group border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center
              ${file ? "border-indigo-500 bg-indigo-50/30" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"}
            `}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className={`p-3 rounded-full mb-3 ${file ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
                {file ? <FileText size={24} /> : <UploadCloud size={24} />}
              </div>
              <p className="text-sm font-medium text-slate-700">
                {file ? file.name : "Drop PDF here or click to upload"}
              </p>
            </div>
          </div>

          {/* Card 2: Job Description Textarea */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
               <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
               Paste Job Description
            </h3>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none text-sm"
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
              flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-white text-lg transition-all transform active:scale-95 shadow-lg
              ${loading 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-slate-900">Match Score</h2>
                <p className="text-slate-500 text-sm mt-1">Based on keyword matching and semantic analysis</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className={`
                  relative w-32 h-32 rounded-full flex items-center justify-center border-8 
                  ${getScoreColor(result.score)}
                `}>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-slate-800">{result.score}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4 text-emerald-700">
                  <CheckCircle2 size={20} />
                  <h3 className="font-bold">Matched Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4 text-rose-600">
                  <XCircle size={20} />
                  <h3 className="font-bold">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-700 text-sm font-medium rounded-full border border-rose-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-indigo-700">
                <Lightbulb size={20} />
                <h3 className="font-bold">How to Improve Your Odds</h3>
              </div>
              <ul className="space-y-3">
                {result.suggestions?.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
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