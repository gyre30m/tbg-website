'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { useDocumentUpload } from '@/hooks/useDocumentUpload'
import { submitWrongfulDeathForm, saveDraftWrongfulDeathForm } from '@/lib/actions'
import { toast } from 'sonner'
import { WdContact } from '@/components/ui/wd-contact'
import { WdDemographics } from '@/components/ui/wd-demographics'
import { WdDependents } from '@/components/ui/wd-dependents'
import { WdMedical } from '@/components/ui/wd-medical'
import { WdEducation } from '@/components/ui/wd-education'
import { WdEmployment } from '@/components/ui/wd-employment'
import { WdHouseholdServices } from '@/components/ui/wd-household-services'
import { WdOther } from '@/components/ui/wd-other'
import { WdLitigation } from '@/components/ui/wd-litigation'
import { wrongfulDeathDummyData } from '@/lib/wrongful-death-dummy-data'

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
  category: string
}

export default function WrongfulDeathForm() {
  const { user, loading, userProfile } = useAuth()
  const router = useRouter()
  const { uploadMultipleDocuments, uploading } = useDocumentUpload()
  
  const [householdDependents, setHouseholdDependents] = useState<Dependent[]>([
    { id: '1', fullName: '', dateOfBirth: '', relationship: '' }
  ])
  
  const [otherDependents, setOtherDependents] = useState<Dependent[]>([
    { id: '1', fullName: '', dateOfBirth: '', relationship: '' }
  ])
  
  const [employmentYears, setEmploymentYears] = useState<EmploymentYear[]>([
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
      'dateOfBirth', 'dateOfDeath', 'healthIssues', 'workMissed', 
      'educationLevel', 'skillsLicenses', 'educationPlans', 'parentEducation',
      'employmentStatus', 'jobTitle', 'employerName', 'startDate', 'salary', 
      'workDuties', 'advancements', 'overtime', 'workSteady', 'lifeInsurance', 
      'individualHealth', 'familyHealth', 'retirementPlan', 'investmentPlan', 
      'bonus', 'stockOptions', 'otherBenefits', 'retirementAge', 'careerTrajectory', 
      'jobExpenses', 'additionalInfo', 'settlementDate', 'trialDate',
      'trialLocation', 'opposingCounselFirm', 'opposingEconomist'
    ]

    textFields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement
      if (field && wrongfulDeathDummyData[fieldName as keyof typeof wrongfulDeathDummyData]) {
        field.value = wrongfulDeathDummyData[fieldName as keyof typeof wrongfulDeathDummyData] as string
      }
    })

    // Populate select fields (dropdowns) - need to trigger change events for React
    const selectFields = [
      { name: 'gender', value: wrongfulDeathDummyData.gender },
      { name: 'maritalStatus', value: wrongfulDeathDummyData.maritalStatus },
      { name: 'ethnicity', value: wrongfulDeathDummyData.ethnicity },
      { name: 'dependentCare', value: wrongfulDeathDummyData.dependentCare },
      { name: 'petCare', value: wrongfulDeathDummyData.petCare },
      { name: 'indoorHousework', value: wrongfulDeathDummyData.indoorHousework },
      { name: 'mealPrep', value: wrongfulDeathDummyData.mealPrep },
      { name: 'homeMaintenance', value: wrongfulDeathDummyData.homeMaintenance },
      { name: 'vehicleMaintenance', value: wrongfulDeathDummyData.vehicleMaintenance },
      { name: 'errands', value: wrongfulDeathDummyData.errands }
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
    setHouseholdDependents(wrongfulDeathDummyData.householdDependents)
    setOtherDependents(wrongfulDeathDummyData.otherDependents)
    setEmploymentYears(wrongfulDeathDummyData.employmentYears)

    toast.success('Demo data loaded successfully!')
  }

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Shift + Cmd + D (or Shift + Ctrl + D on Windows)
      if (event.shiftKey && (event.metaKey || event.ctrlKey) && event.key === 'd') {
        event.preventDefault()
        
        // Check if user is site admin
        if (userProfile?.role === 'site_admin') {
          populateDemoData()
        } else {
          toast.error('Demo data is only available for site administrators')
        }
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
      
      // Add dependent data
      formData.append('householdDependents', JSON.stringify(householdDependents))
      formData.append('otherDependents', JSON.stringify(otherDependents))
      
      // Add employment years data
      formData.append('employmentYears', JSON.stringify(employmentYears))
      
      // Add uploaded files data
      formData.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await submitWrongfulDeathForm(formData)
      
      if (result.success) {
        toast.success('Form submitted successfully!')
        router.push('/forms?submitted=true')
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
      formData.append('householdDependents', JSON.stringify(householdDependents))
      formData.append('otherDependents', JSON.stringify(otherDependents))
      formData.append('employmentYears', JSON.stringify(employmentYears))
      formData.append('uploadedFiles', JSON.stringify(uploadedFiles))
      
      const result = await saveDraftWrongfulDeathForm(formData)
      
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
        form="wrongful-death-form"
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
          <h1 className="text-3xl font-bold tracking-tight mb-4">Wrongful Death Form</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              Please tell us more about your pending wrongful death action. You may save a draft and come back to it later. 
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

        <form id="wrongful-death-form" onSubmit={handleSubmit} className="space-y-8">
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
          
          <WdEmployment 
            employmentYears={employmentYears}
            setEmploymentYears={setEmploymentYears}
            uploadedFiles={uploadedFiles}
            handleFileUpload={handleFileUpload}
            removeFile={removeFile}
            uploading={uploading}
          />
          
          <WdHouseholdServices />
          
          <WdOther />
          
          <WdLitigation />
        </form>
      </div>
    </>
  )
}