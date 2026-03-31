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
      const BASE_URL = import.meta.env.VITE_API_URL;

      // Parallel Fetch: Analytics, Credits, and Activities
      const [analyticsRes, creditsRes, activitiesRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/api/analytics`, { headers }),     // Your new endpoint
        axios.get(`${BASE_URL}/api/user/credits`, { headers }),  // To get exact remaining balance
        axios.get(`${BASE_URL}/api/activities`, { headers })     // For the history table
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
      <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-text-light dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Activity className="text-primary" size={28} />
              </div>
              Usage & Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Track your credit consumption and spending trends.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-text-light dark:bg-white text-white dark:text-text-light font-medium rounded-lg transition-colors shadow-3d hover-3d">
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
          <div className="glass-panel p-6 flex flex-col justify-between hover-3d pointer-events-none sm:pointer-events-auto">
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Top Spending Feature</span>
              </div>
              <h2 className="text-2xl font-bold text-text-light dark:text-white truncate">
                {mostExpensive ? formatFeature(mostExpensive.feature) : "N/A"}
              </h2>
            </div>
            {mostExpensive && (
              <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <TrendingUp size={12} />
                  {mostExpensive.credits_spent} credits used total
                </p>
              </div>
            )}
          </div>

          {/* Card 3: Remaining (Real Data) */}
          <div className="glass-panel p-6 flex items-center justify-between relative overflow-hidden hover-3d pointer-events-none sm:pointer-events-auto">
             <div className="relative z-10">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold text-text-light dark:text-white">{creditsRemaining}</h2>
                <p className="text-xs text-primary font-medium mt-2">Refreshes monthly</p>
             </div>
             <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full"></div>
             </div>
          </div>
        </div>

        {/* 📈 Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Usage Breakdown List */}
          <div className="lg:col-span-1 glass-panel p-6 h-fit">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200/50 dark:border-gray-700/50 pb-4">
              <PieChart className="text-gray-400" size={20} />
              <h2 className="font-bold text-text-light dark:text-white">Usage Breakdown</h2>
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
                        <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                           <Icon size={14} className="text-gray-400" /> 
                           {formatFeature(item.feature)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">{item.credits_spent} credits</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">No usage data available yet.</p>
              )}
            </div>
          </div>

          {/* Right: Daily Spend Chart */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* The Chart Widget */}
            <div className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-gray-400" size={20} />
                <h2 className="font-bold text-text-light dark:text-white">Daily Spending Trend</h2>
              </div>
              
              <div className="h-[300px] w-full">
                {analytics.dailyUsage && analytics.dailyUsage.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailyUsage}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94A3B8', fontSize: 12}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94A3B8', fontSize: 12}} 
                      />
                      <Tooltip 
                        cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                        contentStyle={{
                          borderRadius: '12px', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          background: 'rgba(255,255,255,0.9)',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
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
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <p>No daily activity recorded yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent History Table */}
            <div className="glass-panel overflow-hidden">
               <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2">
                  <Clock className="text-gray-400" size={20} />
                  <h2 className="font-bold text-text-light dark:text-white">Recent Transactions</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200/50 dark:border-gray-700/50">
                     <tr>
                       <th className="px-6 py-4">Feature</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4 text-right">Cost</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                     {recentActivity.slice(0, 5).map((item, idx) => (
                       <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                         <td className="px-6 py-4 font-medium text-text-light dark:text-gray-200">
                           {formatFeature(item.feature)}
                         </td>
                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                           {new Date(item.created_at).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-300">
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
const Card = ({ title, value, icon: Icon, subtext, color }) => (
  <div className="glass-panel p-6 flex flex-col justify-between hover-3d pointer-events-none sm:pointer-events-auto">
    <div>
      <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
        <Icon size={18} />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <h2 className="text-3xl font-bold text-text-light dark:text-white">{value}</h2>
    </div>
    {subtext && (
      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <TrendingUp size={12} />
          {subtext}
        </p>
      </div>
    )}
  </div>
);