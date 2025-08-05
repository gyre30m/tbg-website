'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/ui/header'
import { WrongfulTerminationFormView } from '@/components/ui/wrongful-termination-form-view'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, Save, X, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser-client'
import { updateWrongfulTerminationForm } from '@/lib/actions'
import type { WrongfulTerminationFormData } from '@/components/ui/wrongful-termination-form-view'

// Import the existing form components for edit mode
import { WtContact } from '@/components/ui/wt-contact'
import { WtDemographics } from '@/components/ui/wt-demographics'
import { WtEducation } from '@/components/ui/wt-education'
import { WtEmployment } from '@/components/ui/wt-employment'
import { WtOther } from '@/components/ui/wt-other'
import { WtLitigation } from '@/components/ui/wt-litigation'
import { useDocumentUpload } from '@/hooks/useDocumentUpload'

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

export default function WrongfulTerminationFormDetailPage() {
  const { user, loading, userProfile } = useAuth()
  const router = useRouter()
  const params = useParams()
  const formId = params?.id as string
  const { uploadMultipleDocuments, uploading } = useDocumentUpload()

  const [formData, setFormData] = useState<WrongfulTerminationFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [firmFormsUrl, setFirmFormsUrl] = useState('/forms')

  // Edit mode state (same as original form)
  const [preTerminationYears, setPreTerminationYears] = useState<EmploymentYear[]>([])
  const [postTerminationYears, setPostTerminationYears] = useState<EmploymentYear[]>([])
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
        .from('wrongful_termination_forms')
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
      setPreTerminationYears(data.pre_termination_years || [])
      setPostTerminationYears(data.post_termination_years || [])
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
    // Populate form fields with current data
    setTimeout(() => {
      populateFormFields()
    }, 100)
  }

  const populateFormFields = () => {
    const form = document.querySelector('form') as HTMLFormElement
    if (!form || !formData) return


    // Populate all form fields with current data
    Object.keys(formData).forEach(key => {
      const field = form.querySelector(`[name="${convertDbFieldToFormField(key)}"]`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      if (field && formData[key] !== null && formData[key] !== undefined) {
        if (key.includes('date') && formData[key]) {
          // Handle date fields
          const date = new Date(formData[key] as string)
          field.value = date.toISOString().split('T')[0]
        } else {
          field.value = String(formData[key])
        }
        
        // Don't trigger change events - just populate the values
        // This prevents any unintended saves when entering edit mode
      }
    })
  }

  // Convert database field names to form field names
  const convertDbFieldToFormField = (dbField: string): string => {
    const fieldMapping: Record<string, string> = {
      'first_name': 'firstName',
      'last_name': 'lastName',
      'zip_code': 'zipCode',
      'phone_type': 'phoneType',
      'date_of_birth': 'dateOfBirth',
      'marital_status': 'maritalStatus',
      'termination_date': 'terminationDate',
      'termination_reason': 'terminationReason',
      'pre_termination_education': 'preTerminationEducation',
      'pre_termination_skills': 'preTerminationSkills',
      'pre_termination_education_plans': 'preTerminationEducationPlans',
      'post_termination_education': 'postTerminationEducation',
      'additional_info': 'additionalInfo',
      // Add more mappings as needed
    }
    
    return fieldMapping[dbField] || dbField
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset state to original values
    if (formData) {
      setPreTerminationYears((formData.pre_termination_years as EmploymentYear[]) || [])
      setPostTerminationYears((formData.post_termination_years as EmploymentYear[]) || [])
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
      formDataObj.append('preTerminationYears', JSON.stringify(preTerminationYears))
      formDataObj.append('postTerminationYears', JSON.stringify(postTerminationYears))
      formDataObj.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await updateWrongfulTerminationForm(formId, formDataObj)
      
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
          Edit Form
        </Button>
      )}
    </div>
  ) : null

  return (
    <>
      <Header formActions={formActions} />
      
      {!isEditing ? (
        <>
          {/* Read-only view */}
          <WrongfulTerminationFormView 
            formData={formData}
          />
        </>
      ) : (
        /* Edit mode */
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold tracking-tight">Edit Wrongful Termination Form</h1>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                You are editing a submitted form. Changes will be tracked and a new version will be created.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <WtContact />
            <WtDemographics />
            <WtEducation />
            <WtEmployment 
              preTerminationYears={preTerminationYears}
              setPreTerminationYears={setPreTerminationYears}
              postTerminationYears={postTerminationYears}
              setPostTerminationYears={setPostTerminationYears}
              uploadedFiles={uploadedFiles}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
              uploading={uploading}
            />
            <WtOther />
            <WtLitigation />

            {/* Save button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}