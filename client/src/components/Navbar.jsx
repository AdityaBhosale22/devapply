import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { assets } from "../assets/assets.js";
import navbarBackground from "/src/assets/home-hero-background.jpg";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn, openSignUp } = useClerk();

  return (
    <div className="relative w-full flex justify-between items-center py-4 px-6 sm:px-20 xl:px-32">
      <div
        className="absolute -inset-3 bg-cover bg-center"
        style={{ backgroundImage: `url(${navbarBackground})`, filter: "blur(8px)" }}
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 bg-white/40" aria-hidden="true"></div>

      <img
        src={assets.logo}
        alt="logo"
        className="relative z-10 w-32 sm:w-40 object-contain cursor-pointer drop-shadow-sm"
        onClick={() => {
          navigate("/");
        }}
      />

      {user ? (
        <div className="relative z-10">
          <UserButton />
        </div>
      ) : (
        <button
          onClick={openSignIn} className="relative z-10 flex items-center gap-2 rounded-full text-sm font-medium
                cursor-pointer bg-primary text-white py-2.5 px-8 hover-3d shadow-3d"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
