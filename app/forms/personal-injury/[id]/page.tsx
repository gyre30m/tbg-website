'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/ui/header'
import { PersonalInjuryFormView } from '@/components/ui/personal-injury-form-view'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, Save, X, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser-client'
import { updatePersonalInjuryForm } from '@/lib/actions'
import type { PersonalInjuryFormData } from '@/components/ui/personal-injury-form-view'

// Import the existing form components for edit mode
import { PiContact } from '@/components/ui/pi-contact'
import { PiDemographics } from '@/components/ui/pi-demographics'
import { PiHousehold } from '@/components/ui/pi-household'
import { PiMedical } from '@/components/ui/pi-medical'
import { PiEducation } from '@/components/ui/pi-education'
import { PiEmployment } from '@/components/ui/pi-employment'
import { PiHouseholdServices } from '@/components/ui/pi-household-services'
import { PiOther } from '@/components/ui/pi-other'
import { PiLitigation } from '@/components/ui/pi-litigation'
import { useDocumentUpload } from '@/hooks/useDocumentUpload'

interface HouseholdMember {
  id: string
  fullName: string
  dateOfBirth: string
  relationship: string
}

interface EmploymentYear {
  id: string
  year: string
  income: string
  percentEmployed: string
}

interface UploadedFile {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  storagePath?: string
  category: string
}

export default function PersonalInjuryFormDetailPage() {
  const { user, loading, userProfile } = useAuth()
  const router = useRouter()
  const params = useParams()
  const formId = params?.id as string
  const { uploadMultipleDocuments, uploading } = useDocumentUpload()

  const [formData, setFormData] = useState<PersonalInjuryFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [firmFormsUrl, setFirmFormsUrl] = useState('/forms')

  // Edit mode state (same as original form)
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([])
  const [preInjuryYears, setPreInjuryYears] = useState<EmploymentYear[]>([])
  const [postInjuryYears, setPostInjuryYears] = useState<EmploymentYear[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  useEffect(() => {
    if (user && formId) {
      fetchFormData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, formId])

  const fetchFormData = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('personal_injury_forms')
        .select('*')
        .eq('id', formId)
        .single()

      if (error) {
        console.error('Error fetching form:', error)
        toast.error('Form not found')
        router.push('/forms')
        return
      }

      // Check if user can edit this form
      const isSiteAdmin = userProfile?.role === 'site_admin'
      const isOwner = data.submitted_by === user?.id
      const isSameFirm = data.firm_id === userProfile?.firm_id

      setCanEdit(isSiteAdmin || (isOwner && isSameFirm))
      setFormData(data)
      
      // Get firm information for the Back to Forms URL
      if (data.firm_id) {
        const { data: firmData } = await supabase
          .from('firms')
          .select('slug, name')
          .eq('id', data.firm_id)
          .single()

        if (firmData) {
          const firmIdentifier = firmData.slug || encodeURIComponent(firmData.name)
          setFirmFormsUrl(`/firms/${firmIdentifier}/forms`)
        }
      }
      
      // Initialize edit mode state with current data
      setHouseholdMembers(data.household_members || [])
      setPreInjuryYears(data.pre_injury_years || [])
      setPostInjuryYears(data.post_injury_years || [])
      setUploadedFiles(data.uploaded_files || [])

    } catch (error) {
      console.error('Error fetching form data:', error)
      toast.error('Failed to load form')
      router.push('/forms')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset state to original values
    if (formData) {
      setHouseholdMembers((formData.household_members as HouseholdMember[]) || [])
      setPreInjuryYears((formData.pre_injury_years as EmploymentYear[]) || [])
      setPostInjuryYears((formData.post_injury_years as EmploymentYear[]) || [])
      setUploadedFiles((formData.uploaded_files as UploadedFile[]) || [])
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const form = e.target as HTMLFormElement
      const formDataObj = new FormData(form)
      
      // Add complex data
      formDataObj.append('householdMembers', JSON.stringify(householdMembers))
      formDataObj.append('preInjuryYears', JSON.stringify(preInjuryYears))
      formDataObj.append('postInjuryYears', JSON.stringify(postInjuryYears))
      formDataObj.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await updatePersonalInjuryForm(formId, formDataObj)
      
      if (result.success) {
        toast.success('Form updated successfully!')
        setIsEditing(false)
        // Refresh form data to show updated version
        await fetchFormData()
      } else {
        toast.error('Failed to update form')
      }
      
    } catch (error) {
      console.error('Error updating form:', error)
      toast.error('Failed to update form. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = async (files: FileList, category: string) => {
    const fileArray = Array.from(files)
    
    try {
      const results = await uploadMultipleDocuments(fileArray, category)
      
      const newUploadedFiles = results
        .filter(result => result.success)
        .map(result => ({
          id: Date.now().toString() + Math.random(),
          fileName: result.fileName!,
          fileUrl: result.fileUrl!,
          fileSize: result.fileSize!,
          fileType: result.fileType!,
          storagePath: result.storagePath,
          category
        }))
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles])
      
      const successCount = results.filter(r => r.success).length
      const failCount = results.length - successCount
      
      if (successCount > 0) {
        toast.success(`${successCount} file(s) uploaded successfully`)
      }
      if (failCount > 0) {
        toast.error(`${failCount} file(s) failed to upload`)
      }
      
    } catch {
      toast.error('Failed to upload files')
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  if (loading || isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">Loading...</div>
        </div>
      </>
    )
  }

  if (!user) {
    router.push('/forms')
    return null
  }

  if (!formData) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">Form not found</div>
        </div>
      </>
    )
  }

  // Create form actions for the header
  const formActions = !isEditing ? (
    <div className="flex items-center gap-3">
      <Button 
        variant="ghost" 
        onClick={() => router.push(firmFormsUrl)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Forms
      </Button>
      {canEdit && (
        <Button onClick={handleEdit} className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Cancel
      </Button>
      <Button 
        type="submit" 
        form="edit-form"
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )

  return (
    <>
      <Header formActions={formActions} />
      
      {!isEditing ? (
        <>
          <PersonalInjuryFormView 
            formData={formData}
          />
        </>
      ) : (
        /* Edit mode */
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Personal Injury Form</h1>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                You are editing a submitted form. Changes will be tracked and a new version will be created.
              </p>
            </div>
          </div>

          <form id="edit-form" onSubmit={handleSave} className="space-y-8">
            <PiContact initialData={formData || undefined} />
            <PiDemographics initialData={formData || undefined} />
            <PiHousehold 
              householdMembers={householdMembers}
              setHouseholdMembers={setHouseholdMembers}
            />
            <PiMedical 
              uploadedFiles={uploadedFiles}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
              uploading={uploading}
              initialData={formData || undefined}
            />
            <PiEducation initialData={formData || undefined} />
            <PiEmployment 
              preInjuryYears={preInjuryYears}
              setPreInjuryYears={setPreInjuryYears}
              postInjuryYears={postInjuryYears}
              setPostInjuryYears={setPostInjuryYears}
              uploadedFiles={uploadedFiles}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
              uploading={uploading}
              initialData={formData || undefined}
            />
            <PiHouseholdServices initialData={formData || undefined} />
            <PiOther initialData={formData || undefined} />
            <PiLitigation initialData={formData || undefined} />
          </form>
        </div>
      )}
    </>
  )
}