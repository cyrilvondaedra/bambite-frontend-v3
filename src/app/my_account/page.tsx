import Header from "@/components/Header";
import MyAccountHeroSection from "@/components/MyAccountHeroSection";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { Suspense } from "react";
import RegisterGate from "@/components/RegisterGate";

export default function RegisterPage() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <div className="pt-16">
          <MyAccountHeroSection />
          <RegisterGate />
        </div>
        <Footer />
      </main>
    </CartProvider>
  );
}
