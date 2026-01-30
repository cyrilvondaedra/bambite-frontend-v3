"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  "Stick",
  "Mary Cho's fried potatoes",
  "Beer & Drink",
  "Fruit juice",
  "barbecue",
  "Breakfast",
  "Tea and food",
  "Rice and noodles",
  "Sweets",
  "Desserts",
];

interface NavigationProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function Navigation({
  activeCategory,
  setActiveCategory,
}: NavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10,
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      container?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-background border-b border-border sticky top-0 z-20">
      <div className="px-4 py-4 flex items-center gap-2">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="shrink-0 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </button>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex gap-4 overflow-x-auto scrollbar-hide"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeCategory === category
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
              {activeCategory === category && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="shrink-0 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-foreground" />
          </button>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
