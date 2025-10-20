"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-[#194EFF]/20 to-[#0F3FFF]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-3xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Let's work together to create something amazing. Get started today and see the difference our approach makes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] hover:from-[#0F3FFF] hover:to-[#194EFF] text-white border-0 rounded-full px-12 py-6 text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-[#194EFF]/50 hover:scale-105">
                Start Your Project
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="border-[#194EFF]/40 text-white hover:bg-[#194EFF]/10 rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}