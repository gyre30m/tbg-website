'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

export default function SignInPage() {
  const { user, userProfile, signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)

  // Helper function to get appropriate redirect URL based on user role
  const getRedirectUrl = useCallback(async () => {
    // Only site admins get the global view, firm admins and users get their firm's view
    if (!userProfile) {
      return '/forms/all' // fallback if no profile yet
    }
    
    if (userProfile.role === 'site_admin') {
      return '/admin/firms' // site admins go to firms management
    }

    // For firm admins and regular users, redirect to their firm's forms page
    if (userProfile.firm_id) {
      try {
        const supabase = createClient()
        
        // Fetch firm data
        const { data: firmData, error: firmError } = await supabase
          .from('firms')
          .select('*')
          .eq('id', userProfile.firm_id)
          .single()

        if (firmError) {
          console.error('Error fetching firm for redirect:', firmError)
          return '/forms/all' // fallback
        }
        
        // Use slug if available, otherwise use name
        const firmIdentifier = firmData.slug || encodeURIComponent(firmData.name)
        return `/firms/${firmIdentifier}/forms`
      } catch (error) {
        console.error('Error getting firm redirect URL:', error)
        return '/forms/all' // fallback
      }
    }

    // Fallback for users without firm
    return '/forms/all'
  }, [userProfile])

  // Redirect if already signed in
  useEffect(() => {
    if (user && userProfile) {
      getRedirectUrl().then(url => router.push(url))
    }
  }, [user, userProfile, router, getRedirectUrl])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningIn(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        toast.error(error.message || 'Failed to sign in')
      } else {
        toast.success('Successfully signed in!')
        // Note: redirect will be handled by useEffect when userProfile loads
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSigningIn(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <header className="px-4 lg:px-6 py-4 flex items-center border-b">
        <Link className="flex items-center justify-center hover:opacity-80 transition-opacity" href="/">
          <Image
            src="/web-logo.svg"
            alt="The Bradley Group - Forensic Economists and Economic Damages Experts Logo"
            width={300}
            height={75}
            className="h-12 w-auto dark:hidden"
            priority
          />
          <Image
            src="/web-logo-dark.svg"
            alt="The Bradley Group - Forensic Economists and Economic Damages Experts Logo"
            width={300}
            height={75}
            className="h-12 w-auto hidden dark:block"
            priority
          />
        </Link>
      </header>

      {/* Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Sign in to access online form submission and view your submitted forms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSigningIn} className="w-full">
                  {isSigningIn ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <Link href="/forms" className="text-sm text-gray-600 hover:text-gray-900">
                  ← Back to Forms
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}