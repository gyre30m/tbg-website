'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { useDocumentUpload } from '@/hooks/useDocumentUpload'
import { submitWrongfulTerminationForm, saveDraftWrongfulTerminationForm } from '@/lib/actions'
import { createClient } from '@/lib/supabase/browser-client'
import { toast } from 'sonner'
import { WtContact } from '@/components/ui/wt-contact'
import { WtDemographics } from '@/components/ui/wt-demographics'
import { WtEducation } from '@/components/ui/wt-education'
import { WtEmployment } from '@/components/ui/wt-employment'
import { WtOther } from '@/components/ui/wt-other'
import { WtLitigation } from '@/components/ui/wt-litigation'
import { wrongfulTerminationDummyData } from '@/lib/wrongful-termination-dummy-data'

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
  category: string
}

export default function WrongfulTerminationForm() {
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
      
      // Try to fetch firm by id
      const { data: firmData, error: firmError } = await supabase
        .from('firms')
        .select('*')
        .eq('id', userProfile.firm_id)
        .single()

      if (firmError) {
        console.error('Error fetching firm:', firmError)
        return '/forms?submitted=true' // fallback
      }
      
      // Use slug if available, otherwise use name
      const firmIdentifier = firmData.slug || encodeURIComponent(firmData.name)
      return `/firms/${firmIdentifier}/forms?submitted=true`
    } catch (error) {
      console.error('Error getting firm forms URL:', error)
      return '/forms?submitted=true' // fallback
    }
  }
  
  const [preTerminationYears, setPreTerminationYears] = useState<EmploymentYear[]>([
    { id: '1', year: '', income: '', percentEmployed: '' }
  ])
  
  const [postTerminationYears, setPostTerminationYears] = useState<EmploymentYear[]>([
    { id: '1', year: '', income: '', percentEmployed: '' }
  ])
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  // Demo data population function
  const populateDemoData = () => {
    const form = document.querySelector('form') as HTMLFormElement
    if (!form) return

    // Populate simple form fields (input, textarea)
    const textFields = [
      'firstName', 'lastName', 'address1', 'address2', 'city', 'state', 'zipCode',
      'email', 'phoneNumber', 'dateOfBirth', 'dateOfTermination', 'preTerminationSkills',
      'preTerminationEducationPlans', 'postTerminationEducation', 'preTerminationJobTitle',
      'preTerminationEmployer', 'preTerminationStartDate', 'preTerminationSalary',
      'preTerminationDuties', 'preTerminationAdvancements', 'preTerminationOvertime',
      'preTerminationWorkSteady', 'preTerminationLifeInsurance', 'preTerminationIndividualHealth',
      'preTerminationFamilyHealth', 'preTerminationRetirementPlan', 'preTerminationInvestmentPlan',
      'preTerminationBonus', 'preTerminationStockOptions', 'preTerminationOtherBenefits',
      'preTerminationRetirementAge', 'preTerminationCareerTrajectory', 'preTerminationJobExpenses',
      'postTerminationJobTitle', 'postTerminationEmployer', 'postTerminationStartDate',
      'postTerminationSalary', 'postTerminationDuties', 'postTerminationAdvancements',
      'postTerminationOvertime', 'postTerminationWorkSteady', 'postTerminationLifeInsurance',
      'postTerminationIndividualHealth', 'postTerminationFamilyHealth', 'postTerminationRetirementPlan',
      'postTerminationInvestmentPlan', 'postTerminationBonus', 'postTerminationStockOptions',
      'postTerminationOtherBenefits', 'postTerminationRetirementAge', 'postTerminationJobExpenses',
      'additionalInfo', 'matterNo', 'defendant', 'settlementDate', 'trialDate', 'trialLocation',
      'opposingCounselFirm', 'opposingEconomist'
    ]

    textFields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement
      if (field && wrongfulTerminationDummyData[fieldName as keyof typeof wrongfulTerminationDummyData]) {
        field.value = wrongfulTerminationDummyData[fieldName as keyof typeof wrongfulTerminationDummyData] as string
      }
    })

    // Populate select fields (dropdowns) - need to trigger change events for React
    const selectFields = [
      { name: 'phoneType', value: wrongfulTerminationDummyData.phoneType },
      { name: 'gender', value: wrongfulTerminationDummyData.gender },
      { name: 'maritalStatus', value: wrongfulTerminationDummyData.maritalStatus },
      { name: 'ethnicity', value: wrongfulTerminationDummyData.ethnicity },
      { name: 'preTerminationEducation', value: wrongfulTerminationDummyData.preTerminationEducation },
      { name: 'preTerminationEmploymentStatus', value: wrongfulTerminationDummyData.preTerminationEmploymentStatus },
      { name: 'postTerminationEmploymentStatus', value: wrongfulTerminationDummyData.postTerminationEmploymentStatus }
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
    setPreTerminationYears(wrongfulTerminationDummyData.preTerminationYears)
    setPostTerminationYears(wrongfulTerminationDummyData.postTerminationYears)

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
      
      // Add employment years data
      formData.append('preTerminationYears', JSON.stringify(preTerminationYears))
      formData.append('postTerminationYears', JSON.stringify(postTerminationYears))
      
      // Add uploaded files data
      formData.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await submitWrongfulTerminationForm(formData)
      
      if (result.success) {
        toast.success('Form submitted successfully!')
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
      formData.append('preTerminationYears', JSON.stringify(preTerminationYears))
      formData.append('postTerminationYears', JSON.stringify(postTerminationYears))
      formData.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await saveDraftWrongfulTerminationForm(formData)
      
      if (result.success) {
        toast.success('Draft saved successfully!')
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

  const formActions = (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleSaveDraft} 
        disabled={isSavingDraft || isSubmitting}
        className="text-sm px-3 py-2"
        size="sm"
      >
        {isSavingDraft ? 'Saving...' : 'Save Draft'}
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || isSavingDraft}
        className="text-sm px-3 py-2"
        size="sm"
        form="wrongful-termination-form"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Form'}
      </Button>
    </div>
  )

  return (
    <>
      <Header formActions={formActions} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title (H1) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Wrongful Termination Form</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              Please tell us more about your pending wrongful termination action. You may save a draft and come back to it later. 
              To submit your form, all fields must be completed. NOTE: Most fields are required. If a required field is not 
              applicable, please enter &quot;N/A&quot;.
            </p>
            <p className="text-sm text-blue-800">
              Once the form has been successfully submitted, The Bradley Group will be notified and a copy of the completed 
              form will be sent to you and the site admin for your firm. The timestamp of the submitted form marks the 
              beginning of any tolling period for time-sensitive actions.
            </p>
          </div>
        </div>

        <form id="wrongful-termination-form" onSubmit={handleSubmit} className="space-y-8">
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
        </form>
      </div>
    </>
  )
}