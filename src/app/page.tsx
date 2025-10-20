import LandingHeader from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";
import CrossPostingSection from "@/components/landing/cross-posting-section";
import ContentManagementSection from "@/components/landing/content-management-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import FAQSection from "@/components/landing/faq-section";
import PlatformsSection from "@/components/landing/platforms-section";
import CTASection from "@/components/landing/cta-section";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <LandingHeader />
      <HeroSection />
      <CrossPostingSection />
      <ContentManagementSection />
      <TestimonialsSection />
      <FAQSection />
      <PlatformsSection />
      <CTASection />
      <Footer />
    </div>
  );
}