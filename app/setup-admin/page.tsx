'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export default function SetupAdminPage() {
  const { user, userProfile, refreshProfile } = useAuth()
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const createAdminProfile = async () => {
    if (!user) return

    setCreating(true)
    setError('')
    setMessage('')

    try {
      // Try to create the profile using the service role
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: user.id,
          role: 'site_admin',
          first_name: 'Bradley',
          last_name: 'Gibbs'
        }])
        .select()

      if (insertError) {
        if (insertError.code === '23505') {
          setError('Profile already exists for this user')
        } else {
          setError(`Error creating profile: ${insertError.message}`)
        }
      } else {
        setMessage('Admin profile created successfully!')
        await refreshProfile()
        setTimeout(() => {
          window.location.href = '/profile'
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Profile creation error:', err)
    } finally {
      setCreating(false)
    }
  }

  const triggerAutoCreate = async () => {
    if (!user) return

    setCreating(true)
    setError('')
    setMessage('')

    try {
      // Call the trigger function manually
      const { error: triggerError } = await supabase.rpc('handle_new_user_manual', {
        user_id: user.id,
        user_email: user.email
      })

      if (triggerError) {
        setError(`Trigger error: ${triggerError.message}`)
      } else {
        setMessage('Trigger executed successfully!')
        await refreshProfile()
      }
    } catch {
      setError('Trigger function not available, trying direct insert...')
      // Fallback to direct insert
      await createAdminProfile()
    } finally {
      setCreating(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Setup Admin Profile</CardTitle>
            <CardDescription>You must be logged in to use this tool</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Setup Admin Profile</CardTitle>
          <CardDescription>
            Create the initial site admin profile for bradley@the-bradley-group.com
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>User Email:</span>
              <Badge variant="outline">{user.email}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span>User ID:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">{user.id}</code>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Profile Status:</span>
              {userProfile ? (
                <Badge variant="default">Profile Exists</Badge>
              ) : (
                <Badge variant="destructive">No Profile</Badge>
              )}
            </div>

            {userProfile && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Role:</span>
                  <Badge variant="default">{userProfile.role}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Name:</span>
                  <span>{userProfile.first_name} {userProfile.last_name}</span>
                </div>
              </div>
            )}
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

          {!userProfile && user.email === 'bradley@the-bradley-group.com' && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  No profile found for the site admin account. Click below to create one.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Button 
                  onClick={createAdminProfile} 
                  disabled={creating}
                  className="w-full"
                >
                  {creating ? 'Creating Profile...' : 'Create Admin Profile'}
                </Button>
                
                <Button 
                  onClick={triggerAutoCreate} 
                  disabled={creating}
                  variant="outline"
                  className="w-full"
                >
                  {creating ? 'Running Trigger...' : 'Try Auto-Create Trigger'}
                </Button>
              </div>
            </div>
          )}

          {!userProfile && user.email !== 'bradley@the-bradley-group.com' && (
            <Alert>
              <AlertDescription>
                This tool is only for creating the initial admin profile for bradley@the-bradley-group.com
              </AlertDescription>
            </Alert>
          )}

          {userProfile && (
            <Alert>
              <AlertDescription>
                Profile already exists! You can now access the <a href="/profile" className="underline">profile page</a> to edit your information.
              </AlertDescription>
            </Alert>
          )}

          {/* SQL Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manual SQL Option</CardTitle>
              <CardDescription>
                If the buttons above don&apos;t work, run this SQL in your Supabase dashboard:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
{`INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
VALUES (
    '${user.id}',
    'site_admin',
    'Bradley',
    'Gibbs'
) ON CONFLICT (user_id) DO NOTHING;`}
              </pre>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}