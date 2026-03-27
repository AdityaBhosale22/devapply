import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  Activity,
  CreditCard,
  Zap,
  Clock,
  FileText,
  Target,
  PenTool,
  Code,
  Loader2,
  BarChart3,
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
// toast is intentionally not used on this dashboard page (keeps lint clean).

// Helper to map feature names to icons/colors
const getFeatureStyle = (featureName) => {
  const styles = {
    resume_analyzer: { icon: FileText, color: "text-blue-600 bg-blue-100" },
    cover_letter: {
      icon: PenTool,
      color: "text-purple-600 bg-purple-100",
    },
    job_fit: {
      icon: Target,
      color: "text-emerald-600 bg-emerald-100",
    },
    project_bullets: {
      icon: Code,
      color: "text-orange-600 bg-orange-100",
    },
  };
  return (
    styles[featureName] || {
      icon: Activity,
      color: "text-slate-600 bg-slate-100",
    }
  );
};

// Helper to format raw feature keys if needed (e.g. "resume_analyzer" -> "Resume Analyzer")
const formatFeature = (key) => {
  const map = {
    resume_analyzer: "Resume Analyzer",
    cover_letter: "Cover Letter",
    job_fit: "Job Fit",
    project_bullets: "Bullets",
  };
  // Fallback: Capitalize first letter if not in map
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    creditsRemaining: 0,
    planType: "Free Tier",
  });
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

      console.log(`Fetching data from: ${baseUrl}`);

      const [activitiesResult, creditsResult, planResult] =
        await Promise.allSettled([
          axios.get(`${baseUrl}/api/activities`, { headers }),
          axios.get(`${baseUrl}/api/user/credits`, { headers }),
          axios.get(`${baseUrl}/api/subscription`, { headers }), // ⭐ NEW
        ]);

      /* Activities */
      let activityData = [];
      if (activitiesResult.status === "fulfilled") {
        activityData = activitiesResult.value.data.data || [];
        setActivities(activityData);
      }

      /* Credits */
      let realCredits = 0;
      if (creditsResult.status === "fulfilled") {
        realCredits = creditsResult.value.data.data?.credits_remaining || 0;
      }

      /* Plan */
      let realPlan = "Free Tier";

      if (planResult.status === "fulfilled") {
        realPlan = planResult.value.data.data?.plan_type || "free";
      }

      /* Chart */
      const featureStats = activityData.reduce((acc, activity) => {
        acc[activity.feature] = (acc[activity.feature] || 0) + 1;
        return acc;
      }, {});

      const formattedChartData = Object.keys(featureStats).map((f) => ({
        feature: formatFeature(f),
        usage: featureStats[f],
      }));

      setChartData(formattedChartData);

      const formatPlan = (plan) => {
        const map = {
          free: "Free Tier",
          pro: "Pro Plan",
          premium: "Premium Plan",
        };

        return map[plan] || "Free Tier";
      };

      /* Stats (REAL DATA ⭐) */
      setStats({
        totalAnalyses: activityData.length,
        creditsRemaining: realCredits,
        planType: formatPlan(realPlan), // ⭐ DYNAMIC
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded) {
      fetchDashboardData();
    }
  }, [isLoaded, fetchDashboardData]);

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
              <LayoutDashboard className="text-indigo-600" />
              Dashboard
            </h1>
            <p className="text-slate-500 text-lg">
              Welcome back! Here's an overview of your career optimization.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Analyses */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Total Activities
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                {stats.totalAnalyses}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity size={24} />
            </div>
          </div>

          {/* Active Plan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Current Plan
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                {stats.planType}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard size={24} />
            </div>
          </div>

          {/* Credits Remaining */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Credits Left
              </p>
              <h2 className="text-3xl font-bold text-indigo-600">
                {stats.creditsRemaining}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap size={24} />
            </div>
          </div>
        </div>

        {/* Charts & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Usage Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-slate-400" size={20} />
              <h2 className="text-xl font-bold text-slate-800">
                Feature Usage
              </h2>
            </div>

            <div className="flex-grow min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="feature"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F1F5F9" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="usage"
                    fill="#4F46E5"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Clock className="text-slate-400" size={20} />
              <h2 className="font-bold text-slate-800 text-xl">
                Recent Activity
              </h2>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[350px]">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => {
                  const { icon: Icon, color } = getFeatureStyle(
                    activity.feature,
                  );
                  return (
                    <div
                      key={activity.id}
                      className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {formatFeature(activity.feature)}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(activity.created_at).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        -{activity.credits_used} credits
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <Activity size={32} className="text-slate-300 mx-auto mb-4" />
                  <p>No activity yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
