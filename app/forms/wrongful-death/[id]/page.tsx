'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/ui/header'
import { WrongfulDeathFormView } from '@/components/ui/wrongful-death-form-view'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, Edit, Save, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser-client'
import { updateWrongfulDeathForm } from '@/lib/actions'
import type { WrongfulDeathFormData } from '@/components/ui/wrongful-death-form-view'

// Import the existing form components for edit mode
import { WdContact } from '@/components/ui/wd-contact'
import { WdDemographics } from '@/components/ui/wd-demographics'
import { WdDependents } from '@/components/ui/wd-dependents'
import { WdMedical } from '@/components/ui/wd-medical'
import { WdEducation } from '@/components/ui/wd-education'
import { WdHouseholdServices } from '@/components/ui/wd-household-services'
import { WdOther } from '@/components/ui/wd-other'
import { WdLitigation } from '@/components/ui/wd-litigation'

interface Dependent {
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

export default function WrongfulDeathFormDetailPage() {
  const { user, loading, userProfile } = useAuth()
  const router = useRouter()
  const params = useParams()
  const formId = params?.id as string

  const [formData, setFormData] = useState<WrongfulDeathFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [firmFormsUrl, setFirmFormsUrl] = useState('/forms')

  // Edit mode state (same as original form)
  const [householdDependents, setHouseholdDependents] = useState<Dependent[]>([])
  const [otherDependents, setOtherDependents] = useState<Dependent[]>([])
  const [employmentYears, setEmploymentYears] = useState<EmploymentYear[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  useEffect(() => {
    if (user && formId) {
      fetchFormData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, formId, userProfile])

  const fetchFormData = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('wrongful_death_forms')
        .select('*')
        .eq('id', formId)
        .single()

      if (error) {
        console.error('Error fetching form:', error)
        toast.error('Form not found')
        router.push('/forms')
        return
      }

      // Fetch current user profile to get the most up-to-date role
      const { data: currentUserProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      // Check if user can edit this form using fresh data
      const isCurrentSiteAdmin = currentUserProfile?.role === 'site_admin'
      const isSameFirm = data.firm_id === currentUserProfile?.firm_id

      setCanEdit(isCurrentSiteAdmin || isSameFirm)
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
      setHouseholdDependents(data.household_dependents || [])
      setOtherDependents(data.other_dependents || [])
      setEmploymentYears(data.employment_years || [])
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
      'deceased_first_name': 'deceasedFirstName',
      'deceased_last_name': 'deceasedLastName',
      'date_of_death': 'dateOfDeath',
      'age_at_death': 'ageAtDeath',
      'cause_of_death': 'causeOfDeath',
      'life_expectancy': 'lifeExpectancy',
      'date_of_incident': 'dateOfIncident',
      'pre_death_education': 'preDeathEducation',
      'pre_death_skills': 'preDeathSkills',
      'education_plans': 'educationPlans',
      'parent_education': 'parentEducation',
      'pre_death_household': 'preDeathHousehold',
      'post_death_household': 'postDeathHousehold',
      // Add more mappings as needed
    }
    
    return fieldMapping[dbField] || dbField
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset state to original values
    if (formData) {
      setHouseholdDependents((formData.household_dependents as Dependent[]) || [])
      setOtherDependents((formData.other_dependents as Dependent[]) || [])
      setEmploymentYears((formData.employment_years as EmploymentYear[]) || [])
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
      formDataObj.append('householdDependents', JSON.stringify(householdDependents))
      formDataObj.append('otherDependents', JSON.stringify(otherDependents))
      formDataObj.append('employmentYears', JSON.stringify(employmentYears))
      formDataObj.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await updateWrongfulDeathForm(formId, formDataObj)
      
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
          <WrongfulDeathFormView 
            formData={formData}
          />
        </>
      ) : (
        /* Edit mode */
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold tracking-tight">Edit Wrongful Death Form</h1>
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
            <WdContact />
            <WdDemographics />
            <WdDependents 
              householdDependents={householdDependents}
              setHouseholdDependents={setHouseholdDependents}
              otherDependents={otherDependents}
              setOtherDependents={setOtherDependents}
            />
            <WdMedical />
            <WdEducation />
            <WdHouseholdServices />
            <WdOther />
            <WdLitigation />

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