'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { FirmAdminDashboard } from '@/components/ui/firm-admin-dashboard'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface FirmAdminPageProps {
  params: Promise<{
    'firm-name': string
  }>
}

interface Firm {
  id: string
  name: string
  domain: string
  firm_admin_id: string
  slug: string
}

export default function FirmAdminPage({ params }: FirmAdminPageProps) {
  const { user, userProfile, loading, isSiteAdmin, isFirmAdmin } = useAuth()
  const router = useRouter()
  const [firm, setFirm] = useState<Firm | null>(null)
  const [firmLoading, setFirmLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [firmName, setFirmName] = useState<string>('')

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Await params and extract firm name
        const resolvedParams = await params
        const decodedFirmName = decodeURIComponent(resolvedParams['firm-name'])
        setFirmName(decodedFirmName)
      } catch (error) {
        console.error('Error resolving params:', error)
        setFirmLoading(false)
      }
    }

    initializePage()
  }, [params])

  useEffect(() => {
    const fetchFirm = async () => {
      if (!firmName) return

      try {
        console.log('Searching for firm with slug:', firmName)
        
        // Fetch firm by slug instead of name
        const { data: firmData, error } = await supabase
          .from('firms')
          .select('*')
          .eq('slug', firmName)
          .single()

        if (error) {
          console.error('Error fetching firm:', error, 'Searched for:', firmName)
          setFirmLoading(false)
          return
        }

        setFirm(firmData)

        // Check access permissions
        if (isSiteAdmin) {
          // Site admins can access any firm
          setHasAccess(true)
        } else if (isFirmAdmin && userProfile?.firm_id === firmData.id) {
          // Firm admins can only access their own firm
          setHasAccess(true)
        } else {
          setHasAccess(false)
        }
      } catch (error) {
        console.error('Error fetching firm:', error)
      } finally {
        setFirmLoading(false)
      }
    }

    if (!loading && user && userProfile && firmName) {
      fetchFirm()
    }
  }, [firmName, user, userProfile, loading, isSiteAdmin, isFirmAdmin])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
    
    // If user is a firm admin but trying to access a different firm, redirect to their own firm
    if (!loading && user && userProfile && isFirmAdmin && !isSiteAdmin && userProfile.firm_id && firmName) {
      // Get user's firm slug and redirect if different
      const fetchUserFirm = async () => {
        const { data: userFirmData } = await supabase
          .from('firms')
          .select('slug')
          .eq('id', userProfile.firm_id)
          .single()
        
        if (userFirmData && userFirmData.slug !== firmName) {
          router.push(`/firms/${userFirmData.slug}/admin`)
        }
      }
      fetchUserFirm()
    }
  }, [user, loading, router, userProfile, isFirmAdmin, isSiteAdmin, firmName])

  if (loading || firmLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Please log in to access this page</div>
      </div>
    )
  }

  if (!isFirmAdmin && !isSiteAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          Access Denied - Firm Admin Only
        </div>
      </div>
    )
  }

  if (!firm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Firm not found</div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          Access Denied - You do not have permission to view this firm
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {isSiteAdmin && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="container mx-auto">
            <p className="text-blue-800 text-sm">
              Site Admin View - Managing {firm.name}
            </p>
          </div>
        </div>
      )}
      <FirmAdminDashboard targetFirm={firm} />
    </div>
  )
}