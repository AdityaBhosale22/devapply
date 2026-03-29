import { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate,Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();


  return user ? (
    <div className="flex flex-col items-start justify-start h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <nav className="w-full px-8 min-h-16 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-md z-40">
        <img
          className="cursor-pointer w-32 sm:w-40 drop-shadow-sm"
          src={assets.logo}
          alt="logo"
          onClick={() => navigate("/")}
        />
        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-600 dark:text-gray-300 sm:hidden cursor-pointer hover:text-primary transition-colors"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-600 dark:text-gray-300 sm:hidden cursor-pointer hover:text-primary transition-colors"
          />
        )}
      </nav>
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1 bg-bg-light dark:bg-bg-dark overflow-y-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  ): ( 
    <div className="flex items-center justify-center h-screen bg-bg-light dark:bg-bg-dark">
      <SignIn/>
    </div>
  )
};

export default Layout;