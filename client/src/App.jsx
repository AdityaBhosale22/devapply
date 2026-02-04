import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Layout
import Layout from "./pages/Layout";

// Import Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import JobFitAnalyzer from "./pages/JobFitAnalyzer";
import ProjectBulletGenerator from "./pages/ProjectBulletGenerator";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import Usage from "./pages/Usage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<Layout />}>

        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/resumeanalyzer" element={<ResumeAnalyzer />} />
        <Route path="/app/coverlettergenerator" element={<CoverLetterGenerator />} />
        <Route path="/app/projectbulletgenerator" element={<ProjectBulletGenerator />} />
        <Route path="/app/jobfitanalyzer" element={<JobFitAnalyzer />} />
        <Route path="/app/usage" element={<Usage />} />
      </Route>
    </Routes>
  );
};

export default App;
