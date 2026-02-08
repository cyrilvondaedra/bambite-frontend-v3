"use client";

import MyAccountHeroSection from "@/components/MyAccountHeroSection";
import RegisterGate from "@/components/RegisterGate";
import { useUser } from "@/components/UserContext";

export default function RegisterContent() {
  const { user, authLoading, profileLoading } = useUser();

  if (authLoading || profileLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <div className="pt-16">
      {!user && <MyAccountHeroSection />}
      <RegisterGate />
    </div>
  );
}
