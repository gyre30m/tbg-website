'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  const { signIn, resetPassword } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(email)
        if (error) {
          setError(error?.message || 'Failed to send reset email')
        } else {
          setMessage('Password reset email sent! Check your inbox for instructions.')
        }
      } else if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error?.message || 'Authentication failed')
        } else {
          onClose()
        }
      } else {
        // Signup is not allowed in the new system
        setError('Account creation is by invitation only. Please contact your firm administrator.')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Sign In' : 'Create Account')}
          </DialogTitle>
          <DialogDescription>
            {isForgotPassword
              ? 'Enter your email address to receive a password reset link'
              : (isLogin 
                ? 'Sign in to access the forms'
                : 'Create an account to get started'
              )
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter your password"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Loading...' : (isForgotPassword ? 'Send Reset Email' : (isLogin ? 'Sign In' : 'Create Account'))}
          </Button>
        </form>

        <div className="text-center space-y-2">
          {!isForgotPassword && isLogin && (
            <Button
              variant="link"
              onClick={() => {
                setIsForgotPassword(true)
                setError('')
                setMessage('')
              }}
              className="text-sm"
            >
              Forgot your password?
            </Button>
          )}
          
          <Button
            variant="link"
            onClick={() => {
              if (isForgotPassword) {
                setIsForgotPassword(false)
                setIsLogin(true)
              } else {
                setIsLogin(!isLogin)
              }
              setError('')
              setMessage('')
            }}
            className="text-sm"
          >
            {isForgotPassword
              ? 'Back to Sign In'
              : (isLogin 
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'
              )
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}