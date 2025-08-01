'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  // const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    // Handle auth tokens from password reset email
    const handleAuthTokens = async () => {
      const urlHash = window.location.hash
      
      if (urlHash) {
        const params = new URLSearchParams(urlHash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')
        
        console.log('Password reset page - Full URL:', window.location.href)
        console.log('Password reset page - Hash:', urlHash)
        console.log('Password reset page - URL params:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken })
        console.log('Password reset page - All params:', Object.fromEntries(params.entries()))
        
        if (type === 'invite') {
          // This is an invitation, redirect to signup/complete profile
          if (accessToken && refreshToken) {
            try {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              })
              router.push('/auth/complete-profile')
            } catch (error) {
              console.error('Failed to set session for invitation:', error)
              router.push('/auth/signup')
            }
          } else {
            router.push('/auth/signup')
          }
          return
        }
        
        if (type === 'recovery' && accessToken && refreshToken) {
          // This is a password reset - set the session for password update
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              console.error('Failed to set session for password reset:', error)
              setError('Invalid or expired reset link. Please request a new password reset.')
            } else {
              console.log('Session set successfully for password reset')
              // Session is now active, user can update password
            }
            setInitializing(false)
          } catch (error) {
            console.error('Error setting session:', error)
            setError('Failed to authenticate reset link. Please try again.')
            setInitializing(false)
          }
        } else if (type === 'recovery') {
          setError('Invalid reset link. Please request a new password reset.')
          setInitializing(false)
        }
      } else {
        // No hash parameters - user navigated directly to reset page
        setError('No reset token found. Please use the link from your password reset email.')
        setInitializing(false)
      }
    }
    
    handleAuthTokens()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!password || !confirmPassword) {
      setError('Both password fields are required')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        throw updateError
      }

      setSuccess('Password updated successfully! You can now sign in.')
      
      // Redirect to sign in after a delay
      setTimeout(() => {
        router.push('/signin?message=Password updated successfully')
      }, 2000)

    } catch (error) {
      console.error('Password reset error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/signin')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}