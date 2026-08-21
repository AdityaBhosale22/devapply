// Plan.jsx
//[cite: 4]
import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <section className="bg-white py-20 px-5 sm:px-8 max-w-[88rem] mx-auto">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#111111]/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#111111]/50"></span>
          Pricing
        </div>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#111111]">
          Choose Your Plan
        </h2>
        <p className="text-[#111111]/60 text-base max-w-md mt-2">
          Start for Free and scale as you grow. Find the perfect plan for your career advancement needs.
        </p>
      </div>

      <div className="mx-auto rounded-[2rem] bg-[#0a0a0a] text-white p-8 sm:p-12 shadow-2xl">
        <PricingTable />
      </div>
    </section>
  );
};

export default Plan;