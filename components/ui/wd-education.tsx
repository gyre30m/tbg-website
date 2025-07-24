'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Plus } from 'lucide-react'
import { FileUploadArea } from '@/components/ui/file-upload-area'

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

interface WdEducationProps {
  employmentYears: EmploymentYear[]
  setEmploymentYears: (years: EmploymentYear[]) => void
  uploadedFiles: UploadedFile[]
  handleFileUpload: (files: FileList, category: string) => Promise<void>
  removeFile: (fileId: string) => void
  uploading: boolean
}

export function WdEducation({ 
  employmentYears, 
  setEmploymentYears, 
  uploadedFiles, 
  handleFileUpload, 
  removeFile, 
  uploading 
}: WdEducationProps) {
  const addEmploymentYear = () => {
    setEmploymentYears([...employmentYears, {
      id: Date.now().toString(),
      year: '',
      income: '',
      percentEmployed: ''
    }])
  }

  const removeEmploymentYear = (id: string) => {
    setEmploymentYears(employmentYears.filter(year => year.id !== id))
  }

  const updateEmploymentYear = (id: string, field: keyof EmploymentYear, value: string) => {
    setEmploymentYears(employmentYears.map(year =>
      year.id === id ? { ...year, [field]: value } : year
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="educationLevel">Highest level of education completed*</Label>
          <Input id="educationLevel" name="educationLevel" required />
        </div>
        
        <div>
          <Label htmlFor="skillsLicenses">List any licenses, training, or special skills held by the decedent (enter &quot;N/A&quot; if not applicable)*</Label>
          <Input id="skillsLicenses" name="skillsLicenses" required />
        </div>
        
        <div>
          <Label htmlFor="employmentStatus">Employment status at the time of the incident*</Label>
          <Select name="employmentStatus" required>
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="self-employed">Self-employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="jobTitle">Job title or position*</Label>
            <Input id="jobTitle" name="jobTitle" required />
          </div>
          <div>
            <Label htmlFor="employerName">Employer Name*</Label>
            <Input id="employerName" name="employerName" required />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start date*</Label>
            <Input id="startDate" name="startDate" type="date" required />
          </div>
          <div>
            <Label htmlFor="salary">Hourly wage or annual salary*</Label>
            <Input id="salary" name="salary" required />
          </div>
        </div>
        
        <div>
          <Label htmlFor="workDuties">Brief description of work duties and responsibilities at date of death*</Label>
          <Textarea id="workDuties" name="workDuties" required rows={3} />
        </div>
        
        <div>
          <Label htmlFor="advancements">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates)*</Label>
          <Textarea id="advancements" name="advancements" required rows={3} />
        </div>
        
        <div>
          <Label htmlFor="overtime">Please describe any overtime work, including wages and frequency*</Label>
          <Textarea id="overtime" name="overtime" required rows={3} />
        </div>
        
        <div>
          <Label htmlFor="workSteady">Was work steady?*</Label>
          <Input id="workSteady" name="workSteady" required />
        </div>

        {/* Annual wages table */}
        <div>
          <Label className="text-base font-medium">Annual wages and salary received*</Label>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>% of Year Employed</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employmentYears.map((year) => (
                <TableRow key={year.id}>
                  <TableCell>
                    <Input
                      value={year.year}
                      onChange={(e) => updateEmploymentYear(year.id, 'year', e.target.value)}
                      placeholder="Year"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={year.income}
                      onChange={(e) => updateEmploymentYear(year.id, 'income', e.target.value)}
                      placeholder="Income"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={year.percentEmployed}
                      onChange={(e) => updateEmploymentYear(year.id, 'percentEmployed', e.target.value)}
                      placeholder="% Employed"
                    />
                  </TableCell>
                  <TableCell>
                    {employmentYears.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmploymentYear(year.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button type="button" variant="outline" className="mt-2" onClick={addEmploymentYear}>
            <Plus className="h-4 w-4 mr-2" />
            Add Year
          </Button>
        </div>

        {/* Wage documentation upload */}
        <div>
          <Label className="text-base font-medium mb-2 block">Upload documentation supporting wages and salary received.*</Label>
          <FileUploadArea
            category="wage-documentation"
            label="Wage Documentation"
            acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            uploadedFiles={uploadedFiles}
            onFilesUpload={handleFileUpload}
            onRemoveFile={removeFile}
            uploading={uploading}
          />
        </div>

        {/* Benefits section */}
        <div>
          <Label className="text-base font-medium">Benefits*</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Please describe all benefits provided by the employer, or to which the employer contributed.
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lifeInsurance">Life Insurance:</Label>
              <Input id="lifeInsurance" name="lifeInsurance" />
            </div>
            <div>
              <Label htmlFor="individualHealth">Individual Health Insurance:</Label>
              <Input id="individualHealth" name="individualHealth" />
            </div>
            <div>
              <Label htmlFor="familyHealth">Family Health Insurance:</Label>
              <Input id="familyHealth" name="familyHealth" />
            </div>
            <div>
              <Label htmlFor="retirementPlan">Retirement Plan:</Label>
              <Input id="retirementPlan" name="retirementPlan" />
            </div>
            <div>
              <Label htmlFor="investmentPlan">Investment Plan:</Label>
              <Input id="investmentPlan" name="investmentPlan" />
            </div>
            <div>
              <Label htmlFor="bonus">Bonus:</Label>
              <Input id="bonus" name="bonus" />
            </div>
            <div>
              <Label htmlFor="stockOptions">Stock Options:</Label>
              <Input id="stockOptions" name="stockOptions" />
            </div>
            <div>
              <Label htmlFor="otherBenefits">Other:</Label>
              <Input id="otherBenefits" name="otherBenefits" />
            </div>
          </div>
        </div>

        {/* Benefit plans upload */}
        <div>
          <Label className="text-base font-medium mb-2 block">Please attach copies of any I.R.A., 401K, Profit Sharing, or other benefit plans.</Label>
          <FileUploadArea
            category="benefit-plans"
            label="Benefit Plans"
            acceptedTypes=".pdf,.doc,.docx"
            uploadedFiles={uploadedFiles}
            onFilesUpload={handleFileUpload}
            onRemoveFile={removeFile}
            uploading={uploading}
          />
        </div>

        <div>
          <Label htmlFor="retirementAge">At what age was the decedent planning to retire?*</Label>
          <Input id="retirementAge" name="retirementAge" required />
        </div>

        <div>
          <Label htmlFor="careerTrajectory">What were the decedent&apos;s career trajectory expectations (promotions, pay raises, etc.)?*</Label>
          <Textarea id="careerTrajectory" name="careerTrajectory" required rows={3} />
        </div>

        <div>
          <Label htmlFor="jobExpenses">List any out-of-the-ordinary expenses associated with this job*</Label>
          <Textarea id="jobExpenses" name="jobExpenses" required rows={3} />
        </div>
      </CardContent>
    </Card>
  )
}