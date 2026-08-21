// ActivityItem.jsx
//[cite: 1]
import { useState } from "react";
import { Download, ArrowUpRight } from "lucide-react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";

const ActivityItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const downloadContent = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([item.result], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${item.feature}_${item.id}_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success("Result downloaded successfully!");
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="group relative w-full max-w-5xl rounded-[1.25rem] bg-[#f1f0ee] hover:bg-[#e3e2df] transition-colors duration-300 p-1 mb-4">
      <div className="flex items-center justify-between gap-4 p-5 rounded-xl bg-white border border-[#e6e5e2]">
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex-1 cursor-pointer flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8d8d8d]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111]/30"></span>
            {item.feature}
          </div>
          <h2 className="font-semibold text-lg text-[#111111] tracking-tight">
            {item.prompt}
          </h2>
          <p className="text-sm text-[#8d8d8d]">
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadContent();
            }}
            className="flex items-center gap-2 rounded-full border border-[#e6e5e2] bg-transparent text-[#111111] py-2 px-4 text-sm font-medium transition-transform hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0a0a0a] text-white transition-transform hover:scale-110 active:scale-95"
          >
            <ArrowUpRight className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 text-sm text-[#111111]/80">
          <div className="prose prose-sm max-w-none prose-headings:text-[#111111] prose-a:text-[#b15f2c]">
            <Markdown>{item.result}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;