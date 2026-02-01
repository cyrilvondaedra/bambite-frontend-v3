"use client";

import { useUser } from "./UserContext";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProfileSection from "./ProfileSection";
// import OrdersSection from "./OrdersSection";
import PasswordSection from "./PasswordSection";

type TabType = "profile" | "orders" | "password";

export default function ProfilePage() {
  //   const { user, logout, updateProfile } = useUser();
  const user = {
    id: "d58bcdbd-d1ea-4f0d-978f-dcf26162e73d",
    name: "Gerrard",
    email: "august810.a@gmail.com",
    profileImageUrl: null,
    createdAt: "2026-01-29T03:28:50.890Z",
    updatedAt: "2026-01-29T03:28:50.890Z",
  };

  // const { logout, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImageUrl: user?.profileImageUrl || null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      // await updateProfile({
      //   name: formData.name,
      //   email: formData.email,
      //   profileImageUrl: formData.profileImageUrl || ""
      // });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // logout();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Please log in to view your profile
          </h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="primary_background border-b border_border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-ultra-wide nav-link transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="">Back to Home</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold heading">My Account</h1>
              <p className="sub_heading mt-2">{user.email}</p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "profile"
                ? "primary_border primary_text"
                : "border-transparent sub_heading"
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "primary_border primary_text"
                : "border-transparent sub_heading"
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "password"
                ? "primary_border primary_text"
                : "border-transparent sub_heading"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Tab Content */}
        {/* {activeTab === "profile" && (
          <ProfileSection
            user={user}
            isEditing={isEditing}
            formData={formData}
            message={message}
            isSaving={isSaving}
            onEdit={() => setIsEditing(true)}
            onCancel={() => {
              setIsEditing(false);
              setFormData({
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
              });
            }}
            onSave={handleSaveProfile}
            onFormChange={(field, value) =>
              setFormData((prev) => ({ ...prev, [field]: value }))
            }
          />
        )}

        {activeTab === "orders" && <OrdersSection />} */}

        {activeTab === "password" && <PasswordSection />}
      </div>
    </div>
  );
}
