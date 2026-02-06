import React, { useEffect, useState } from "react";
import { 
  PieChart, 
  Activity, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  Zap, 
  FileText, 
  Target, 
  PenTool, 
  Code 
} from "lucide-react";

export default function Usage() {
  const [usage, setUsage] = useState(null);

  // TEMP mock data
  useEffect(() => {
    setUsage({
      totalCredits: 100,
      usedCredits: 23,
      breakdown: [
        { feature: "Resume Analyzer", credits: 10, icon: FileText, color: "text-blue-600 bg-blue-100" },
        { feature: "Cover Letter", credits: 6, icon: PenTool, color: "text-purple-600 bg-purple-100" },
        { feature: "Job Fit Analyzer", credits: 4, icon: Target, color: "text-emerald-600 bg-emerald-100" },
        { feature: "Project Bullets", credits: 3, icon: Code, color: "text-orange-600 bg-orange-100" },
      ],
      history: [
        {
          feature: "Resume Analyzer",
          credits: 5,
          date: "2026-02-04",
          status: "Completed"
        },
        {
          feature: "Cover Letter",
          credits: 3,
          date: "2026-02-03",
          status: "Completed"
        },
        {
          feature: "Job Fit Analyzer",
          credits: 4,
          date: "2026-02-01",
          status: "Completed"
        },
      ],
    });
  }, []);

  if (!usage) return null;

  const percentageUsed = Math.round((usage.usedCredits / usage.totalCredits) * 100);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Activity className="text-indigo-600" />
              Usage & Billing
            </h1>
            <p className="text-slate-500 text-lg">
              Track your consumption and manage your AI credits.
            </p>
          </div>
          
          <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors shadow-sm">
            Upgrade Plan
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            title="Total Credits" 
            value={usage.totalCredits} 
            icon={CreditCard}
            subtext="Monthly allocation"
          />
          <Card 
            title="Credits Used" 
            value={usage.usedCredits} 
            icon={Zap}
            subtext={`${percentageUsed}% of total limit`}
          />
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-sm font-medium text-slate-500 mb-1">Remaining</p>
                <h2 className="text-4xl font-bold text-slate-900">{usage.totalCredits - usage.usedCredits}</h2>
                <p className="text-xs text-indigo-600 font-medium mt-2">Refreshes in 14 days</p>
             </div>
             {/* Visual Circle Background */}
             <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-indigo-100 rounded-full"></div>
             </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Breakdown (Takes up 1 space) */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <PieChart className="text-slate-400" size={20} />
              <h2 className="font-bold text-slate-800">Usage Breakdown</h2>
            </div>
            
            <div className="space-y-6">
              {usage.breakdown.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                       <item.icon size={14} className="text-slate-400" /> 
                       {item.feature}
                    </span>
                    <span className="text-slate-500">{item.credits} credits</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${(item.credits / usage.usedCredits) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h4 className="text-sm font-semibold text-slate-800 mb-1">Need more?</h4>
               <p className="text-xs text-slate-500 mb-3">Upgrade to Pro to get 1,000 monthly credits and unlock advanced features.</p>
               <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Plans &rarr;</button>
            </div>
          </div>

          {/* Right Column: History (Takes up 2 spaces) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-slate-400" size={20} />
                <h2 className="font-bold text-slate-800">Recent Activity</h2>
              </div>
              <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Feature</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usage.history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{item.feature}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.status || "Completed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.date}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600">-{item.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper Components

const Card = ({ title, value, icon: Icon, subtext }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-2 mb-2 text-slate-500">
        <Icon size={18} />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
    </div>
    {subtext && (
      <div className="mt-4 pt-4 border-t border-slate-50">
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <TrendingUp size={12} />
          {subtext}
        </p>
      </div>
    )}
  </div>
);