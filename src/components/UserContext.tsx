"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { refreshAuthToken } from "@/lib/api-client";
import { fetchUserProfile } from "@/lib/user-api";
import { clearTokens } from "@/lib/auth-token";

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
  guestUser: GuestUser | null;
  authLoading: boolean;
  fetchUser: () => Promise<boolean>;
  fetchGuestUser: () => Promise<boolean>;
  //   isLoggedIn: boolean;
  //   orders: Order[];
  //   login: (email: string, password: string) => Promise<void>;
  //   logout: () => void;
  //   updateProfile: (details: Partial<User>) => Promise<void>;
  //   changePassword: (otpCode: string, newPassword: string) => Promise<void>;
  //   requestPasswordReset: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const router = useRouter();

  const fetchUser = async (): Promise<boolean> => {
    try {
      const user = await fetchUserProfile();

      if (!user) {
        setUser(null);
        setIsLoggedIn(false);
        return false;
      }

      setUser(user);
      setIsLoggedIn(true);
      return true;
    } catch (e) {
      console.error("Failed to fetch user:", e);
      setUser(null);
      setIsLoggedIn(false);
      clearTokens();
      return false;
    }
  };

  const fetchGuestUser = async (): Promise<boolean> => {
    const guestToken = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/guest/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(guestToken ? { "X-Guest-Token": guestToken } : {}),
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      setGuestUser(data.data.user);
      setIsLoggedIn(true);
      return true;
    } catch (error: any) {
      console.error("Failed to fetch user:", error.message);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (
        typeof window !== "undefined" &&
        window.location.pathname.includes("/restaurant/table/")
      ) {
        setUser(null);
        setIsLoggedIn(false);
        setAuthLoading(false);
        return;
      }

      const success = await fetchUser();

      if (!success) {
        setIsLoggedIn(false);
      }

      setAuthLoading(false);
    };

    initAuth();
  }, []);

  // Set up token refresh interval (optional - refresh before expiry)
  useEffect(() => {
    if (!isLoggedIn) return;

    // Refresh token every 14 minutes if access token expires in 15 minutes
    const interval = setInterval(async () => {
      await refreshAccessToken();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  //   const login = async (email: string, password: string) => {
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     const userData = MOCK_USERS[email];
  //     if (!userData || userData.password !== password) {
  //       throw new Error("Invalid email or password");
  //     }

  //     setUser(userData.user);
  //     setOrders(userData.orders);
  //     setIsLoggedIn(true);
  //     localStorage.setItem("currentUser", email);
  //   };

  //   const logout = () => {
  //     setUser(null);
  //     setIsLoggedIn(false);
  //     setOrders([]);
  //     localStorage.removeItem("currentUser");
  //   };

  //   const updateProfile = async (details: Partial<User>) => {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     if (!user) throw new Error("No user logged in");

  //     const updatedUser = { ...user, ...details };
  //     setUser(updatedUser);

  //     const currentEmail = user.email;
  //     if (MOCK_USERS[currentEmail]) {
  //       MOCK_USERS[currentEmail].user = updatedUser;
  //     }
  //   };

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
        authLoading,
        guestUser,
        fetchUser,
        fetchGuestUser,
        // isLoggedIn,
        // orders,
        // login,
        // logout,
        // updateProfile,
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
