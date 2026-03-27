import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
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
  Code,
  Loader2,
  BarChart3,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Helper to format feature names (e.g. "resume_analyzer" -> "Resume Analyzer")
const formatFeature = (key) => {
  if (!key) return "Unknown";
  const map = {
    "resume_analyzer": "Resume Analyzer",
    "cover_letter": "Cover Letter",
    "job_fit": "Job Fit Analysis",
    "project_bullets": "Project Bullets",
  };
  return map[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper to map feature icons
const getFeatureIcon = (feature) => {
  const map = {
    "resume_analyzer": FileText,
    "cover_letter": PenTool,
    "job_fit": Target,
    "project_bullets": Code,
  };
  return map[feature] || Activity;
};

export default function Usage() {
  const { getToken, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // State for all data
  const [analytics, setAnalytics] = useState({
    totalCreditsUsed: 0,
    featureBreakdown: [],
    dailyUsage: [],
  });
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchUsageData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

      // Parallel Fetch: Analytics, Credits, and Activities
      const [analyticsRes, creditsRes, activitiesRes] = await Promise.allSettled([
        axios.get(`${baseUrl}/api/analytics`, { headers }),     // Your new endpoint
        axios.get(`${baseUrl}/api/user/credits`, { headers }),  // To get exact remaining balance
        axios.get(`${baseUrl}/api/activities`, { headers })     // For the history table
      ]);

      // 1. Process Analytics
      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data.data || {
          totalCreditsUsed: 0,
          featureBreakdown: [],
          dailyUsage: []
        });
      }

      // 2. Process Credits
      if (creditsRes.status === 'fulfilled') {
        setCreditsRemaining(creditsRes.value.data.data?.credits_remaining || 0);
      }

      // 3. Process Recent Activity
      if (activitiesRes.status === 'fulfilled') {
        setRecentActivity(activitiesRes.value.data.data || []);
      }

    } catch (err) {
      console.error("Usage fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) fetchUsageData();
  }, [isLoaded]);

  // Derived Stats: Most Expensive Feature
  const mostExpensive = analytics.featureBreakdown?.reduce((max, item) => 
    (item.credits_spent > (max?.credits_spent || 0) ? item : max), 
    null
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Activity className="text-indigo-600" />
              Usage & Analytics
            </h1>
            <p className="text-slate-500 text-lg">
              Track your credit consumption and spending trends.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors shadow-sm">
            Upgrade Plan
          </button>
        </div>

        {/* 📊 Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Consumed */}
          <Card 
            title="Total Credits Consumed" 
            value={analytics.totalCreditsUsed} 
            icon={Zap}
            subtext="Lifetime usage"
            color="indigo"
          />

          {/* Card 2: Most Expensive Feature */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Top Spending Feature</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 truncate">
                {mostExpensive ? formatFeature(mostExpensive.feature) : "N/A"}
              </h2>
            </div>
            {mostExpensive && (
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <TrendingUp size={12} />
                  {mostExpensive.credits_spent} credits used total
                </p>
              </div>
            )}
          </div>

          {/* Card 3: Remaining (Real Data) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-sm font-medium text-slate-500 mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold text-slate-900">{creditsRemaining}</h2>
                <p className="text-xs text-indigo-600 font-medium mt-2">Refreshes monthly</p>
             </div>
             <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-indigo-100 rounded-full"></div>
             </div>
          </div>
        </div>

        {/* 📈 Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Usage Breakdown List */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <PieChart className="text-slate-400" size={20} />
              <h2 className="font-bold text-slate-800">Usage Breakdown</h2>
            </div>
            
            <div className="space-y-6">
              {analytics.featureBreakdown && analytics.featureBreakdown.length > 0 ? (
                analytics.featureBreakdown.map((item, idx) => {
                  const Icon = getFeatureIcon(item.feature);
                  const percent = analytics.totalCreditsUsed > 0 
                    ? Math.round((item.credits_spent / analytics.totalCreditsUsed) * 100) 
                    : 0;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 font-medium text-slate-700">
                           <Icon size={14} className="text-slate-400" /> 
                           {formatFeature(item.feature)}
                        </span>
                        <span className="text-slate-500">{item.credits_spent} credits</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400 italic">No usage data available yet.</p>
              )}
            </div>
          </div>

          {/* Right: Daily Spend Chart */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* The Chart Widget */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-slate-400" size={20} />
                <h2 className="font-bold text-slate-800">Daily Spending Trend</h2>
              </div>
              
              <div className="h-[300px] w-full">
                {analytics.dailyUsage && analytics.dailyUsage.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailyUsage}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748B', fontSize: 12}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748B', fontSize: 12}} 
                      />
                      <Tooltip 
                        cursor={{fill: '#F1F5F9'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      />
                      <Bar 
                        dataKey="credits_spent" 
                        fill="#6366f1" 
                        radius={[6, 6, 0, 0]} 
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    <p>No daily activity recorded yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                  <Clock className="text-slate-400" size={20} />
                  <h2 className="font-bold text-slate-800">Recent Transactions</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4">Feature</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4 text-right">Cost</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {recentActivity.slice(0, 5).map((item, idx) => (
                       <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4 font-medium text-slate-800">
                           {formatFeature(item.feature)}
                         </td>
                         <td className="px-6 py-4 text-slate-500">
                           {new Date(item.created_at).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4 text-right font-medium text-slate-600">
                           -{item.credits_used}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Stats Card
const Card = ({ title, value, icon: IconComponent, subtext }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-2 mb-2 text-slate-500">
        {React.createElement(IconComponent, { size: 18 })}
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