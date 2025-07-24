'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FirmAdminDashboard } from '@/components/ui/firm-admin-dashboard'

export default function FirmAdminPage() {
  const { user, userProfile, loading, isFirmAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isFirmAdmin)) {
      router.push('/')
    }
  }, [user, userProfile, loading, isFirmAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user || !isFirmAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Access Denied - Firm Admin Only</div>
      </div>
    )
  }

  return <FirmAdminDashboard />
}