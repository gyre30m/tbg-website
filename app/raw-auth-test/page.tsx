/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function RawAuthTestPage() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Get session directly from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        setError(`Session error: ${sessionError.message}`)
        return
      }
      
      setSession(session)
      
      if (session?.user?.id) {
        // Try to get profile directly from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
        
        if (profileError) {
          setError(`Profile error: ${profileError.message} (Code: ${profileError.code})`)
        } else {
          setProfile(profileData)
        }
      }
    } catch (err) {
      setError(`Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const createProfileDirectly = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: session.user.id,
          role: 'site_admin',
          first_name: 'Bradley',
          last_name: 'Gibbs'
        })
        .select()
        .single()
      
      if (error) {
        setError(`Insert error: ${error.message} (Code: ${error.code})`)
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError(`Insert unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuthUid = async () => {
    try {
      const { data, error } = await supabase.rpc('get_current_user_id')
      if (error) {
        setError(`auth.uid() test failed: ${error.message}`)
      } else {
        setError(`auth.uid() returns: ${data}`)
      }
    } catch (err) {
      setError(`auth.uid() test error: ${err}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Raw Auth Test</h1>
      <p className="text-gray-600 mb-6">
        This page bypasses the auth context and talks directly to Supabase
      </p>
      
      <div className="grid gap-6">
        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : session ? (
              <div className="space-y-2">
                <div><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{session.user?.id || 'N/A'}</code></div>
                <div><strong>Email:</strong> {session.user?.email || 'N/A'}</div>
                <div><strong>Email Confirmed:</strong> {session.user?.email_confirmed_at ? 'Yes' : 'No'}</div>
                <div><strong>Role (from JWT):</strong> {session.user?.role || 'authenticated'}</div>
              </div>
            ) : (
              <div>No session found</div>
            )}
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-2">
                <div><strong>Profile ID:</strong> {String(profile.id)}</div>
                <div><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{String(profile.user_id)}</code></div>
                <div><strong>Role:</strong> {String(profile.role)}</div>
                <div><strong>Name:</strong> {String(profile.first_name)} {String(profile.last_name)}</div>
              </div>
            ) : (
              <div>No profile found</div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card>
            <CardHeader>
              <CardTitle>Error/Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-red-50 p-4 rounded overflow-auto">{error}</pre>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkAuth} disabled={loading}>
              Refresh Auth Check
            </Button>
            
            {session?.user?.email === 'bradley@the-bradley-group.com' && !profile && (
              <Button onClick={createProfileDirectly} disabled={loading} variant="destructive">
                Create Profile Directly
              </Button>
            )}
            
            <Button onClick={testAuthUid} disabled={loading} variant="outline">
              Test auth.uid() Function
            </Button>
          </CardContent>
        </Card>

        {/* SQL to create test function */}
        <Card>
          <CardHeader>
            <CardTitle>SQL Helper Function</CardTitle>
            <CardDescription>
              Run this SQL first to enable the auth.uid() test:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
{`-- Create helper function to test auth.uid()
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_current_user_id() TO authenticated;`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}