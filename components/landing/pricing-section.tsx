'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "3 social accounts",
        "10 posts per month",
        "Basic scheduling",
        "Email support",
        "Basic analytics"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Creator",
      price: "$9",
      period: "per month",
      description: "For content creators",
      features: [
        "10 social accounts",
        "Unlimited posts",
        "Advanced scheduling",
        "Priority support",
        "Advanced analytics",
        "Content templates",
        "Bulk upload"
      ],
      cta: "Start 14-day trial",
      popular: true
    },
    {
      name: "Team",
      price: "$29",
      period: "per month",
      description: "For growing teams",
      features: [
        "Unlimited accounts",
        "Unlimited posts",
        "Team collaboration",
        "White-label options",
        "API access",
        "Custom integrations",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-green-500 relative shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full py-3 text-lg font-semibold ${
                  plan.popular 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include 14-day free trial. No credit card required.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <span className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              Cancel anytime
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              Money-back guarantee
            </span>
            <span className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              Setup in 2 minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
