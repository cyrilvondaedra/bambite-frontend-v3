"use client";

import { useUser } from "./UserContext";
import {
  LogOut,
  ArrowLeft,
  User,
  ShoppingBag,
  Star,
  Gift,
  Lock,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";
import PasswordSection from "./PasswordSection";
import PointHistorySection from "./PointHistorySection";
import RedeemHistorySection from "./RedeemHistorySection";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useCart } from "./CartContext";
import { toast } from "sonner";

type TabType = "profile" | "orders" | "points" | "redeems" | "password";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  {
    id: "profile",
    label: "Profile Details",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "orders",
    label: "Order History",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  { id: "points", label: "Point History", icon: <Star className="w-5 h-5" /> },
  {
    id: "redeems",
    label: "Redeem History",
    icon: <Gift className="w-5 h-5" />,
  },
  {
    id: "password",
    label: "Change Password",
    icon: <Lock className="w-5 h-5" />,
  },
];

const validTabs: TabType[] = [
  "profile",
  "orders",
  "points",
  "redeems",
  "password",
];

export default function ProfilePage() {
  const { user, updateProfile, setAccessToken, setUser } = useUser();
  const { setItems } = useCart();
  const searchParams = useSearchParams();

  const getInitialTab = (): TabType => {
    const tabParam = searchParams.get("tab");
    if (tabParam && validTabs.includes(tabParam as TabType)) {
      return tabParam as TabType;
    }
    return "profile";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImageUrl: user?.profileImageUrl || null,
  });
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  // Update active tab when URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && validTabs.includes(tabParam as TabType)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

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

  const logout = async () => {
    try {
      const res = await api(`/api/auth/logout`, { method: "POST" });
      toast.success(res.message);
    } finally {
      setItems([]);
      setAccessToken(null);
      setUser(null);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="primary_background border-b border_border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold heading">My Account</h1>
              {user && <p className="sub_heading mt-2">{user.email}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "primary_background primary_text font-medium"
                      : "hover:secondary_background sub_heading"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-red-500 hover:secondary_background mt-4"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
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

            {activeTab === "points" && <PointHistorySection />}

            {activeTab === "redeems" && <RedeemHistorySection />}

            {activeTab === "password" && <PasswordSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
