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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Dashboard
        </h2>
        <p className="text-slate-500 mt-1">
          Select a tool to optimize your job application process.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => user && tool.path !== "#" && navigate(tool.path)}
            className={`
              group relative p-6 rounded-2xl bg-white border border-slate-200 
              shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer
              hover:border-indigo-100
            `}
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

            <div className="relative flex flex-col h-full">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
                }}
              >
                <tool.Icon className="w-6 h-6 text-white" />
              </div>

              {/* Text Content */}
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-grow">
                {tool.description}
              </p>

              {/* Call to Action (Subtle Arrow) */}
              <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Launch Tool <span>&rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
