'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Eye, Clock, User } from 'lucide-react'
import { DocumentViewer } from '@/components/ui/document-viewer'

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

interface PersonalInjuryFormData {
  id: string
  version: number
  status: 'submitted' | 'draft'
  created_at: string
  updated_at: string
  submitted_by: string
  
  // Contact Information
  first_name: string | null
  last_name: string | null
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  email: string | null
  phone: string | null
  phone_type: string | null
  
  // Demographics
  gender: string | null
  marital_status: string | null
  ethnicity: string | null
  date_of_birth: string | null
  
  // Medical Information
  incident_date: string | null
  injury_description: string | null
  caregiver_claim: string | null
  life_expectancy: string | null
  future_medical: string | null
  
  // Education
  pre_injury_education: string | null
  pre_injury_skills: string | null
  education_plans: string | null
  parent_education: string | null
  post_injury_education: string | null
  
  // Employment and other fields...
  [key: string]: string | number | boolean | null | HouseholdMember[] | EmploymentYear[] | UploadedFile[] | { first_name: string; last_name: string } | undefined
  
  // Complex data
  household_members: HouseholdMember[]
  pre_injury_years: EmploymentYear[]
  post_injury_years: EmploymentYear[]
  uploaded_files: UploadedFile[]
  
  // User profile info
  user_profiles?: {
    first_name: string
    last_name: string
  }
}

interface PersonalInjuryFormViewProps {
  formData: PersonalInjuryFormData
  onEdit?: () => void
  canEdit?: boolean
}

export type { PersonalInjuryFormData }

