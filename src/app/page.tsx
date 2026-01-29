import Header from "@/components/Header";
import EventBanner from "@/components/EventBanner";
import HeroSection from "@/components/HeroSection";
import AboutUs from "@/components/AboutUs";
import MenuSection from "@/components/MenuSection";
import FranchiseSection from "@/components/FranchiseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FAQSection";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <EventBanner />
      <HeroSection />
      <AboutUs />
      <MenuSection />
      <FranchiseSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactUs />
      <Footer />
    </main>
  );
}
