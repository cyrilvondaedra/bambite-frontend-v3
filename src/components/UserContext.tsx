"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

interface UserContextType {
  user: User | null;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [otpCode, setOtpCode] = useState<string>("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      let token;
      const storedValue = localStorage.getItem("accessToken");

      if (!storedValue) return;

      try {
        token = JSON.parse(storedValue);
      } catch (error) {
        token = storedValue;
      }

      try {
        console.log("fetchUser token", token);

        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        setAuthLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        console.log("user data", data);

        if (!res.ok) {
          localStorage.removeItem("accessToken");
          setIsLoggedIn(false);
          return;
        }

        // adjust shape based on backend response
        setUser(data.data.user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

    if (authLoading) {
      return (
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin h-6 w-6 rounded-full border-2 border_border border-t-transparent" />
        </main>
      );
    }

//   const login = async (email: string, password: string) => {
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const userData = MOCK_USERS[email];
//     if (!userData || userData.password !== password) {
//       throw new Error("Invalid email or password");
//     }

//     setUser(userData.user);
//     setOrders(userData.orders);
//     setIsLoggedIn(true);
//     localStorage.setItem("currentUser", JSON.stringify({ email }));
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
