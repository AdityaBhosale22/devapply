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
    <div className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex-1 cursor-pointer"
        >
          <h2>{item.prompt}</h2>

          <p className="text-gray-500">
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
            className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg transition-colors"
          >
            <Download className="w-3 h-3" />
            <span className="text-xs">Download</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-blue-100 border border-blue-200 text-blue-700 px-4 py-1 rounded-full capitalize"
          >
            {item.feature}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 text-sm text-slate-700">
          <div className="reset-tw">
            <Markdown>{item.result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
