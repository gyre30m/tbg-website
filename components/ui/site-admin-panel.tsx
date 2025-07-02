'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import { Firm } from '@/lib/types'
import { Settings } from 'lucide-react'

interface CreateFirmFormData {
  name: string
  domain: string
  adminEmail: string
}

export function SiteAdminPanel() {
  const router = useRouter()
  const [firms, setFirms] = useState<Firm[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<CreateFirmFormData>({
    name: '',
    domain: '',
    adminEmail: ''
  })

  // Client-side function to create a firm
  const createFirmClient = async (name: string, domain: string): Promise<Firm | null> => {
    try {
      console.log('createFirmClient called with:', { name, domain })
      
      const { data: firm, error: firmError } = await supabase
        .from('firms')
        .insert([{
          name,
          domain: domain.toLowerCase(),
        }])
        .select()
        .single()

      console.log('Supabase insert result:', { firm, firmError })

      if (firmError) {
        console.error('Error creating firm:', firmError)
        throw new Error(`Database error: ${firmError.message}`)
      }

      console.log('Firm created successfully:', firm)
      return firm
    } catch (error) {
      console.error('Exception in createFirmClient:', error)
      throw error
    }
  }

  // Client-side function to invite user to firm
  const inviteUserToFirmClient = async (
    email: string, 
    firmId: string, 
    role: 'firm_admin' | 'user' = 'user'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if domain matches firm domain
      const emailDomain = email.split('@')[1]
      const { data: firm } = await supabase
        .from('firms')
        .select('domain, name')
        .eq('id', firmId)
        .single()

      if (!firm || firm.domain !== emailDomain) {
        return { success: false, error: 'Email domain does not match firm domain' }
      }

      // First, create the invitation record
      const { error: inviteError } = await supabase
        .from('user_invitations')
        .insert([{
          email: email.toLowerCase(),
          firm_id: firmId,
          role,
          status: 'pending',
          invited_at: new Date().toISOString()
        }])

      if (inviteError) {
        console.error('Error creating invitation:', inviteError)
        return { success: false, error: inviteError.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Exception in inviteUserToFirmClient:', error)
      return { success: false, error: 'Failed to invite user' }
    }
  }

  useEffect(() => {
    fetchFirms()
  }, [])

  const fetchFirms = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('firms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching firms:', error)
        return
      }

      setFirms(data || [])
    } catch (error) {
      console.error('Error in fetchFirms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    setMessage('')

    // Validate email domain matches firm domain
    const emailDomain = formData.adminEmail.split('@')[1]
    if (emailDomain !== formData.domain) {
      setError('Admin email domain must match firm domain')
      setCreating(false)
      return
    }

    try {
      console.log('Creating firm with data:', { name: formData.name, domain: formData.domain })
      
      // Create the firm
      const firm = await createFirmClient(formData.name, formData.domain)
      
      console.log('createFirm result:', firm)
      
      if (firm) {
        console.log('Firm created successfully, sending invitation...')
        // Send invitation to firm admin
        const inviteResult = await inviteUserToFirmClient(
          formData.adminEmail,
          firm.id,
          'firm_admin'
        )
        
        console.log('Invitation result:', inviteResult)
        
        if (inviteResult.success) {
          const signupUrl = `${window.location.origin}/auth/signup?firmId=${firm.id}&role=firm_admin&email=${encodeURIComponent(formData.adminEmail)}`
          setMessage(`Firm created successfully! Send this signup link to ${formData.adminEmail}: ${signupUrl}`)
          setFormData({ name: '', domain: '', adminEmail: '' })
          setShowCreateForm(false)
          await fetchFirms()
        } else {
          setError(inviteResult.error || 'Failed to send invitation')
        }
      }
    } catch (error) {
      console.error('Error creating firm:', error)
      setError(error instanceof Error ? error.message : 'Failed to create firm')
    } finally {
      setCreating(false)
    }
  }

  const handleManageFirm = (firm: Firm) => {
    // Navigate to firm management page
    const firmSlug = firm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    router.push(`/admin/firms/${firmSlug}`)
  }

  const clearMessages = () => {
    setError('')
    setMessage('')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading administration data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Administration</h1>
            <p className="text-gray-600 mt-2">Manage law firms and system settings</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
            Create New Firm
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Law Firm</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFirm} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firmName">Firm Name *</Label>
                    <Input
                      id="firmName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Smith & Associates"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Email Domain *</Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value.toLowerCase() })}
                      placeholder="e.g., smithlaw.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="adminEmail">Firm Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    placeholder="admin@smithlaw.com"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email domain must match the firm domain above
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Firm'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Law Firms ({firms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {firms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No law firms created yet.</p>
              ) : (
                <div className="space-y-4">
                  {firms.map((firm) => (
                    <div
                      key={firm.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{firm.name}</h3>
                        <p className="text-sm text-gray-600">Domain: {firm.domain}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(firm.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleManageFirm(firm)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        {(error || message) && (
          <div className="mt-6">
            {error && (
              <Alert className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearMessages}
              className="mt-2"
            >
              Clear Messages
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}