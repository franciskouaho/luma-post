'use client';

import { Shield, Lock, Users, Award, Clock, Globe } from "lucide-react";

export default function TrustSection() {
  const trustElements = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Privacy",
      description: "GDPR compliant with full data ownership"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "8,166+ Creators",
      description: "Trusted by content creators worldwide"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "99.9% Uptime",
      description: "Reliable service you can count on"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Always here when you need us"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Supporting creators in 50+ countries"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by creators worldwide
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied creators who trust Luma Post with their content
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {trustElements.map((element, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--luma-purple-light)', color: 'var(--luma-purple)' }}>
                {element.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                {element.title}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                {element.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security badges */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">SOC 2 Type II</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--luma-purple-light)' }}>
                <Lock className="w-4 h-4" style={{ color: 'var(--luma-purple)' }} />
              </div>
              <span className="font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-medium">99.9% Uptime SLA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
