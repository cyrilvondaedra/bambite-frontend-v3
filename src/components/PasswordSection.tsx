'use client'

import { useUser } from './UserContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'
import { useState } from 'react'

type Step = 'initial' | 'otp' | 'success'

export default function PasswordChangeSection() {
  const { requestPasswordReset, changePassword } = useUser()
  const [step, setStep] = useState<Step>('initial')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRequestOtp = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')
    try {
      await requestPasswordReset()
      setStep('otp')
      setMessage('OTP code has been sent to your email. For demo purposes, check the console.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setError('')
    setMessage('')

    // Validation
    if (!otpCode.trim()) {
      setError('Please enter the OTP code')
      return
    }
    if (!newPassword.trim()) {
      setError('Please enter a new password')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      await changePassword(otpCode, newPassword)
      setStep('success')
      setMessage('Password changed successfully!')
      setTimeout(() => {
        setStep('initial')
        setOtpCode('')
        setNewPassword('')
        setConfirmPassword('')
        setMessage('')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Change Password</h2>
      </div>

      {step === 'initial' && (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Click the button below to request a password reset. You will receive an OTP code to
            verify your identity.
          </p>
          <Button
            onClick={handleRequestOtp}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? 'Sending...' : 'Request Password Reset'}
          </Button>
        </div>
      )}

      {step === 'otp' && (
        <div className="space-y-4">
          {message && (
            <div className="p-3 rounded-lg bg-blue-100/20 border border-blue-200 text-blue-700 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-100/20 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              OTP Code
            </label>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Check your email or console for the OTP code
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
            <Button
              onClick={() => {
                setStep('initial')
                setOtpCode('')
                setNewPassword('')
                setConfirmPassword('')
                setError('')
                setMessage('')
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-100/20 border border-green-200 flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
          <div>
            <p className="font-medium text-foreground">Password Changed Successfully!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your password has been updated. Redirecting...
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
