"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, CircleUser } from "lucide-react";
import Image from "next/image";
import CartSheet from "./CartSheet";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    // const params = new URLSearchParams(searchParams.toString());
    // params.delete("q");

    // router.replace(`?${params.toString()}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-(--color-background) text-(--color-text) border-b border-border">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <div className="w-15 xl:w-40">
          <Link
            href="/"
            className="font-serif text-xl font-medium tracking-wide text-foreground"
          >
            <Image
              src="/bb.png"
              alt="Bambite Logo"
              width={100}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="hidden xl:flex items-center gap-12">
          <Link
            href="/"
            className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about_us"
            className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary)transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/menus"
            className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/contact_us"
            className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="#career"
            className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
          >
            Career
          </Link>
        </div>

        <div className="hidden xl:flex items-center gap-4">
          <div className="flex items-center gap-2 border border-(--color-primary) rounded-3xl px-3 py-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const trimmed = searchQuery.trim();
                  if (!trimmed) return;
                  router.push(`/search?q=${encodeURIComponent(trimmed)}`);
                }
              }}
              className="bg-transparent border-none outline-none text-sm py-1 w-35 placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={() => {
                handleRemove();
              }}
              className={`p-1 hover:text-muted-foreground transition-colors ${
                searchQuery ? "visible" : "invisible"
              }`}
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Link href="/my_account">
            <CircleUser className="w-5 h-5" />
          </Link>
          <CartSheet />
        </div>

        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2"
            aria-label={isSearchOpen ? "Close search" : "Open search"}
          >
            <Search className="w-4 h-4 xl:w-5 xl:h-5" />
          </button>
          <Link href="/my_account">
            <CircleUser className="w-4 h-4 xl:w-5 xl:h-5" />
          </Link>
          <CartSheet />
          <button
            className="p-2"
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
      </nav>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="xl:hidden px-6 pb-4">
          <div className="flex items-center gap-2 border border-(--color-primary) rounded-3xl px-3 py-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const trimmed = searchQuery.trim();
                  if (!trimmed) return;
                  router.push(`/search?q=${encodeURIComponent(trimmed)}`);
                }
              }}
              className="bg-transparent rounded-3xl border-none outline-none text-sm py-2 flex-1 placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={() => {
                handleRemove();
              }}
              className={`p-1 ${searchQuery ? "visible" : "invisible"}`}
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-background border-t border-border">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/"
              className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about_us"
              className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/menus"
              className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/contact_us"
              className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              href="/career"
              className="text-sm tracking-wide text-muted-foreground hover:text-(--color-primary) transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Career
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
