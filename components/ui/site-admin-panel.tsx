'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/browser-client'
import { Firm } from '@/lib/types'
import { Settings, Upload, User, Calendar, Plus, ChevronDown, Eye } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'
import { toast } from 'sonner'

interface CreateFirmFormData {
  name: string
  domain: string
  adminEmail: string
  address_1: string
  address_2: string
  city: string
  state: string
  zip_code: string
  main_phone: string
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
}

interface SiteAdmin {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  created_at: string
  updated_at: string
  role: string
}

const FORM_TYPE_LABELS = {
  personal_injury: 'Personal Injury',
  wrongful_death: 'Wrongful Death',
  wrongful_termination: 'Wrongful Termination'
}

export function SiteAdminPanel() {
  const router = useRouter()
  const { uploadImage, uploading: imageUploading, uploadProgress } = useImageUpload()
  const [firms, setFirms] = useState<Firm[]>([])
  const [forms, setForms] = useState<FormSubmission[]>([])
  const [siteAdmins, setSiteAdmins] = useState<SiteAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [formsLoading, setFormsLoading] = useState(true)
  const [adminsLoading, setAdminsLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  const [totalFormsCount, setTotalFormsCount] = useState(0)
  const [activeTab, setActiveTab] = useState('firms')
  const formsLoadedRef = useRef(false)
  const adminsLoadedRef = useRef(false)
  const [formData, setFormData] = useState<CreateFirmFormData>({
    name: '',
    domain: '',
    adminEmail: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    zip_code: '',
    main_phone: ''
  })

  // Client-side function to create a firm
  const createFirmClient = async (firmData: Omit<CreateFirmFormData, 'adminEmail'>, imageUrl?: string): Promise<Firm | null> => {
    try {
      console.log('createFirmClient called with:', firmData, 'imageUrl:', imageUrl)
      
      const { data: firm, error: firmError } = await supabase
        .from('firms')
        .insert([{
          name: firmData.name,
          domain: firmData.domain.toLowerCase(),
          address_1: firmData.address_1 || null,
          address_2: firmData.address_2 || null,
          city: firmData.city || null,
          state: firmData.state || null,
          zip_code: firmData.zip_code || null,
          main_phone: firmData.main_phone || null,
          image_url: imageUrl || null,
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

  // Fetch firms data once on component mount
  useEffect(() => {
    fetchFirms()
  }, [])

  // Fetch forms data only when switching to forms tab for the first time
  useEffect(() => {
    if (activeTab === 'forms' && !formsLoadedRef.current) {
      formsLoadedRef.current = true
      fetchAllForms()
    }
  }, [activeTab])

  // Fetch site admins data only when switching to admins tab for the first time
  useEffect(() => {
    if (activeTab === 'admins' && !adminsLoadedRef.current) {
      adminsLoadedRef.current = true
      fetchSiteAdmins()
    }
  }, [activeTab])

  const fetchFirms = async () => {
    try {
      setLoading(true)
      const supabaseClient = createClient()
      
      // First get all firms
      const { data: firmsData, error: firmsError } = await supabaseClient
        .from('firms')
        .select('*')
        .order('created_at', { ascending: false })

      if (firmsError) {
        console.error('Error fetching firms:', firmsError)
        return
      }

      // Then get firm admin info for each firm
      const firmsWithAdmins = await Promise.all(
        (firmsData || []).map(async (firm) => {
          // Get the most senior firm admin for this firm (earliest created_at)
          const { data: adminData, error: adminError } = await supabaseClient
            .from('user_profiles')
            .select('first_name, last_name, email, created_at')
            .eq('firm_id', firm.id)
            .eq('role', 'firm_admin')
            .order('created_at', { ascending: true })
            .limit(1)
            .single()

          return {
            ...firm,
            firmAdmin: adminError ? null : adminData
          }
        })
      )

      setFirms(firmsWithAdmins)
    } catch (error) {
      console.error('Error in fetchFirms:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllForms = async () => {
    try {
      setFormsLoading(true)
      const supabaseClient = createClient()

      // Fetch from all three form types (site admin sees all forms)
      const fetchPromises = []

      // Personal Injury Forms
      const piQuery = supabaseClient
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

      fetchPromises.push(
        piQuery.order('updated_at', { ascending: false }).then(({ data, error }) => {
          if (error) throw error
          return (data || []).map(form => ({ ...form, form_type: 'personal_injury' as const }))
        })
      )

      // Wrongful Death Forms
      const wdQuery = supabaseClient
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

      fetchPromises.push(
        Promise.resolve(wdQuery.order('updated_at', { ascending: false })).then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
          return (data || []).map(form => ({ ...form, form_type: 'wrongful_death' as const }))
        }).catch(() => []) // Return empty array if table doesn't exist
      )

      // Wrongful Termination Forms
      const wtQuery = supabaseClient
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
      setTotalFormsCount(allForms.length)

    } catch (error) {
      console.error('Error fetching forms:', error)
      toast.error('Failed to load forms')
    } finally {
      setFormsLoading(false)
    }
  }

  const fetchSiteAdmins = async () => {
    try {
      setAdminsLoading(true)
      const supabaseClient = createClient()

      // Fetch users with site_admin role from user_profiles table
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          created_at,
          updated_at,
          role
        `)
        .eq('role', 'site_admin')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching site admins:', error)
        toast.error('Failed to load site admins')
        return
      }

      setSiteAdmins(data || [])

    } catch (error) {
      console.error('Error fetching site admins:', error)
      toast.error('Failed to load site admins')
    } finally {
      setAdminsLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setError('')
      const result = await uploadImage(file)
      
      if (result.success && result.imageUrl) {
        setUploadedImageUrl(result.imageUrl)
        setMessage('Image uploaded successfully!')
      } else {
        setError(result.error || 'Failed to upload image')
      }
    } catch (error) {
      setError('Failed to upload image')
      console.error('Image upload error:', error)
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
      console.log('Creating firm with data:', formData)
      
      // Create the firm
      const { adminEmail, ...firmData } = formData
      const firm = await createFirmClient(firmData, uploadedImageUrl || undefined)
      
      console.log('createFirm result:', firm)
      
      if (firm) {
        console.log('Firm created successfully, sending invitation...')
        // Send invitation to firm admin
        const inviteResult = await inviteUserToFirmClient(
          adminEmail,
          firm.id,
          'firm_admin'
        )
        
        console.log('Invitation result:', inviteResult)
        
        if (inviteResult.success) {
          const signupUrl = `${window.location.origin}/auth/signup?firmId=${firm.id}&role=firm_admin&email=${encodeURIComponent(adminEmail)}`
          setMessage(`Firm created successfully! Send this signup link to ${adminEmail}: ${signupUrl}`)
          setFormData({ name: '', domain: '', adminEmail: '', address_1: '', address_2: '', city: '', state: '', zip_code: '', main_phone: '' })
          setUploadedImageUrl('')
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
    router.push(`/firms/${firmSlug}/admin`)
  }

  const clearMessages = () => {
    setError('')
    setMessage('')
  }

  // Helper functions for forms table
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

  // Helper functions for site admin table
  const getAdminFullName = (admin: SiteAdmin): string => {
    const firstName = admin.first_name || ''
    const lastName = admin.last_name || ''
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    return firstName || lastName || 'Unknown Name'
  }

  const getAdminSinceDate = (admin: SiteAdmin): string => {
    return new Date(admin.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function for firm admin display
  const getFirmAdminInfo = (firm: Firm & { firmAdmin?: { first_name?: string, last_name?: string, email?: string } | null }) => {
    if (!firm.firmAdmin) {
      return { name: 'No admin assigned', email: '' }
    }
    
    const firstName = firm.firmAdmin.first_name || ''
    const lastName = firm.firmAdmin.last_name || ''
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || 'Unknown Name')
    
    return {
      name: fullName,
      email: firm.firmAdmin.email || ''
    }
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Site Administration</h1>
            <p className="text-gray-600 mt-2">Manage law firms and view all forms</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="firms">Law Firms</TabsTrigger>
            <TabsTrigger value="forms">All Forms</TabsTrigger>
            <TabsTrigger value="admins">Site Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="firms" className="space-y-6">
            <div className="flex justify-end">
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
                
                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Address Information (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address1">Address Line 1</Label>
                      <Input
                        id="address1"
                        value={formData.address_1}
                        onChange={(e) => setFormData({ ...formData, address_1: e.target.value })}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        value={formData.address_2}
                        onChange={(e) => setFormData({ ...formData, address_2: e.target.value })}
                        placeholder="Suite 100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="mainPhone">Main Phone</Label>
                    <Input
                      id="mainPhone"
                      type="tel"
                      value={formData.main_phone}
                      onChange={(e) => setFormData({ ...formData, main_phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firmImage">Firm Logo/Image (Optional)</Label>
                    <Input
                      id="firmImage"
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
                    {uploadedImageUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 mb-1">Image uploaded successfully!</p>
                        <Image 
                          src={uploadedImageUrl} 
                          alt="Uploaded firm logo" 
                          width={96}
                          height={96}
                          className="object-cover border rounded"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setUploadedImageUrl('')}
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: JPG, PNG, GIF, WebP, SVG (Max 5MB)
                    </p>
                  </div>
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

            <Card>
              <CardHeader>
                <CardTitle>Law Firms ({firms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {firms.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No law firms created yet.</p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Firm Name</TableHead>
                          <TableHead>Firm Admin</TableHead>
                          <TableHead>Domain</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {firms.map((firm) => {
                          const adminInfo = getFirmAdminInfo(firm)
                          return (
                            <TableRow key={firm.id}>
                              <TableCell className="font-medium">
                                {firm.name}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{adminInfo.name}</span>
                                  {adminInfo.email && (
                                    <span className="text-xs text-gray-500">{adminInfo.email}</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {firm.domain}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(firm.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleManageFirm(firm)}
                                >
                                  <Settings className="w-4 h-4 mr-2" />
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {totalFormsCount} Total Forms
                </Badge>
                <Badge variant="secondary">Site Admin View</Badge>
              </div>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  All Form Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading forms...</p>
                  </div>
                ) : forms.length === 0 ? (
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

            {/* Summary Stats for Forms */}
            {forms.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {siteAdmins.length} Site Admin{siteAdmins.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Site Administrators
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adminsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading site administrators...</p>
                  </div>
                ) : siteAdmins.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-2">No site administrators found</p>
                    <p className="text-gray-400 text-sm">
                      Site administrators will appear here
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Email Address</TableHead>
                          <TableHead>Admin Since</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {siteAdmins.map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell className="font-medium">
                              {getAdminFullName(admin)}
                            </TableCell>
                            <TableCell>
                              {admin.email}
                            </TableCell>
                            <TableCell className="text-sm">
                              {getAdminSinceDate(admin)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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