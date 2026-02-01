<<<<<<< HEAD
'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  'Stick',
  "Mary Cho's fried potatoes",
  'Beer & Drink',
  'Fruit juice',
  'barbecue',
  'Breakfast',
  'Tea and food',
  'Rice and noodles',
  'Sweets',
  'Desserts',
=======
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
>>>>>>> restaurant
];

interface NavigationProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

<<<<<<< HEAD
export default function Navigation({ activeCategory, setActiveCategory }: NavigationProps) {
=======
export default function Navigation({
  activeCategory,
  setActiveCategory,
}: NavigationProps) {
>>>>>>> restaurant
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
<<<<<<< HEAD
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
=======
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10,
>>>>>>> restaurant
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
<<<<<<< HEAD
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
=======
    container?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      container?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
>>>>>>> restaurant
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
<<<<<<< HEAD
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
=======
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
>>>>>>> restaurant
      });
    }
  };

  return (
<<<<<<< HEAD
    <div className="bg-background border-b border-border sticky top-0 z-20">
=======
    <div className="bg-background border-b border-border sticky top-0 z-20 mt-15">
>>>>>>> restaurant
      <div className="px-4 py-4 flex items-center gap-2">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
<<<<<<< HEAD
            onClick={() => scroll('left')}
            className="flex-shrink-0 p-2 hover:bg-muted rounded-full transition-colors"
=======
            onClick={() => scroll("left")}
            className="shrink-0 p-2 hover:bg-muted rounded-full transition-colors"
>>>>>>> restaurant
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
<<<<<<< HEAD
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
=======
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
>>>>>>> restaurant
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
<<<<<<< HEAD
            onClick={() => scroll('right')}
=======
            onClick={() => scroll("right")}
>>>>>>> restaurant
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
