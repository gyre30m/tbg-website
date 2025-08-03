'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/browser-client'
import { Calendar, User, Plus, ChevronDown, Settings, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface FirmFormsPageProps {
  params: Promise<{
    'firm-name': string
  }>
}

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
  submitter_name?: string
}

interface Firm {
  id: string
  name: string
  domain: string
  firm_admin_id: string
  slug: string
}

interface UserProfile {
  id: string
  first_name: string
  last_name: string
}

const FORM_TYPE_LABELS = {
  personal_injury: 'Personal Injury',
  wrongful_death: 'Wrongful Death',
  wrongful_termination: 'Wrongful Termination'
}

export default function FirmFormsPage({ params }: FirmFormsPageProps) {
  const { user, loading, userProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [forms, setForms] = useState<FormSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [firm, setFirm] = useState<Firm | null>(null)
  const [firmLoading, setFirmLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [firmName, setFirmName] = useState<string>('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    const initializePage = async () => {
      try {
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
        console.log('Searching for firm with name/slug:', firmName)
        
        const supabase = createClient()
        
        // Try to fetch firm by slug first, then by name if slug doesn't exist
        let firmData = null
        const { data: slugData, error: slugError } = await supabase
          .from('firms')
          .select('*')
          .eq('slug', firmName)
          .single()

        // If slug search fails (column might not exist), try by name
        if (slugError) {
          const { data: nameData, error: nameError } = await supabase
            .from('firms')
            .select('*')
            .eq('name', firmName)
            .single()
          
          if (nameError) {
            console.error('Error fetching firm by name:', nameError)
            setFirmLoading(false)
            return
          }
          
          firmData = nameData
        } else {
          firmData = slugData
        }

        setFirm(firmData)

        // Check access permissions
        const isSiteAdmin = userProfile?.role === 'site_admin'
        
        if (isSiteAdmin) {
          setHasAccess(true)
        } else if (userProfile?.firm_id === firmData.id) {
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
  }, [firmName, user, userProfile, loading])

  const fetchFirmForms = useCallback(async () => {
    if (!firm) return

    try {
      setIsLoading(true)
      const supabase = createClient()

      // Fetch from all three form types for this specific firm
      const fetchPromises = []

      // Personal Injury Forms
      const piQuery = supabase
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
        .in('status', ['submitted', 'saved'])
        .eq('firm_id', firm.id)

      fetchPromises.push(
        piQuery.order('updated_at', { ascending: false }).then(async ({ data, error }) => {
          if (error) throw error
          
          console.log('Personal Injury - Forms data:', data)
          
          // Get user profiles for submitted_by fields
          const userIds = [...new Set((data || []).map(form => form.submitted_by).filter(Boolean))]
          let userProfiles: Record<string, UserProfile> = {}
          
          console.log('Personal Injury - Looking up user IDs:', userIds)
          
          if (userIds.length > 0) {
            const { data: profiles, error: profileError } = await supabase
              .from('user_profiles')
              .select('id, first_name, last_name')
              .in('id', userIds)
            
            console.log('Personal Injury - Profile query result:', profiles, 'error:', profileError)
            
            userProfiles = (profiles || []).reduce((acc, profile) => {
              acc[profile.id] = profile
              return acc
            }, {} as Record<string, UserProfile>)
            
            console.log('Personal Injury - User profiles map:', userProfiles)
          }
          
          const result = (data || []).map(form => {
            const submitterName = userProfiles[form.submitted_by] 
              ? `${userProfiles[form.submitted_by].last_name}, ${userProfiles[form.submitted_by].first_name}` 
              : 'Unknown User'
            
            console.log(`Form ${form.id} - submitted_by: ${form.submitted_by}, submitterName: ${submitterName}`)
            
            return { 
              ...form, 
              form_type: 'personal_injury' as const,
              submitter_name: submitterName
            }
          })
          
          console.log('Personal Injury - Final result:', result)
          return result
        })
      )

      // Wrongful Death Forms
      const wdQuery = supabase
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
        .in('status', ['submitted', 'saved'])
        .eq('firm_id', firm.id)

      fetchPromises.push(
        Promise.resolve(wdQuery.order('updated_at', { ascending: false })).then(async ({ data, error }) => {
          if (error && error.code !== 'PGRST116') throw error
          
          // Get user profiles for submitted_by fields
          const userIds = [...new Set((data || []).map(form => form.submitted_by).filter(Boolean))]
          let userProfiles: Record<string, UserProfile> = {}
          
          if (userIds.length > 0) {
            const { data: profiles } = await supabase
              .from('user_profiles')
              .select('id, first_name, last_name')
              .in('id', userIds)
            
            userProfiles = (profiles || []).reduce((acc, profile) => {
              acc[profile.id] = profile
              return acc
            }, {} as Record<string, UserProfile>)
          }
          
          return (data || []).map(form => ({ 
            ...form, 
            form_type: 'wrongful_death' as const,
            submitter_name: userProfiles[form.submitted_by] 
              ? `${userProfiles[form.submitted_by].last_name}, ${userProfiles[form.submitted_by].first_name}` 
              : 'Unknown User'
          }))
        }).catch(() => [])
      )

      // Wrongful Termination Forms
      const wtQuery = supabase
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
        .in('status', ['submitted', 'saved'])
        .eq('firm_id', firm.id)

      fetchPromises.push(
        Promise.resolve(wtQuery.order('updated_at', { ascending: false })).then(async ({ data, error }) => {
          if (error && error.code !== 'PGRST116') throw error
          
          // Get user profiles for submitted_by fields
          const userIds = [...new Set((data || []).map(form => form.submitted_by).filter(Boolean))]
          let userProfiles: Record<string, UserProfile> = {}
          
          if (userIds.length > 0) {
            const { data: profiles } = await supabase
              .from('user_profiles')
              .select('id, first_name, last_name')
              .in('id', userIds)
            
            userProfiles = (profiles || []).reduce((acc, profile) => {
              acc[profile.id] = profile
              return acc
            }, {} as Record<string, UserProfile>)
          }
          
          return (data || []).map(form => ({ 
            ...form, 
            form_type: 'wrongful_termination' as const,
            submitter_name: userProfiles[form.submitted_by] 
              ? `${userProfiles[form.submitted_by].last_name}, ${userProfiles[form.submitted_by].first_name}` 
              : 'Unknown User'
          }))
        }).catch(() => [])
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
      console.error('Error fetching firm forms:', error)
      toast.error('Failed to load firm forms')
    } finally {
      setIsLoading(false)
    }
  }, [firm])

  useEffect(() => {
    if (user && userProfile && firm && hasAccess) {
      fetchFirmForms()
    }
  }, [user, userProfile, firm, hasAccess, fetchFirmForms])

  // Check for form submission success
  useEffect(() => {
    const submitted = searchParams.get('submitted')
    if (submitted === 'true') {
      setShowSuccessMessage(true)
      // Remove the submitted parameter from URL without redirecting
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('submitted')
      window.history.replaceState({}, '', newUrl.toString())
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Check authentication and permissions
  if (loading || firmLoading || isLoading) {
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

  if (!hasAccess) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-600">Access denied. You don&apos;t have permission to view this firm&apos;s forms.</p>
          </div>
        </div>
      </>
    )
  }

  if (!firm) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-600">Firm not found.</p>
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
    return form.submitter_name || 'Unknown User'
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
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Form submitted successfully!</span>
            </div>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              Your form has been submitted and will appear in the table below.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{firm.name} - Forms</h1>
              <p className="text-gray-600 mt-2">
                Viewing all forms for {firm.name}
              </p>
            </div>
            {/* Show Firm Admin button only if user is the firm admin */}
            {user && firm && user.id === firm.firm_admin_id && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  const firmIdentifier = firm.slug || encodeURIComponent(firm.name)
                  router.push(`/firms/${firmIdentifier}/admin`)
                }}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Firm Admin
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {totalCount} Total Forms
            </Badge>
          </div>
        </div>

        {/* Summary Stats */}
        {forms.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* New Form Button */}
        <div className="mb-6 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Form
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/forms/personal-injury" className="flex items-center cursor-pointer">
                  Personal Injury Form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/forms/wrongful-death" className="flex items-center cursor-pointer">
                  Wrongful Death Form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/forms/wrongful-termination" className="flex items-center cursor-pointer">
                  Wrongful Termination Form
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Forms Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No forms found</p>
                <p className="text-gray-400 text-sm">
                  Forms will appear here once they are saved or submitted by {firm.name}&apos;s users
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
                      <TableHead>Status</TableHead>
                      <TableHead>Last Edited</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Version</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forms.map((form) => (
                      <TableRow 
                        key={`${form.form_type}-${form.id}`}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => router.push(getFormUrl(form))}
                      >
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
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={form.status === 'submitted' 
                              ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900 dark:text-green-300' 
                              : 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                            }
                          >
                            {form.status === 'submitted' ? 'Submitted' : 'Saved'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(form.status === 'submitted' ? form.created_at : form.updated_at)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {getSubmittedBy(form)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            v{form.version || 1}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </>
  )
}