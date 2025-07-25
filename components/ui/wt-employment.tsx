'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

interface WtEmploymentProps {
  preTerminationYears: EmploymentYear[]
  setPreTerminationYears: (years: EmploymentYear[]) => void
  postTerminationYears: EmploymentYear[]
  setPostTerminationYears: (years: EmploymentYear[]) => void
  uploadedFiles: UploadedFile[]
  handleFileUpload: (files: FileList, category: string) => Promise<void>
  removeFile: (fileId: string) => void
  uploading: boolean
}

export function WtEmployment({
  preTerminationYears,
  setPreTerminationYears,
  postTerminationYears,
  setPostTerminationYears,
  uploadedFiles,
  handleFileUpload,
  removeFile,
  uploading
}: WtEmploymentProps) {
  const addPreTerminationYear = () => {
    const newYear: EmploymentYear = {
      id: Date.now().toString(),
      year: '',
      income: '',
      percentEmployed: ''
    }
    setPreTerminationYears([...preTerminationYears, newYear])
  }

  const removePreTerminationYear = (id: string) => {
    if (preTerminationYears.length > 1) {
      setPreTerminationYears(preTerminationYears.filter(year => year.id !== id))
    }
  }

  const updatePreTerminationYear = (id: string, field: keyof EmploymentYear, value: string) => {
    setPreTerminationYears(preTerminationYears.map(year =>
      year.id === id ? { ...year, [field]: value } : year
    ))
  }

  const addPostTerminationYear = () => {
    const newYear: EmploymentYear = {
      id: Date.now().toString(),
      year: '',
      income: '',
      percentEmployed: ''
    }
    setPostTerminationYears([...postTerminationYears, newYear])
  }

  const removePostTerminationYear = (id: string) => {
    if (postTerminationYears.length > 1) {
      setPostTerminationYears(postTerminationYears.filter(year => year.id !== id))
    }
  }

  const updatePostTerminationYear = (id: string, field: keyof EmploymentYear, value: string) => {
    setPostTerminationYears(postTerminationYears.map(year =>
      year.id === id ? { ...year, [field]: value } : year
    ))
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Employment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Pre-Termination Employment */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Pre-Termination Employment</h3>
          
          <div>
            <Label htmlFor="preTerminationEmploymentStatus">Employment status at the time of the incident*</Label>
            <Select name="preTerminationEmploymentStatus" required>
              <SelectTrigger>
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="self-employed">Self-employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preTerminationJobTitle">Job title or position*</Label>
              <Input id="preTerminationJobTitle" name="preTerminationJobTitle" required />
            </div>
            <div>
              <Label htmlFor="preTerminationEmployer">Employer Name*</Label>
              <Input id="preTerminationEmployer" name="preTerminationEmployer" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preTerminationStartDate">Start date*</Label>
              <Input id="preTerminationStartDate" name="preTerminationStartDate" type="date" required />
            </div>
            <div>
              <Label htmlFor="preTerminationSalary">Hourly wage or annual salary*</Label>
              <Input id="preTerminationSalary" name="preTerminationSalary" required />
            </div>
          </div>

          <div>
            <Label htmlFor="preTerminationDuties">Brief description of work duties and responsibilities at date of termination*</Label>
            <Textarea id="preTerminationDuties" name="preTerminationDuties" required />
          </div>

          <div>
            <Label htmlFor="preTerminationAdvancements">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates)*</Label>
            <Textarea id="preTerminationAdvancements" name="preTerminationAdvancements" required />
          </div>

          <div>
            <Label htmlFor="preTerminationOvertime">Please describe any overtime work, including wages and frequency*</Label>
            <Textarea id="preTerminationOvertime" name="preTerminationOvertime" required />
          </div>

          <div>
            <Label htmlFor="preTerminationWorkSteady">Was work steady?*</Label>
            <Input id="preTerminationWorkSteady" name="preTerminationWorkSteady" required />
          </div>

          {/* Pre-Termination Employment Years Table */}
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
                {preTerminationYears.map((year) => (
                  <TableRow key={year.id}>
                    <TableCell>
                      <Input
                        value={year.year}
                        onChange={(e) => updatePreTerminationYear(year.id, 'year', e.target.value)}
                        placeholder="Year"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={year.income}
                        onChange={(e) => updatePreTerminationYear(year.id, 'income', e.target.value)}
                        placeholder="Income"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={year.percentEmployed}
                        onChange={(e) => updatePreTerminationYear(year.id, 'percentEmployed', e.target.value)}
                        placeholder="% Employed"
                      />
                    </TableCell>
                    <TableCell>
                      {preTerminationYears.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePreTerminationYear(year.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" variant="outline" className="mt-2" onClick={addPreTerminationYear}>
              <Plus className="h-4 w-4 mr-2" />
              Add Year
            </Button>
          </div>

          {/* Pre-Termination File Upload */}
          <div>
            <Label className="text-base font-medium mb-2 block">Upload documentation supporting wages and salary received*</Label>
            <FileUploadArea
              category="pre-termination-wages"
              label="Pre-Termination Wage Documentation"
              acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              uploadedFiles={uploadedFiles}
              onFilesUpload={handleFileUpload}
              onRemoveFile={removeFile}
              uploading={uploading}
            />
          </div>

          {/* Pre-Termination Benefits */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">Benefits*</h4>
            <p className="text-sm text-muted-foreground">Please describe all benefits provided by the employer, or to which the employer contributed prior to the termination.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preTerminationLifeInsurance">Life Insurance:</Label>
                <Input id="preTerminationLifeInsurance" name="preTerminationLifeInsurance" />
              </div>
              <div>
                <Label htmlFor="preTerminationIndividualHealth">Individual Health Insurance:</Label>
                <Input id="preTerminationIndividualHealth" name="preTerminationIndividualHealth" />
              </div>
              <div>
                <Label htmlFor="preTerminationFamilyHealth">Family Health Insurance:</Label>
                <Input id="preTerminationFamilyHealth" name="preTerminationFamilyHealth" />
              </div>
              <div>
                <Label htmlFor="preTerminationRetirementPlan">Retirement Plan:</Label>
                <Input id="preTerminationRetirementPlan" name="preTerminationRetirementPlan" />
              </div>
              <div>
                <Label htmlFor="preTerminationInvestmentPlan">Investment Plan:</Label>
                <Input id="preTerminationInvestmentPlan" name="preTerminationInvestmentPlan" />
              </div>
              <div>
                <Label htmlFor="preTerminationBonus">Bonus:</Label>
                <Input id="preTerminationBonus" name="preTerminationBonus" />
              </div>
              <div>
                <Label htmlFor="preTerminationStockOptions">Stock Options:</Label>
                <Input id="preTerminationStockOptions" name="preTerminationStockOptions" />
              </div>
              <div>
                <Label htmlFor="preTerminationOtherBenefits">Other:</Label>
                <Input id="preTerminationOtherBenefits" name="preTerminationOtherBenefits" />
              </div>
            </div>

            {/* Pre-Termination Benefits File Upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">Please attach copies of any I.R.A., 401K, Profit Sharing, or other benefit plans.</Label>
              <FileUploadArea
                category="pre-termination-benefits"
                label="Pre-Termination Benefit Plans"
                acceptedTypes=".pdf,.doc,.docx"
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFileUpload}
                onRemoveFile={removeFile}
                uploading={uploading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="preTerminationRetirementAge">Prior to termination, at what age was the plaintiff planning to retire?*</Label>
            <Input id="preTerminationRetirementAge" name="preTerminationRetirementAge" required />
          </div>

          <div>
            <Label htmlFor="preTerminationCareerTrajectory">What were the plaintiff&apos;s career trajectory expectations prior to termination (promotions, pay raises, etc.)?*</Label>
            <Textarea id="preTerminationCareerTrajectory" name="preTerminationCareerTrajectory" required />
          </div>

          <div>
            <Label htmlFor="preTerminationJobExpenses">List any out-of-the-ordinary expenses associated with this job*</Label>
            <Textarea id="preTerminationJobExpenses" name="preTerminationJobExpenses" required />
          </div>
        </div>

        {/* Post-Termination Employment */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Post-Termination Employment</h3>
          <p className="text-sm text-muted-foreground">If the plaintiff has not been employed since the date of termination, please continue to the next section.</p>
          
          <div>
            <Label htmlFor="postTerminationEmploymentStatus">Current employment status</Label>
            <Select name="postTerminationEmploymentStatus">
              <SelectTrigger>
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="self-employed">Self-employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="not-applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postTerminationJobTitle">Job title or position</Label>
              <Input id="postTerminationJobTitle" name="postTerminationJobTitle" />
            </div>
            <div>
              <Label htmlFor="postTerminationEmployer">Employer Name</Label>
              <Input id="postTerminationEmployer" name="postTerminationEmployer" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postTerminationStartDate">Start date</Label>
              <Input id="postTerminationStartDate" name="postTerminationStartDate" type="date" />
            </div>
            <div>
              <Label htmlFor="postTerminationSalary">Hourly wage or annual salary</Label>
              <Input id="postTerminationSalary" name="postTerminationSalary" />
            </div>
          </div>

          <div>
            <Label htmlFor="postTerminationDuties">Brief description of work duties and responsibilities.</Label>
            <Textarea id="postTerminationDuties" name="postTerminationDuties" />
          </div>

          <div>
            <Label htmlFor="postTerminationAdvancements">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates).</Label>
            <Textarea id="postTerminationAdvancements" name="postTerminationAdvancements" />
          </div>

          <div>
            <Label htmlFor="postTerminationOvertime">Please describe any overtime work, including wages and frequency.</Label>
            <Textarea id="postTerminationOvertime" name="postTerminationOvertime" />
          </div>

          <div>
            <Label htmlFor="postTerminationWorkSteady">Is work steady?</Label>
            <Input id="postTerminationWorkSteady" name="postTerminationWorkSteady" />
          </div>

          {/* Post-Termination Employment Years Table */}
          <div>
            <Label className="text-base font-medium">Annual wages and salary received</Label>
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
                {postTerminationYears.map((year) => (
                  <TableRow key={year.id}>
                    <TableCell>
                      <Input
                        value={year.year}
                        onChange={(e) => updatePostTerminationYear(year.id, 'year', e.target.value)}
                        placeholder="Year"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={year.income}
                        onChange={(e) => updatePostTerminationYear(year.id, 'income', e.target.value)}
                        placeholder="Income"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={year.percentEmployed}
                        onChange={(e) => updatePostTerminationYear(year.id, 'percentEmployed', e.target.value)}
                        placeholder="% Employed"
                      />
                    </TableCell>
                    <TableCell>
                      {postTerminationYears.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePostTerminationYear(year.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" variant="outline" className="mt-2" onClick={addPostTerminationYear}>
              <Plus className="h-4 w-4 mr-2" />
              Add Year
            </Button>
          </div>

          {/* Post-Termination File Upload */}
          <div>
            <Label className="text-base font-medium mb-2 block">Upload documentation supporting wages and salary received.</Label>
            <FileUploadArea
              category="post-termination-wages"
              label="Post-Termination Wage Documentation"
              acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              uploadedFiles={uploadedFiles}
              onFilesUpload={handleFileUpload}
              onRemoveFile={removeFile}
              uploading={uploading}
            />
          </div>

          {/* Post-Termination Benefits */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">Benefits</h4>
            <p className="text-sm text-muted-foreground">Please describe all benefits provided by the employer, or to which the employer contributes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postTerminationLifeInsurance">Life Insurance:</Label>
                <Input id="postTerminationLifeInsurance" name="postTerminationLifeInsurance" />
              </div>
              <div>
                <Label htmlFor="postTerminationIndividualHealth">Individual Health Insurance:</Label>
                <Input id="postTerminationIndividualHealth" name="postTerminationIndividualHealth" />
              </div>
              <div>
                <Label htmlFor="postTerminationFamilyHealth">Family Health Insurance:</Label>
                <Input id="postTerminationFamilyHealth" name="postTerminationFamilyHealth" />
              </div>
              <div>
                <Label htmlFor="postTerminationRetirementPlan">Retirement Plan:</Label>
                <Input id="postTerminationRetirementPlan" name="postTerminationRetirementPlan" />
              </div>
              <div>
                <Label htmlFor="postTerminationInvestmentPlan">Investment Plan:</Label>
                <Input id="postTerminationInvestmentPlan" name="postTerminationInvestmentPlan" />
              </div>
              <div>
                <Label htmlFor="postTerminationBonus">Bonus:</Label>
                <Input id="postTerminationBonus" name="postTerminationBonus" />
              </div>
              <div>
                <Label htmlFor="postTerminationStockOptions">Stock Options:</Label>
                <Input id="postTerminationStockOptions" name="postTerminationStockOptions" />
              </div>
              <div>
                <Label htmlFor="postTerminationOtherBenefits">Other:</Label>
                <Input id="postTerminationOtherBenefits" name="postTerminationOtherBenefits" />
              </div>
            </div>

            {/* Post-Termination Benefits File Upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">Please attach copies of any I.R.A., 401K, Profit Sharing, or other benefit plans.</Label>
              <FileUploadArea
                category="post-termination-benefits"
                label="Post-Termination Benefit Plans"
                acceptedTypes=".pdf,.doc,.docx"
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFileUpload}
                onRemoveFile={removeFile}
                uploading={uploading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="postTerminationRetirementAge">Given the termination, at what age is the plaintiff planning to retire?</Label>
            <Input id="postTerminationRetirementAge" name="postTerminationRetirementAge" />
          </div>

          <div>
            <Label htmlFor="postTerminationJobExpenses">List any out-of-the-ordinary expenses associated with this job.</Label>
            <Textarea id="postTerminationJobExpenses" name="postTerminationJobExpenses" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}