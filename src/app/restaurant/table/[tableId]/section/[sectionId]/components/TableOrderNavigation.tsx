"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiCategory } from "@/types/api/table-order";

interface TableOrderNavigationProps {
  categories: ApiCategory[];
  activeCategoryId: string | null;
  setActiveCategoryId: (id: string | null) => void;
  isLoading?: boolean;
}

export default function TableOrderNavigation({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  isLoading,
}: TableOrderNavigationProps) {
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
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="px-3 md:px-4 py-3 md:py-4 flex gap-3 md:gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="shrink-0 h-8 md:h-9 w-20 md:w-24 bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-30 shadow-sm">
      <div className="px-3 md:px-4 py-3 md:py-4 flex items-center gap-1 md:gap-2">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="shrink-0 p-2 hover:bg-muted rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} className="text-foreground md:w-5 md:h-5" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex-1 flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`shrink-0 px-3 md:px-4 py-2 min-h-[40px] text-xs md:text-sm font-medium whitespace-nowrap transition-colors relative touch-manipulation ${
              activeCategoryId === null
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground active:text-primary/70"
            }`}
          >
            All
            {activeCategoryId === null && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-primary rounded-full" />
            )}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`shrink-0 px-3 md:px-4 py-2 min-h-[40px] text-xs md:text-sm font-medium whitespace-nowrap transition-colors relative touch-manipulation ${
                activeCategoryId === cat.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground active:text-primary/70"
              }`}
            >
              {cat.name}
              {activeCategoryId === cat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="shrink-0 p-2 hover:bg-muted rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} className="text-foreground md:w-5 md:h-5" />
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
