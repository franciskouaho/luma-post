'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-green-600 to-green-700 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to transform your social media strategy?
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Join thousands of creators who save 10+ hours per week and grow their audience faster with Luma Post.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-semibold">
            Schedule Demo Call
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center justify-center space-x-2 text-green-100">
            <Check className="w-5 h-5" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-100">
            <Check className="w-5 h-5" />
            <span>Setup in 2 minutes</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-100">
            <Check className="w-5 h-5" />
            <span>Cancel anytime</span>
          </div>
        </div>

        <div className="bg-green-800/50 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">👤</span>
                </div>
              ))}
            </div>
            <div className="text-green-100">
              <div className="font-semibold">8,166+ creators</div>
              <div className="text-sm">started their journey this month</div>
            </div>
          </div>
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-green-100 ml-2 font-semibold">4.9/5 rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
