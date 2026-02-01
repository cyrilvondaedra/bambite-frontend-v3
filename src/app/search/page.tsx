import Header from "@/components/Header";
import SearchHeroSection from "@/components/SearchHeroSection";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { Suspense } from "react";
import { fetchMenuItem } from "@/lib/menu";
import SearchMenus from "@/components/SearchMenus";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  if (!query) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        No search query provided.
      </p>
    );
  }

  const menuItems = await fetchMenuItem(null, query);

  return (
    <CartProvider>
      <main className="min-h-screen bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <div className="pt-16">
          <SearchHeroSection query={query} />
          <SearchMenus SearchMenus={menuItems} />
        </div>
        <Footer />
      </main>
    </CartProvider>
  );
}
