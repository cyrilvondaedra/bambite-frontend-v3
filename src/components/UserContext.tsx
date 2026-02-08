"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@/lib/user-api";
import { clearTokens } from "@/lib/auth-token";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/api";
import { api } from "@/lib/api";
import { useCart } from "./CartContext";

export interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "completed" | "cancelled";
}

export interface User {
  id: string;
  name: string;
  email: string;

  emailVerified: boolean;
  emailVerifiedAt: string | null;

  profileImageUrl: string | null;

  createdAt: string;
  updatedAt: string;
  memberId?: string | null;
  memberQrCodeUrl?: string | null;
  points?: number | null;
}

export interface GuestUser {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;

  emailVerified: boolean;
  emailVerifiedAt: string | null;

  isGuest: boolean;

  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  // guestUser: GuestUser | null;
  authLoading: boolean;
  profileLoading: boolean;
  // fetchUser: () => Promise<boolean>;
  // fetchGuestUser: () => Promise<boolean>;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  //   isLoggedIn: boolean;
  //   orders: Order[];
  //   login: (email: string, password: string) => Promise<void>;
  // logout: () => void;
  updateProfile: (details: Partial<User>) => Promise<void>;
  //   changePassword: (otpCode: string, newPassword: string) => Promise<void>;
  //   requestPasswordReset: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  // const fetchUser = async (): Promise<boolean> => {
  //   try {
  //     const user = await fetchUserProfile();

  //     if (!user) {
  //       setUser(null);
  //       setIsLoggedIn(false);
  //       return false;
  //     }
  //     console.log("user", user);

  //     setUser(user);
  //     setIsLoggedIn(true);
  //     return true;
  //   } catch (e) {
  //     console.error("Failed to fetch user:", e);
  //     setUser(null);
  //     setIsLoggedIn(false);
  //     clearTokens();
  //     return false;
  //   }
  // };

  // const fetchGuestUser = async (): Promise<boolean> => {
  //   const guestToken = localStorage.getItem("token");
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/guest/profile`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...(guestToken ? { "X-Guest-Token": guestToken } : {}),
  //         },
  //       }
  //     );

  //     const data = await res.json();
  //     if (!res.ok) {
  //       throw new Error(data.message || "Failed to fetch user");
  //     }

  //     setGuestUser(data.data.user);
  //     setIsLoggedIn(true);
  //     return true;
  //   } catch (error: any) {
  //     console.error("Failed to fetch user:", error.message);
  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   const initAuth = async () => {
  //     if (
  //       typeof window !== "undefined" &&
  //       window.location.pathname.includes("/restaurant/table/")
  //     ) {
  //       setUser(null);
  //       setIsLoggedIn(false);
  //       setAuthLoading(false);
  //       return;
  //     }

  //     const success = await fetchUser();

  //     if (!success) {
  //       setIsLoggedIn(false);
  //     }

  //     setAuthLoading(false);
  //   };

  //   initAuth();
  // }, []);

  const refresh = async () => {
    try {
      const data = await api("/api/auth/refresh-token", { method: "POST" });

      setAccessToken(data.data.tokens.accessToken);
    } catch (err) {
      console.error("❌ refresh() failed:", err);
      setAccessToken(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setProfileLoading(true);
      try {
        const res = await api("/api/auth/user/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setProfileLoading(false);
      }
    };

    if (accessToken) fetchUser();
  }, [accessToken]);

  const updateProfile = async (details: Partial<User>): Promise<void> => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch("/api/auth/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
          }),
        },
        body: JSON.stringify({
          name: details.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success(data.message);
      setUser(data.data.user);
    } catch (error: any) {
      console.error("updateProfile failed:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  //   const requestPasswordReset = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     if (!user) throw new Error("No user logged in");

  //     // Generate a random 6-digit OTP
  //     const code = Math.floor(100000 + Math.random() * 900000).toString();
  //     setOtpCode(code);
  //     console.log("[v0] OTP Code for demo:", code);
  //   };

  //   const changePassword = async (otpCode: string, newPassword: string) => {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     if (!user) throw new Error("No user logged in");

  //     if (otpCode !== otpCode) {
  //       throw new Error("Invalid OTP code");
  //     }

  //     if (newPassword.length < 6) {
  //       throw new Error("Password must be at least 6 characters");
  //     }

  //     // Update password in mock database
  //     if (MOCK_USERS[user.email]) {
  //       MOCK_USERS[user.email].password = newPassword;
  //     }

  //     setOtpCode("");
  //   };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        profileLoading,
        // guestUser,
        // fetchUser,
        // fetchGuestUser,
        accessToken,
        setAccessToken,
        // isLoggedIn,
        // orders,
        // login,
        updateProfile,
        // changePassword,
        // requestPasswordReset,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
