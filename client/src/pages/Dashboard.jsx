import React, { useEffect, useState } from "react";
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
import toast from "react-hot-toast";

// Helper to map feature names to icons/colors
const getFeatureStyle = (featureName) => {
  const styles = {
    "Resume Analyzer": { icon: FileText, color: "text-blue-600 bg-blue-100" },
    "Cover Letter Generator": {
      icon: PenTool,
      color: "text-purple-600 bg-purple-100",
    },
    "Job Fit Analyzer": {
      icon: Target,
      color: "text-emerald-600 bg-emerald-100",
    },
    "Project Bullet Generator": {
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
  const [analytics, setAnalytics] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_API_URL || "";

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
  };

  useEffect(() => {
    if (isLoaded) {
      fetchDashboardData();
    }
  }, [isLoaded]);

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
                <LayoutDashboard className="text-primary" size={28} />
              </div>
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Welcome back! Here's an overview of your career optimization.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Analyses */}
          <div className="glass-panel p-6 flex items-center justify-between hover-3d pointer-events-none sm:pointer-events-auto">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Activities
              </p>
              <h2 className="text-3xl font-bold text-text-light dark:text-white">
                {stats.totalAnalyses}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Activity size={24} />
            </div>
          </div>

          {/* Active Plan */}
          <div className="glass-panel p-6 flex items-center justify-between hover-3d pointer-events-none sm:pointer-events-auto">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Current Plan
              </p>
              <h2 className="text-3xl font-bold text-text-light dark:text-white">
                {stats.planType}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <CreditCard size={24} />
            </div>
          </div>

          {/* Credits Remaining */}
          <div className="glass-panel p-6 flex items-center justify-between hover-3d pointer-events-none sm:pointer-events-auto">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Credits Left
              </p>
              <h2 className="text-3xl font-bold text-primary">
                {stats.creditsRemaining}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap size={24} />
            </div>
          </div>
        </div>

        {/* Charts & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Usage Chart */}
          <div className="glass-panel p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-gray-400" size={20} />
              <h2 className="text-xl font-bold text-text-light dark:text-white">
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
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="feature"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.9)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="usage"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="glass-panel overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              <h2 className="font-bold text-text-light dark:text-white text-xl">
                Recent Activity
              </h2>
            </div>

            <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50 overflow-y-auto max-h-[350px]">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => {
                  const { icon: Icon, color } = getFeatureStyle(
                    activity.feature,
                  );
                  return (
                    <div
                      key={activity.id}
                      className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20`}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-text-light dark:text-gray-200">
                            {formatFeature(activity.feature)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        -{activity.credits_used} credits
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <Activity size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
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
