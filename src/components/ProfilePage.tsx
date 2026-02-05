"use client";

import { useUser } from "./UserContext";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";
import PasswordSection from "./PasswordSection";
import { toast } from "sonner";

type TabType = "profile" | "orders" | "password";

export default function ProfilePage() {
  const { user, logout, updateProfile, authLoading } = useUser();

  // const { logout, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImageUrl: user?.profileImageUrl || null,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
      });
      setIsEditing(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // logout();
    window.location.href = "/";
  };

  if (!user) {
    window.location.href = "/";
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
              {user && <p className="sub_heading mt-2">{user.email}</p>}
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
        {activeTab === "profile" && user && (
          <ProfileSection
            user={user}
            isEditing={isEditing}
            formData={formData}
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

        {activeTab === "orders" && <OrdersSection />}

        {activeTab === "password" && <PasswordSection />}
      </div>
    </div>
  );
}
