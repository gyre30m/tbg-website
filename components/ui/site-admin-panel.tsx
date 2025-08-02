'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import { Firm } from '@/lib/types'
import { Settings, Upload } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

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

export function SiteAdminPanel() {
  const router = useRouter()
  const { uploadImage, uploading: imageUploading, uploadProgress } = useImageUpload()
  const [firms, setFirms] = useState<Firm[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Site Administration</h1>
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