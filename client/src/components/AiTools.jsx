import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Section Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-white">
          Explore Tools
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Select a tool to optimize your job application process.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => user && tool.path !== "#" && navigate(tool.path)}
            className={`
              group relative p-8 glass-panel hover-3d
              ${tool.path === "#" ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {/* Hover Gradient Effect (Subtle glow behind content) */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

            <div className="relative flex flex-col h-full z-10">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
                }}
              >
                <tool.Icon className="w-7 h-7 text-white drop-shadow-sm" />
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-white group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">
                {tool.description}
              </p>

              {/* Call to Action (Subtle Arrow) */}
              <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Launch Tool <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
