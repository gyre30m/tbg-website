'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DebugPage() {
  const { user, userProfile, userFirm, loading, isSiteAdmin, isFirmAdmin, refreshProfile } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const handleRefreshProfile = async () => {
    setRefreshing(true)
    try {
      await refreshProfile()
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error refreshing profile:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={condition ? 'default' : 'secondary'}>
        {condition ? trueText : falseText}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading authentication state...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Authentication Debug</h1>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-sm text-gray-500">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <Button 
            onClick={handleRefreshProfile} 
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Profile'}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Authentication Status
              {getStatusBadge(!!user, 'Authenticated', 'Not Authenticated')}
            </CardTitle>
            <CardDescription>
              Current authentication and session state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>User ID:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {user?.id || 'None'}
              </code>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-mono text-sm">{user?.email || 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span>Email Verified:</span>
              {getStatusBadge(!!user?.email_confirmed_at, 'Verified', 'Unverified')}
            </div>
            <div className="flex justify-between">
              <span>Last Sign In:</span>
              <span className="text-sm">
                {user?.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : 'Never'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Profile Status
              {getStatusBadge(!!userProfile, 'Profile Exists', 'No Profile')}
            </CardTitle>
            <CardDescription>
              User profile and role information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {userProfile ? (
              <>
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{userProfile.first_name} {userProfile.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <Badge variant={userProfile.role === 'site_admin' ? 'default' : 'secondary'}>
                    {userProfile.role.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Firm ID:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {userProfile.firm_id || 'None'}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-sm">
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </>
            ) : (
              <Alert>
                <AlertDescription>
                  No profile found. This may be normal for new users or indicate a setup issue.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Current user permissions and access levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Site Admin:</span>
              {getStatusBadge(isSiteAdmin, 'Yes', 'No')}
            </div>
            <div className="flex justify-between">
              <span>Firm Admin:</span>
              {getStatusBadge(isFirmAdmin, 'Yes', 'No')}
            </div>
            <div className="flex justify-between">
              <span>Can Access Admin:</span>
              {getStatusBadge(isSiteAdmin, 'Yes', 'No')}
            </div>
            <div className="flex justify-between">
              <span>Can Manage Firm:</span>
              {getStatusBadge(isFirmAdmin || isSiteAdmin, 'Yes', 'No')}
            </div>
          </CardContent>
        </Card>

        {/* Firm Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Firm Information
              {getStatusBadge(!!userFirm, 'Has Firm', 'No Firm')}
            </CardTitle>
            <CardDescription>
              Associated firm details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {userFirm ? (
              <>
                <div className="flex justify-between">
                  <span>Firm Name:</span>
                  <span className="font-medium">{userFirm.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Domain:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {userFirm.domain}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-sm">
                    {new Date(userFirm.created_at).toLocaleDateString()}
                  </span>
                </div>
              </>
            ) : (
              <Alert>
                <AlertDescription>
                  No firm association found. Users must be assigned to a firm to access forms.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Steps to properly configure the authentication system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Run the database setup script from <code className="bg-gray-100 px-2 py-1 rounded">/database-setup.sql</code></li>
            <li>Create an account with <code className="bg-gray-100 px-2 py-1 rounded">bradley@the-bradley-group.com</code> to become site admin</li>
            <li>Verify that the user profile was created automatically with site admin role</li>
            <li>Access <code className="bg-gray-100 px-2 py-1 rounded">/admin/site</code> to manage firms and users</li>
            <li>Create firms and invite users as needed</li>
          </ol>
        </CardContent>
      </Card>

      {/* Raw Data (Collapsible) */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
          <CardDescription>
            Complete authentication objects for debugging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-semibold text-sm hover:text-blue-600">
              User Object
            </summary>
            <pre className="text-xs mt-2 bg-gray-50 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
          
          <details className="group">
            <summary className="cursor-pointer font-semibold text-sm hover:text-blue-600">
              User Profile Object
            </summary>
            <pre className="text-xs mt-2 bg-gray-50 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          </details>
          
          <details className="group">
            <summary className="cursor-pointer font-semibold text-sm hover:text-blue-600">
              User Firm Object
            </summary>
            <pre className="text-xs mt-2 bg-gray-50 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(userFirm, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}