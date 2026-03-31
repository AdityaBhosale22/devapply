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
  const [activities, setActivities] = useState([]);

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
      const BASE_URL = import.meta.env.VITE_API_URL;

      const res = await axios.get(`${BASE_URL}/api/activities`, {
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
      const BASE_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(
        `${BASE_URL}/api/resume/analyze`,
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
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-text-light dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FileText className="text-primary" size={28} />
            </div>
            Resume Analyzer
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg mt-2">
            Get instant, AI-powered feedback on your resume's strengths,
            weaknesses, and ATS compatibility.
          </p>
        </div>

        {/* Upload Section (Card) */}
        <div className="glass-panel p-8 md:p-10 text-center">
          <div
            className={`
            relative group border-2 border-dashed rounded-xl p-10 transition-all duration-300
            ${file ? "border-primary bg-primary/5 dark:bg-primary/20" : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50/50 dark:hover:bg-gray-800/30"}
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
                className={`p-4 rounded-full ${file ? "bg-primary/20 text-primary" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"} transition-colors`}
              >
                {file ? <FileText size={32} /> : <UploadCloud size={32} />}
              </div>

              <div className="space-y-1">
                <p className="text-lg font-medium text-text-light dark:text-white">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
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
                flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white transition-all transform shadow-3d hover-3d
                ${
                  loading || !file
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed shadow-none"
                    : "bg-primary hover:bg-primary-dark"
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

const Section = ({ title, content, icon: Icon, color }) => {
  const colorStyles = {
    indigo: "text-primary bg-primary/10",
    green: "text-emerald-500 bg-emerald-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    red: "text-rose-500 bg-rose-500/10",
    blue: "text-cyan-500 bg-cyan-500/10",
  };

  return (
    <div className="glass-panel p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-lg ${colorStyles[color] || "bg-gray-100 dark:bg-gray-800"}`}
        >
          <Icon size={20} />
        </div>
        <h2 className="font-bold text-text-light dark:text-white text-lg">{title}</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{content}</p>
    </div>
  );
};

const ListSection = ({ title, items, icon: Icon, color }) => {
  const colorStyles = {
    indigo: "text-primary bg-primary/10",
    green: "text-emerald-500 bg-emerald-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    red: "text-rose-500 bg-rose-500/10",
    blue: "text-cyan-500 bg-cyan-500/10",
  };

  const bulletStyles = {
    indigo: "bg-primary",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-rose-500",
    blue: "bg-cyan-500",
  };

  return (
    <div
      className="p-6 rounded-2xl glass-panel h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-lg ${colorStyles[color]}`}
        >
          <Icon size={20} />
        </div>
        <h2 className="font-bold text-text-light dark:text-white text-lg">{title}</h2>
      </div>
      <ul className="space-y-3">
        {items?.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm md:text-base"
          >
            <span
              className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${bulletStyles[color] || "bg-gray-400"}`}
            />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
        {(!items || items.length === 0) && (
          <li className="text-gray-400 dark:text-gray-500 italic text-sm">No items found.</li>
        )}
      </ul>
    </div>
  );
};
