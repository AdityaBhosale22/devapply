import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"; // 👈 You need to import axios to make the API call
import { useAuth } from "@clerk/clerk-react"; // 👈 Import useAuth from Clerk
import {
  Download,
  Send,
  Briefcase,
  Building2,
  FileText,
  Wand2,
  Copy,
  Loader2,
  PenTool,
} from "lucide-react";
import Markdown from "react-markdown";

export default function CoverLetterGenerator() {
  const { getToken } = useAuth(); 
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

const handleGenerate = async () => {
  if (!jobTitle || !company || !jd) {
    toast.error("Fill all fields");
    return;
  }

  try {
    setLoading(true);

    const token = await getToken();
    const BASE_URL = import.meta.env.VITE_API_URL;

    const { data } = await axios.post(`${BASE_URL}/api/cover-letter`,
      {
        role: jobTitle,
        company,
        jd,
        tone,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      setResult(data.data);
      toast.success("Cover letter generated!");
    }

  } catch (err) {
    toast.error(err.response?.data?.message || "Generation failed");
  }

  setLoading(false);
};

  const downloadLetter = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cover_letter_${company.replace(/\s+/g, "_")}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded successfully");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text-light dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <PenTool className="text-primary" size={28} />
              </div>
              Cover Letter Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Create a persuasive, job-specific cover letter in seconds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: Input Form */}
          <div className="glass-panel p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <Wand2 className="text-primary" size={20} />
              <h2 className="font-semibold text-text-light dark:text-white">Job Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-400 dark:text-gray-500" />
                  Target Role
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="e.g. Backend Engineer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Building2 size={16} className="text-gray-400 dark:text-gray-500" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="e.g. Google"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText size={16} className="text-gray-400 dark:text-gray-500" />
                Job Description
              </label>
              <textarea
                rows="6"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none text-sm leading-relaxed"
                placeholder="Paste the full job description here. The AI will analyze it to match keywords and requirements."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tone of Voice
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Professional", "Confident", "Enthusiastic", "Formal"].map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`
                      px-3 py-2 rounded-lg text-sm font-medium border transition-all hover-3d
                      ${
                        tone === t
                          ? "bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:text-primary-dark"
                          : "bg-white/50 dark:bg-black/20 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-black/40"
                      }
                    `}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white transition-all shadow-3d hover-3d
                ${
                  loading
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed shadow-none"
                    : "bg-primary hover:bg-primary-dark"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Drafting Letter...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Generate Cover Letter (3 Credits)</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Preview Panel */}
          <div className="flex flex-col h-full space-y-4">
            {/* Toolbar */}
            {result && (
              <div className="flex justify-end gap-3 animate-in fade-in slide-in-from-bottom-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 glass-panel shadow-sm text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors hover-3d"
                >
                  <Copy size={16} />
                  Copy Text
                </button>
                <button
                  onClick={downloadLetter}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-medium hover:bg-primary/20 transition-colors hover-3d shadow-sm"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            )}

            {/* The Paper Document */}
            <div
              className={`
              flex-grow glass-panel p-8 md:p-12 min-h-[500px] transition-all duration-500
              ${!result ? "flex items-center justify-center bg-white/30 dark:bg-black/10 border-dashed border-2" : ""}
            `}
            >
              {result ? (
                <article className="prose prose-slate dark:prose-invert prose-sm md:prose-base max-w-none leading-relaxed">
                  <Markdown>{result}</Markdown>
                </article>
              ) : (
                <div className="text-center space-y-4 max-w-xs mx-auto opacity-60">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <FileText className="text-gray-400 dark:text-gray-500" size={32} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-medium">
                    Your letter will appear here
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fill in the details on the left and click generate to create
                    your tailored cover letter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
