import React from "react";
import { assets } from "../assets/assets";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"; // Optional: Add social icons if needed

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 pt-16 pb-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
             <img src={assets.logo} alt="DevApply Logo" className="h-8 w-auto" />
             {/* <span className="text-xl font-bold text-slate-800">DevApply</span> */}
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            The AI-powered career assistant helping developers land their dream jobs. 
            Optimize resumes, generate cover letters, and track applications in one place.
          </p>
          {/* Social Links (Optional placeholder) */}
          <div className="flex gap-4 text-slate-400">
             <a href="#" className="hover:text-indigo-600 transition"><Twitter size={20} /></a>
             <a href="#" className="hover:text-indigo-600 transition"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-4">Product</h3>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><a href="/resume-analyzer" className="hover:text-indigo-600 transition">Resume Analyzer</a></li>
            <li><a href="/cover-letter" className="hover:text-indigo-600 transition">Cover Letter Generator</a></li>
            <li><a href="/project-bullets" className="hover:text-indigo-600 transition">Project Bullet Enhancer</a></li>
            <li><a href="/pricing" className="hover:text-indigo-600 transition">Pricing Plans</a></li>
          </ul>
        </div>

        {/* Resources Links */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-4">Resources</h3>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><a href="#" className="hover:text-indigo-600 transition">Career Blog</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Resume Templates</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Interview Prep</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Success Stories</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-4">Stay Updated</h3>
          <p className="text-sm text-slate-500 mb-4">
            Get the latest career tips and feature updates delivered to your inbox.
          </p>
          <div className="flex flex-col gap-2">
            <input
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              type="email"
              placeholder="Enter your email"
            />
            <button className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} DevApply. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-slate-800 transition">Privacy Policy</a>
          <a href="#" className="hover:text-slate-800 transition">Terms of Service</a>
          <a href="#" className="hover:text-slate-800 transition">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;