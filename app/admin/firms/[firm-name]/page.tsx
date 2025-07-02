'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Firm } from '@/lib/types'
import { ArrowLeft, Settings, Mail, User, Clock } from 'lucide-react'

interface UserProfile {
  id: string
  user_id: string
  role: string
  first_name: string | null
  last_name: string | null
  firm_id: string | null
  created_at: string
  email?: string
  last_sign_in_at?: string
  status?: 'invited' | 'verified'
}

interface Invitation {
  id: string
  email: string
  status: string
  role: string
  invited_at: string
}

export default function FirmManagementPage() {
  const params = useParams()
  const router = useRouter()
  const firmSlug = params['firm-name'] as string

  const [firm, setFirm] = useState<Firm | null>(null)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [editingFirm, setEditingFirm] = useState({ name: '', domain: '' })

  useEffect(() => {
    if (firmSlug) {
      fetchFirmData()
    }
  }, [firmSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFirmData = async () => {
    try {
      setLoading(true)
      
      // First, get all firms and find the one matching the slug
      const { data: firms, error: firmsError } = await supabase
        .from('firms')
        .select('*')
      
      if (firmsError) {
        console.error('Error fetching firms:', firmsError)
        setError('Failed to load firm data')
        return
      }

      // Find firm by matching the slug
      const matchingFirm = firms?.find(f => {
        const firmSlugFromName = f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        return firmSlugFromName === firmSlug
      })

      if (!matchingFirm) {
        setError('Firm not found')
        return
      }

      setFirm(matchingFirm)
      setEditingFirm({ name: matchingFirm.name, domain: matchingFirm.domain })

      // Fetch users for this firm
      await Promise.all([
        fetchFirmUsers(matchingFirm.id),
        fetchFirmInvitations(matchingFirm.id)
      ])

    } catch (error) {
      console.error('Error in fetchFirmData:', error)
      setError('Failed to load firm data')
    } finally {
      setLoading(false)
    }
  }

  const fetchFirmUsers = async (firmId: string) => {
    try {
      // First get user profiles
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('firm_id', firmId)
        .order('last_name', { ascending: true })

      if (error) {
        console.error('Error fetching firm users:', error)
        return
      }

      // Then get auth users data
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('Error fetching auth users:', authError)
        // Set users without auth data
        setUsers((profiles || []).map(profile => ({
          ...profile,
          status: 'verified' as const
        })))
        return
      }

      // Combine the data
      const processedUsers = (profiles || []).map((profile: UserProfile) => {
        const authUser = authUsers?.users?.find(u => u.id === profile.user_id)
        return {
          ...profile,
          email: authUser?.email,
          last_sign_in_at: authUser?.last_sign_in_at,
          status: authUser?.email ? 'verified' as const : 'invited' as const
        }
      })

      setUsers(processedUsers)
    } catch (error) {
      console.error('Error in fetchFirmUsers:', error)
    }
  }

  const fetchFirmInvitations = async (firmId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('firm_id', firmId)
        .eq('status', 'pending')
        .order('invited_at', { ascending: false })

      if (error) {
        console.error('Error fetching invitations:', error)
        return
      }

      setInvitations(data || [])
    } catch (error) {
      console.error('Error in fetchFirmInvitations:', error)
    }
  }

  const handleUpdateFirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firm) return

    try {
      const { error } = await supabase
        .from('firms')
        .update({
          name: editingFirm.name,
          domain: editingFirm.domain.toLowerCase()
        })
        .eq('id', firm.id)

      if (error) {
        console.error('Error updating firm:', error)
        setError('Failed to update firm')
      } else {
        setMessage('Firm updated successfully')
        // Update local state
        setFirm({ ...firm, name: editingFirm.name, domain: editingFirm.domain })
      }
    } catch (error) {
      console.error('Error in handleUpdateFirm:', error)
      setError('Failed to update firm')
    }
  }

  const handleRemoveUser = async (userId: string) => {
    if (!firm) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ firm_id: null, role: 'user' })
        .eq('id', userId)

      if (error) {
        console.error('Error removing user:', error)
        setError('Failed to remove user from firm')
      } else {
        setMessage('User removed from firm successfully')
        await fetchFirmUsers(firm.id)
      }
    } catch (error) {
      console.error('Error in handleRemoveUser:', error)
      setError('Failed to remove user from firm')
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
            <p className="mt-4 text-gray-600">Loading firm data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!firm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => router.back()} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Alert>
            <AlertDescription>Firm not found</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Combine users and invitations for the table
  const allUsers = [
    ...users.map(user => ({
      id: user.id,
      name: user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.email || 'Unknown',
      lastName: user.last_name || '',
      email: user.email,
      status: user.status || 'verified',
      lastLogin: user.last_sign_in_at,
      role: user.role,
      type: 'user' as const
    })),
    ...invitations.map(inv => ({
      id: inv.id,
      name: inv.email,
      lastName: inv.email.split('@')[0], // Use email username as sortable field
      email: inv.email,
      status: 'invited' as const,
      lastLogin: null,
      role: inv.role,
      type: 'invitation' as const
    }))
  ]

  // Sort by last name
  allUsers.sort((a, b) => a.lastName.localeCompare(b.lastName))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Firm</h1>
            <p className="text-gray-600 mt-1">{firm.name}</p>
          </div>
        </div>

        {/* Firm Profile Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Firm Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateFirm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirmName">Firm Name</Label>
                  <Input
                    id="editFirmName"
                    value={editingFirm.name}
                    onChange={(e) => setEditingFirm({ ...editingFirm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editFirmDomain">Email Domain</Label>
                  <Input
                    id="editFirmDomain"
                    value={editingFirm.domain}
                    onChange={(e) => setEditingFirm({ ...editingFirm, domain: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Created: {new Date(firm.created_at).toLocaleDateString()}</span>
                <span>ID: {firm.id}</span>
              </div>
              <Button type="submit" size="sm">
                Update Firm Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Firm Users ({allUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allUsers.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No users or invitations found for this firm.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-semibold">Full Name</th>
                      <th className="text-left py-3 px-2 font-semibold">Email</th>
                      <th className="text-left py-3 px-2 font-semibold">Status</th>
                      <th className="text-left py-3 px-2 font-semibold">Role</th>
                      <th className="text-left py-3 px-2 font-semibold">Last Login</th>
                      <th className="text-left py-3 px-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <tr key={`${user.type}-${user.id}`} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{user.name}</td>
                        <td className="py-3 px-2 text-gray-600">{user.email}</td>
                        <td className="py-3 px-2">
                          <Badge variant={user.status === 'verified' ? 'default' : 'secondary'}>
                            {user.status === 'verified' ? 'Verified' : 'Invited'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline">
                            {user.role === 'firm_admin' ? 'Firm Admin' : 'User'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {user.lastLogin ? (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-gray-400">Never</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {user.type === 'user' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

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