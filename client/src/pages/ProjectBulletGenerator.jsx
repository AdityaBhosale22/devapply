import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Download,
  Rocket,
  Code2,
  PenTool,
  Copy,
  Loader2,
  Sparkles,
} from "lucide-react";
import Markdown from "react-markdown";

export default function ProjectBulletGenerator() {
  const [title, setTitle] = useState("");
  const [stack, setStack] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = () => {
    if (!title || !stack || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    // TEMP mock
    setTimeout(() => {
      setResult(`
- Developed **${title}**, a full-stack SaaS platform using **${stack.split(",")[0] || "modern tech"}**, serving 500+ active users.
- Engineered robust RESTful APIs with **Node.js** and **PostgreSQL**, reducing query latency by 40% through indexing strategies.
- Implemented secure authentication and role-based access control (RBAC) using **JWT** and **OAuth2**.
- Deployed scalable infrastructure on **AWS (EC2, S3)** with automated CI/CD pipelines via GitHub Actions.
      `);

      setLoading(false);
      toast.success("Project bullets generated!");
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard");
  };

  const downloadBullets = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `project_bullets_${title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Code2 className="text-indigo-600" />
            Project Bullet Generator
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Turn your side projects into impact-driven resume bullet points that
            recruiters love.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Input Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <PenTool className="text-indigo-600" size={20} />
              <h2 className="font-semibold text-slate-800">Project Details</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Project Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="e.g. DevApply SaaS"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="e.g. React, Node.js, PostgreSQL, Redis"
                />
                <p className="text-xs text-slate-400">
                  Mentioning specific tools helps the AI add technical keywords.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  What did you build?
                </label>
                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none text-sm leading-relaxed"
                  placeholder="Briefly describe the core features and any challenges you solved (e.g., 'Built a real-time chat app using WebSockets that handles 10k concurrent users')."
                />
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
                  <span>Generating Bullets...</span>
                </>
              ) : (
                <>
                  <Rocket size={18} />
                  <span>Generate Bullets (2 Credits)</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="flex flex-col h-full space-y-4">
            {/* Toolbar */}
            {result && (
              <div className="flex justify-end gap-3 animate-in fade-in slide-in-from-bottom-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={downloadBullets}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors shadow-sm"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            )}

            {/* The "Resume Paper" Look */}
            <div
              className={`
              flex-grow bg-white rounded-xl shadow-lg border border-slate-200 p-8 md:p-10 transition-all duration-500
              ${!result ? "flex flex-col items-center justify-center bg-slate-50/50 border-dashed min-h-[400px]" : "min-h-[400px]"}
            `}
            >
              {result ? (
                <div>
                  <div className="flex items-baseline justify-between border-b border-slate-200 pb-2 mb-4">
                    <h3 className="text-xl font-bold text-slate-900">
                      {title || "Project Title"}
                    </h3>
                    <span className="text-sm text-slate-500 italic">
                      {stack || "Tech Stack"}
                    </span>
                  </div>
                  <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed">
                    <Markdown>{result}</Markdown>
                  </div>

                  <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex gap-3">
                    <Sparkles
                      className="text-indigo-600 flex-shrink-0"
                      size={18}
                    />
                    <p className="text-xs text-indigo-800">
                      <strong>Pro Tip:</strong> Add metrics! Instead of
                      "Optimized performance," say "Reduced load times by 40%."
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 max-w-xs mx-auto opacity-60">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Rocket className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-slate-900 font-medium">
                    Your bullets will appear here
                  </h3>
                  <p className="text-sm text-slate-500">
                    We'll format them exactly as they should appear on your
                    resume.
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
