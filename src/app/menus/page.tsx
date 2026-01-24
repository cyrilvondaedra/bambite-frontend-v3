"use client";

import Image from "next/image";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { useState, useEffect } from "react";
import { Category } from "@/types/api/category";
import { MenuItem } from "@/types/api/menuItem";
import QuantityControls from "@/components/QualityControls";
import Link from "next/link";

export default function MenuPage() {
  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/categories/active",
      );
      const data = await response.json();

      setMenuCategories(data.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products?limit=100&${activeCategory === "all" ? "" : `category=${activeCategory}`}`,
      );
      const data = await response.json();
      setMenuItems(data.data);
      setLoading(false);
    };
    fetchMenuItems();
  }, [activeCategory]);

  return (
    <CartProvider>
      <main className="min-h-screen bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>

        {/* Hero */}
        <section className="pt-32 pb-12 bg-foreground text-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-4xl font-medium leading-tight md:text-5xl lg:text-6xl text-balance text-(--color-text) mb-6">
              BamBite Menu
            </h1>
            <p className="text-background/70 text-lg max-w-md mx-auto">
              All the best in one place
            </p>
          </div>
        </section>

        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-6">
            <nav className="flex justify-center gap-2 md:gap-4 flex-wrap">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 md:px-6 md:py-3 font-serif text-sm md:text-base transition-all duration-300 border-b-2 ${
                  activeCategory === "all"
                    ? "border-(--color-primary) text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                All
              </button>
              {menuCategories.length > 0 &&
                menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 md:px-6 md:py-3 font-serif text-sm md:text-base transition-all duration-300 border-b-2 ${
                      activeCategory === category.id
                        ? "border-foreground text-foreground"
                        : "border-transparent text-muted-foreground hover:text-(--color-primary) hover:border-(--color-primary)"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
            </nav>
          </div>
        </section>

        {/* Menu Items Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div
              key={activeCategory}
              className="transition-opacity duration-400 ease-in-out"
            >
              {/* Items Grid - 2 columns on mobile/tablet, flexible on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading && (
                  <p className="text-center text-muted-foreground col-span-full">
                    Loading...
                  </p>
                )}

                {!loading && menuItems.length === 0 && (
                  <p className="text-center text-muted-foreground col-span-full">
                    No items found in this category.
                  </p>
                )}

                {!loading &&
                  menuItems.length > 0 &&
                  menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer flex flex-col h-full bg-(--color-background) p-1 rounded-md"
                    >
                      <Link
                        href={`/menu/${item.id}`}
                        className="relative aspect-square overflow-hidden mb-2"
                      >
                        <Image
                          src={item.imageUrls[0]}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority
                        />
                      </Link>

                      <div className="flex flex-col flex-1 p-2">
                        <div className="flex-1">
                          <Link
                            href={`/menu/${item.id}`}
                            className="font-serif text-xl mb-2 text-(--color-title)"
                          >
                            {item.name}
                          </Link>
                          <p className="font-serif text-sm mb-2 text-(--color-title)">
                            {item.thaiName}
                          </p>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-5 gap-2 md:gap-4">
                          <span className="font-serif text-lg">
                            ฿{item.price}
                          </span>
                          <div className="w-full md:w-auto">
                            <QuantityControls item={item} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </CartProvider>
  );
}
