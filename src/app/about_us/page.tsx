import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import { Suspense } from "react";
import AboutHeroSection from "@/components/AboutHeroSection";
import OriginStory from "@/components/OriginStory";
import ValuesSection from "@/components/ValuesSection";
import VisionSection from "@/components/VisionSection";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <AboutHeroSection />
        <OriginStory />
        <ValuesSection />
        <VisionSection />
        <Footer />
      </main>
    </CartProvider>
  );
}
