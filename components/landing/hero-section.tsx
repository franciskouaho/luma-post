"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Play, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Background Sphere */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#194EFF]/20 to-[#0F3FFF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#0F3FFF]/15 to-[#194EFF]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23194EFF' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Design That Powers{" "}
            <span className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] bg-clip-text text-transparent">
              Real Business Growth
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            Elevating brands through innovative and engaging web solutions.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] hover:from-[#0F3FFF] hover:to-[#194EFF] text-white border-0 rounded-full px-12 py-6 text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-[#194EFF]/50 hover:scale-105">
                Get this Template
              </Button>
            </Link>
            <div className="text-sm text-white/60">
              2 Spots Available
            </div>
          </div>

          {/* Rating Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white/90 font-semibold">4.9/5</span>
              <span className="text-white/60">(3,602 clients)</span>
            </div>
          </div>

          {/* Featured Projects Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Project 1 */}
            <div className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-2xl p-6 hover:border-[#194EFF]/40 transition-all duration-300 hover:scale-105">
              <div className="w-full h-32 bg-gradient-to-br from-[#194EFF]/20 to-[#0F3FFF]/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#194EFF]/30 rounded-lg"></div>
              </div>
              <h3 className="text-white font-semibold mb-2">Explore the World, One Journey at a Time</h3>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span>Spectrum</span>
                <span>•</span>
                <span>Velocity</span>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-2xl p-6 hover:border-[#194EFF]/40 transition-all duration-300 hover:scale-105">
              <div className="w-full h-32 bg-gradient-to-br from-[#0F3FFF]/20 to-[#194EFF]/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#0F3FFF]/30 rounded-lg"></div>
              </div>
              <h3 className="text-white font-semibold mb-2">Regulate Your Focus with Inspiring Content</h3>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span>Enigma</span>
                <span>•</span>
                <span>Lumina</span>
              </div>
            </div>

            {/* Project 3 */}
            <div className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-2xl p-6 hover:border-[#194EFF]/40 transition-all duration-300 hover:scale-105">
              <div className="w-full h-32 bg-gradient-to-br from-[#194EFF]/20 to-[#0F3FFF]/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#194EFF]/30 rounded-lg"></div>
              </div>
              <h3 className="text-white font-semibold mb-2">Connect and Collaborate Seamlessly</h3>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span>Vortex</span>
                <span>•</span>
                <span>Synergy</span>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-3xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-[#194EFF]/10 to-[#0F3FFF]/10 flex items-center justify-center">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full p-6 transition-all duration-300 hover:scale-110">
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>
              {/* Video Thumbnail Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Watch Our Success Stories</h3>
                  <p className="text-white/80">See how we've helped businesses grow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}