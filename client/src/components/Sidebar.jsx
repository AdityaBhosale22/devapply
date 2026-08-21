// Sidebar.jsx
//[cite: 5]
import React from "react";
import { NavLink } from "react-router-dom";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  House,
  SquarePen,
  Hash,
  FileText,
  Users,
  Scissors,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: House },
  { to: "/app/resumeanalyzer", label: "Resume Analyzer", icon: FileText },
  { to: "/app/coverlettergenerator", label: "Cover Letter", icon: SquarePen },
  { to: "/app/projectbulletgenerator", label: "Project Bullets", icon: Hash },
  { to: "/app/jobfitanalyzer", label: "Job Fit", icon: Users },
  { to: "/app/usage", label: "Usage", icon: Scissors },
];

export default function Sidebar({ sidebar, setSidebar }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <aside
      className={`
        fixed sm:relative top-0 left-0 h-screen w-64 bg-[#f1f0ee] border-r border-[#e6e5e2] flex flex-col justify-between z-40
        transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}
      `}
    >
      <div className="flex-1 overflow-y-auto py-8">
        <div className="flex flex-col items-center mb-10 px-6">
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover mb-3"
          />
          <h1 className="text-sm font-semibold text-[#111111]">{user.fullName}</h1>
        </div>
        
        <nav className="px-4 flex flex-col gap-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-[0.875rem] transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-[#0a0a0a] text-white"
                    : "text-[#111111]/70 hover:bg-[#e3e2df] hover:text-[#111111]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#111111]/50"}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-[#e6e5e2]">
        <div 
          className="flex items-center justify-between p-3 rounded-[1.25rem] bg-white border border-[#e6e5e2] cursor-pointer hover:bg-[#f1f0ee] transition-colors"
          onClick={() => { openUserProfile(); setSidebar(false); }}
        >
          <div className="flex gap-3 items-center">
            <img src={user.imageUrl} alt={user.fullName} className="w-8 h-8 rounded-full" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#111111] truncate max-w-[80px]">
                {user.fullName}
              </span>
              <span className="text-[10px] font-medium text-[#b15f2c] uppercase tracking-wide">
                <Protect plan="premium" fallback="Free">Premium</Protect>
              </span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); signOut(); }}
            className="p-1.5 text-[#111111]/40 hover:text-[#0a0a0a] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}