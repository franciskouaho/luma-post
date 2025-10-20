"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Users, Star } from "lucide-react";

export default function HeroSection() {
  const socialPlatforms = [
    { name: "X", color: "bg-black" },
    { name: "Instagram", color: "bg-gradient-to-br from-purple-600 to-pink-600" },
    { name: "LinkedIn", color: "bg-blue-600" },
    { name: "Facebook", color: "bg-blue-500" },
    { name: "TikTok", color: "bg-black" },
    { name: "YouTube", color: "bg-red-600" },
    { name: "Bluesky", color: "bg-blue-400" },
    { name: "Google My Business", color: "bg-blue-500" },
    { name: "Pinterest", color: "bg-red-500" }
  ];

  const testimonials = [
    { name: "Sarah Chen", avatar: "SC" },
    { name: "Mike Rodriguez", avatar: "MR" },
    { name: "Emma Wilson", avatar: "EW" },
    { name: "David Kim", avatar: "DK" },
    { name: "Lisa Johnson", avatar: "LJ" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-purple-100 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Media Platforms */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {socialPlatforms.map((platform, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg ${platform.color} flex items-center justify-center text-white text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300`}
              >
                {platform.name === "X" ? "X" : 
                 platform.name === "Instagram" ? "📷" :
                 platform.name === "LinkedIn" ? "in" :
                 platform.name === "Facebook" ? "f" :
                 platform.name === "TikTok" ? "♪" :
                 platform.name === "YouTube" ? "▶" :
                 platform.name === "Bluesky" ? "🦋" :
                 platform.name === "Google My Business" ? "G" :
                 platform.name === "Pinterest" ? "P" : platform.name[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The social media scheduler for{" "}
            <span className="text-purple-600">founders</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Post to all social platforms from one dashboard. Easy to use, fairly priced, 
            with human support from our team 🧑‍💻
          </p>

          {/* CTA Button */}
          <div className="mb-8">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 flex items-center gap-2 mx-auto">
                Try it for free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {testimonials.map((user, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white"
                  >
                    {user.avatar}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-900 font-semibold">4.9/5</span>
                </div>
                <p className="text-sm text-gray-600">
                  Used by <span className="font-semibold text-purple-600">1,404</span> happy customers
                </p>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">9</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">SOCIAL PLATFORMS SUPPORTED</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">627,288</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">POSTS PUBLISHED BY USERS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">2 min</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">AVERAGE TIME TO POST EVERYWHERE</div>
            </div>
          </div>
        </div>

        {/* Video Demo Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 transition-all duration-300 hover:scale-110">
                <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
              </Button>
            </div>
            <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded text-sm">
              how to use Luma Post! (demo)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}