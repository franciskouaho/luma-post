'use client';

import { Calendar, Zap, Users, BarChart3, Shield, Smartphone, Palette, Globe } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "One-Click Publishing",
      description: "Publish to all your social media platforms simultaneously with just one click. Save hours of manual posting every week."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "AI-powered optimal posting times based on your audience activity. Schedule weeks or months in advance."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Content Templates",
      description: "Access hundreds of professionally designed templates for Instagram, TikTok, and other platforms. Customize to match your brand."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Invite team members, set approval workflows, and manage content collaboratively. Perfect for agencies and growing teams."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Track performance across all platforms with detailed insights, engagement rates, and growth metrics in one dashboard."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile App",
      description: "Manage your content on the go with our intuitive mobile app. Post, schedule, and monitor performance from anywhere."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Platform Support",
      description: "Connect Instagram, TikTok, Facebook, Twitter, LinkedIn, YouTube, Pinterest, and more. New platforms added regularly."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption. Your data and content are protected with industry-leading security measures."
    }
  ];

  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--luma-dark)' }}>
            Everything you need to grow your audience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to save you time and help you create engaging content that drives real results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4" style={{ color: 'var(--luma-purple)' }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional benefits section */}
        <div className="mt-20 bg-white rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--luma-dark)' }}>
                Why thousands of creators choose Luma Post
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'var(--luma-purple-light)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--luma-purple)' }}></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Save 10+ hours per week</h4>
                    <p className="text-gray-600">Automate your posting schedule and focus on creating amazing content instead of managing multiple platforms.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'var(--luma-purple-light)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--luma-purple)' }}></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Increase engagement by 40%</h4>
                    <p className="text-gray-600">Our AI-powered optimal posting times help you reach your audience when they&apos;re most active.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'var(--luma-purple-light)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--luma-purple)' }}></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Grow your following faster</h4>
                    <p className="text-gray-600">Consistent posting across all platforms with optimized content helps you build a loyal audience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='rounded-xl p-8' style={{ background: 'var(--luma-gradient-light)' }}>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--luma-purple)' }}>98%</div>
                <div className="text-gray-700 font-semibold mb-4">Customer Satisfaction</div>
                <div className="text-gray-600 mb-6">
                  &quot;Luma Post transformed how I manage my social media. I&apos;ve grown my following by 300% in just 3 months!&quot;
                </div>
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-gray-600">- Sarah M., Content Creator</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
