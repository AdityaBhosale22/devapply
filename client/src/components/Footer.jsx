import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

return (
    <footer className="w-full bg-bg-light dark:bg-bg-dark pt-16 pb-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
             <img src={assets.logo} alt="DevApply Logo" className="h-8 w-auto" />
          </div>
          {/* Changed text to slate-300 for visibility on dark background */}
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            The AI-powered career assistant helping developers land their dream jobs. 
            Optimize resumes, generate cover letters, and track applications in one place.
          </p>
          <div className="flex gap-4 text-slate-300">
             <a href="https://x.com/adityyaxb" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition"><Twitter size={20} /></a>
             <a href="https://www.linkedin.com/in/adityabhosale22/" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Product Links */}
        <div>
          {/* Changed heading to white */}
          <h3 className="font-semibold text-white mb-4">Product</h3>
          {/* Changed links to slate-300 and hover to indigo-400 */}
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link to="/app/resumeanalyzer" className="hover:text-indigo-400 transition">Resume Analyzer</Link></li>
            <li><Link to="/app/coverlettergenerator" className="hover:text-indigo-400 transition">Cover Letter Generator</Link></li>
            <li><Link to="/app/projectbulletgenerator" className="hover:text-indigo-400 transition">Project Bullet Enhancer</Link></li>
            <li><Link to="/app/pricing" className="hover:text-indigo-400 transition">Pricing Plans</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-sm text-slate-300 mb-4">
            Get the latest career tips and feature updates delivered to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Made the button a vibrant indigo for better visibility */}
            <button type="submit" className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer">
              Subscribe
            </button>
            {status === "error" && (
              <p className="text-sm text-rose-400">Please enter your email address</p>
            )}
            {status === "success" && (
              <p className="text-sm text-emerald-400">Thanks for subscribing!</p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      {/* Removed top border and added flex layout to position copyright and portfolio link */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} DevApply. All rights reserved.
        </p>
        <p className="text-sm text-slate-400">
          Built by <a href="https://www.adityabhosale.dev" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">www.adityabhosale.dev</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;