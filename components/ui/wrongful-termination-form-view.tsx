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

interface WrongfulTerminationFormData {
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
  phone_number: string | null
  phone_type: string | null
  
  // Demographics
  gender: string | null
  marital_status: string | null
  ethnicity: string | null
  date_of_birth: string | null
  date_of_termination: string | null
  
  // Education
  pre_termination_education: string | null
  pre_termination_skills: string | null
  pre_termination_education_plans: string | null
  post_termination_education: string | null
  
  // Pre-Termination Employment
  pre_termination_employment_status: string | null
  pre_termination_job_title: string | null
  pre_termination_employer: string | null
  pre_termination_start_date: string | null
  pre_termination_salary: string | null
  pre_termination_duties: string | null
  pre_termination_advancements: string | null
  pre_termination_overtime: string | null
  pre_termination_work_steady: string | null
  pre_termination_life_insurance: string | null
  pre_termination_individual_health: string | null
  pre_termination_family_health: string | null
  pre_termination_retirement_plan: string | null
  pre_termination_investment_plan: string | null
  pre_termination_bonus: string | null
  pre_termination_stock_options: string | null
  pre_termination_other_benefits: string | null
  pre_termination_retirement_age: string | null
  pre_termination_career_trajectory: string | null
  pre_termination_job_expenses: string | null
  
  // Post-Termination Employment
  post_termination_employment_status: string | null
  post_termination_job_title: string | null
  post_termination_employer: string | null
  post_termination_start_date: string | null
  post_termination_salary: string | null
  post_termination_duties: string | null
  post_termination_advancements: string | null
  post_termination_overtime: string | null
  post_termination_work_steady: string | null
  post_termination_life_insurance: string | null
  post_termination_individual_health: string | null
  post_termination_family_health: string | null
  post_termination_retirement_plan: string | null
  post_termination_investment_plan: string | null
  post_termination_bonus: string | null
  post_termination_stock_options: string | null
  post_termination_other_benefits: string | null
  post_termination_retirement_age: string | null
  post_termination_job_expenses: string | null
  
  // Other and litigation fields
  additional_info: string | null
  matter_no: string | null
  settlement_date: string | null
  trial_date: string | null
  trial_location: string | null
  opposing_counsel_firm: string | null
  opposing_economist: string | null
  
  // Complex data
  pre_termination_years: EmploymentYear[]
  post_termination_years: EmploymentYear[]
  uploaded_files: UploadedFile[]
  
  // User profile info
  user_profiles?: {
    first_name: string
    last_name: string
  }
  
  // Index signature for dynamic property access
  [key: string]: string | number | boolean | null | EmploymentYear[] | UploadedFile[] | { first_name: string; last_name: string } | undefined
}

interface WrongfulTerminationFormViewProps {
  formData: WrongfulTerminationFormData
  onEdit?: () => void
  canEdit?: boolean
}

export type { WrongfulTerminationFormData }

