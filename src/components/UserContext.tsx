'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Order {
  id: string
  date: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
}

export interface User {
  id: string
  email: string
  name: string
  profileImageUrl?: string | null
  createdAt ?: string
  updatedAt?:string
}

interface UserContextType {
  user: User | null
  isLoggedIn: boolean
  orders: Order[]
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (details: Partial<User>) => Promise<void>
  changePassword: (otpCode: string, newPassword: string) => Promise<void>
  requestPasswordReset: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: User; orders: Order[] }> = {
  'user@example.com': {
    password: 'password123',
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
    },
    orders: [
      {
        id: 'ORD-001',
        date: '2024-01-15',
        items: [
          { name: 'Classic Burger', quantity: 2, price: 12.99 },
          { name: 'Greek Salad', quantity: 1, price: 10.99 },
        ],
        total: 36.97,
        status: 'completed',
      },
      {
        id: 'ORD-002',
        date: '2024-01-20',
        items: [{ name: 'Margherita Pizza', quantity: 1, price: 13.99 }],
        total: 13.99,
        status: 'completed',
      },
    ],
  },
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [otpCode, setOtpCode] = useState<string>('')

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const { email } = JSON.parse(savedUser)
      if (MOCK_USERS[email]) {
        setUser(MOCK_USERS[email].user)
        setOrders(MOCK_USERS[email].orders)
        setIsLoggedIn(true)
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userData = MOCK_USERS[email]
    if (!userData || userData.password !== password) {
      throw new Error('Invalid email or password')
    }

    setUser(userData.user)
    setOrders(userData.orders)
    setIsLoggedIn(true)
    localStorage.setItem('currentUser', JSON.stringify({ email }))
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setOrders([])
    localStorage.removeItem('currentUser')
  }

  const updateProfile = async (details: Partial<User>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (!user) throw new Error('No user logged in')

    const updatedUser = { ...user, ...details }
    setUser(updatedUser)

    const currentEmail = user.email
    if (MOCK_USERS[currentEmail]) {
      MOCK_USERS[currentEmail].user = updatedUser
    }
  }

  const requestPasswordReset = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (!user) throw new Error('No user logged in')
    
    // Generate a random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setOtpCode(code)
    console.log('[v0] OTP Code for demo:', code)
  }

  const changePassword = async (otpCode: string, newPassword: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (!user) throw new Error('No user logged in')

    if (otpCode !== otpCode) {
      throw new Error('Invalid OTP code')
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Update password in mock database
    if (MOCK_USERS[user.email]) {
      MOCK_USERS[user.email].password = newPassword
    }

    setOtpCode('')
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        orders,
        login,
        logout,
        updateProfile,
        changePassword,
        requestPasswordReset,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
