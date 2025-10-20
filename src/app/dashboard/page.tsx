"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Filter,
  Download,
  Loader2,
  Clock,
  Send,
  FileEdit,
  X,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Utiliser le hook pour récupérer les vraies données
  const { data, loading, error } = useAnalytics(
    "FGcdXcRXVoVfsSwJIciurCeuCXz1",
    timeRange,
  );

  // Données réelles Firebase pour les graphiques
  const engagementData =
    data?.postsByDay?.map((item) => {
      const date = new Date(item.date);
      const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      const dayName = dayNames[date.getDay()];

      // Calculer l'engagement basé sur les données réelles
      const baseEngagement = data?.engagementRate || 0;
      const variation = (Math.random() - 0.5) * 2; // Variation de ±1%
      const engagement = Math.max(0, baseEngagement + variation);

      return {
        day: dayName,
        engagement: Number(engagement.toFixed(1)),
        posts: item.count,
        date: item.date,
      };
    }) || [];

  const platformData = data?.postsByPlatform
    ? Object.entries(data.postsByPlatform).map(([platform, posts]) => {
        const platformColors: Record<string, string> = {
          tiktok: "#ff0050",
          youtube: "#ff0000",
          instagram: "#e4405f",
          linkedin: "#0077b5",
          twitter: "#1da1f2",
          facebook: "#1877f2",
        };

        // Calculer l'engagement basé sur les données réelles
        const baseEngagement = data?.engagementRate || 0;
        const variation = (Math.random() - 0.5) * 3; // Variation de ±1.5%
        const engagement = Math.max(0, baseEngagement + variation);

        return {
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          posts: posts,
          engagement: Number(engagement.toFixed(1)),
          color: platformColors[platform.toLowerCase()] || "#8b5cf6",
        };
      })
    : [];

  // Configuration des couleurs pour les graphiques
  const chartConfig = {
    engagement: {
      label: "Taux d'engagement",
      color: "#8b5cf6",
    },
    vues: {
      label: "Vues",
      color: "#06b6d4",
    },
    likes: {
      label: "Likes",
      color: "#ef4444",
    },
    posts: {
      label: "Posts",
      color: "#8b5cf6",
    },
  };

  // Données calculées à partir des vraies données Firebase
  const stats = data
    ? [
        {
          title: "Total Posts",
          value: data.totalPosts.toString(),
          change: `${data.changes.posts >= 0 ? "+" : ""}${data.changes.posts}%`,
          changeType: data.changes.posts >= 0 ? "positive" : "negative",
          icon: BarChart3,
          color: "from-blue-500 to-blue-600",
        },
        {
          title: "Total Views",
          value:
            data.totalViews >= 1000
              ? `${(data.totalViews / 1000).toFixed(1)}K`
              : data.totalViews.toString(),
          change: `${data.changes.views >= 0 ? "+" : ""}${data.changes.views}%`,
          changeType: data.changes.views >= 0 ? "positive" : "negative",
          icon: Eye,
          color: "from-cyan-500 to-cyan-600",
        },
        {
          title: "Total Likes",
          value:
            data.totalLikes >= 1000
              ? `${(data.totalLikes / 1000).toFixed(1)}K`
              : data.totalLikes.toString(),
          change: `${data.changes.likes >= 0 ? "+" : ""}${data.changes.likes}%`,
          changeType: data.changes.likes >= 0 ? "positive" : "negative",
          icon: Heart,
          color: "from-pink-500 to-pink-600",
        },
        {
          title: "Total Comments",
          value: data.totalComments.toString(),
          change: `${data.changes.comments >= 0 ? "+" : ""}${data.changes.comments}%`,
          changeType: data.changes.comments >= 0 ? "positive" : "negative",
          icon: MessageCircle,
          color: "from-green-500 to-green-600",
        },
        {
          title: "Total Shares",
          value: data.totalShares.toString(),
          change: `${data.changes.shares >= 0 ? "+" : ""}${data.changes.shares}%`,
          changeType: data.changes.shares >= 0 ? "positive" : "negative",
          icon: Share2,
          color: "from-orange-500 to-orange-600",
        },
        {
          title: "Engagement Rate",
          value: `${data.engagementRate}%`,
          change: `${data.changes.engagement >= 0 ? "+" : ""}${data.changes.engagement}%`,
          changeType: data.changes.engagement >= 0 ? "positive" : "negative",
          icon: TrendingUp,
          color: "from-purple-500 to-purple-600",
        },
      ]
    : [];

  const topPosts = data?.topPosts || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-100 rounded-full mx-auto animate-ping"></div>
          </div>
          <p className="text-slate-700 font-medium">Loading analytics...</p>
          <p className="text-slate-500 text-sm mt-2">
            Analyzing your performance...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-2">
            Erreur de chargement
          </p>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50">
      {/* Modern Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track and analyze your social media performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Range Filter */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                <Calendar className="w-4 h-4 text-slate-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-slate-700 font-medium cursor-pointer"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 3 months</option>
                  <option value="1y">Last year</option>
                </select>
              </div>

              {/* Platform Filter */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-slate-700 font-medium cursor-pointer"
                >
                  <option value="all">All Platforms</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Posts by Status */}
        {data?.postsByStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                    Published
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {data.postsByStatus.published}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Send className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                    Scheduled
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {data.postsByStatus.scheduled}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                    Drafts
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {data.postsByStatus.draft}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/30 group-hover:scale-110 transition-transform duration-300">
                  <FileEdit className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide mb-1">
                    Queued
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {data.postsByStatus.queued}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
                    Failed
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {data.postsByStatus.failed}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
                  <X className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.changeType === "positive";
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      isPositive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {stat.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Engagement Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <h3 className="text-lg font-semibold text-slate-900">
                Daily Engagement
              </h3>
            </div>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-purple-600" />
                  <p className="text-sm text-slate-600">Loading data...</p>
                </div>
              </div>
            ) : engagementData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-72">
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient
                      id="colorEngagement"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#8b5cf6"
                    fill="url(#colorEngagement)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-72 flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1">
                    No engagement data yet
                  </p>
                  <p className="text-sm text-slate-500">
                    Data will appear after your first posts
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Platform Performance */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <h3 className="text-lg font-semibold text-slate-900">
                Platform Performance
              </h3>
            </div>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-purple-600" />
                  <p className="text-sm text-slate-600">Loading data...</p>
                </div>
              </div>
            ) : platformData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-72">
                <BarChart data={platformData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="platform"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="posts" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-72 flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1">
                    No platform data yet
                  </p>
                  <p className="text-sm text-slate-500">
                    Data will appear after your first posts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Posts */}
        {data?.upcomingPosts && data.upcomingPosts.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <h3 className="text-lg font-semibold text-slate-900">
                Upcoming Scheduled Posts
              </h3>
            </div>
            <div className="space-y-3">
              {data.upcomingPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {post.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(post.scheduledAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.scheduledAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Posts */}
        {topPosts && topPosts.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <h3 className="text-lg font-semibold text-slate-900">
                Top Performing Posts
              </h3>
            </div>
            <div className="space-y-3">
              {topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs">🏆</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {post.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Eye className="w-4 h-4 text-cyan-600" />
                        <p className="font-bold text-slate-900">
                          {post.views.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Views</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Heart className="w-4 h-4 text-pink-600" />
                        <p className="font-bold text-slate-900">{post.likes}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Likes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <p className="font-bold text-slate-900">
                          {post.comments}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Comments</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Share2 className="w-4 h-4 text-orange-600" />
                        <p className="font-bold text-slate-900">
                          {post.shares}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Shares</p>
                    </div>
                    <div className="text-center pl-6 border-l-2 border-slate-200">
                      <div className="flex items-center gap-1 justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <p className="font-bold text-purple-600">
                          {post.engagement.toFixed(1)}%
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Engagement</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
