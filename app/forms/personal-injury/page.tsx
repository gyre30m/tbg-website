'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useDocumentUpload } from '@/hooks/useDocumentUpload'
import { submitPersonalInjuryForm, saveDraftPersonalInjuryForm, deletePersonalInjuryForm } from '@/lib/actions'
import { createClient } from '@/lib/supabase/browser-client'
import { toast } from 'sonner'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import { CancelFormDialog } from '@/components/ui/cancel-form-dialog'
import { PiContact } from '@/components/ui/pi-contact'
import { PiDemographics } from '@/components/ui/pi-demographics'
import { PiHousehold } from '@/components/ui/pi-household'
import { PiMedical } from '@/components/ui/pi-medical'
import { PiEducation } from '@/components/ui/pi-education'
import { PiEmployment } from '@/components/ui/pi-employment'
import { PiHouseholdServices } from '@/components/ui/pi-household-services'
import { PiOther } from '@/components/ui/pi-other'
import { PiLitigation } from '@/components/ui/pi-litigation'
import { personalInjuryDummyData } from '@/lib/personal-injury-dummy-data'

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

export default function PersonalInjuryForm() {
  const { user, loading, userProfile } = useAuth()
  const router = useRouter()
  const { uploadMultipleDocuments, uploading } = useDocumentUpload()

  // Helper function to get firm forms redirect URL
  const getFirmFormsUrl = async () => {
    if (!userProfile?.firm_id) {
      return '/forms?submitted=true' // fallback to original behavior
    }

    try {
      const supabase = createClient()
      
      // Try to fetch firm by slug first, then by name if slug doesn't exist
      let firmData = null
      const { data: slugData, error: slugError } = await supabase
        .from('firms')
        .select('*')
        .eq('id', userProfile.firm_id)
        .single()

      if (slugError) {
        console.error('Error fetching firm:', slugError)
        return '/forms?submitted=true' // fallback
      }
      
      firmData = slugData
      
      // Use slug if available, otherwise use name
      const firmIdentifier = firmData.slug || encodeURIComponent(firmData.name)
      return `/firms/${firmIdentifier}/forms?submitted=true`
    } catch (error) {
      console.error('Error getting firm forms URL:', error)
      return '/forms?submitted=true' // fallback
    }
  }
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([
    { id: '1', fullName: '', dateOfBirth: '', relationship: '' }
  ])
  
  const [preInjuryYears, setPreInjuryYears] = useState<EmploymentYear[]>([
    { id: '1', year: '', income: '', percentEmployed: '' }
  ])
  
  const [postInjuryYears, setPostInjuryYears] = useState<EmploymentYear[]>([
    { id: '1', year: '', income: '', percentEmployed: '' }
  ])
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  
  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentFormId, setCurrentFormId] = useState<string | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  
  // Track if form has been saved or submitted
  const [hasBeenSaved, setHasBeenSaved] = useState(false)

  // Function to get the current last name from the form
  const getCurrentLastName = (): string => {
    const form = document.querySelector('form') as HTMLFormElement
    if (!form) return ''
    
    const lastNameField = form.querySelector('[name="lastName"]') as HTMLInputElement
    return lastNameField ? lastNameField.value.trim() : ''
  }

  // Demo data population function
  const populateDemoData = () => {
    const form = document.querySelector('form') as HTMLFormElement
    if (!form) return

    // Populate simple form fields (input, textarea)
    const textFields = [
      'firstName', 'lastName', 'address1', 'address2', 'city', 'state', 'zipCode',
      'email', 'phone', 'dateOfBirth', 'incidentDate', 'injuryDescription',
      'caregiverClaim', 'lifeExpectancy', 'futureMedical', 'futureExpenses',
      'preInjurySkills', 'educationPlans', 'parentEducation', 'parentsEducation', 'postInjuryEducation',
      'preInjuryJobTitle', 'preInjuryEmployer', 'preInjuryStartDate', 'preInjurySalary',
      'preInjuryDuties', 'preInjuryAdvancements', 'preInjuryOvertime', 'preInjuryWorkSteady',
      'preInjuryLifeInsurance', 'preInjuryIndividualHealth', 'preInjuryFamilyHealth',
      'preInjuryRetirementPlan', 'preInjuryInvestmentPlan', 'preInjuryBonus',
      'preInjuryStockOptions', 'preInjuryOtherBenefits', 'preInjuryRetirementAge',
      'retirementAge', 'preInjuryCareerTrajectory', 'careerTrajectory', 'preInjuryJobExpenses',
      'jobExpenses', 'disabilityRating',
      'postInjuryJobTitle', 'postInjuryEmployer', 'postInjuryStartDate', 'postInjurySalary',
      'postInjuryDuties', 'postInjuryAdvancements', 'postInjuryOvertime', 'postInjuryWorkSteady',
      'postInjuryLifeInsurance', 'postInjuryIndividualHealth', 'postInjuryFamilyHealth',
      'postInjuryRetirementPlan', 'postInjuryInvestmentPlan', 'postInjuryBonus',
      'postInjuryStockOptions', 'postInjuryOtherBenefits', 'postInjuryRetirementAge',
      'postRetirementAge', 'postInjuryJobExpenses', 'postJobExpenses', 'additionalInfo', 'matterNo', 'defendant', 'settlementDate', 'trialDate',
      'trialLocation', 'opposingCounselFirm', 'opposingEconomist'
    ]

    textFields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement
      if (field && personalInjuryDummyData[fieldName as keyof typeof personalInjuryDummyData]) {
        field.value = personalInjuryDummyData[fieldName as keyof typeof personalInjuryDummyData] as string
      }
    })

    // Populate select fields (dropdowns) - need to trigger change events for React
    const selectFields = [
      { name: 'phoneType', value: personalInjuryDummyData.phoneType },
      { name: 'gender', value: personalInjuryDummyData.gender },
      { name: 'maritalStatus', value: personalInjuryDummyData.maritalStatus },
      { name: 'ethnicity', value: personalInjuryDummyData.ethnicity },
      { name: 'preInjuryEducation', value: personalInjuryDummyData.preInjuryEducation },
      { name: 'preInjuryEmploymentStatus', value: personalInjuryDummyData.preInjuryEmploymentStatus },
      { name: 'postInjuryEmploymentStatus', value: personalInjuryDummyData.postInjuryEmploymentStatus },
      { name: 'dependentCare', value: personalInjuryDummyData.dependentCare },
      { name: 'petCare', value: personalInjuryDummyData.petCare },
      { name: 'indoorHousework', value: personalInjuryDummyData.indoorHousework },
      { name: 'mealPrep', value: personalInjuryDummyData.mealPrep },
      { name: 'homeMaintenance', value: personalInjuryDummyData.homeMaintenance },
      { name: 'vehicleMaintenance', value: personalInjuryDummyData.vehicleMaintenance },
      { name: 'errands', value: personalInjuryDummyData.errands }
    ]

    selectFields.forEach(({ name, value }) => {
      const select = form.querySelector(`[name="${name}"]`) as HTMLSelectElement
      if (select && value) {
        select.value = value
        // Trigger change event for React components
        const event = new Event('change', { bubbles: true })
        select.dispatchEvent(event)
      }
    })

    // Populate dynamic arrays
    setHouseholdMembers(personalInjuryDummyData.householdMembers)
    setPreInjuryYears(personalInjuryDummyData.preInjuryYears)
    setPostInjuryYears(personalInjuryDummyData.postInjuryYears)

    toast.success('Demo data loaded successfully!')
  }

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Shift + Cmd + D (or Shift + Ctrl + D on Windows)
      if (event.shiftKey && (event.metaKey || event.ctrlKey) && event.key === 'd') {
        event.preventDefault()
        populateDemoData()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [userProfile])

  // Check authentication
  if (loading) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      // Add household members data
      formData.append('householdMembers', JSON.stringify(householdMembers))
      
      // Add employment years data
      formData.append('preInjuryYears', JSON.stringify(preInjuryYears))
      formData.append('postInjuryYears', JSON.stringify(postInjuryYears))
      
      // Add uploaded files data
      formData.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await submitPersonalInjuryForm(formData)
      
      if (result.success) {
        toast.success('Form submitted successfully!')
        setHasBeenSaved(true)
        const redirectUrl = await getFirmFormsUrl()
        router.push(redirectUrl)
      } else {
        toast.error('Failed to submit form')
      }
      
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    
    try {
      const form = document.querySelector('form') as HTMLFormElement
      const formData = new FormData(form)
      
      // Add additional data
      formData.append('householdMembers', JSON.stringify(householdMembers))
      formData.append('preInjuryYears', JSON.stringify(preInjuryYears))
      formData.append('postInjuryYears', JSON.stringify(postInjuryYears))
      formData.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await saveDraftPersonalInjuryForm(formData)
      
      if (result.success) {
        toast.success('Draft saved successfully!')
        setHasBeenSaved(true)
      } else {
        toast.error('Failed to save draft')
      }
      
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft. Please try again.')
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleCancelClick = () => {
    if (!hasBeenSaved) {
      // Show cancel dialog for unsaved forms
      setIsCancelDialogOpen(true)
    } else {
      // For saved forms, show delete dialog
      const lastName = getCurrentLastName()
      if (!lastName) {
        toast.error('Please enter a Last Name in the Contact section before deleting.')
        return
      }
      
      // In a real implementation, this would get the actual form ID
      setCurrentFormId('existing-form-id')
      setIsDeleteDialogOpen(true)
    }
  }

  const handleEraseForm = () => {
    // Clear all form data
    const form = document.querySelector('form') as HTMLFormElement
    if (form) {
      form.reset()
    }
    
    // Reset all state
    setHouseholdMembers([{ id: '1', fullName: '', dateOfBirth: '', relationship: '' }])
    setPreInjuryYears([{ id: '1', year: '', income: '', percentEmployed: '' }])
    setPostInjuryYears([{ id: '1', year: '', income: '', percentEmployed: '' }])
    setUploadedFiles([])
    setHasBeenSaved(false)
    
    // Close dialog
    setIsCancelDialogOpen(false)
    
    toast.success('Form data has been cleared.')
  }

  const handleDeleteConfirm = async (lastNameConfirmation: string) => {
    if (!currentFormId) return
    
    setIsDeleting(true)
    try {
      const result = await deletePersonalInjuryForm(currentFormId, lastNameConfirmation)
      
      if (result.success) {
        toast.success('Form deleted successfully!')
        router.push('/forms')
      } else {
        throw new Error(result.error || 'Failed to delete form')
      }
    } catch (error) {
      toast.error('Failed to delete form. Please try again.')
      throw error
    } finally {
      setIsDeleting(false)
    }
  }

  const formActions = (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleCancelClick} 
              disabled={isSubmitting || isSavingDraft || isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2"
              size="sm"
            >
              {hasBeenSaved ? 'Delete' : 'Cancel'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{hasBeenSaved ? 'Delete this saved form permanently' : 'Clear all form data without saving'}</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveDraft} 
              disabled={isSavingDraft || isSubmitting || isDeleting}
              className="text-sm px-3 py-2"
              size="sm"
            >
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save your progress and continue later</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="submit" 
              disabled={isSubmitting || isSavingDraft || isDeleting}
              className="text-sm px-3 py-2"
              size="sm"
              form="personal-injury-form"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Submit completed form for review</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )

  return (
    <>
      <Header formActions={formActions} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title (H1) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Personal Injury Form</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              Please tell us more about your pending personal injury case. You may save a draft and come back to it later. 
              To submit your form, all fields must be completed. NOTE: Most fields are required. If a required field is not 
              applicable to the plaintiff, please enter &quot;N/A&quot;.
            </p>
            <p className="text-sm text-blue-800">
              Once the form has been successfully submitted, The Bradley Group will be notified and a copy of the completed 
              form will be sent to you and the site admin for your firm. The timestamp of the submitted form marks the 
              beginning of any tolling period for time-sensitive actions.
            </p>
          </div>
        </div>

        <form id="personal-injury-form" onSubmit={handleSubmit} className="space-y-8">
          <PiContact />
          
          <PiDemographics />
          
          <PiHousehold 
            householdMembers={householdMembers}
            setHouseholdMembers={setHouseholdMembers}
          />
          
          <PiMedical 
            uploadedFiles={uploadedFiles}
            handleFileUpload={handleFileUpload}
            removeFile={removeFile}
            uploading={uploading}
          />
          
          <PiEducation />
          
          <PiEmployment 
            preInjuryYears={preInjuryYears}
            setPreInjuryYears={setPreInjuryYears}
            postInjuryYears={postInjuryYears}
            setPostInjuryYears={setPostInjuryYears}
            uploadedFiles={uploadedFiles}
            handleFileUpload={handleFileUpload}
            removeFile={removeFile}
            uploading={uploading}
          />
          
          <PiHouseholdServices />
          
          <PiOther />
          
          <PiLitigation />
        </form>

        <CancelFormDialog
          isOpen={isCancelDialogOpen}
          onClose={() => setIsCancelDialogOpen(false)}
          onEraseForm={handleEraseForm}
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          expectedLastName={getCurrentLastName()}
          isDeleting={isDeleting}
        />
      </div>
    </>
  )
}