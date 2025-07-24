'use client'

import { useAuth } from '@/lib/auth-context'
import { SiteAdminPanel } from '@/components/ui/site-admin-panel'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminFirmsPage() {
  const { user, userProfile, loading, isSiteAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isSiteAdmin)) {
      router.push('/')
    }
  }, [user, userProfile, loading, isSiteAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user || !isSiteAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Access Denied</div>
      </div>
    )
  }

  return <SiteAdminPanel />
}