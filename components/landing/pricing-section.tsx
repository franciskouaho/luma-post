"use client";

import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  const plans = [
    {
      name: "Basic",
      price: "$1,995",
      period: "/m",
      discount: "15% Off",
      features: [
        "Enjoy limitless design requests",
        "One request at a time",
        "Average 48 hours delivery",
        "Unlimited brands",
        "Easy credit-card payments",
        "Pause or cancel anytime"
      ],
      popular: false,
      gradient: "from-[#194EFF] to-[#0F3FFF]"
    },
    {
      name: "Standard",
      price: "$3,995",
      period: "/m",
      discount: null,
      features: [
        "Enjoy limitless design requests",
        "Two requests at a time",
        "Average 24 hours delivery",
        "Unlimited brands",
        "Priority support",
        "Easy credit-card payments",
        "Pause or cancel anytime"
      ],
      popular: true,
      gradient: "from-[#0F3FFF] to-[#194EFF]"
    },
    {
      name: "Pro",
      price: "$5,995",
      period: "/m",
      discount: "15% Off",
      features: [
        "Enjoy limitless design requests",
        "Three requests at a time",
        "Average 12 hours delivery",
        "Unlimited brands",
        "Dedicated account manager",
        "Priority support",
        "Easy credit-card payments",
        "Pause or cancel anytime"
      ],
      popular: false,
      gradient: "from-[#194EFF] to-[#0F3FFF]"
    }
  ];

  return (
    <section className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-[#194EFF]/10 to-[#0F3FFF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-[#0F3FFF]/10 to-[#194EFF]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transparent{" "}
            <span className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] bg-clip-text text-transparent">
              Pricing Options
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br from-[#00020F] to-[#00041F] border rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-[#194EFF] shadow-2xl shadow-[#194EFF]/20' 
                  : 'border-[#194EFF]/20 hover:border-[#194EFF]/40'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Discount Badge */}
              {plan.discount && !plan.popular && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-gradient-to-r from-[#0F3FFF] to-[#194EFF] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {plan.discount}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">What's included</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#194EFF] mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link href="/auth">
                <Button className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white border-0 rounded-full py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#194EFF]/30`}>
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Trial Package */}
        <div className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Assurance Trial Package
            </h3>
            <p className="text-xl text-white/80 mb-8">
              Try our services risk-free with our trial package
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">$979</div>
                <div className="text-white/60">/month</div>
              </div>
              <div className="text-white/80">
                Perfect for testing our services before committing to a full plan
              </div>
            </div>

            <Link href="/auth">
              <Button className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] hover:from-[#0F3FFF] hover:to-[#194EFF] text-white border-0 rounded-full px-12 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-[#194EFF]/50 hover:scale-105">
                Start a Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#194EFF]" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#194EFF]" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#194EFF]" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#194EFF]" />
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}