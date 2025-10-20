'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-[#00041F] to-[#00020F] border-b border-[#194EFF]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#194EFF] to-[#0F3FFF]">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-semibold text-white">Luma Post</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#home" className="text-white/90 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="#works" className="text-white/90 hover:text-white transition-colors">
              Works
            </Link>
            <Link href="#blogs" className="text-white/90 hover:text-white transition-colors">
              Blogs
            </Link>
            <Link href="#timeline" className="text-white/90 hover:text-white transition-colors">
              Timeline
            </Link>
            <Link href="#waitlist" className="text-white/90 hover:text-white transition-colors">
              Waitlist
            </Link>
            
            {/* All Pages Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPagesOpen(!isPagesOpen)}
                className="flex items-center text-white/90 hover:text-white transition-colors"
              >
                All Pages
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isPagesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#00020F] border border-[#194EFF]/20 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <Link href="/dashboard" className="block px-4 py-2 text-white/90 hover:text-white hover:bg-[#194EFF]/10">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-white/90 hover:text-white hover:bg-[#194EFF]/10">
                      Settings
                    </Link>
                    <Link href="/dashboard/workspaces" className="block px-4 py-2 text-white/90 hover:text-white hover:bg-[#194EFF]/10">
                      Workspaces
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] hover:from-[#0F3FFF] hover:to-[#194EFF] text-white border-0 rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#194EFF]/30">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/90 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#194EFF]/20">
            <nav className="flex flex-col space-y-4">
              <Link href="#home" className="text-white/90 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="#works" className="text-white/90 hover:text-white transition-colors">
                Works
              </Link>
              <Link href="#blogs" className="text-white/90 hover:text-white transition-colors">
                Blogs
              </Link>
              <Link href="#timeline" className="text-white/90 hover:text-white transition-colors">
                Timeline
              </Link>
              <Link href="#waitlist" className="text-white/90 hover:text-white transition-colors">
                Waitlist
              </Link>
              <div className="pt-4">
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] hover:from-[#0F3FFF] hover:to-[#194EFF] text-white border-0 rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#194EFF]/30 w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}