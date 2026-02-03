"use client";

import { useState } from "react";

interface TableOrderHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TableOrderHeader({
  searchQuery,
  setSearchQuery,
}: TableOrderHeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <div className="relative w-full mb-3 md:mb-4">
      <div
        className="h-40 w-full bg-linear-to-b from-amber-200 to-green-100 opacity-40 blur-xl absolute"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(200, 150, 100, 0.3) 0%, rgba(100, 180, 100, 0.3) 100%)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 pt-5 md:pt-6 pb-14 md:pb-16 bg-linear-to-b from-stone-200/30 to-transparent">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className={`transition-all min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation ${
              showSearchInput
                ? "text-primary bg-primary/10 p-2 md:p-2.5 rounded-full"
                : "text-foreground hover:bg-muted p-2 md:p-2.5 rounded-full"
            }`}
            aria-label="Toggle search"
          >
            {showSearchInput ? (
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 top-4 md:top-5 z-50">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl border-3 border-white/20">
            <span className="text-white text-sm md:text-base font-bold tracking-wide">
              BamBite
            </span>
          </div>
        </div>

        <div className="w-11 md:w-12" aria-hidden />
      </div>

      {showSearchInput && (
        <div className="relative z-30 px-4 md:px-6 py-4 md:py-5 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm -mt-4">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 md:py-3.5 text-base border-2 border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted rounded-full transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
