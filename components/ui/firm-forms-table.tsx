'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FormSubmission {
  id: string
  form_data: Record<string, unknown>
  submitted_by: string
  firm_id: string
  status: 'draft' | 'submitted'
  created_at: string
  updated_at: string
  user_profiles?: {
    first_name: string
    last_name: string
  }
}

export function FirmFormsTable() {
  const { user, userProfile } = useAuth()
  const [forms, setForms] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && userProfile?.firm_id) {
      fetchFirmForms()
    }
  }, [user, userProfile, fetchFirmForms])

  const fetchFirmForms = useCallback(async () => {
    if (!userProfile?.firm_id) return

    try {
      setLoading(true)
      
      // Fetch both submitted forms and drafts
      const [formsResult, draftsResult] = await Promise.all([
        supabase
          .from('personal_injury_forms')
          .select(`
            *,
            user_profiles!personal_injury_forms_submitted_by_fkey(
              first_name,
              last_name
            )
          `)
          .eq('firm_id', userProfile.firm_id)
          .order('updated_at', { ascending: false }),
        
        supabase
          .from('personal_injury_drafts')
          .select(`
            *,
            user_profiles!personal_injury_drafts_submitted_by_fkey(
              first_name,
              last_name
            )
          `)
          .eq('firm_id', userProfile.firm_id)
          .order('updated_at', { ascending: false })
      ])

      const allForms = [
        ...(formsResult.data || []),
        ...(draftsResult.data || [])
      ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

      setForms(allForms)
    } catch (error) {
      console.error('Error fetching firm forms:', error)
    } finally {
      setLoading(false)
    }
  }, [userProfile?.firm_id])

  const getFirstName = (form: FormSubmission): string => {
    const firstName = form.user_profiles?.first_name || 
           (form.form_data?.firstName as string) || 
           'Unknown'
    return firstName
  }

  const getLastName = (form: FormSubmission): string => {
    const lastName = form.user_profiles?.last_name || 
           (form.form_data?.lastName as string) || 
           'Unknown'
    return lastName
  }

  const getUserEmail = (form: FormSubmission): string => {
    return (form.form_data?.email as string) || 'Unknown'
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

  if (!user || !userProfile?.firm_id) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firm Forms ({forms.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading forms...</span>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No saved or submitted forms, yet.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Last</TableHead>
                  <TableHead>First</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Edited</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">
                      {getLastName(form)}
                    </TableCell>
                    <TableCell>
                      {getFirstName(form)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={form.status === 'submitted' ? 'default' : 'secondary'}
                      >
                        {form.status === 'submitted' ? 'Submitted' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(form.updated_at)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {getUserEmail(form)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}