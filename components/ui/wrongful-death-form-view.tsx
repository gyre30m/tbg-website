'use client'

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
import { Eye, Clock, User } from 'lucide-react'
import { DocumentViewer } from '@/components/ui/document-viewer'

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

interface WrongfulDeathFormData {
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
  
  // Demographics
  gender: string | null
  marital_status: string | null
  ethnicity: string | null
  date_of_birth: string | null
  date_of_death: string | null
  
  // Medical Information
  health_issues: string | null
  work_missed: string | null
  
  // Education
  education_level: string | null
  skills_licenses: string | null
  education_plans: string | null
  parent_education: string | null
  
  // Employment
  employment_status: string | null
  job_title: string | null
  employer_name: string | null
  start_date: string | null
  salary: string | null
  work_duties: string | null
  advancements: string | null
  overtime: string | null
  work_steady: string | null
  life_insurance: string | null
  individual_health: string | null
  family_health: string | null
  retirement_plan: string | null
  investment_plan: string | null
  bonus: string | null
  stock_options: string | null
  other_benefits: string | null
  retirement_age: string | null
  career_trajectory: string | null
  job_expenses: string | null
  
  // Household Services
  dependent_care: string | null
  pet_care: string | null
  indoor_housework: string | null
  meal_prep: string | null
  home_maintenance: string | null
  vehicle_maintenance: string | null
  errands: string | null
  
  // Other and litigation fields
  additional_info: string | null
  matter_no: string | null
  settlement_date: string | null
  trial_date: string | null
  trial_location: string | null
  opposing_counsel_firm: string | null
  opposing_economist: string | null
  
  // Complex data
  household_dependents: Dependent[]
  other_dependents: Dependent[]
  employment_years: EmploymentYear[]
  uploaded_files: UploadedFile[]
  
  // User profile info
  user_profiles?: {
    first_name: string
    last_name: string
  }
  
  // Index signature for dynamic property access
  [key: string]: string | number | boolean | null | Dependent[] | EmploymentYear[] | UploadedFile[] | { first_name: string; last_name: string } | undefined
}

interface WrongfulDeathFormViewProps {
  formData: WrongfulDeathFormData
}

export type { WrongfulDeathFormData }

export function WrongfulDeathFormView({ 
  formData
}: WrongfulDeathFormViewProps) {
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
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-center">Wrongful Death Form</h1>
          <div className="flex items-center justify-center gap-4 mt-2">
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
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-blue-800 mb-1">
                <strong>Decedent:</strong> {getValue(formData.first_name)} {getValue(formData.last_name)}
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
          <p className="text-sm text-muted-foreground">Please provide the decedent&apos;s most recent contact information.</p>
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
              <label className="text-sm font-medium text-gray-700">Date of Death*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {formatDate(formData.date_of_death)}
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

      {/* 3. Dependents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Dependents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Household Section */}
          {formData.household_dependents && formData.household_dependents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Household</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For each person living in the decedent&apos;s household at the time of death, please list the name, date of birth, and relationship to the decedent.
              </p>
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
                    {formData.household_dependents.map((dependent, index) => (
                      <TableRow key={dependent.id || index}>
                        <TableCell className="font-medium">
                          {getValue(dependent.fullName)}
                        </TableCell>
                        <TableCell>
                          {formatDate(dependent.dateOfBirth)}
                        </TableCell>
                        <TableCell>
                          {getValue(dependent.relationship)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Other Dependents Section */}
          {formData.other_dependents && formData.other_dependents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Other Dependents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For each person receiving assistance from the deceased but not living in the same household at the time of death, please list the name, date of birth, and relationship to the decedent.
              </p>
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
                    {formData.other_dependents.map((dependent, index) => (
                      <TableRow key={dependent.id || index}>
                        <TableCell className="font-medium">
                          {getValue(dependent.fullName)}
                        </TableCell>
                        <TableCell>
                          {formatDate(dependent.dateOfBirth)}
                        </TableCell>
                        <TableCell>
                          {getValue(dependent.relationship)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Medical */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Medical</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Describe decedent&apos;s health and any issues prior to death.*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
              {getValue(formData.health_issues)}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Describe any work missed due to health issues prior to death.*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
              {getValue(formData.work_missed)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Education */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Highest level of education completed*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.education_level)}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">List any licenses, training, or special skills held by the decedent (enter &quot;N/A&quot; if not applicable)*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.skills_licenses)}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Detail any plans the decedent had to attain further educational degrees, licenses, or training at the time of death (enter &quot;N/A&quot; if not applicable)*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.education_plans)}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">If the decedent was a minor or had yet to finish formal education at the time of the death, list the education levels and occupations of the decedent&apos;s parents.*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
              {getValue(formData.parent_education)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Employment */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Employment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Employment status at the time of death*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.employment_status)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Job title or position*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.job_title)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Employer Name*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.employer_name)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Start date*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {formatDate(formData.start_date)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Hourly wage or annual salary*</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
                {getValue(formData.salary)}
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Brief description of work duties and responsibilities at date of death*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
              {getValue(formData.work_duties)}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates)*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
              {getValue(formData.advancements)}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Please describe any overtime work, including wages and frequency*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
              {getValue(formData.overtime)}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Was work steady?*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.work_steady)}
            </div>
          </div>

          {/* Employment years table */}
          {formData.employment_years && formData.employment_years.length > 0 && (
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
                    {formData.employment_years.map((year, index) => (
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
                  {getValue(formData.life_insurance)}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Individual Health Insurance:</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                  {getValue(formData.individual_health)}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Family Health Insurance:</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                  {getValue(formData.family_health)}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Retirement Plan:</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                  {getValue(formData.retirement_plan)}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Investment Plan:</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                  {getValue(formData.investment_plan)}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Bonus:</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                  {getValue(formData.bonus)}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Stock Options:</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                  {getValue(formData.stock_options)}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Other:</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[35px]">
                  {getValue(formData.other_benefits)}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">At what age was the plaintiff planning to retire?*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[40px]">
              {getValue(formData.retirement_age)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">What were the plaintiff&apos;s career trajectory expectations prior to death (promotions, pay raises, etc.)?*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
              {getValue(formData.career_trajectory)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">List any out-of-the-ordinary expenses associated with this job*</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[100px] whitespace-pre-wrap">
              {getValue(formData.job_expenses)}
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
              For each category of tasks below, please indicate the decedent&apos;s ability to complete the listed tasks using a scale of 0-5, as described below:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>0 - Death has no impact on ability to complete task, or did not complete task prior to death.</li>
              <li>1 - Death has a minor impact on ability to complete task.</li>
              <li>2 - Death has a moderate impact on ability to complete task.</li>
              <li>3 - Death has a major impact on ability to complete task.</li>
              <li>4 - Death has a severe impact on ability to complete task.</li>
              <li>5 - Death completely prevents completion of these tasks.</li>
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
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm min-h-[150px] whitespace-pre-wrap">
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