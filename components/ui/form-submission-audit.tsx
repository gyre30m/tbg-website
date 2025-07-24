'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Clock, User, Building2, FileText, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface AuditEntry {
  id: string
  form_id: string
  form_type: string
  submitted_by: string
  firm_id: string
  submission_timestamp: string
  action_type: string
  metadata: Record<string, unknown>
  user_email: string
  user_name: string
  firm_name: string
}

export function FormSubmissionAudit() {
  const { userProfile, isSiteAdmin, isFirmAdmin } = useAuth()
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    formType: '',
    actionType: '',
    dateRange: '30', // days
    searchUser: ''
  })

  useEffect(() => {
    fetchAuditEntries()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const fetchAuditEntries = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build the query parameters
      const params: Record<string, unknown> = {}
      
      if (filters.formType) {
        params.p_form_type = filters.formType
      }
      
      if (!isSiteAdmin && userProfile?.firm_id) {
        params.p_firm_id = userProfile.firm_id
      }

      const { data, error: fetchError } = await supabase.rpc('get_form_submission_history', params)

      if (fetchError) {
        throw fetchError
      }

      let filteredData = data || []

      // Apply client-side filters
      if (filters.actionType) {
        filteredData = filteredData.filter((entry: AuditEntry) => entry.action_type === filters.actionType)
      }

      if (filters.searchUser) {
        const searchTerm = filters.searchUser.toLowerCase()
        filteredData = filteredData.filter((entry: AuditEntry) => 
          entry.user_name.toLowerCase().includes(searchTerm) ||
          entry.user_email.toLowerCase().includes(searchTerm)
        )
      }

      // Apply date range filter
      if (filters.dateRange) {
        const daysBack = parseInt(filters.dateRange)
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysBack)
        
        filteredData = filteredData.filter((entry: AuditEntry) => 
          new Date(entry.submission_timestamp) >= cutoffDate
        )
      }

      setAuditEntries(filteredData)
    } catch (err) {
      console.error('Error fetching audit entries:', err)
      setError('Failed to load submission history')
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'submitted': return 'bg-green-100 text-green-800'
      case 'resubmitted': return 'bg-blue-100 text-blue-800'
      case 'updated': return 'bg-yellow-100 text-yellow-800'
      case 'deleted': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFormTypeDisplay = (formType: string) => {
    switch (formType) {
      case 'personal_injury': return 'Personal Injury'
      case 'wrongful_death': return 'Wrongful Death'
      case 'wrongful_termination': return 'Wrongful Termination'
      default: return formType
    }
  }

  if (!isSiteAdmin && !isFirmAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <span>Access denied. This feature is only available to administrators.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Form Submission Audit Trail
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isSiteAdmin 
            ? 'View submission history for all forms across all firms' 
            : 'View submission history for your firm\'s forms'
          }
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="formType">Form Type</Label>
            <Select value={filters.formType} onValueChange={(value) => setFilters(prev => ({ ...prev, formType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All forms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All forms</SelectItem>
                <SelectItem value="personal_injury">Personal Injury</SelectItem>
                <SelectItem value="wrongful_death">Wrongful Death</SelectItem>
                <SelectItem value="wrongful_termination">Wrongful Termination</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="actionType">Action</Label>
            <Select value={filters.actionType} onValueChange={(value) => setFilters(prev => ({ ...prev, actionType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All actions</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="resubmitted">Resubmitted</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateRange">Date Range</Label>
            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="searchUser">Search User</Label>
            <Input
              id="searchUser"
              placeholder="Name or email"
              value={filters.searchUser}
              onChange={(e) => setFilters(prev => ({ ...prev, searchUser: e.target.value }))}
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">Loading submission history...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : auditEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No submission history found</div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Showing {auditEntries.length} submission{auditEntries.length !== 1 ? 's' : ''}
            </div>
            
            <div className="space-y-3">
              {auditEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getActionBadgeColor(entry.action_type)}>
                          {entry.action_type}
                        </Badge>
                        <Badge variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          {getFormTypeDisplay(entry.form_type)}
                        </Badge>
                        {isSiteAdmin && (
                          <Badge variant="outline">
                            <Building2 className="h-3 w-3 mr-1" />
                            {entry.firm_name}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{entry.user_name}</span>
                          <span className="text-gray-400">({entry.user_email})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimestamp(entry.submission_timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Form ID: {entry.form_id}
                        {entry.metadata && typeof entry.metadata === 'object' && 'form_fields_count' in entry.metadata && (
                          <span className="ml-4">Fields: {String(entry.metadata.form_fields_count)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}