"use client";

import SignIn from "@/components/SignIn";
import ProfilePage from "@/components/ProfilePage";
import { useUser } from "@/components/UserContext";

export default function RegisterGate() {
  const { user, authLoading, profileLoading } = useUser();

  // Still checking auth or profile
  if (authLoading || profileLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
      </main>
    );
  }

  // Not logged in
  if (!user) {
    return <SignIn />;
  }

  // Logged in
  return <ProfilePage />;
}
