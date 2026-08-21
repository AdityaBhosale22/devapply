// Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="max-w-[88rem] mx-auto flex items-center justify-between p-5 sm:px-8 sm:py-6">
        
        {/* Logo */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center text-2xl font-extrabold tracking-tighter text-[#111111] transition-transform hover:scale-105"
        >
          DevApply.
        </button>

        {/* Navigation Links - Now with onClick handlers! */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#111111]/70">
          <button 
            onClick={() => navigate("/")} 
            className="hover:text-[#111111] hover:-translate-y-0.5 transition-all"
          >
            Home
          </button>
          <button 
            onClick={() => navigate("/tools")} 
            className="hover:text-[#111111] hover:-translate-y-0.5 transition-all"
          >
            Tools
          </button>
          <button 
            onClick={() => navigate("/pricing")} 
            className="hover:text-[#111111] hover:-translate-y-0.5 transition-all"
          >
            Pricing
          </button>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border border-[#111111]/20 shadow-sm" } }} />
          ) : (
            <button
              onClick={openSignIn}
              className="inline-flex items-center justify-center rounded-full border border-[#111111]/10 bg-white/50 backdrop-blur-md px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#111111] transition-all hover:bg-white/80 hover:scale-105"
            >
              Get Started
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;