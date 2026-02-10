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
  const { accessToken, guestToken, setUser } = useUser();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("token",token);
    
    if (!token) {
      toast.error("Invalid verification link");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // const headers: Record<string, string> = {
        //   "Content-Type": "application/json",
        // };

        // // logged-in users: cookie + optional accessToken backup
        // if (user) {
        //   const accessToken = localStorage.getItem("accessToken");
        //   if (accessToken) {
        //     headers["Authorization"] = `Bearer ${accessToken}`;
        //   }
        // } else {
        //   // guest users (rare but safe to support)
        //   const guestToken = localStorage.getItem("token");
        //   if (guestToken) {
        //     headers["X-Guest-Token"] = guestToken;
        //   }
        // }

        // const res = await fetch("/api/auth/user/verify-email", {
        //   method: "POST",
        //   headers,
        //   body: JSON.stringify({ token }),
        //   credentials: user ? "include" : "omit",
        // });
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (!accessToken && guestToken) {
          headers["X-Guest-Token"] = guestToken;
        }

        const res = await api(`/api/auth/user/verify-email`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({ token }),
        });

        setUser(res.data);
        toast.success(res.message || "Email verified");
        router.push("/checkout");
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, router, guestToken, accessToken]);

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
