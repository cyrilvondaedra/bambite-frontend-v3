"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, CircleUser, User, ShoppingBag, Star, Gift, Lock, LogOut } from "lucide-react";
import CartSheet from "./CartSheet";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useUser } from "./UserContext";
import { useCart } from "./CartContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { user, authLoading, setAccessToken, setUser } = useUser();
  const { setItems } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        
        {/* Mobile Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          {authLoading ? (
            <div className="h-4 w-4 xl:h-5 xl:w-5 rounded-full secondary_background animate-pulse" />
          ) : (
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="nav-link transition-colors p-2"
              aria-label="Profile menu"
            >
              <CircleUser className="w-4 h-4 xl:w-5 xl:h-5" />
            </button>
          )}
          
          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 rounded-lg primary_background border border_border shadow-lg overflow-hidden z-50">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border_border">
                    <p className="text-sm font-medium heading truncate">{user.name || "User"}</p>
                    <p className="text-xs sub_heading truncate">{user.email}</p>
                  </div>
                  <nav className="py-2">
                    <Link
                      href="/my_account?tab=profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm nav-link hover:secondary_background transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile Details
                    </Link>
                    <Link
                      href="/my_account?tab=orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm nav-link hover:secondary_background transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Order History
                    </Link>
                    <Link
                      href="/my_account?tab=points"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm nav-link hover:secondary_background transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      Point History
                    </Link>
                    <Link
                      href="/my_account?tab=redeems"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm nav-link hover:secondary_background transition-colors"
                    >
                      <Gift className="w-4 h-4" />
                      Redeem History
                    </Link>
                    <Link
                      href="/my_account?tab=password"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm nav-link hover:secondary_background transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </Link>
                  </nav>
                  <div className="border-t border_border py-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await api(`/api/auth/logout`, { method: "POST" });
                          toast.success(res.message);
                        } finally {
                          setItems([]);
                          setAccessToken(null);
                          setUser(null);
                          setIsProfileOpen(false);
                          router.push("/");
                        }
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:secondary_background transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-2">
                  <Link
                    href="/my_account"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm nav-link hover:secondary_background transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Sign In / Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
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
