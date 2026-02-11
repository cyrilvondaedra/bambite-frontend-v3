"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "./UserContext";
import { api } from "@/lib/api";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const {
    setUser,
    guestToken,
    setGuestToken,
    setAccessToken,
    fetchGuestUser,
    setGuestUser,
  } = useUser();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid verification link");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        const res = await api(`/api/auth/user/verify-email`, {
          method: "POST",
          headers,
          body: JSON.stringify({ token }),
        });

        console.log("Verification response:", res);

        const userData = res?.data?.user ?? res?.data ?? null;

        if (guestToken) {
          setGuestUser(res?.data?.user);
        }

        setUser(userData);

        toast.success(res.message || "Email verified successfully!");

        router.push("/checkout");
      } catch (err: unknown) {
        console.error("Email verification failed:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    searchParams,
    router,
    guestToken,
    setUser,
    setGuestToken,
    setAccessToken,
    fetchGuestUser,
    setGuestUser,
  ]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      {loading && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          Verifying…
        </div>
      )}
    </main>
  );
}
