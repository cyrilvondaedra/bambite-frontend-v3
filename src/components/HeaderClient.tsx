"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, CircleUser } from "lucide-react";
import CartSheet from "./CartSheet";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useUser } from "./UserContext";

export default function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { authLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    }
  };

  const handleRemove = () => {
    setSearchQuery("");
  };

  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <div className="hidden xl:flex items-center gap-4">
        <div className="flex items-center gap-2 border border_border rounded-3xl px-3 py-1">
          <Search className="w-4 h-4 heading" />
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
            className="bg-transparent border-none outline-none text-sm heading py-1 w-35 placeholder:text-white placeholder:opacity-50"
            autoFocus
          />
          <button
            onClick={handleRemove}
            className={`p-1 nav-link transition-colors ${
              searchQuery ? "visible" : "invisible"
            }`}
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Link href="/my_account" className="nav-link transition-colors">
          <CircleUser className="w-5 h-5" />
        </Link>
        <CartSheet />
      </div>

      <div className="flex xl:hidden items-center gap-2">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-2 nav-link"
          aria-label={isSearchOpen ? "Close search" : "Open search"}
        >
          <Search className="w-4 h-4 xl:w-5 xl:h-5" />
        </button>
        {authLoading ? (
          <div className="h-4 w-4 xl:h-5 xl:w-5 rounded-full secondary_background animate-pulse" />
        ) : (
          <Link href="/my_account" className="nav-link transition-colors">
            <CircleUser className="w-4 h-4 xl:w-5 xl:h-5" />
          </Link>
        )}
        <CartSheet />
        <button
          className="p-2 nav-link"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Mobile Search Bar */}
      {/* {isSearchOpen && (
        <div className="xl:hidden px-6 pb-4">
          <div className="flex items-center gap-2 border border-(--color-border) rounded-3xl px-3 py-1">
            <Search className="w-4 h-4 heading" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearchSubmit();
                }
              }}
              className="bg-transparent heading rounded-3xl border-none outline-none text-sm py-2 flex-1 placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={handleRemove}
              className={`p-1 nav-link ${
                searchQuery ? "visible" : "invisible"
              }`}
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )} */}

      {isSearchOpen && (
        <div className="xl:hidden fixed left-0 right-0 top-0 z-60 primary_background border-b border_border">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 border border_border rounded-3xl px-3 py-2">
              <Search className="w-4 h-4 heading shrink-0" />
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                className="bg-transparent border-none outline-none text-sm heading flex-1 placeholder:text-muted-foreground focus-visible:ring-0"
              />
              <button
                onClick={
                  searchQuery ? handleRemove : () => setIsSearchOpen(false)
                }
                className="p-1 nav-link"
                aria-label={searchQuery ? "Clear search" : "Close search"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 primary_background heading1 z-50">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/"
              className="text-sm tracking-wide nav-link transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about_us"
              className="text-sm tracking-wide nav-link transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/menus"
              className="text-sm tracking-wide nav-link transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/contact_us"
              className="text-sm tracking-wide nav-link transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              href="/careers"
              className="text-sm tracking-wide nav-link transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Career
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
