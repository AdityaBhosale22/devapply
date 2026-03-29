import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import gradientBackground from "/src/assets/gradientBackground.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col justify-center items-center w-full px-4 sm:px-20 xl:px-32 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${gradientBackground})` }}
    >
      <div className="text-center mt-20 mb-10 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-text-light dark:text-white drop-shadow-sm">
          Elevate your career with <br />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-md">
            DevApply
          </span>
        </h1>
        <p className="mt-6 text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          The all-in-one AI career assistant. Build targeted resumes, generate compelling cover letters, and score your job fit in seconds.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-5 text-sm sm:text-base z-10">
        <button
          onClick={() => navigate("/app/dashboard")}
          className="bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3.5 rounded-full hover-3d shadow-3d focus:ring-4 focus:ring-primary/30 outline-none"
        >
          Start building for free
        </button>
        <button 
          className="glass hover:bg-white/80 dark:hover:bg-gray-800/80 text-text-light dark:text-text-dark font-medium px-8 py-3.5 rounded-full hover-3d transition-all focus:ring-4 focus:ring-gray-300/30 outline-none"
        >
          Watch how it works
        </button>
      </div>

      <div className="flex items-center gap-4 mt-16 mx-auto text-gray-500 dark:text-gray-400 font-medium z-10 glass px-6 py-2.5 rounded-full">
        <div className="flex -space-x-2">
          {/* Using a placeholder circle icon or asset image if multiple avatars are needed. The existing user_group works. */}
          <img src={assets.user_group} alt="creators" className="h-8 object-contain" />
        </div>
        <p className="text-sm">Trusted by <span className="text-gray-900 dark:text-white font-bold">10,000+</span> professionals</p>
      </div>
    </div>
  );
};

export default Hero;
