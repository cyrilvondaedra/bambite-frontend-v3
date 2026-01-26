"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };
  return (
    <section id="sign-in" className="py-20 px-6 bg-(--color-background)">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-light text-(--color-header2) mb-4 tracking-wide">
            My account
          </h2>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-(--color-header2) placeholder:text-muted-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-(--color-header2) placeholder:text-muted-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-(--color-header2)" />
                  ) : (
                    <Eye className="h-4 w-4 text-(--color-header2)" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-block mt-10 px-8 py-3 bg-(--color-background) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-header1) border border-(--color-primary) text-sm rounded-3xl tracking-wider uppercase transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
            <div className="flex items-center justify-center">
              <div className="space-x-2 flex items-center">
                <p className="text-(--color-header2)">Don&apos;t have an account?</p>
                <Link
                  href="/register"
                  className="text-(--color-primary) text-center underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
