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
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Luma Post</span>
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
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}
