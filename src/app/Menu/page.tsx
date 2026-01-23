"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { useState, useEffect } from "react";
import { Category } from "@/types/api/category";
import { MenuItem } from "@/types/api/menuItem";
import QuantityControls from "@/components/QualityControls";

export default function MenuPage() {
  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/categories/active",
      );
      const data = await response.json();
      console.log("data", data);

      setMenuCategories(data.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products?limit=100&${activeCategory === "all" ? "" : `category=${activeCategory}`}`,
      );
      const data = await response.json();
      setMenuItems(data.data);
    };
    fetchMenuItems();
  }, [activeCategory]);

  return (
    <CartProvider>
      <main className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-12 bg-foreground text-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-7xl font-light mb-6">
              BamBite Menu
            </h1>
            <p className="text-background/70 max-w-md mx-auto text-sm">
              All the best in one place
            </p>
          </div>
        </section>

        {/* Two-Column Menu Layout */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-[240px_1fr] gap-12">
              {/* Category Navigation - Left Side */}
              <nav className="md:sticky md:top-32 md:self-start">
                <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-6">
                  Categories
                </p>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveCategory("all")}
                      className={`w-full text-left p-1 font-serif text-lg transition-all duration-300 border-l-2 ${
                        activeCategory === "all"
                          ? "border-foreground text-foreground bg-muted/50"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                      }`}
                    >
                      All
                    </button>
                  </li>

                  {menuCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left p-1 font-serif text-lg transition-all duration-300 border-l-2 ${
                          activeCategory === category.name
                            ? "border-foreground text-foreground bg-muted/50"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Menu Items - Right Side */}
              <div key={activeCategory} className="min-h-100">
                {/* Items */}
                <div className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-8">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-col h-full bg-(--color-primary) p-1 rounded-md"
                      >
                        <div className="relative aspect-square overflow-hidden mb-2">
                          <Image
                            src={item.imageUrls[0]}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                          />
                        </div>
                        <div className="flex flex-col flex-1 p-2">
                          <div className="flex-1">
                            <h3 className="font-serif text-xl mb-2 text-(--color-title)">
                              {item.name}
                            </h3>
                            <p className="font-serif text-sm mb-2 text-(--color-title)">
                              {item.thaiName}
                            </p>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-4 mt-4 text-(--color-title)">
                            <span className="font-serif text-lg">
                              ฿{item.price}
                            </span>
                            <QuantityControls item={item} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </CartProvider>
  );
}
