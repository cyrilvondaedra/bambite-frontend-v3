'use client';

import { Search, Settings } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterClick: () => void;
}

export default function Header({ searchQuery, setSearchQuery, onFilterClick }: HeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <div className="relative w-full">
      {/* Blurred background */}
      <div 
        className="h-40 w-full bg-linear-to-b from-amber-200 to-green-100 opacity-40 blur-xl absolute"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(200, 150, 100, 0.3) 0%, rgba(100, 180, 100, 0.3) 100%)',
        }}
      />
      
      <div className="relative z-10 flex items-center justify-between px-6 py-8 bg-linear-to-b from-stone-200/30 to-transparent">
        {/* Left icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="text-foreground hover:bg-muted p-2 rounded-full transition-colors"
          >
            <Search size={24} />
          </button>
          <button 
            onClick={onFilterClick}
            className="text-foreground hover:bg-muted p-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-8 z-50">
          <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">Gqos</span>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button className="text-foreground hover:bg-muted p-2 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
          <button className="text-foreground hover:bg-muted p-2 rounded-full transition-colors">
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      {showSearchInput && (
        <div className="relative z-20 px-6 py-4 bg-background border-b border-border">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-full bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
