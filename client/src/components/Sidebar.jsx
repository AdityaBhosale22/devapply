// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  House,
  SquarePen,
  Hash,
  Image,
  Eraser,
  Scissors,
  FileText,
  Users,
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
    <div
      className={`
        w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col justify-between
        max-sm:absolute top-10 bottom-0 z-40
        transition-transform duration-300 ease-in-out
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}
      `}
    >
      {/* Profile Section */}
      <div className="w-full flex-1 overflow-y-auto py-6">
        <div className="flex flex-col items-center mb-8 px-6">
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-primary/20"
          />
          <h1 className="mt-3 text-sm font-semibold text-text-light dark:text-text-dark text-center">{user.fullName}</h1>
        </div>
        <div className="px-4 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400 dark:text-gray-500"}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Profile & Sign Out Buttons */}
      <div className="p-4 w-full border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/20">
        <div className="flex items-center justify-between glass-panel p-3 shadow-none border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-xl transition-colors cursor-pointer"
             onClick={() => {
               openUserProfile();
               setSidebar(false);
             }}
        >
          <div className="flex gap-3 items-center">
            <img
              src={user.imageUrl}
              alt={user.fullName}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate w-24 text-text-light dark:text-text-dark">{user.fullName}</span>
              <span className="text-xs text-primary font-medium">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>{" "}
                Plan
              </span>
            </div>
          </div>
          <LogOut
            onClick={(e) => {
              e.stopPropagation();
              signOut();
            }}
            className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
