"use client";

import { Palette, Zap, Search, Users, Shield, Globe } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Palette,
      title: "Custom Designs",
      description: "Tailored websites meticulously crafted to reflect your brand.",
      gradient: "from-[#194EFF] to-[#0F3FFF]"
    },
    {
      icon: Zap,
      title: "Fast Performance",
      description: "Optimized for lightning-fast speed to enhance user experience.",
      gradient: "from-[#0F3FFF] to-[#194EFF]"
    },
    {
      icon: Search,
      title: "SEO Friendly",
      description: "Designed to improve SEO and increase visibility effortlessly.",
      gradient: "from-[#194EFF] to-[#0F3FFF]"
    }
  ];

  return (
    <section className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-gradient-to-r from-[#194EFF]/10 to-[#0F3FFF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-r from-[#0F3FFF]/10 to-[#194EFF]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] bg-clip-text text-transparent">
              Luma Post
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Our mission is to design websites that attract and engage customers.
          </p>
          <p className="text-lg text-white/60 mt-4">
            However, we approach things a bit differently around here.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-2xl p-8 hover:border-[#194EFF]/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#194EFF]/20"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choosing Luma Post Over Others
            </h3>
            <p className="text-white/80 text-lg">
              See the difference our approach makes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Other Agencies */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white/90 mb-6">Other Agencies</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/70">Experienced team delivering standard solutions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/70">Limited post-launch support and updates</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/70">Generic templates and designs</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/70">Fixed pricing with hidden costs</p>
                </div>
              </div>
            </div>

            {/* Luma Post */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-6">Luma Post</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/90">Highly skilled specialists delivering customized solutions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/90">Comprehensive post-launch support and updates</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/90">Unique, brand-focused designs tailored to your vision</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/90">Transparent pricing with no hidden fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Our Core Services
            </h3>
            <p className="text-white/80 text-lg">
              Comprehensive solutions for your digital presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Web Design */}
            <div className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Palette className="w-6 h-6 text-[#194EFF]" />
                Web Design
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">Customized visual aesthetics</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">User-centric design approach</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">Responsive and mobile-friendly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#194EFF] to-[#0F3FFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">Interactive and engaging layouts</span>
                </li>
              </ul>
            </div>

            {/* Web Development */}
            <div className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#0F3FFF]" />
                Web Development
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#0F3FFF] to-[#194EFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">Custom backend development</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#0F3FFF] to-[#194EFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">Ongoing maintenance and support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#0F3FFF] to-[#194EFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">Security and data protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#0F3FFF] to-[#194EFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">Content management systems (CMS)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#0F3FFF] to-[#194EFF] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/90">API integration and development</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Other Services */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Palette, title: "Logo Design" },
              { icon: Users, title: "Social Post Design" },
              { icon: Shield, title: "Branding" },
              { icon: Globe, title: "Packaging Design" }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#00020F] to-[#00041F] border border-[#194EFF]/20 rounded-xl p-4 text-center hover:border-[#194EFF]/40 transition-all duration-300 hover:scale-105"
              >
                <service.icon className="w-8 h-8 text-[#194EFF] mx-auto mb-2" />
                <p className="text-white/90 text-sm font-medium">{service.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}