"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";
import { api } from "@/lib/api";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ phoneNumber?: string }>({});

  const { setUser } = useUser();

  const validatePhoneNumber = (raw: string) => {
    const v = raw.trim();

    if (!v) return "Phone number is required.";

    if (!/^[0-9+\-\s()]+$/.test(v))
      return "Phone number contains invalid characters.";

    const digits = v.replace(/\D/g, "");

    if (digits.length < 10 || digits.length > 10) {
      return "Phone number must be 10 digits.";
    }

    // optional: if starts with 0, expect 9–10 digits (commonly 10)
    if (v.startsWith("0") && (digits.length < 9 || digits.length > 10)) {
      return "Local phone numbers should be 9–10 digits.";
    }

    return null;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const phoneMsg = validatePhoneNumber(form.phoneNumber);
      if (phoneMsg) {
        setErrors({ phoneNumber: phoneMsg });
        return;
      }

      setIsLoading(true);

      // Get guest token if exists
      const guestToken = typeof window !== 'undefined' ? localStorage.getItem('guest_token') : null;

      const res = await api(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          ...(guestToken && { guestToken }),
        }),
      });
      console.log("res",res);
      
      toast.success(res.message || "Your have successfully signed in!");
      setForm({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
      });
      setUser(res.data.user)
      router.push("/my_account");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="sign-up" className="py-20 px-6 primary_background">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-light heading mb-4 tracking-wide">
            Create An Account?
          </h2>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-0 py-3 heading bg-transparent border-b primary_border placeholder:heading focus:outline-none focus:primary_border transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-0 py-3 heading bg-transparent border-b primary_border placeholder:heading focus:outline-none focus:primary_border transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="Phone number"
                  value={form.phoneNumber}
                  onChange={(e) => {
                    const next = e.target.value;
                    setForm((prev) => ({ ...prev, phoneNumber: next }));

                    const msg = validatePhoneNumber(next);
                    setErrors((prev) => ({
                      ...prev,
                      phoneNumber: msg ?? undefined,
                    }));
                  }}
                  onBlur={() => {
                    const msg = validatePhoneNumber(form.phoneNumber);
                    setErrors((prev) => ({
                      ...prev,
                      phoneNumber: msg ?? undefined,
                    }));
                  }}
                  inputMode="tel"
                  autoComplete="tel"
                  className={`w-full px-0 py-3 heading bg-transparent border-b placeholder:heading focus:outline-none transition-colors
        ${
          errors.phoneNumber
            ? "border-red-500"
            : "primary_border focus:primary_border"
        }`}
                  required
                />

                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
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
                  className="w-full px-0 py-3 heading bg-transparent border-b primary_border placeholder:heading focus:outline-none focus:primary_border transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 sub_heading transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
    w-full mt-10 px-8 py-3
    primary_btn text-sm rounded-3xl tracking-wider uppercase
    transition-all duration-300
    flex items-center justify-center gap-2
    ${isLoading ? "opacity-80 cursor-not-allowed" : ""}
  `}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
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
                  <span>Processing…</span>
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>

            <div className="flex items-center justify-center">
              <div className="space-x-2 flex items-center">
                <p className="heading">Already have an account?</p>
                <Link
                  href="/my_account"
                  className="text-(--color-primary) text-center underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center text-sm sub_heading mt-6">
          By creating an account, you agree to our{" "}
          <a href="#" className="primary_text hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="primary_text hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </section>
  );
}
