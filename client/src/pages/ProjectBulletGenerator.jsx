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
import axios from "axios";
import { useAuth } from "@clerk/clerk-react"; // Use @clerk/nextjs if you are on Next.js

export default function ProjectBulletGenerator() {
  const { getToken } = useAuth(); // ⭐ Initialize Clerk auth

  const [title, setTitle] = useState("");
  const [stack, setStack] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!title || !stack || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // ⭐ 1. Get the auth token
      const token = await getToken();

      // ⭐ 2. Make the real API call
      // (Assuming you kept the Vite proxy we set up earlier)
      const { data } = await axios.post(
        "http://localhost:5000/api/project-bullets",
        {
          projectName: title, // Map frontend 'title' to backend 'projectName'
          techStack: stack, // Map frontend 'stack' to backend 'techStack'
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ⭐ 3. Set the real AI response
      if (data.success) {
        setResult(data.data);
        toast.success("Project bullets generated!");
      }
    } catch (err) {
      console.error("Error calling backend:", err);
      toast.error(
        err.response?.data?.message || "Failed to generate bullets. Try again.",
      );
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-text-light dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Code2 className="text-primary" size={28} />
            </div>
            Project Bullet Generator
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mt-2">
            Turn your side projects into impact-driven resume bullet points that
            recruiters love.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Input Form */}
          <div className="glass-panel p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <PenTool className="text-primary" size={20} />
              <h2 className="font-semibold text-text-light dark:text-white">Project Details</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="e.g. DevApply SaaS"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="e.g. React, Node.js, PostgreSQL, Redis"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Mentioning specific tools helps the AI add technical keywords.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  What did you build?
                </label>
                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none text-sm leading-relaxed"
                  placeholder="Briefly describe the core features and any challenges you solved (e.g., 'Built a real-time chat app using WebSockets that handles 10k concurrent users')."
                />
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
                  <span>Generating Bullets...</span>
                </>
              ) : (
                <>
                  <Rocket size={18} />
                  <span>Generate Bullets (5 Credits)</span>
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
                  className="flex items-center gap-2 px-4 py-2 glass-panel shadow-sm text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors hover-3d"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={downloadBullets}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-medium hover:bg-primary/20 transition-colors hover-3d shadow-sm"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            )}

            {/* The "Resume Paper" Look */}
            <div
              className={`
              flex-grow glass-panel p-8 md:p-10 transition-all duration-500
              ${!result ? "flex flex-col items-center justify-center bg-white/30 dark:bg-black/10 border-dashed border-2 min-h-[400px]" : "min-h-[400px]"}
            `}
            >
              {result ? (
                <div>
                  <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    <h3 className="text-xl font-bold text-text-light dark:text-white">
                      {title || "Project Title"}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                      {stack || "Tech Stack"}
                    </span>
                  </div>
                  <div className="prose prose-slate dark:prose-invert prose-sm max-w-none leading-relaxed">
                    <Markdown>{result}</Markdown>
                  </div>

                  <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20 flex gap-3">
                    <Sparkles
                      className="text-primary flex-shrink-0"
                      size={18}
                    />
                    <p className="text-xs text-text-light dark:text-gray-300">
                      <strong className="text-primary">Pro Tip:</strong> Add metrics! Instead of
                      "Optimized performance," say "Reduced load times by 40%."
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 max-w-xs mx-auto opacity-60">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Rocket className="text-gray-400 dark:text-gray-500" size={32} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-medium">
                    Your bullets will appear here
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
