'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useUser } from './UserContext'
import { api } from '@/lib/api'
import { toast } from 'sonner'

type Step = 'request' | 'reset' | 'success'

export default function PasswordChangeSection() {
  const { user, accessToken } = useUser()
  const [email, setEmail] = useState(user?.email || '')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<Step>('request')

  const inputClassName = "w-full px-0 py-3 heading bg-transparent border-b primary_border placeholder:heading focus:outline-none focus:primary_border transition-colors"

  const handleRequestReset = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
      }

      const res = await api('/api/auth/user/forgot-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email }),
      })

      toast.success(res.message || 'OTP sent to your email')
      setStep('reset')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP')
      return
    }
    if (!newPassword.trim()) {
      toast.error('Please enter a new password')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      const res = await api('/api/auth/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      toast.success(res.message || 'Password reset successfully')
      setStep('success')
      // Clear form
      setOtp('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartOver = () => {
    setStep('request')
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <Card className="p-6 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Change Password</h2>
      </div>

      {step === 'request' && (
        <div className="space-y-6">
          <p className="body">
            Enter your email address and we&apos;ll send you an OTP to reset your password.
          </p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
          />

          <Button
            onClick={handleRequestReset}
            disabled={isLoading}
            className="w-full primary_btn rounded-3xl"
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </Button>
        </div>
      )}

      {step === 'reset' && (
        <div className="space-y-6">
          <button
            onClick={handleStartOver}
            className="flex items-center gap-1 text-sm body hover:opacity-80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <p className="body">
            Enter the OTP sent to <span className="font-medium heading">{email}</span> and your new password.
          </p>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className={inputClassName}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${inputClassName} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 body hover:opacity-80"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClassName} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 body hover:opacity-80"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button
            onClick={handleResetPassword}
            disabled={isLoading}
            className="w-full primary_btn rounded-3xl"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <button
            onClick={handleRequestReset}
            disabled={isLoading}
            className="w-full text-sm body hover:opacity-80 transition-colors"
          >
            Didn&apos;t receive OTP? Send again
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <div>
            <p className="font-medium heading">Password Reset Successfully!</p>
            <p className="text-sm body mt-1">
              Your password has been changed. You can now use your new password to sign in.
            </p>
          </div>
          <Button
            onClick={handleStartOver}
            className="mt-4 primary_btn rounded-3xl"
          >
            Done
          </Button>
        </div>
      )}
    </Card>
  )
}
