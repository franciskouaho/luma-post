import LandingHeader from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";
import FeaturedSection from "@/components/landing/featured-section";
import FeaturesSection from "@/components/landing/features-section";
import PricingSection from "@/components/landing/pricing-section";
import TrustSection from "@/components/landing/trust-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import FAQSection from "@/components/landing/faq-section";
import CTASection from "@/components/landing/cta-section";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00041F] via-[#00020F] to-[#00041F] text-white overflow-hidden">
      <LandingHeader />
      <HeroSection />
      <FeaturedSection />
      <FeaturesSection />
      <PricingSection />
      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}