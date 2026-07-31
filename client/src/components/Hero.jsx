import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import heroBackground from "/src/assets/home-hero-background.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col justify-center items-center w-full px-4 sm:px-20 xl:px-32 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-white/40" aria-hidden="true"></div>
      <div className="relative z-10 text-center mt-20 mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-text-light drop-shadow-sm">
          Elevate your career with <br />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-secondary drop-shadow-md">
            DevApply
          </span>
        </h1>
        <p className="mt-6 text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-gray-600">
          The all-in-one AI career assistant. Build targeted resumes, generate
          compelling cover letters, and score your job fit in seconds.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-5 text-sm sm:text-base">
        <button
          onClick={() => navigate("/app/dashboard")}
          className="bg-white/10 hover:bg-white/20 text-slate-900 font-semibold px-8 py-3.5 rounded-full border border-slate-500/20 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 focus:ring-4 focus:ring-slate-500/20 outline-none cursor-pointer"
        >
          Start building for free
        </button>
      </div>

      <div className="relative z-10 w-max mx-auto flex items-center gap-3 mt-12 bg-white/10 border border-slate-500/20 shadow-sm backdrop-blur-md px-5 py-2 rounded-full transition-all hover:bg-white/20">
        <div className="flex -space-x-2">
          <img 
            src={assets.user_group} 
            alt="creators" 
            className="h-8 rounded-full object-contain ring-2 ring-white/40" 
          />
        </div>
        <p className="text-sm text-slate-700 font-medium">
          Trusted by <span className="text-slate-900 font-bold">10,000+</span> professionals
        </p>
      </div>
    </div>
  );
};

export default Hero;
