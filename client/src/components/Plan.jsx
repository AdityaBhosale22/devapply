import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div className="max-w-4xl mx-auto z-20 my-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-text-light dark:text-white">
          Choose Your Plan
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-xl mx-auto">
          Start for Free and scale as you grow. Find the perfect plan for your career advancement needs.
        </p>
      </div>
      <div className="mt-10 mx-auto max-sm:px-2 rounded-2xl glass-panel p-6 sm:p-10">
        <PricingTable />
      </div>
    </div>
  );
};

export default Plan;
