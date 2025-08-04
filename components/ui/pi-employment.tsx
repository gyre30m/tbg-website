'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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

interface PiEmploymentProps {
  preInjuryYears: EmploymentYear[]
  setPreInjuryYears: (years: EmploymentYear[]) => void
  postInjuryYears: EmploymentYear[]
  setPostInjuryYears: (years: EmploymentYear[]) => void
  uploadedFiles: UploadedFile[]
  handleFileUpload: (files: FileList, category: string) => Promise<void>
  removeFile: (fileId: string) => void
  uploading: boolean
  initialData?: Record<string, unknown>
}

export function PiEmployment({ 
  preInjuryYears, 
  setPreInjuryYears, 
  postInjuryYears, 
  setPostInjuryYears,
  uploadedFiles,
  handleFileUpload,
  removeFile,
  uploading,
  initialData
}: PiEmploymentProps) {
  const addEmploymentYear = (type: 'preInjury' | 'postInjury') => {
    const newYear = {
      id: Date.now().toString(),
      year: '',
      income: '',
      percentEmployed: ''
    }
    
    if (type === 'preInjury') {
      setPreInjuryYears([...preInjuryYears, newYear])
    } else {
      setPostInjuryYears([...postInjuryYears, newYear])
    }
  }

  const removeEmploymentYear = (id: string, type: 'preInjury' | 'postInjury') => {
    if (type === 'preInjury') {
      setPreInjuryYears(preInjuryYears.filter(year => year.id !== id))
    } else {
      setPostInjuryYears(postInjuryYears.filter(year => year.id !== id))
    }
  }

  const updateEmploymentYear = (id: string, field: keyof EmploymentYear, value: string, type: 'preInjury' | 'postInjury') => {
    if (type === 'preInjury') {
      setPreInjuryYears(preInjuryYears.map(year => year.id === id ? { ...year, [field]: value } : year))
    } else {
      setPostInjuryYears(postInjuryYears.map(year => year.id === id ? { ...year, [field]: value } : year))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Employment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Pre-Injury Employment Section (H3) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Pre-Injury Employment</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="preInjuryEmploymentStatus">Employment status at the time of the incident*</Label>
              <Select name="preInjuryEmploymentStatus" defaultValue={String(initialData?.pre_injury_employment_status || '')} required>
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
                <Label htmlFor="preInjuryJobTitle">Job title or position*</Label>
                <Input id="preInjuryJobTitle" name="preInjuryJobTitle" defaultValue={String(initialData?.pre_injury_job_title || '')} required />
              </div>
              <div>
                <Label htmlFor="preInjuryEmployer">Employer Name*</Label>
                <Input id="preInjuryEmployer" name="preInjuryEmployer" defaultValue={String(initialData?.pre_injury_employer || '')} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preInjuryStartDate">Start date*</Label>
                <Input id="preInjuryStartDate" name="preInjuryStartDate" type="date" defaultValue={initialData?.pre_injury_start_date ? new Date(String(initialData.pre_injury_start_date)).toISOString().split('T')[0] : ''} required />
              </div>
              <div>
                <Label htmlFor="preInjurySalary">Hourly wage or annual salary*</Label>
                <Input id="preInjurySalary" name="preInjurySalary" defaultValue={String(initialData?.pre_injury_salary || '')} required />
              </div>
            </div>
            
            <div>
              <Label htmlFor="preInjuryDuties">Brief description of work duties and responsibilities at date of injury*</Label>
              <Textarea id="preInjuryDuties" name="preInjuryDuties" defaultValue={String(initialData?.pre_injury_duties || '')} required rows={3} />
            </div>
            
            <div>
              <Label htmlFor="preInjuryAdvancements">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates)*</Label>
              <Textarea id="preInjuryAdvancements" name="preInjuryAdvancements" defaultValue={String(initialData?.pre_injury_advancements || '')} required rows={3} />
            </div>
            
            <div>
              <Label htmlFor="preInjuryOvertime">Please describe any overtime work, including wages and frequency*</Label>
              <Textarea id="preInjuryOvertime" name="preInjuryOvertime" defaultValue={String(initialData?.pre_injury_overtime || '')} required rows={3} />
            </div>
            
            <div>
              <Label htmlFor="preInjuryWorkSteady">Was work steady*</Label>
              <Input id="preInjuryWorkSteady" name="preInjuryWorkSteady" defaultValue={String(initialData?.pre_injury_work_steady || '')} required />
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
                  {preInjuryYears.map((year) => (
                    <TableRow key={year.id}>
                      <TableCell>
                        <Input
                          value={year.year}
                          onChange={(e) => updateEmploymentYear(year.id, 'year', e.target.value, 'preInjury')}
                          placeholder="Year"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={year.income}
                          onChange={(e) => updateEmploymentYear(year.id, 'income', e.target.value, 'preInjury')}
                          placeholder="Income"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={year.percentEmployed}
                          onChange={(e) => updateEmploymentYear(year.id, 'percentEmployed', e.target.value, 'preInjury')}
                          placeholder="% Employed"
                        />
                      </TableCell>
                      <TableCell>
                        {preInjuryYears.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmploymentYear(year.id, 'preInjury')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="outline" className="mt-2" onClick={() => addEmploymentYear('preInjury')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Year
              </Button>
            </div>

            {/* Wage documentation upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">Upload documentation supporting wages and salary received.*</Label>
              <FileUploadArea
                category="pre-injury-wages"
                label="Pre-Injury Wage Documentation"
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
                Please describe all benefits provided by the employer, or to which the employer contributed prior to the injury.
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lifeInsurance">Life Insurance:</Label>
                  <Input id="lifeInsurance" name="preInjuryLifeInsurance" defaultValue={String(initialData?.pre_injury_life_insurance || '')} />
                </div>
                <div>
                  <Label htmlFor="individualHealth">Individual Health Insurance:</Label>
                  <Input id="individualHealth" name="preInjuryIndividualHealth" defaultValue={String(initialData?.pre_injury_individual_health || '')} />
                </div>
                <div>
                  <Label htmlFor="familyHealth">Family Health Insurance:</Label>
                  <Input id="familyHealth" name="preInjuryFamilyHealth" defaultValue={String(initialData?.pre_injury_family_health || '')} />
                </div>
                <div>
                  <Label htmlFor="retirementPlan">Retirement Plan:</Label>
                  <Input id="retirementPlan" name="preInjuryRetirementPlan" defaultValue={String(initialData?.pre_injury_retirement_plan || '')} />
                </div>
                <div>
                  <Label htmlFor="investmentPlan">Investment Plan:</Label>
                  <Input id="investmentPlan" name="preInjuryInvestmentPlan" defaultValue={String(initialData?.pre_injury_investment_plan || '')} />
                </div>
                <div>
                  <Label htmlFor="bonus">Bonus:</Label>
                  <Input id="bonus" name="preInjuryBonus" defaultValue={String(initialData?.pre_injury_bonus || '')} />
                </div>
                <div>
                  <Label htmlFor="stockOptions">Stock Options:</Label>
                  <Input id="stockOptions" name="preInjuryStockOptions" defaultValue={String(initialData?.pre_injury_stock_options || '')} />
                </div>
                <div>
                  <Label htmlFor="otherBenefits">Other:</Label>
                  <Input id="otherBenefits" name="preInjuryOtherBenefits" defaultValue={String(initialData?.pre_injury_other_benefits || '')} />
                </div>
              </div>
            </div>

            {/* Benefit plans upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">Please attach copies of any I.R.A., 401K, Profit Sharing, or other benefit plans.</Label>
              <FileUploadArea
                category="pre-injury-benefits"
                label="Pre-Injury Benefit Plans"
                acceptedTypes=".pdf,.doc,.docx"
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFileUpload}
                onRemoveFile={removeFile}
                uploading={uploading}
              />
            </div>

            <div>
              <Label htmlFor="retirementAge">Prior to the injury, at what age was the plaintiff planning to retire?*</Label>
              <Input id="retirementAge" name="preInjuryRetirementAge" defaultValue={String(initialData?.pre_injury_retirement_age || '')} required />
            </div>

            <div>
              <Label htmlFor="careerTrajectory">What were the plaintiff&apos;s career trajectory expectations prior to injury (promotions, pay raises, etc.)?*</Label>
              <Textarea id="careerTrajectory" name="preInjuryCareerTrajectory" defaultValue={String(initialData?.pre_injury_career_trajectory || '')} required rows={3} />
            </div>

            <div>
              <Label htmlFor="jobExpenses">List any out-of-the-ordinary expenses associated with this job*</Label>
              <Textarea id="jobExpenses" name="preInjuryJobExpenses" defaultValue={String(initialData?.pre_injury_job_expenses || '')} required rows={3} />
            </div>

            <div>
              <Label htmlFor="disabilityRating">Has the plaintiff been declared unable to work, or has a disability rating been provided by a doctor or rehabilitation specialist?*</Label>
              <Textarea id="disabilityRating" name="disabilityRating" defaultValue={String(initialData?.disability_rating || '')} required rows={3} />
            </div>

            {/* Disability documentation upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">Please upload any documentation related to the previous question.</Label>
              <FileUploadArea
                category="disability-documentation"
                label="Disability Documentation"
                acceptedTypes=".pdf,.doc,.docx"
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFileUpload}
                onRemoveFile={removeFile}
                uploading={uploading}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Post-Injury Employment Section (H3) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Post-Injury Employment</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              If the plaintiff has not been employed since the date of the injury, please continue to the next section.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="postInjuryEmploymentStatus">Current employment status*</Label>
              <Select name="postInjuryEmploymentStatus" defaultValue={String(initialData?.post_injury_employment_status || '')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postInjuryJobTitle">Job title or position*</Label>
                <Input id="postInjuryJobTitle" name="postInjuryJobTitle" defaultValue={String(initialData?.post_injury_job_title || '')} required />
              </div>
              <div>
                <Label htmlFor="postInjuryEmployer">Employer Name*</Label>
                <Input id="postInjuryEmployer" name="postInjuryEmployer" defaultValue={String(initialData?.post_injury_employer || '')} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postInjuryStartDate">Start date*</Label>
                <Input id="postInjuryStartDate" name="postInjuryStartDate" type="date" defaultValue={initialData?.post_injury_start_date ? new Date(String(initialData.post_injury_start_date)).toISOString().split('T')[0] : ''} required />
              </div>
              <div>
                <Label htmlFor="postInjurySalary">Hourly wage or annual salary*</Label>
                <Input id="postInjurySalary" name="postInjurySalary" defaultValue={String(initialData?.post_injury_salary || '')} required />
              </div>
            </div>
            
            <div>
              <Label htmlFor="postInjuryDuties">Brief description of work duties and responsibilities*</Label>
              <Textarea id="postInjuryDuties" name="postInjuryDuties" defaultValue={String(initialData?.post_injury_duties || '')} required rows={3} />
            </div>
            
            <div>
              <Label htmlFor="postInjuryAdvancements">List all advancements within the company, including promotions and raises (include title changes, raise amounts, and dates)*</Label>
              <Textarea id="postInjuryAdvancements" name="postInjuryAdvancements" defaultValue={String(initialData?.post_injury_advancements || '')} required rows={3} />
            </div>
            
            <div>
              <Label htmlFor="postInjuryOvertime">Please describe any overtime work, including wages and frequency*</Label>
              <Textarea id="postInjuryOvertime" name="postInjuryOvertime" defaultValue={String(initialData?.post_injury_overtime || '')} required rows={3} />
            </div>
            
            <div>
              <Label htmlFor="postInjuryWorkSteady">Is work steady*</Label>
              <Input id="postInjuryWorkSteady" name="postInjuryWorkSteady" defaultValue={String(initialData?.post_injury_work_steady || '')} required />
            </div>

            {/* Post-injury annual wages table */}
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
                  {postInjuryYears.map((year) => (
                    <TableRow key={year.id}>
                      <TableCell>
                        <Input
                          value={year.year}
                          onChange={(e) => updateEmploymentYear(year.id, 'year', e.target.value, 'postInjury')}
                          placeholder="Year"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={year.income}
                          onChange={(e) => updateEmploymentYear(year.id, 'income', e.target.value, 'postInjury')}
                          placeholder="Income"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={year.percentEmployed}
                          onChange={(e) => updateEmploymentYear(year.id, 'percentEmployed', e.target.value, 'postInjury')}
                          placeholder="% Employed"
                        />
                      </TableCell>
                      <TableCell>
                        {postInjuryYears.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmploymentYear(year.id, 'postInjury')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="outline" className="mt-2" onClick={() => addEmploymentYear('postInjury')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Year
              </Button>
            </div>

            {/* Post-injury wage documentation upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">Upload documentation supporting wages and salary received.*</Label>
              <FileUploadArea
                category="post-injury-wages"
                label="Post-Injury Wage Documentation"
                acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFileUpload}
                onRemoveFile={removeFile}
                uploading={uploading}
              />
            </div>

            {/* Post-injury benefits section */}
            <div>
              <Label className="text-base font-medium">Benefits*</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Please describe all benefits provided by the employer, or to which the employer contributed.
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="postLifeInsurance">Life Insurance:</Label>
                  <Input id="postLifeInsurance" name="postInjuryLifeInsurance" defaultValue={String(initialData?.post_injury_life_insurance || '')} />
                </div>
                <div>
                  <Label htmlFor="postIndividualHealth">Individual Health Insurance:</Label>
                  <Input id="postIndividualHealth" name="postInjuryIndividualHealth" defaultValue={String(initialData?.post_injury_individual_health || '')} />
                </div>
                <div>
                  <Label htmlFor="postFamilyHealth">Family Health Insurance:</Label>
                  <Input id="postFamilyHealth" name="postInjuryFamilyHealth" defaultValue={String(initialData?.post_injury_family_health || '')} />
                </div>
                <div>
                  <Label htmlFor="postRetirementPlan">Retirement Plan:</Label>
                  <Input id="postRetirementPlan" name="postInjuryRetirementPlan" defaultValue={String(initialData?.post_injury_retirement_plan || '')} />
                </div>
                <div>
                  <Label htmlFor="postInvestmentPlan">Investment Plan:</Label>
                  <Input id="postInvestmentPlan" name="postInjuryInvestmentPlan" defaultValue={String(initialData?.post_injury_investment_plan || '')} />
                </div>
                <div>
                  <Label htmlFor="postBonus">Bonus:</Label>
                  <Input id="postBonus" name="postInjuryBonus" defaultValue={String(initialData?.post_injury_bonus || '')} />
                </div>
                <div>
                  <Label htmlFor="postStockOptions">Stock Options:</Label>
                  <Input id="postStockOptions" name="postInjuryStockOptions" defaultValue={String(initialData?.post_injury_stock_options || '')} />
                </div>
                <div>
                  <Label htmlFor="postOtherBenefits">Other:</Label>
                  <Input id="postOtherBenefits" name="postInjuryOtherBenefits" defaultValue={String(initialData?.post_injury_other_benefits || '')} />
                </div>
              </div>
            </div>

            {/* Post-injury benefit plans upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">Please attach copies of any I.R.A., 401K, Profit Sharing, or other benefit plans.</Label>
              <FileUploadArea
                category="post-injury-benefits"
                label="Post-Injury Benefit Plans"
                acceptedTypes=".pdf,.doc,.docx"
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFileUpload}
                onRemoveFile={removeFile}
                uploading={uploading}
              />
            </div>

            <div>
              <Label htmlFor="postRetirementAge">Given the injury, at what age is the plaintiff planning to retire?*</Label>
              <Input id="postRetirementAge" name="postInjuryRetirementAge" defaultValue={String(initialData?.post_injury_retirement_age || '')} required />
            </div>

            <div>
              <Label htmlFor="postJobExpenses">List any out-of-the-ordinary expenses associated with this job*</Label>
              <Textarea id="postJobExpenses" name="postInjuryJobExpenses" defaultValue={String(initialData?.post_injury_job_expenses || '')} required rows={3} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}