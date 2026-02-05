"use client";

import SignIn from "@/components/SignIn";
import ProfilePage from "@/components/ProfilePage";
import { useUser } from "@/components/UserContext";

export default function RegisterGate() {
  const { user } = useUser();

  return user ? <ProfilePage /> : <SignIn />;
}
