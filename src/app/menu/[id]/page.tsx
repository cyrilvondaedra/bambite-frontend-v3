import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import SingleMenu from "@/components/SingleMenu";
import { fetchMenuItem } from "@/lib/api/menu";

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const menuItem = await fetchMenuItem(id,"");

  return (
    <CartProvider>
      <main className="h-full bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <SingleMenu menuItem={menuItem} />

        <Footer />
      </main>
    </CartProvider>
  );
}