export function PersonalInjuryFormView({ 
  formData, 
  onEdit, 
  canEdit = false 
}: PersonalInjuryFormViewProps) {
  const formatDate = (dateString: string | null | undefined | HouseholdMember[] | EmploymentYear[] | UploadedFile[] | { first_name: string; last_name: string } | number | boolean): string => {
    if (!dateString || typeof dateString !== 'string') return 'Not provided'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getValue = (value: string | number | boolean | null | undefined | HouseholdMember[] | EmploymentYear[] | UploadedFile[] | { first_name: string; last_name: string }): string => {
    if (value === null || value === undefined || value === '') return 'Not provided'
    if (Array.isArray(value) || typeof value === 'object') return 'Complex data'
    return String(value)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personal Injury Form</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={formData.status === 'submitted' ? 'default' : 'secondary'}>
                <Eye className="w-3 h-3 mr-1" />
                {formData.status === 'submitted' ? 'Submitted' : 'Draft'}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                Last updated: {formatDateTime(formData.updated_at)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-1" />
                Version {formData.version}
              </div>
            </div>
          </div>
          {canEdit && onEdit && (
            <Button onClick={onEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Form
            </Button>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-blue-800 mb-1">
                <strong>Client:</strong> {getValue(formData.first_name)} {getValue(formData.last_name)}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Submission Date:</strong> {formatDateTime(formData.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Contact */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.first_name)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Name*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.last_name)}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address 1*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.address1)}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address 2</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.address2)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">City*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.city)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.state)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Zip Code*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.zip_code)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.email)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.phone)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Type*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.phone_type)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Demographics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Gender*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.gender)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Marital Status*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.marital_status)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ethnicity*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.ethnicity)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date of Birth*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {formatDate(formData.date_of_birth)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Household Members */}
      {formData.household_members && formData.household_members.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Household</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Relationship</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.household_members.map((member, index) => (
                    <TableRow key={member.id || index}>
                      <TableCell className="font-medium">
                        {getValue(member.fullName)}
                      </TableCell>
                      <TableCell>
                        {formatDate(member.dateOfBirth)}
                      </TableCell>
                      <TableCell>
                        {getValue(member.relationship)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Medical */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Medical</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Current</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Date of Incident*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {formatDate(formData.incident_date)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Describe the nature of the injury and limitations*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.injury_description)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">If another party is making a claim for lost earnings due to time spent caring for the plaintiff, please provide details*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.caregiver_claim)}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Future</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">If medical evidence indicates plaintiff&apos;s life expectancy has been reduced to this injury, provide details.*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.life_expectancy)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Detail future medical expenses including current cost and number of years they will be incurred. Consider nursing home care, in-home nursing care, physician care, drugs, medical appliances, physical therapy, psychiatric therapy, and surgery. If a Life Care Planner is preparing a report, please reference that here, and attach it below when available.*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[150px] whitespace-pre-wrap">
                  {getValue(formData.future_medical)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Education */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pre-Injury</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Highest level of education completed prior to injury*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_injury_education)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">List any licenses, training, or special skills held by the injured party at the time of the incident (enter &quot;N/A&quot; if not applicable)*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_injury_skills)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Detail any plans the injured party had to attain further educational degrees, licenses, or training at the time of the incident (enter &quot;N/A&quot; if not applicable)*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.education_plans)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">If the plaintiff was a minor or had yet to finish formal education at the time of the injury, list the education levels and occupations of the plaintiff&apos;s parents.*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.parent_education)}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Post-Injury</h3>
            <div>
              <label className="text-sm font-medium text-gray-700">Detail any education, training, or special skills the plaintiff has acquired since the date of the injury, including the length and costs of all programs (enter &quot;N/A&quot; if not applicable).*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                {getValue(formData.post_injury_education)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Employment */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Employment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pre-Injury Employment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employment status at the time of the incident*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_injury_employment_status)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Job title or position*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.pre_injury_job_title)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Employer Name*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.pre_injury_employer)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Start date*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {formatDate(formData.pre_injury_start_date)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hourly wage or annual salary*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.pre_injury_salary)}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Brief description of work duties and responsibilities at date of injury*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_injury_duties)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates)*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_injury_advancements)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Please describe any overtime work, including wages and frequency*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_injury_overtime)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Was work steady*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_injury_work_steady)}
                </div>
              </div>

              {/* Pre-injury employment years table */}
              {formData.pre_injury_years && formData.pre_injury_years.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Annual wages and salary received*</label>
                  <div className="rounded-md border mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>Income</TableHead>
                          <TableHead>% of Year Employed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.pre_injury_years.map((year, index) => (
                          <TableRow key={year.id || index}>
                            <TableCell className="font-medium">
                              {getValue(year.year)}
                            </TableCell>
                            <TableCell>
                              {getValue(year.income)}
                            </TableCell>
                            <TableCell>
                              {getValue(year.percentEmployed)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Benefits*</label>
                <p className="text-xs text-gray-500 mb-3">
                  Please describe all benefits provided by the employer, or to which the employer contributed prior to the injury.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Life Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_injury_life_insurance)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Individual Health Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_injury_individual_health)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Family Health Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_injury_family_health)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Retirement Plan:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_injury_retirement_plan)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Investment Plan:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_injury_investment_plan)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Bonus:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_injury_bonus)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Stock Options:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_injury_stock_options)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Other:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_injury_other_benefits)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Prior to the injury, at what age was the plaintiff planning to retire?*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_injury_retirement_age)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">What were the plaintiff&apos;s career trajectory expectations prior to injury (promotions, pay raises, etc.)?*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_injury_career_trajectory)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">List any out-of-the-ordinary expenses associated with this job*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_injury_job_expenses)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Has the plaintiff been declared unable to work, or has a disability rating been provided by a doctor or rehabilitation specialist?*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.disability_rating)}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Post-Injury Employment</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                If the plaintiff has not been employed since the date of the injury, please continue to the next section.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Current employment status*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.post_injury_employment_status)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Job title or position*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.post_injury_job_title)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Employer Name*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.post_injury_employer)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Start date*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {formatDate(formData.post_injury_start_date)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hourly wage or annual salary*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.post_injury_salary)}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Brief description of work duties and responsibilities*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.post_injury_duties)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates)*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.post_injury_advancements)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Please describe any overtime work, including wages and frequency*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.post_injury_overtime)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Is work steady*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.post_injury_work_steady)}
                </div>
              </div>

              {/* Post-injury employment years table */}
              {formData.post_injury_years && formData.post_injury_years.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Annual wages and salary received*</label>
                  <div className="rounded-md border mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>Income</TableHead>
                          <TableHead>% of Year Employed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.post_injury_years.map((year, index) => (
                          <TableRow key={year.id || index}>
                            <TableCell className="font-medium">
                              {getValue(year.year)}
                            </TableCell>
                            <TableCell>
                              {getValue(year.income)}
                            </TableCell>
                            <TableCell>
                              {getValue(year.percentEmployed)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Benefits*</label>
                <p className="text-xs text-gray-500 mb-3">
                  Please describe all benefits provided by the employer, or to which the employer contributed.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Life Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_injury_life_insurance)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Individual Health Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_injury_individual_health)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Family Health Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_injury_family_health)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Retirement Plan:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_injury_retirement_plan)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Investment Plan:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_injury_investment_plan)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Bonus:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_injury_bonus)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Stock Options:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_injury_stock_options)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Other:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_injury_other_benefits)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Given the injury, at what age is the plaintiff planning to retire?*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.post_injury_retirement_age)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">List any out-of-the-ordinary expenses associated with this job*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.post_injury_job_expenses)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Household Services */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Household Services</CardTitle>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              For each category of tasks below, please indicate the injured party&apos;s ability to complete the listed tasks using a scale of 0-5, as described below:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>0 - Injury has no impact on ability to complete task, or did not complete task prior to injury.</li>
              <li>1 - Injury has a minor impact on ability to complete task.</li>
              <li>2 - Injury has a moderate impact on ability to complete task.</li>
              <li>3 - Injury has a major impact on ability to complete task.</li>
              <li>4 - Injury has a severe impact on ability to complete task.</li>
              <li>5 - Injury completely prevents completion of these tasks.</li>
            </ul>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Care of Dependent Family Members</label>
            <p className="text-xs text-gray-500 mb-2">
              dressing, bathing, feeding, supervising, or transporting to and from events (includes children and adults)
            </p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.dependent_care)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Pet Care</label>
            <p className="text-xs text-gray-500 mb-2">
              feeding, grooming, walking, picking up after, or otherwise caring for household pets
            </p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.pet_care)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Indoor Housework</label>
            <p className="text-xs text-gray-500 mb-2">
              vacuuming, sweeping, mopping, dusting, making beds, emptying trash, washing clothes, ironing, folding and putting laundry away, putting groceries away
            </p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.indoor_housework)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Meal Preparation and Cleanup</label>
            <p className="text-xs text-gray-500 mb-2">
              food preparation, cooking, serving, setting & clearing a table, washing dishes, loading & unloading a dishwasher, cleaning the kitchen
            </p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.meal_prep)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Home/Yard Maintenance</label>
            <p className="text-xs text-gray-500 mb-2">
              painting, house repairs, gardening, mowing, trimming, edging, weeding
            </p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.home_maintenance)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Vehicle Maintenance</label>
            <p className="text-xs text-gray-500 mb-2">
              car washing, vacuuming, arranging appointments for maintenance & repair, taking vehicles to appointments
            </p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.vehicle_maintenance)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Errands</label>
            <p className="text-xs text-gray-500 mb-2">
              shopping for groceries and other household items, disposing of trash, yard waste, etc. and other travel to complete tasks not included in other categories
            </p>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.errands)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. Other */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Other</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium text-gray-700">Please provide any additional pertinent information which may have some bearing on past or future income or expenses.*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap mt-2">
              {getValue(formData.additional_info)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. Litigation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Litigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Matter No. (for law firm internal use only)</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.matter_no)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Defendant</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.defendant)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Date of Next Settlement Negotiation*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {formatDate(formData.settlement_date)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Date of Trial*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {formatDate(formData.trial_date)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Location of Trial*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.trial_location)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Name of firm of opposing counsel*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.opposing_counsel_firm)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Name and firm of opposing counsel&apos;s economist*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.opposing_economist)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files Section */}
      {formData.uploaded_files && formData.uploaded_files.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.uploaded_files.map((file, index) => (
                <div key={file.id || index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                    <p className="text-xs text-gray-500">
                      Category: {file.category} • Size: {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {file.fileUrl && (
                    <DocumentViewer 
                      fileName={file.fileName}
                      fileUrl={file.fileUrl}
                      storagePath={file.storagePath}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}