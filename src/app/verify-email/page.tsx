"use client";

import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useSearchParams, useRouter } from "next/navigation";
=======
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
>>>>>>> restaurant
import { toast } from "sonner";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
<<<<<<< HEAD
  const router = useRouter();
  const token = searchParams.get("token");

  console.log("token",token);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
=======
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
>>>>>>> restaurant
    if (!token) {
      setLoading(false);
      return;
    }
<<<<<<< HEAD
    console.log("token");
    
    const verifyEmail = async () => {
      try {
=======
    console.log("VerifyEmail", token);

    (async () => {
      try {
        setLoading(true);

        const accessToken = localStorage.getItem("accessToken");

>>>>>>> restaurant
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/verify-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
<<<<<<< HEAD
=======
              ...(accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
>>>>>>> restaurant
            },
            body: JSON.stringify({ token }),
          },
        );
        const data = await res.json();
<<<<<<< HEAD
        console.log("Verification:", data);

        if (!res.ok) {
          throw new Error(data.message);
        }
        toast.success(data.message);
        router.replace("/checkout");
      } catch (error: any) {
        console.error("Email verification error:", error);
        toast.error(error.message || "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);
=======

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        router.push("/");
      } catch (e: any) {
        console.error(e);
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);
>>>>>>> restaurant

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      {loading && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
<<<<<<< HEAD
          Verifying email…
=======
          Verifying…
>>>>>>> restaurant
        </div>
      )}
    </main>
  );
}
