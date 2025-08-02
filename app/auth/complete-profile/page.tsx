'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hasPrefilledData, setHasPrefilledData] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Handle invitation token from URL
    const handleInvitationToken = async () => {
      const urlHash = window.location.hash
      
      if (urlHash) {
        const params = new URLSearchParams(urlHash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')
        
        if (type === 'invite' && accessToken && refreshToken) {
          try {
            // Set the session from the invitation link
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              console.error('Failed to set session from invitation:', error)
              setError('Invalid invitation link. Please contact your administrator.')
              return
            }
            
            console.log('Session set successfully from invitation')
            // The auth context will update with the new user
          } catch (error) {
            console.error('Error processing invitation:', error)
            setError('Failed to process invitation. Please try again.')
          }
        }
      }
    }
    
    handleInvitationToken()
  }, [])

  // Separate effect for pre-filling form data (only once when user becomes available)
  useEffect(() => {
    if (user?.user_metadata && !hasPrefilledData) {
      setFormData(prev => ({
        ...prev,
        firstName: user.user_metadata.first_name || '',
        lastName: user.user_metadata.last_name || ''
      }))
      setHasPrefilledData(true)
    }
  }, [user, hasPrefilledData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required')
      setLoading(false)
      return
    }

    if (!formData.password) {
      setError('Password is required')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Update user metadata
      const updateData: {
        data: { first_name: string; last_name: string };
        password?: string;
      } = {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      const { error: updateError } = await supabase.auth.updateUser(updateData)

      if (updateError) {
        throw updateError
      }

      // Update or create user profile
      if (user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            firm_id: user.user_metadata?.firm_id || null,
            role: user.user_metadata?.role || 'user'
          })

        if (profileError) {
          console.error('Profile update error:', profileError)
          // Don't fail the whole process for profile errors, but log them
          setError(`Warning: Profile update failed: ${profileError.message}`)
        } else {
          console.log('Profile created/updated successfully')
        }

        // Mark invitation as accepted if applicable
        if (user.user_metadata?.firm_id && user.email) {
          console.log('Marking invitation as accepted for:', user.email, 'firm:', user.user_metadata.firm_id)
          
          try {
            const response = await fetch('/api/accept-invitation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email.toLowerCase(),
                firmId: user.user_metadata.firm_id
              })
            });

            const result = await response.json();

            if (response.ok) {
              console.log('Successfully marked invitation as accepted:', result)
            } else {
              console.error('Error accepting invitation:', result.error)
            }
          } catch (invitationError) {
            console.error('Exception accepting invitation:', invitationError)
          }
        }
      }

      setSuccess('Profile completed successfully!')
      
      // Redirect to appropriate page based on role
      setTimeout(async () => {
        if (user?.user_metadata?.firm_id) {
          // Get firm details to construct proper redirect
          try {
            const { data: firmData } = await supabase
              .from('firms')
              .select('slug, name')
              .eq('id', user.user_metadata.firm_id)
              .single()

            if (firmData) {
              // Use slug if available, otherwise use name
              const firmIdentifier = firmData.slug || encodeURIComponent(firmData.name)
              router.push(`/firms/${firmIdentifier}/forms`)
            } else {
              // Fallback to generic forms page
              router.push('/forms')
            }
          } catch (error) {
            console.error('Error fetching firm for redirect:', error)
            // Fallback to generic forms page
            router.push('/forms')
          }
        } else {
          // No firm assigned - go to profile
          router.push('/profile')
        }
      }, 2000)

    } catch (error) {
      console.error('Profile completion error:', error)
      setError(error instanceof Error ? error.message : 'Failed to complete profile')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-center">
              Please provide some additional information to complete your account setup
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Set Your Password
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Please create a password for your account.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}