"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Type,
  Image,
  Video,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mountain,
  Lock,
  Plus,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useConnectedAccounts } from "@/hooks/use-connected-accounts";

// Icône TikTok personnalisée
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function DashboardPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { isPlatformConnected } = useConnectedAccounts();

  // Fonction pour vérifier si un type de post est disponible
  const isPostTypeAvailable = (platforms: string[]) => {
    return platforms.some((platform) => isPlatformConnected(platform));
  };

  const postTypes = [
    {
      id: "text",
      name: "Text Post",
      description:
        "Create a simple text-based post for your social media accounts",
      icon: Type,
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-600",
      bgGradient: "from-blue-50 to-blue-100/50",
      platforms: ["twitter", "linkedin", "instagram"],
      platformIcons: [
        { name: "Twitter", icon: Twitter, color: "text-blue-500" },
        { name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
        { name: "Instagram", icon: Instagram, color: "text-pink-500" },
      ],
    },
    {
      id: "image",
      name: "Image Post",
      description:
        "Upload and share images with captions across your platforms",
      icon: Image,
      color: "from-green-500 to-green-600",
      iconColor: "text-green-600",
      bgGradient: "from-green-50 to-green-100/50",
      platforms: ["instagram", "twitter", "linkedin"],
      platformIcons: [
        { name: "Instagram", icon: Instagram, color: "text-pink-500" },
        { name: "Twitter", icon: Twitter, color: "text-blue-500" },
        { name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
      ],
    },
    {
      id: "video",
      name: "Video Post",
      description: "Upload and share videos with captions and hashtags",
      icon: Video,
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-600",
      bgGradient: "from-purple-50 to-purple-100/50",
      platforms: ["youtube", "instagram", "tiktok"],
      platformIcons: [
        { name: "YouTube", icon: Youtube, color: "text-red-600" },
        { name: "Instagram", icon: Instagram, color: "text-pink-500" },
        { name: "TikTok", icon: TikTokIcon, color: "text-black" },
      ],
    },
    {
      id: "carousel",
      name: "Carousel Post",
      description: "Create multi-image posts for Instagram and LinkedIn",
      icon: Mountain,
      color: "from-orange-500 to-orange-600",
      iconColor: "text-orange-600",
      bgGradient: "from-orange-50 to-orange-100/50",
      platforms: ["instagram", "linkedin"],
      platformIcons: [
        { name: "Instagram", icon: Instagram, color: "text-pink-500" },
        { name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
      ],
    },
  ].map((postType) => ({
    ...postType,
    isAvailable: isPostTypeAvailable(postType.platforms),
  }));

  const availablePostTypes = postTypes.filter((pt) => pt.isAvailable).length;
  const totalPostTypes = postTypes.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50">
      {/* Modern Sticky Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Create New Post
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Choose your content type and publish across platforms
              </p>
            </div>
            <Link
              href="/dashboard/accounts"
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Connect Account
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                  Available Types
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {availablePostTypes}/{totalPostTypes}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                  Quick Create
                </p>
                <p className="text-2xl font-bold text-slate-900">Ready</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                  Multi-Platform
                </p>
                <p className="text-2xl font-bold text-slate-900">Enabled</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Post Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {postTypes.map((postType) => {
            const Icon = postType.icon;
            const isAvailable = postType.isAvailable;

            return (
              <div
                key={postType.id}
                className="relative"
                onMouseEnter={() => isAvailable && setHoveredCard(postType.id)}
                onMouseLeave={() => isAvailable && setHoveredCard(null)}
              >
                {isAvailable ? (
                  <Link href={`/dashboard/create-post/${postType.id}`}>
                    <div
                      className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 transition-all duration-300 cursor-pointer ${
                        hoveredCard === postType.id
                          ? "shadow-xl scale-[1.02] border-purple-200"
                          : "hover:shadow-lg"
                      }`}
                    >
                      {/* Header coloré */}
                      <div
                        className={`relative p-6 bg-gradient-to-br ${postType.bgGradient} border-b border-slate-200/60`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${postType.color} rounded-xl flex items-center justify-center shadow-lg shadow-${postType.iconColor}/30`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div
                            className={`px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold ${postType.iconColor}`}
                          >
                            Available
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {postType.name}
                        </h3>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                          {postType.description}
                        </p>

                        {/* Platforms */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              Platforms
                            </span>
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                              {postType.platformIcons.length}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {postType.platformIcons.map((platform) => {
                              const PlatformIcon = platform.icon;
                              return (
                                <div
                                  key={platform.name}
                                  className="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                                  title={platform.name}
                                >
                                  <PlatformIcon
                                    className={`h-5 w-5 ${platform.color}`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* CTA */}
                        <button
                          className={`w-full py-2.5 bg-gradient-to-r ${postType.color} text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn`}
                        >
                          Create {postType.name}
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 opacity-60 cursor-not-allowed">
                    {/* Header grisé */}
                    <div className="relative p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200/60">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-300 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-slate-500" />
                        </div>
                        <div className="px-3 py-1 bg-slate-200 rounded-full text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-500">
                        {postType.name}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                        {postType.description}
                      </p>

                      {/* Platforms */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Platforms
                          </span>
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-400 rounded-full font-medium">
                            {postType.platformIcons.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {postType.platformIcons.map((platform) => {
                            const PlatformIcon = platform.icon;
                            return (
                              <div
                                key={platform.name}
                                className="w-10 h-10 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center"
                                title={platform.name}
                              >
                                <PlatformIcon className="h-5 w-5 text-slate-400" />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* CTA disabled */}
                      <button
                        disabled
                        className="w-full py-2.5 bg-slate-200 text-slate-400 text-sm font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Connect Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Unlock More Post Types
                </h3>
                <p className="text-sm text-slate-600">
                  Connect additional social media accounts to access all
                  features
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/accounts"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Connect Accounts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
