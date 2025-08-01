'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/browser-client'
import { ArrowLeft, Eye, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface FormSubmission {
  id: string
  first_name: string | null
  last_name: string | null
  matter_no: string | null
  form_type: 'personal_injury' | 'wrongful_death' | 'wrongful_termination'
  status: string
  created_at: string
  updated_at: string
  submitted_by: string
  firm_id: string | null
  version?: number
}

const FORM_TYPE_LABELS = {
  personal_injury: 'Personal Injury',
  wrongful_death: 'Wrongful Death',
  wrongful_termination: 'Wrongful Termination'
}

export default function AllFormsPage() {
  const { user, loading, userProfile } = useAuth()
  const router = useRouter()
  const [forms, setForms] = useState<FormSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    if (user && userProfile) {
      fetchAllForms()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile])

  const fetchAllForms = async () => {
    if (!userProfile) return

    try {
      setIsLoading(true)
      const supabase = createClient()

      // Determine access level
      const isSiteAdmin = userProfile.role === 'site_admin'
      const firmId = userProfile.firm_id

      // Fetch from all three form types
      const fetchPromises = []

      // Personal Injury Forms - simplified query without foreign key reference
      let piQuery = supabase
        .from('personal_injury_forms')
        .select(`
          id,
          first_name,
          last_name,
          matter_no,
          status,
          created_at,
          updated_at,
          submitted_by,
          firm_id,
          version
        `)
        .eq('status', 'submitted')

      if (!isSiteAdmin && firmId) {
        piQuery = piQuery.eq('firm_id', firmId)
      }

      fetchPromises.push(
        piQuery.order('updated_at', { ascending: false }).then(({ data, error }) => {
          if (error) throw error
          return (data || []).map(form => ({ ...form, form_type: 'personal_injury' as const }))
        })
      )

      // Wrongful Death Forms - simplified query
      let wdQuery = supabase
        .from('wrongful_death_forms')
        .select(`
          id,
          first_name,
          last_name,
          matter_no,
          status,
          created_at,
          updated_at,
          submitted_by,
          firm_id,
          version
        `)
        .eq('status', 'submitted')

      if (!isSiteAdmin && firmId) {
        wdQuery = wdQuery.eq('firm_id', firmId)
      }

      fetchPromises.push(
        Promise.resolve(wdQuery.order('updated_at', { ascending: false })).then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
          return (data || []).map(form => ({ ...form, form_type: 'wrongful_death' as const }))
        }).catch(() => []) // Return empty array if table doesn't exist
      )

      // Wrongful Termination Forms - simplified query
      let wtQuery = supabase
        .from('wrongful_termination_forms')
        .select(`
          id,
          first_name,
          last_name,
          matter_no,
          status,
          created_at,
          updated_at,
          submitted_by,
          firm_id,
          version
        `)
        .eq('status', 'submitted')

      if (!isSiteAdmin && firmId) {
        wtQuery = wtQuery.eq('firm_id', firmId)
      }

      fetchPromises.push(
        Promise.resolve(wtQuery.order('updated_at', { ascending: false })).then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
          return (data || []).map(form => ({ ...form, form_type: 'wrongful_termination' as const }))
        }).catch(() => []) // Return empty array if table doesn't exist
      )

      // Wait for all queries to complete
      const results = await Promise.all(fetchPromises)
      
      // Combine and sort all forms by updated_at
      const allForms = results.flat().sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )

      setForms(allForms)
      setTotalCount(allForms.length)

    } catch (error) {
      console.error('Error fetching forms:', error)
      toast.error('Failed to load forms')
    } finally {
      setIsLoading(false)
    }
  }

  // Check authentication and permissions
  if (loading || isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">Loading...</div>
        </div>
      </>
    )
  }

  if (!user) {
    router.push('/forms')
    return null
  }

  // Only allow site admins and firm members to access this page
  if (!userProfile?.firm_id && userProfile?.role !== 'site_admin') {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-600">Access denied. This page is only available to firm members and site administrators.</p>
          </div>
        </div>
      </>
    )
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPlaintiffName = (form: FormSubmission): string => {
    const lastName = form.last_name || 'Unknown'
    const firstName = form.first_name || 'Unknown'
    return `${lastName}, ${firstName}`
  }

  const getSubmittedBy = (form: FormSubmission): string => {
    // For now, just show the user ID since we simplified the query
    return form.submitted_by.substring(0, 8) + '...' || 'Unknown User'
  }

  const getFormUrl = (form: FormSubmission): string => {
    switch (form.form_type) {
      case 'personal_injury':
        return `/forms/personal-injury/${form.id}`
      case 'wrongful_death':
        return `/forms/wrongful-death/${form.id}`
      case 'wrongful_termination':
        return `/forms/wrongful-termination/${form.id}`
      default:
        return '#'
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">All Submitted Forms</h1>
              <p className="text-gray-600 mt-2">
                {userProfile?.role === 'site_admin' 
                  ? 'Viewing all submitted forms across all firms'
                  : 'Viewing submitted forms for your firm'
                }
              </p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/forms')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Forms
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {totalCount} Total Forms
            </Badge>
            {userProfile?.role === 'site_admin' && (
              <Badge variant="secondary">Site Admin View</Badge>
            )}
          </div>
        </div>

        {/* Forms Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Form Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No submitted forms found</p>
                <p className="text-gray-400 text-sm">
                  Forms will appear here once they are submitted
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plaintiff</TableHead>
                      <TableHead>Defendant</TableHead>
                      <TableHead>Matter</TableHead>
                      <TableHead>Type of Action</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forms.map((form) => (
                      <TableRow key={`${form.form_type}-${form.id}`}>
                        <TableCell className="font-medium">
                          {getPlaintiffName(form)}
                        </TableCell>
                        <TableCell className="text-gray-400 italic">
                          TBD
                        </TableCell>
                        <TableCell>
                          {form.matter_no || (
                            <span className="text-gray-400 italic">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {FORM_TYPE_LABELS[form.form_type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(form.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {getSubmittedBy(form)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            v{form.version || 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={getFormUrl(form)}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {forms.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(FORM_TYPE_LABELS).map(([type, label]) => {
              const count = forms.filter(f => f.form_type === type).length
              return (
                <Card key={type}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{label} Forms</p>
                        <p className="text-2xl font-bold">{count}</p>
                      </div>
                      <Badge variant="outline">{count > 0 ? 'Active' : 'None'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}