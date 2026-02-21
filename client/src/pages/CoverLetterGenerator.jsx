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

    const { data } = await axios.post("http://localhost:5000/api/cover-letter",
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
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Cover Letter Generator
            </h1>
            <p className="text-slate-500 text-lg">
              Create a persuasive, job-specific cover letter in seconds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: Input Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Wand2 className="text-indigo-600" size={20} />
              <h2 className="font-semibold text-slate-800">Job Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Briefcase size={16} className="text-slate-400" />
                  Target Role
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="e.g. Backend Engineer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Building2 size={16} className="text-slate-400" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="e.g. Google"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText size={16} className="text-slate-400" />
                Job Description
              </label>
              <textarea
                rows="6"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none text-sm leading-relaxed"
                placeholder="Paste the full job description here. The AI will analyze it to match keywords and requirements."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Tone of Voice
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Professional", "Confident", "Enthusiastic", "Formal"].map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`
                      px-3 py-2 rounded-lg text-sm font-medium border transition-all
                      ${
                        tone === t
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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
                w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white transition-all shadow-md
                ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-[0.98] shadow-indigo-200"
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
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
                >
                  <Copy size={16} />
                  Copy Text
                </button>
                <button
                  onClick={downloadLetter}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors shadow-sm"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            )}

            {/* The Paper Document */}
            <div
              className={`
              flex-grow bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 min-h-[500px] transition-all duration-500
              ${!result ? "flex items-center justify-center bg-slate-50/50 border-dashed" : ""}
            `}
            >
              {result ? (
                <article className="prose prose-slate prose-sm md:prose-base max-w-none leading-relaxed text-slate-800">
                  <Markdown>{result}</Markdown>
                </article>
              ) : (
                <div className="text-center space-y-4 max-w-xs mx-auto opacity-60">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-slate-900 font-medium">
                    Your letter will appear here
                  </h3>
                  <p className="text-sm text-slate-500">
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
