"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

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
  guestUser: GuestUser | null;
  authLoading: boolean;
  profileLoading: boolean;
  // fetchUser: () => Promise<boolean>;
  fetchGuestUser: (tokenOverride?: string) => Promise<void>;
  setGuestUser: React.Dispatch<React.SetStateAction<GuestUser | null>>;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  guestToken: string | null;
  setGuestToken: (token: string | null) => void;
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
  const [guestToken, setGuestToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("guest");

    const token = localStorage.getItem("token");
    setGuestToken(token);
  }, []);

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

  const fetchGuestUser = async () => {
    setProfileLoading(true);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (!accessToken && guestToken) {
        headers["X-Guest-Token"] = guestToken;
      }

      const res = await api("/api/auth/guest/profile", {
        headers,
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setProfileLoading(false);
    }
  };

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
    } catch (error: unknown) {
      console.error("updateProfile failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
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
        guestUser,
        fetchGuestUser,
        setGuestUser,
        accessToken,
        setAccessToken,
        guestToken,
        setGuestToken,
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
