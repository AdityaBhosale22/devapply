import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"; // Make sure to install: npm install axios
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

// NOTE: Import your specific auth method here.
// For example: import { useAuth } from "@clerk/clerk-react";
// Or define a helper function if you store tokens in localStorage.

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  // We fetch activity history for side-effects, but the page doesn't render it.
  // Use an empty slot to avoid `no-unused-vars` for `activities`.
  const [, setActivities] = useState([]);

  const { getToken } = useAuth();

  // Placeholder for your auth logic
  // const getToken = async () => {
  // TODO: Replace with your actual token retrieval logic
  // Example: return await window.Clerk.session.getToken();
  // Example: return localStorage.getItem("token");
  //   return "YOUR_AUTH_TOKEN";
  // };

  const fetchActivities = async () => {
    try {
      const token = await getToken();

      const res = await axios.get("http://localhost:5000/api/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setActivities(res.data.data);
    } catch (err) {
      console.error("Activities fetch failed", err);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume PDF");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const token = await getToken();

      const res = await axios.post(
        "/api/resume/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ SAFE PLACE — res EXISTS HERE
      setResult(res.data.data);

      // ✅ REFRESH HISTORY AFTER SUCCESS
      fetchActivities();

      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error("Analysis failed:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to analyze resume.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Resume Analyzer
          </h1>
          <p className="text-slate-500 max-w-2xl text-lg">
            Get instant, AI-powered feedback on your resume's strengths,
            weaknesses, and ATS compatibility.
          </p>
        </div>

        {/* Upload Section (Card) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 text-center">
          <div
            className={`
            relative group border-2 border-dashed rounded-xl p-10 transition-all duration-300
            ${file ? "border-indigo-500 bg-indigo-50/30" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"}
          `}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                className={`p-4 rounded-full ${file ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"} transition-colors`}
              >
                {file ? <FileText size={32} /> : <UploadCloud size={32} />}
              </div>

              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-700">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-slate-400">
                  {file ? "Ready to analyze" : "PDF files only (Max 5MB)"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all transform active:scale-95
                ${
                  loading || !file
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Analyze Resume (5 Credits)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Section (Dashboard Grid) */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary - Full Width */}
            <div className="md:col-span-2">
              <Section
                title="Executive Summary"
                content={result.summary}
                icon={FileText}
                color="indigo"
              />
            </div>

            {/* Strengths */}
            <ListSection
              title="Strengths"
              items={result.strengths}
              icon={CheckCircle2}
              color="green"
            />

            {/* Weaknesses */}
            <ListSection
              title="Areas for Improvement"
              items={result.improvements}
              icon={AlertTriangle}
              color="amber"
            />

            {/* Missing Skills */}
            <ListSection
              title="Missing Keywords"
              items={result.missing_keywords}
              icon={XCircle}
              color="red"
            />

            {/* ATS Improvements */}
            <ListSection
              title="ATS Optimization Steps"
              items={result.ats_optimization}
              icon={Sparkles}
              color="blue"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable UI Components */

const Section = ({ title, content, icon: IconComponent, color }) => {
  const colorStyles = {
    indigo: "text-indigo-600 bg-indigo-50",
    green: "text-green-600 bg-green-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-lg ${colorStyles[color] || "bg-slate-100"}`}
        >
          {React.createElement(IconComponent, { size: 20 })}
        </div>
        <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">{content}</p>
    </div>
  );
};

const ListSection = ({ title, items, icon: IconComponent, color }) => {
  const colorStyles = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    red: "text-rose-600 bg-rose-50 border-rose-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
  };

  const bulletStyles = {
    indigo: "bg-indigo-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-rose-500",
    blue: "bg-blue-500",
  };

  return (
    <div
      className={`p-6 rounded-2xl border h-full ${colorStyles[color]?.split(" ")[2] || "border-slate-200"} bg-white shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-lg ${colorStyles[color]?.split(" ").slice(0, 2).join(" ")}`}
        >
          {React.createElement(IconComponent, { size: 20 })}
        </div>
        <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
      </div>
      <ul className="space-y-3">
        {items?.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-slate-600 text-sm md:text-base"
          >
            <span
              className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${bulletStyles[color] || "bg-slate-400"}`}
            />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
        {(!items || items.length === 0) && (
          <li className="text-slate-400 italic text-sm">No items found.</li>
        )}
      </ul>
    </div>
  );
};
