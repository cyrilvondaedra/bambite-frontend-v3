import ProfilePage from "@/components/ProfilePage"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account - Bambite",
  description: "Manage your profile, view orders, and change password",
};

export default function Page() {
  return <ProfilePage />;
}
