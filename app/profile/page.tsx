'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/ui/header'
import { User, Mail, Building, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { user, userProfile, userFirm, loading, refreshProfile, isSiteAdmin, isFirmAdmin } = useAuth()
  const router = useRouter()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    if (userProfile) {
      setFirstName(userProfile.first_name || '')
      setLastName(userProfile.last_name || '')
    }
  }, [user, userProfile, loading, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !userProfile) return

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
        .eq('user_id', user.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        setMessage('Profile updated successfully!')
        await refreshProfile()
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Profile update error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!user) {
    return null
  }

  const getRoleBadge = () => {
    if (!userProfile) return <Badge variant="outline">No Profile</Badge>
    if (isSiteAdmin) return <Badge variant="default">Site Admin</Badge>
    if (isFirmAdmin) return <Badge variant="secondary">Firm Admin</Badge>
    return <Badge variant="outline">User</Badge>
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Information Card */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProfile ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

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

                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                ) : (
                  <Alert>
                    <AlertDescription>
                      No profile found. Please contact your administrator to set up your profile.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Summary Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-500">Email Address</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-500">Role</Label>
                  <div className="mt-1">
                    {getRoleBadge()}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-500">Account Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-gray-500">Last Sign In</Label>
                  <p className="text-sm text-gray-600">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Firm Information Card */}
            {userFirm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Firm Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">Firm Name</Label>
                    <p className="font-medium">{userFirm.name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-500">Domain</Label>
                    <p className="text-sm text-gray-600 font-mono">{userFirm.domain}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Member Since</Label>
                    <p className="text-sm text-gray-600">
                      {userProfile?.created_at 
                        ? new Date(userProfile.created_at).toLocaleDateString()
                        : 'Unknown'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-500">Email Verified</Label>
                  <div className="mt-1">
                    <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
                      {user.email_confirmed_at ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>

                {!user.email_confirmed_at && (
                  <Alert>
                    <AlertDescription>
                      Please check your email and click the verification link to verify your account.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}