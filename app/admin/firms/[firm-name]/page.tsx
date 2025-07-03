'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Firm } from '@/lib/types'
import { ArrowLeft, Settings, Mail, User, Clock, UserPlus, Upload } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'
import { toast } from 'sonner'

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
  firm_id: string
  role: string
  invited_by?: string
  invited_at: string
  accepted_at?: string
}

export default function FirmManagementPage() {
  const params = useParams()
  const router = useRouter()
  const firmSlug = params['firm-name'] as string
  const { uploadImage, uploading: imageUploading, uploadProgress } = useImageUpload()

  const [firm, setFirm] = useState<Firm | null>(null)
  const [newImageUrl, setNewImageUrl] = useState<string>('')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingFirm, setEditingFirm] = useState({ 
    name: '', 
    domain: '', 
    address_1: '', 
    address_2: '', 
    city: '', 
    state: '', 
    zip_code: '', 
    main_phone: '' 
  })
  
  // Invite user state
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'user' as 'firm_admin' | 'user'
  })

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
        toast.error('Failed to load firm data')
        return
      }

      // Find firm by matching the slug
      const matchingFirm = firms?.find(f => {
        const firmSlugFromName = f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        return firmSlugFromName === firmSlug
      })

      if (!matchingFirm) {
        toast.error('Firm not found')
        return
      }

      setFirm(matchingFirm)
      setEditingFirm({ 
        name: matchingFirm.name, 
        domain: matchingFirm.domain,
        address_1: matchingFirm.address_1 || '',
        address_2: matchingFirm.address_2 || '',
        city: matchingFirm.city || '',
        state: matchingFirm.state || '',
        zip_code: matchingFirm.zip_code || '',
        main_phone: matchingFirm.main_phone || ''
      })

      // Fetch users for this firm
      await Promise.all([
        fetchFirmUsers(matchingFirm.id),
        fetchFirmInvitations(matchingFirm.id)
      ])

    } catch (error) {
      console.error('Error in fetchFirmData:', error)
      toast.error('Failed to load firm data')
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
        .is('accepted_at', null)
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

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImage(file)
      
      if (result.success && result.imageUrl) {
        setNewImageUrl(result.imageUrl)
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(result.error || 'Failed to upload image')
      }
    } catch (error) {
      toast.error('Failed to upload image')
      console.error('Image upload error:', error)
    }
  }

  const handleUpdateFirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firm) return

    try {
      const updateData: Partial<Firm> = {
        name: editingFirm.name,
        domain: editingFirm.domain.toLowerCase(),
        address_1: editingFirm.address_1 || undefined,
        address_2: editingFirm.address_2 || undefined,
        city: editingFirm.city || undefined,
        state: editingFirm.state || undefined,
        zip_code: editingFirm.zip_code || undefined,
        main_phone: editingFirm.main_phone || undefined
      }

      // Only update image_url if a new image was uploaded
      if (newImageUrl) {
        updateData.image_url = newImageUrl
      }

      const { error } = await supabase
        .from('firms')
        .update(updateData)
        .eq('id', firm.id)

      if (error) {
        console.error('Error updating firm:', error)
        toast.error('Failed to update firm')
      } else {
        // Update local state with new values
        const updatedFirm = { 
          ...firm, 
          name: editingFirm.name, 
          domain: editingFirm.domain,
          address_1: editingFirm.address_1 || undefined,
          address_2: editingFirm.address_2 || undefined,
          city: editingFirm.city || undefined,
          state: editingFirm.state || undefined,
          zip_code: editingFirm.zip_code || undefined,
          main_phone: editingFirm.main_phone || undefined,
          image_url: newImageUrl || firm.image_url
        }
        setFirm(updatedFirm)
        
        // Clear temporary data
        setNewImageUrl('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        
        // Show success toast with updated firm name
        toast.success(`${updatedFirm.name} profile updated successfully`)
      }
    } catch (error) {
      console.error('Error in handleUpdateFirm:', error)
      toast.error('Failed to update firm')
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
        toast.error('Failed to remove user from firm')
      } else {
        toast.success('User removed from firm successfully')
        await fetchFirmUsers(firm.id)
      }
    } catch (error) {
      console.error('Error in handleRemoveUser:', error)
      toast.error('Failed to remove user from firm')
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firm) return

    setInviting(true)

    try {
      // Validate email domain matches firm domain
      const emailDomain = inviteData.email.split('@')[1]
      if (emailDomain !== firm.domain) {
        toast.error(`Email domain must match firm domain: ${firm.domain}`)
        setInviting(false)
        return
      }

      // Check if user is already invited or exists
      const { data: existingInvite } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('email', inviteData.email.toLowerCase())
        .eq('firm_id', firm.id)
        .is('accepted_at', null)
        .limit(1)

      if (existingInvite && existingInvite.length > 0) {
        toast.error('An invitation has already been sent to this email address')
        setInviting(false)
        return
      }

      // Check if a user with this email already exists in the firm
      const { data: authUsers } = await supabase.auth.admin.listUsers()
      const existingUser = authUsers?.users?.find(u => u.email === inviteData.email.toLowerCase())
      
      if (existingUser) {
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', existingUser.id)
          .eq('firm_id', firm.id)
          .limit(1)

        if (existingProfile && existingProfile.length > 0) {
          toast.error('This user is already a member of this firm')
          setInviting(false)
          return
        }
      }

      // Create the invitation
      const { error: inviteError } = await supabase
        .from('user_invitations')
        .insert([{
          email: inviteData.email.toLowerCase(),
          firm_id: firm.id,
          role: inviteData.role,
          invited_at: new Date().toISOString()
        }])

      if (inviteError) {
        console.error('Error creating invitation:', inviteError)
        toast.error('Failed to send invitation')
      } else {
        toast.success(`Invitation sent to ${inviteData.email}`)
        
        // Reset form and refresh data
        setInviteData({ email: '', role: 'user' })
        setShowInviteForm(false)
        await Promise.all([
          fetchFirmUsers(firm.id),
          fetchFirmInvitations(firm.id)
        ])
      }
    } catch (error) {
      console.error('Error in handleInviteUser:', error)
      toast.error('Failed to send invitation')
    } finally {
      setInviting(false)
    }
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">Firm not found</p>
          </div>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <p className="text-sm text-gray-500">Manage Firm</p>
              <h1 className="text-4xl font-bold text-gray-900">{firm.name}</h1>
            </div>
          </div>
          {/* Firm Image */}
          {firm.image_url && (
            <div className="flex-shrink-0">
              <Image
                src={firm.image_url}
                alt={`${firm.name} logo`}
                width={80}
                height={80}
                className="object-cover rounded-lg border"
              />
            </div>
          )}
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
              
              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editAddress1">Address Line 1</Label>
                    <Input
                      id="editAddress1"
                      value={editingFirm.address_1}
                      onChange={(e) => setEditingFirm({ ...editingFirm, address_1: e.target.value })}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editAddress2">Address Line 2</Label>
                    <Input
                      id="editAddress2"
                      value={editingFirm.address_2}
                      onChange={(e) => setEditingFirm({ ...editingFirm, address_2: e.target.value })}
                      placeholder="Suite 100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="editCity">City</Label>
                    <Input
                      id="editCity"
                      value={editingFirm.city}
                      onChange={(e) => setEditingFirm({ ...editingFirm, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editState">State</Label>
                    <Input
                      id="editState"
                      value={editingFirm.state}
                      onChange={(e) => setEditingFirm({ ...editingFirm, state: e.target.value })}
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editZipCode">Zip Code</Label>
                    <Input
                      id="editZipCode"
                      value={editingFirm.zip_code}
                      onChange={(e) => setEditingFirm({ ...editingFirm, zip_code: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editMainPhone">Main Phone</Label>
                  <Input
                    id="editMainPhone"
                    type="tel"
                    value={editingFirm.main_phone}
                    onChange={(e) => setEditingFirm({ ...editingFirm, main_phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="editFirmImage">Firm Logo/Image</Label>
                  <Input
                    ref={fileInputRef}
                    id="editFirmImage"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        await handleImageUpload(file)
                      }
                    }}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-blue-600">Uploading... {uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF, WebP, SVG (Max 5MB)
                  </p>
                  
                  {/* New Uploaded Image */}
                  {newImageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 mb-1">New image uploaded (will replace current image when saved):</p>
                      <Image 
                        src={newImageUrl} 
                        alt="New firm logo" 
                        width={96}
                        height={96}
                        className="object-cover border rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setNewImageUrl('')}
                      >
                        Remove New Image
                      </Button>
                    </div>
                  )}
                </div>
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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Firm Users ({allUsers.length})
              </CardTitle>
              <Button 
                onClick={() => setShowInviteForm(true)}
                size="sm"
                disabled={showInviteForm}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Invite User Form */}
            {showInviteForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Invite New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="inviteEmail">Email Address *</Label>
                        <Input
                          id="inviteEmail"
                          type="email"
                          value={inviteData.email}
                          onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                          placeholder={`user@${firm?.domain}`}
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Email domain must match: {firm?.domain}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="inviteRole">Role *</Label>
                        <select
                          id="inviteRole"
                          value={inviteData.role}
                          onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as 'firm_admin' | 'user' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="user">User</option>
                          <option value="firm_admin">Firm Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={inviting} size="sm">
                        {inviting ? 'Sending...' : 'Send Invitation'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowInviteForm(false)
                          setInviteData({ email: '', role: 'user' })
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

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

      </div>
    </div>
  )
}