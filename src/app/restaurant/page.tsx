"use client";

import { useState } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import ProductGrid from "./components/ProductGrid";
import CartSheet from "./components/CartSheet";
import { useCart } from "@/components/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Home() {
  const { totalItems, totalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState("Beer & Drink");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  return (
    <main className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterClick={() => setShowFilters(!showFilters)}
      />
      <Navigation
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <div className="px-4 md:px-8 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {activeCategory}
        </h2>
        <ProductGrid
          category={activeCategory}
          searchQuery={searchQuery}
          priceRange={priceRange}
        />
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 animate-in slide-in-from-bottom">
            <h3 className="text-xl font-bold text-foreground mb-6">Filters</h3>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Price Range: ₿{priceRange[0]} - ₿{priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Cart Footer */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-secondary text-white p-4 flex items-center justify-between rounded-t-2xl z-40">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-3 flex-1"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs opacity-80">Total</p>
              <p className="text-lg font-bold">₿ {totalPrice.toFixed(2)}</p>
            </div>
          </button>
          <button
            onClick={() => setShowCart(true)}
            className="ml-4 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-all whitespace-nowrap"
          >
            confirm
          </button>
        </div>
      )}

      {/* Cart Sheet */}
      <CartSheet isOpen={showCart} onClose={() => setShowCart(false)} />
    </main>
  );
}
