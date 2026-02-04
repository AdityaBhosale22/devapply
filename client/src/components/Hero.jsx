import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import gradientBackground from "/src/assets/gradientBackground.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        flex flex-col justify-center items-center
        w-full px-4 sm:px-20 xl:px-32
        min-h-screen bg-cover bg-repeat
        style={{ backgroundImage: `url(${gradientBackground})` }}
      "
    >
      <div className="text-center m-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold leading-[1.2]">
          Create your future with <br />{" "}
          <span className="text-primary">DevApply</span>{" "}
        </h1>
        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-3xl mx-auto">
          Join us and start building your career today.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button
          onClick={() => navigate()}
          className="bg-primary text-black px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer"
        >
          Start creating now
        </button>
        <button className="bg-pink text-primary px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer">
          Watch demo
        </button>
      </div>

      <div className="flex items-center gap-4 mt-8 mx-auto text-gray-600">
        <img src={assets.user_group} alt="" className="h-8" />
        Trusted by 1K+ creators
      </div>
    </div>
  );
};

export default Hero;
