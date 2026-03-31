import React from "react";
import { Check, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    credits: "100 Credits",
    description: "Perfect to explore DevApply",
    features: [
      "Resume Analyzer",
      "Basic AI Features",
      "Standard Processing Speed",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    credits: "1000 Credits",
    description: "For serious job hunters 😏",
    features: [
      "Everything in Free",
      "Priority AI Processing",
      "Advanced Resume Insights",
      "Premium Support",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "₹999",
    credits: "Unlimited Credits",
    description: "Unlimited power 🚀",
    features: [
      "Everything in Pro",
      "Unlimited AI Usage",
      "Early Feature Access",
      "VIP Experience",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  const { getToken } = useAuth();

  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleUpgrade = async (planType) => {
    try {
      setLoadingPlan(planType); // ⭐ lock button

      const token = await getToken();
      const BASE_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(
        `${BASE_URL}/api/subscription/upgrade`,
        { planType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upgrade failed");
    } finally {
      setLoadingPlan(null); // ⭐ unlock button
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-white p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Upgrade Your Experience 🚀
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Choose the plan that matches your ambition.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-2xl p-8 transition-all duration-300
                glass-panel hover-3d
                ${
                  plan.highlight
                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/20 scale-105"
                    : "border-gray-200/50 dark:border-gray-700/50"
                }
              `}
            >
              {/* Recommended Badge */}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-primary px-4 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1 shadow-md shadow-primary/40">
                    <Sparkles size={14} />
                    Recommended
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2 text-text-light dark:text-white">{plan.name}</h2>

              <div className="text-4xl font-bold mb-1 text-text-light dark:text-white">
                {plan.price}
                <span className="text-base text-gray-400"> / month</span>
              </div>

              <p className="text-primary font-medium mb-4">{plan.credits}</p>

              <p className="text-gray-500 dark:text-gray-400 mb-6">{plan.description}</p>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
                  >
                    <Check size={18} className="text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={loadingPlan === plan.name.toLowerCase()}
                onClick={() => handleUpgrade(plan.name.toLowerCase())}
                className={`
    w-full py-3 rounded-lg font-medium transition-all duration-300
    ${loadingPlan === plan.name.toLowerCase() ? "opacity-70 cursor-not-allowed" : ""}
    ${
      plan.highlight
        ? "bg-primary text-white hover:bg-primary-dark shadow-3d"
        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    }
  `}
              >
                {loadingPlan === plan.name.toLowerCase()
                  ? "Processing..."
                  : plan.highlight
                    ? "Upgrade to Pro 🚀"
                    : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
