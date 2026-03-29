import { useState } from "react";
import { Download } from "lucide-react";
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
    <div className="p-4 max-w-5xl text-sm glass-panel text-text-light dark:text-white !bg-white/80 dark:!bg-black/20 hover:!bg-white dark:hover:!bg-black/30 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex-1 cursor-pointer"
        >
          <h2 className="font-medium text-base">{item.prompt}</h2>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {item.feature} •{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadContent();
            }}
            className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Download</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full capitalize text-xs font-semibold"
          >
            {item.feature}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 text-sm text-gray-700 dark:text-gray-300">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown>{item.result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
