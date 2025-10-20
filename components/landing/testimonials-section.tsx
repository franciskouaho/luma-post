"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, Play, TrendingUp, Users } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "David",
      handle: "@ninthdensity",
      text: "Finally, social media posting tool for the rest of us. Thanks team!",
      rating: 5,
      platform: "twitter"
    },
    {
      name: "Fer",
      handle: "@fer_chvs",
      text: "Luma Post is the best investment i've made in months. It's simple and works, exactly what i was searching to handle multiple channels.",
      rating: 5,
      platform: "twitter"
    },
    {
      name: "Julian",
      handle: "@BuiltByJulian",
      text: "Luma Post is amazing, makes my life so much easier!",
      rating: 5,
      platform: "twitter"
    },
    {
      name: "Yorgo Hoebeke",
      handle: "@yorgohoebeke",
      text: "Best price/quality of all platforms of this kind by far",
      rating: 5,
      platform: "twitter"
    },
    {
      name: "Patty",
      handle: "@pattybuilds",
      text: "The content studio has slowly been bringing in customers tho and I appreciate you so much for that + saves me soooo much time can spend days just building new shit cause all the marketing on autopilot. Love it",
      rating: 5,
      platform: "twitter"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 flex items-center gap-2 mx-auto">
            Try it for free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Luma Post is loved by{" "}
            <span className="text-purple-600">1,404 users</span>. Here's what they are saying.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Video Testimonial */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-full">
              <div className="relative mb-4">
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <p className="text-sm">SO WHY DO</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Video testimonial from a satisfied customer</p>
              </div>
            </div>
          </div>

          {/* Text Testimonials */}
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-full">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.handle}</div>
                </div>
                <div className="ml-auto">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
                    {testimonial.platform === 'twitter' ? '🐦' : '📱'}
                  </div>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed">{testimonial.text}</p>
            </div>
          ))}

          {/* Stats Testimonial */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-full">
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <div className="text-center text-white">
                <div className="text-2xl font-bold text-purple-600 mb-2">+100.0%</div>
                <div className="text-sm text-gray-300 mb-4">Net volume from sales</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-purple-400 font-semibold">$119.59</div>
                    <div className="text-gray-400">Nov 29 - Today</div>
                  </div>
                  <div>
                    <div className="text-gray-400">$0.00</div>
                    <div className="text-gray-400">Nov 22 - Nov 28</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-purple-400 font-semibold">4</div>
                  <div className="text-gray-400 text-xs">New customers</div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                P
              </div>
              <div>
                <div className="font-semibold text-gray-900">Patty</div>
                <div className="text-sm text-gray-600">@pattybuilds</div>
              </div>
              <div className="ml-auto">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">9</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">SOCIAL PLATFORMS SUPPORTED</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">627,288</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">POSTS PUBLISHED BY USERS</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">2 min</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">AVERAGE TIME TO POST EVERYWHERE</div>
            </div>
          </div>
        </div>

        {/* Featured On */}
        <div className="mt-16 text-center">
          <div className="text-sm text-gray-500 uppercase tracking-wide mb-6">FEATURED ON</div>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Starter Story</div>
            <div className="text-2xl font-bold text-gray-400">TinyLaunch</div>
            <div className="text-2xl font-bold text-gray-400">Product Hunt</div>
          </div>
        </div>
      </div>
    </section>
  );
}