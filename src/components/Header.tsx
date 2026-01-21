"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";
import CartSheet from "./CartSheet";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"

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
    } else {
      params.delete("q");
    }

    router.replace(`?${params.toString()}`);
  };

  const handleRemove = () => {
    setSearchQuery("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");

    router.replace(`?${params.toString()}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-serif text-xl font-medium tracking-wide text-foreground"
          >
            <Image
              src="/bb.png"
              alt="Bambite Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-18">
          <Link
            href="/"
            className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="#about_us"
            className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
          >
            About Us
          </Link>
          <Link
            href="#menu"
            className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
          >
            Menu
          </Link>
          <Link
            href="#contact_us"
            className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="#career"
            className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
          >
            Career
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 border border-primary rounded-3xl px-3 py-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={handleChange}
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
          <CartSheet />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2"
            aria-label={isSearchOpen ? "Close search" : "Open search"}
          >
            <Search className="w-5 h-5" />
          </button>
          <CartSheet />
          <button
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="flex items-center gap-2 border-b border-foreground">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={handleChange}
              className="bg-transparent border-none outline-none text-sm py-2 flex-1 placeholder:text-muted-foreground"
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/"
              className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#about_us"
              className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="#menu"
              className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="#contact_us"
              className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              href="#career"
              className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors"
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
