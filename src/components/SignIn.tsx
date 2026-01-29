"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit form");
      }

      toast.success("Your have successfully signed in!");
      setForm({
        email: "",
        password: "",
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="sign-in" className="py-20 px-6 bg-(--color-background)">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-light heading mb-4 tracking-wide">
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
                  className="w-full px-0 py-3 heading bg-transparent border-b primary_border placeholder:heading focus:outline-none focus:primary_border focus:border-(--color-primary) transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-0 py-3 heading bg-transparent border-b primary_border placeholder:heading focus:primary_border  placeholder:text-muted-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 sub_heading transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 heading" />
                  ) : (
                    <Eye className="h-4 w-4 heading" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-block mt-10 px-8 py-3 primary_btn text-sm rounded-3xl tracking-wider uppercase transition-all duration-300"
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
                <p className="heading">Don&apos;t have an account?</p>
                <Link
                  href="/register"
                  className="primary_text text-center underline"
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
