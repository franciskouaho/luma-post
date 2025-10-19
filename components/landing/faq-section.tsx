'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How quickly can I get started?",
      answer: "You can be up and running in under 2 minutes! Simply connect your social media accounts, create your first post, and schedule it. No technical setup required."
    },
    {
      question: "Which social media platforms do you support?",
      answer: "We support all major platforms including Instagram, TikTok, Facebook, Twitter/X, LinkedIn, YouTube, Pinterest, and more. New platforms are added regularly based on user requests."
    },
    {
      question: "Can I customize content for each platform?",
      answer: "Absolutely! You can create platform-specific versions of your content, adjust captions, hashtags, and even format differently for each platform's audience and best practices."
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you when you're approaching your limits and offer options to upgrade. Your scheduled posts will continue to publish, and you can upgrade anytime without losing your content."
    },
    {
      question: "Is my content secure and private?",
      answer: "Yes! We use enterprise-grade security and never store your login credentials. Your content is encrypted and we comply with all major privacy regulations including GDPR and CCPA."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to all features until the end of your current billing period. No questions asked."
    },
    {
      question: "Do you offer team collaboration features?",
      answer: "Yes! Our Team plan includes user management, approval workflows, shared content libraries, and role-based permissions to help teams collaborate effectively."
    },
    {
      question: "What kind of analytics do you provide?",
      answer: "We provide comprehensive analytics including post performance, engagement rates, best posting times, audience insights, and growth tracking across all your connected platforms."
    }
  ];

  return (
    <section id="faq" className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Luma Post
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a 
            href="mailto:support@lumapost.com" 
            className="font-semibold" style={{ color: 'var(--luma-purple)' }}
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
