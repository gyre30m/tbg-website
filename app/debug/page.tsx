'use client'

import { useAuth } from '@/lib/auth-context'

export default function DebugPage() {
  const { user, userProfile, userFirm, loading, isSiteAdmin, isFirmAdmin } = useAuth()

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Info</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">User Info:</h2>
          <pre className="text-sm mt-2">{JSON.stringify(user, null, 2)}</pre>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">User Profile:</h2>
          <pre className="text-sm mt-2">{JSON.stringify(userProfile, null, 2)}</pre>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">User Firm:</h2>
          <pre className="text-sm mt-2">{JSON.stringify(userFirm, null, 2)}</pre>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Roles:</h2>
          <p>Is Site Admin: {isSiteAdmin ? 'Yes' : 'No'}</p>
          <p>Is Firm Admin: {isFirmAdmin ? 'Yes' : 'No'}</p>
        </div>

        <div className="p-4 bg-blue-100 rounded">
          <h2 className="font-semibold">Next Steps:</h2>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Run the database migration script from /lib/db-init.sql</li>
            <li>Sign up with bradley@the-bradley-group.com</li>
            <li>Check if user profile was created automatically</li>
            <li>Try accessing /admin again</li>
          </ol>
        </div>
      </div>
    </div>
  )
}