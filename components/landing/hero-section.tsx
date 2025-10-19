'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight" style={{ color: 'var(--luma-dark)' }}>
              Schedule your content everywhere in seconds.
            </h1>

            {/* Sub-headline */}
            <p className="text-xl text-gray-600 leading-relaxed">
              The simplest way to post and grow on all platforms. Built for creators and small teams without the ridiculous price tag.
            </p>

            {/* Features List */}
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--luma-purple)' }} />
                <span className="text-gray-700">Post to all major platforms in one click</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--luma-purple)' }} />
                <span className="text-gray-700">Schedule content for the perfect posting time</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--luma-purple)' }} />
                <span className="text-gray-700">Customize content for each platform</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--luma-purple)' }} />
                <span className="text-gray-700">Generate viral videos using our studio templates</span>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button className="text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all" style={{ background: 'var(--luma-gradient-primary)' }}>
                Try it for free - No credit card required
              </Button>
              <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold">
                Watch Demo (2 min)
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--luma-purple-light)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--luma-purple)' }}></div>
                </div>
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--luma-purple-light)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--luma-purple)' }}></div>
                </div>
                <span>Setup in 2 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--luma-purple-light)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--luma-purple)' }}></div>
                </div>
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-8 space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 font-medium">Loved by 8,166 creators</p>
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">👤</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Platform Icons */}
          <div className="relative">

        {/* Platform Icons Image */}
        <div className="mt-8 flex justify-center">
          <Image
            src="/icons.png"
            alt="Social media platforms"
            width={256}
            height={64}
            className="max-w-full h-auto"
          />
        </div>

            {/* Scheduled Status Box */}
            <div className="mt-8 rounded-lg p-4 max-w-xs mx-auto" style={{ background: 'var(--luma-purple-light)' }}>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5" style={{ color: 'var(--luma-purple)' }} />
                <span className="font-medium" style={{ color: 'var(--luma-dark)' }}>Scheduled to all platforms</span>
              </div>
            </div>

            {/* All Platforms Row */}
            <div className="mt-6 flex justify-center space-x-3">
              {['X', '📷', 'in', 'f', '🎵', '📺', '🦋', 'A', '📌'].map((icon, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