export function WrongfulTerminationFormView({ 
  formData, 
  onEdit, 
  canEdit = false 
}: WrongfulTerminationFormViewProps) {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not provided'
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

  const getValue = (value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined || value === '') return 'Not provided'
    return String(value)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wrongful Termination Form</h1>
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
                <strong>Plaintiff:</strong> {getValue(formData.first_name)} {getValue(formData.last_name)}
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
          <p className="text-sm text-muted-foreground">Please provide the plaintiff&apos;s contact information.</p>
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
              <label className="text-sm font-medium text-gray-700">Email Address*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.email)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.phone_number)}
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
              <label className="text-sm font-medium text-gray-700">Date of Birth*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {formatDate(formData.date_of_birth)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date of Termination*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {formatDate(formData.date_of_termination)}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Ethnicity*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.ethnicity)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Education */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pre-Termination</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Highest level of education completed prior to termination*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_termination_education)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">List any licenses, training, or special skills held by the plaintiff at the time of the termination (enter &quot;N/A&quot; if not applicable)*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_termination_skills)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Detail any plans the plaintiff had to attain further educational degrees, licenses, or training at the time of the termination (enter &quot;N/A&quot; if not applicable)*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_termination_education_plans)}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Post-Termination</h3>
            <div>
              <label className="text-sm font-medium text-gray-700">Detail any education, training, or special skills the plaintiff has acquired since the date of termination, including the length and costs of all programs (enter &quot;N/A&quot; if not applicable)*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                {getValue(formData.post_termination_education)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Employment */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Employment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pre-Termination Employment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employment status at the time of the incident*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_termination_employment_status)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Job title or position*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.pre_termination_job_title)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Employer Name*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.pre_termination_employer)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Start date*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {formatDate(formData.pre_termination_start_date)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hourly wage or annual salary*</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.pre_termination_salary)}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Brief description of work duties and responsibilities at date of termination*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_termination_duties)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates)*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_termination_advancements)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Please describe any overtime work, including wages and frequency*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_termination_overtime)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Was work steady?*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_termination_work_steady)}
                </div>
              </div>

              {/* Pre-termination employment years table */}
              {formData.pre_termination_years && formData.pre_termination_years.length > 0 && (
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
                        {formData.pre_termination_years.map((year, index) => (
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
                  Please describe all benefits provided by the employer, or to which the employer contributed prior to the termination.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Life Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_termination_life_insurance)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Individual Health Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_termination_individual_health)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Family Health Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_termination_family_health)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Retirement Plan:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_termination_retirement_plan)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Investment Plan:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_termination_investment_plan)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Bonus:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_termination_bonus)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Stock Options:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_termination_stock_options)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Other:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.pre_termination_other_benefits)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Prior to termination, at what age was the plaintiff planning to retire?*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.pre_termination_retirement_age)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">What were the plaintiff&apos;s career trajectory expectations prior to termination (promotions, pay raises, etc.)?*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_termination_career_trajectory)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">List any out-of-the-ordinary expenses associated with this job*</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.pre_termination_job_expenses)}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Post-Termination Employment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If the plaintiff has not been employed since the date of termination, please continue to the next section.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Current employment status</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.post_termination_employment_status)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Job title or position</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.post_termination_job_title)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Employer Name</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.post_termination_employer)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Start date</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {formatDate(formData.post_termination_start_date)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hourly wage or annual salary</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                    {getValue(formData.post_termination_salary)}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Brief description of work duties and responsibilities.</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.post_termination_duties)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates).</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.post_termination_advancements)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Please describe any overtime work, including wages and frequency.</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.post_termination_overtime)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Is work steady?</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.post_termination_work_steady)}
                </div>
              </div>

              {/* Post-termination employment years table */}
              {formData.post_termination_years && formData.post_termination_years.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Annual wages and salary received</label>
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
                        {formData.post_termination_years.map((year, index) => (
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
                <label className="text-sm font-medium text-gray-700">Benefits</label>
                <p className="text-xs text-gray-500 mb-3">
                  Please describe all benefits provided by the employer, or to which the employer contributes.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Life Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_termination_life_insurance)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Individual Health Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_termination_individual_health)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Family Health Insurance:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_termination_family_health)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Retirement Plan:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_termination_retirement_plan)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Investment Plan:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_termination_investment_plan)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Bonus:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_termination_bonus)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Stock Options:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_termination_stock_options)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Other:</label>
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                      {getValue(formData.post_termination_other_benefits)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Given the termination, at what age is the plaintiff planning to retire?</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                  {getValue(formData.post_termination_retirement_age)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">List any out-of-the-ordinary expenses associated with this job.</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
                  {getValue(formData.post_termination_job_expenses)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Other */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Other</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium text-gray-700">Please provide any additional pertinent information which may have some bearing on past or future income or expenses.*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[120px] whitespace-pre-wrap">
              {getValue(formData.additional_info)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Litigation */}
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