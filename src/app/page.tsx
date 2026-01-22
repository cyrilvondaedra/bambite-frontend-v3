import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import { CartProvider } from "@/components/CartContext";
import MenuSection from "@/components/MenuSection";
import { Suspense } from "react";

export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <HeroSection />
        <PhilosophySection />
        <MenuSection />
      </main>
    </CartProvider>
  );
}
