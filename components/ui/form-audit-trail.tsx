'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser-client'

interface FieldChange {
  field: string
  oldValue: string
  newValue: string
}

interface AuditEntry {
  id: string
  form_id: string
  form_type: string
  action_type: string
  submitted_by: string
  created_at: string
  metadata: {
    version?: number
    previous_version?: number
    field_changes?: FieldChange[]
    updated_by_role?: string
    timestamp?: string
  }
  user_profiles?: {
    first_name: string
    last_name: string
  }
}

interface FormAuditTrailProps {
  formId: string
  formType: string
}

export function FormAuditTrail({ formId, formType }: FormAuditTrailProps) {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAuditTrail()
  }, [formId, formType])

  const fetchAuditTrail = async () => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('form_audit_trail')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name
          )
        `)
        .eq('form_id', formId)
        .eq('form_type', formType)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching audit trail:', error)
        return
      }

      setAuditEntries(data || [])
    } catch (error) {
      console.error('Error fetching audit trail:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionLabel = (action: string): string => {
    switch (action) {
      case 'submitted':
        return 'Form Submitted'
      case 'updated':
        return 'Form Updated'
      case 'deleted':
        return 'Form Deleted'
      default:
        return action
    }
  }

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'submitted':
        return 'bg-green-100 text-green-800'
      case 'updated':
        return 'bg-blue-100 text-blue-800'
      case 'deleted':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Form History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading audit trail...</div>
        </CardContent>
      </Card>
    )
  }

  if (auditEntries.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Form History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditEntries.map((entry) => (
            <div key={entry.id} className="border-l-2 border-gray-200 pl-4 pb-4 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getActionColor(entry.action_type)}>
                    {getActionLabel(entry.action_type)}
                  </Badge>
                  {entry.metadata?.version && (
                    <Badge variant="outline">
                      Version {entry.metadata.version}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(entry.created_at)}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                <User className="w-3 h-3" />
                {entry.user_profiles?.first_name} {entry.user_profiles?.last_name}
                {entry.metadata?.updated_by_role && (
                  <span className="text-gray-400">({entry.metadata.updated_by_role})</span>
                )}
              </div>

              {entry.action_type === 'updated' && entry.metadata?.field_changes && entry.metadata.field_changes.length > 0 && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Changes:</p>
                  <ul className="space-y-1">
                    {entry.metadata.field_changes.map((change, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        <span className="font-medium">{change.field}</span> was changed from{' '}
                        <span className="text-red-600">{change.oldValue}</span> to{' '}
                        <span className="text-green-600">{change.newValue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}