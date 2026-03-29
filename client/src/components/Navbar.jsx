import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { assets } from "../assets/assets.js";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn, openSignUp } = useClerk();

  return (
    <div
      className="fixed top-0 z-50 w-full glass flex justify-between 
    items-center py-4 px-6 sm:px-20 xl:px-32 transition-all duration-300"
    >
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-40 object-contain cursor-pointer drop-shadow-sm"
        onClick={() => {
          navigate("/");
        }}
      />

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn} className="flex items-center gap-2 rounded-full text-sm font-medium
                cursor-pointer bg-primary text-white py-2.5 px-8 hover-3d shadow-3d"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
