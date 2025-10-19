'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--luma-gradient-primary)' }}>
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-semibold" style={{ color: 'var(--luma-dark)' }}>Luma Post</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="#reviews" className="text-gray-700 hover:text-gray-900 transition-colors">
              Reviews
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#platforms" className="text-gray-700 hover:text-gray-900 transition-colors">
              Platforms
            </Link>
            <Link href="#faq" className="text-gray-700 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="#tools" className="text-gray-700 hover:text-gray-900 transition-colors">
              Tools
            </Link>
            <Link href="#blog" className="text-gray-700 hover:text-gray-900 transition-colors">
              Blog
            </Link>
          </nav>

          {/* Login Button */}
          <Link href="/auth">
            <Button className="text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105" style={{ background: 'var(--luma-gradient-primary)' }}>
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
