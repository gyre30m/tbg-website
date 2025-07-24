'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DebugProfilePage() {
  const { user, userProfile, loading } = useAuth()
  const [dbProfiles, setDbProfiles] = useState<Record<string, unknown>[]>([])
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (user) {
      checkDatabase()
    }
  }, [user])

  const checkDatabase = async () => {
    setChecking(true)
    try {
      // Check profiles in database
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')

      setDbProfiles(profiles || [])

      // Note: auth.admin.listUsers() requires service role, skipping
    } catch (error) {
      console.error('Error checking database:', error)
    } finally {
      setChecking(false)
    }
  }

  const fixProfile = async () => {
    if (!user) return

    setChecking(true)
    try {
      // Delete any existing incorrect profiles first
      await supabase
        .from('user_profiles')
        .delete()
        .neq('user_id', user.id)

      // Create/update the correct profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          role: 'site_admin',
          first_name: 'Bradley',
          last_name: 'Gibbs'
        })

      if (error) {
        console.error('Error fixing profile:', error)
      } else {
        await checkDatabase()
        window.location.reload()
      }
    } catch (error) {
      console.error('Error in fixProfile:', error)
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile Debug</h1>
      
      <div className="grid gap-6">
        {/* Current Auth State */}
        <Card>
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>User ID from auth context:</strong>
              <code className="block bg-gray-100 p-2 mt-1 rounded">{user?.id || 'null'}</code>
            </div>
            <div>
              <strong>Email:</strong> {user?.email || 'null'}
            </div>
            <div>
              <strong>Profile found:</strong> {userProfile ? 'Yes' : 'No'}
            </div>
            {userProfile && (
              <div>
                <strong>Profile user_id:</strong>
                <code className="block bg-gray-100 p-2 mt-1 rounded">{userProfile.user_id}</code>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>All Profiles in Database</CardTitle>
            <CardDescription>
              Showing all user_profiles entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dbProfiles.length > 0 ? (
              <div className="space-y-4">
                {dbProfiles.map((profile, index) => (
                  <div key={index} className="border p-4 rounded">
                    <div><strong>Profile ID:</strong> {String(profile.id)}</div>
                    <div><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{String(profile.user_id)}</code></div>
                    <div><strong>Role:</strong> {String(profile.role)}</div>
                    <div><strong>Name:</strong> {String(profile.first_name)} {String(profile.last_name)}</div>
                    <div><strong>Matches current user:</strong> {profile.user_id === user?.id ? '✅ Yes' : '❌ No'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>No profiles found in database</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkDatabase} disabled={checking}>
              {checking ? 'Checking...' : 'Refresh Database Check'}
            </Button>

            {user?.email === 'bradley@the-bradley-group.com' && (
              <Button onClick={fixProfile} disabled={checking} variant="destructive">
                {checking ? 'Fixing...' : 'Fix Profile (Delete Others & Create Correct One)'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* SQL to run manually */}
        <Card>
          <CardHeader>
            <CardTitle>Manual SQL Fix</CardTitle>
            <CardDescription>
              Run this in your Supabase dashboard if the button above doesn&apos;t work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
{`-- 1. Check current state
SELECT 
    au.id as auth_user_id,
    au.email,
    up.user_id as profile_user_id,
    up.role,
    up.first_name,
    up.last_name
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE au.email = 'bradley@the-bradley-group.com';

-- 2. Delete any incorrect profiles
DELETE FROM public.user_profiles 
WHERE user_id != (
    SELECT id FROM auth.users 
    WHERE email = 'bradley@the-bradley-group.com'
);

-- 3. Create/update correct profile
INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'bradley@the-bradley-group.com'),
    'site_admin',
    'Bradley',
    'Gibbs'
) ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;`}
            </pre>
            
            {user && (
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <strong>Your current user ID is:</strong>
                <code className="block bg-white p-2 mt-2 rounded">{user.id}</code>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}