'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { Firm } from '@/lib/types'
import { createFirm, inviteUserToFirm } from '@/lib/auth-utils'
import { Building, Users, Mail, Plus, Settings } from 'lucide-react'

interface CreateFirmFormData {
  name: string
  domain: string
  adminEmail: string
}

interface UserProfile {
  id: string
  user_id: string
  role: string
  first_name: string | null
  last_name: string | null
  firm_id: string | null
  created_at: string
  email?: string
}

interface Invitation {
  id: string
  email: string
  role: string
  firm_id: string
  invited_at: string
  accepted_at: string | null
  firms?: {
    name: string
  }
}

export function SiteAdminPanel() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<CreateFirmFormData>({
    name: '',
    domain: '',
    adminEmail: ''
  })
  const [inviteData, setInviteData] = useState({
    email: '',
    firmId: '',
    role: 'firm_admin' as 'firm_admin' | 'user'
  })

  useEffect(() => {
    fetchAll()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([
      fetchFirms(),
      fetchUsers(),
      fetchInvitations()
    ])
    setLoading(false)
  }

  const fetchFirms = async () => {
    try {
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
    }
  }

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        return
      }

      setUsers(profiles || [])
    } catch (error) {
      console.error('Error in fetchUsers:', error)
    }
  }

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select(`
          *,
          firms (
            name
          )
        `)
        .order('invited_at', { ascending: false })

      if (error) {
        console.error('Error fetching invitations:', error)
        return
      }

      setInvitations(data || [])
    } catch (error) {
      console.error('Error in fetchInvitations:', error)
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
      const firm = await createFirm(formData.name, formData.domain)
      
      console.log('createFirm result:', firm)
      
      if (firm) {
        console.log('Firm created successfully, sending invitation...')
        // Send invitation to firm admin
        const inviteResult = await inviteUserToFirm(
          formData.adminEmail,
          firm.id,
          'firm_admin'
        )
        
        console.log('Invitation result:', inviteResult)
        
        if (inviteResult.success) {
          setMessage(`Firm created successfully! Invitation sent to ${formData.adminEmail}`)
          setFormData({ name: '', domain: '', adminEmail: '' })
          setShowCreateForm(false)
          await fetchAll()
        } else {
          setError(`Firm created but invitation failed: ${inviteResult.error}`)
          await fetchAll() // Still refresh to show the created firm
        }
      } else {
        setError('Failed to create firm. Check console for details.')
      }
    } catch (error) {
      console.error('Error creating firm:', error)
      setError(`Failed to create firm: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setCreating(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    setError('')
    setMessage('')

    try {
      const result = await inviteUserToFirm(
        inviteData.email,
        inviteData.firmId,
        inviteData.role
      )
      
      if (result.success) {
        setMessage(`Invitation sent to ${inviteData.email}`)
        setInviteData({ email: '', firmId: '', role: 'firm_admin' })
        await fetchInvitations()
      } else {
        setError(result.error || 'Failed to send invitation')
      }
    } catch (error) {
      console.error('Error inviting user:', error)
      setError('Failed to send invitation. Please try again.')
    } finally {
      setInviting(false)
    }
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

        <Tabs defaultValue="firms" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="firms" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Firms ({firms.length})</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users ({users.length})</span>
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Invitations ({invitations.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="firms" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Law Firms</CardTitle>
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
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>System Users</CardTitle>
                  <Button 
                    onClick={() => setInviteData({...inviteData, email: 'show-form', firmId: '', role: 'firm_admin'})}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No users found.</p>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">
                            {user.first_name} {user.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            User ID: {user.user_id.slice(0, 8)}...
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={user.role === 'site_admin' ? 'default' : 'secondary'}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                            {user.firm_id && (
                              <span className="text-sm text-gray-500">
                                Firm: {firms.find(f => f.id === user.firm_id)?.name || 'Unknown'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invite User Form */}
            {inviteData.email === 'show-form' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Invite New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="inviteEmail">Email Address *</Label>
                        <Input
                          id="inviteEmail"
                          type="email"
                          value={inviteData.email === 'show-form' ? '' : inviteData.email}
                          onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                          placeholder="user@example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="inviteFirm">Firm *</Label>
                        <select
                          id="inviteFirm"
                          value={inviteData.firmId}
                          onChange={(e) => setInviteData({ ...inviteData, firmId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select a firm</option>
                          {firms.map((firm) => (
                            <option key={firm.id} value={firm.id}>
                              {firm.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="inviteRole">Role *</Label>
                        <select
                          id="inviteRole"
                          value={inviteData.role}
                          onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as 'firm_admin' | 'user' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="firm_admin">Firm Admin</option>
                          <option value="user">User</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={inviting}>
                        {inviting ? 'Sending...' : 'Send Invitation'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setInviteData({ email: '', firmId: '', role: 'firm_admin' })}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="invitations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                {invitations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending invitations.</p>
                ) : (
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">{invitation.email}</h3>
                          <p className="text-sm text-gray-600">
                            Firm: {invitation.firms?.name || 'Unknown'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">
                              {invitation.role.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Invited: {new Date(invitation.invited_at).toLocaleDateString()}
                            </span>
                            {invitation.accepted_at && (
                              <Badge variant="default">Accepted</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {!invitation.accepted_at && (
                            <Button variant="outline" size="sm">
                              Resend
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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