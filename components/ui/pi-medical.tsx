'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { FileUploadArea } from '@/components/ui/file-upload-area'

interface UploadedFile {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  category: string
}

interface PiMedicalProps {
  uploadedFiles: UploadedFile[]
  handleFileUpload: (files: FileList, category: string) => Promise<void>
  removeFile: (fileId: string) => void
  uploading: boolean
}

export function PiMedical({ uploadedFiles, handleFileUpload, removeFile, uploading }: PiMedicalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Medical</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Section (H3) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Current</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="incidentDate">Date of Incident*</Label>
              <Input id="incidentDate" name="incidentDate" type="date" required />
            </div>
            
            <div>
              <Label htmlFor="injuryDescription">Describe the nature of the injury and limitations*</Label>
              <Textarea id="injuryDescription" name="injuryDescription" required rows={4} />
            </div>
            
            <div>
              <Label htmlFor="caregiverClaim">If another party is making a claim for lost earnings due to time spent caring for the plaintiff, please provide details*</Label>
              <Textarea id="caregiverClaim" name="caregiverClaim" required rows={4} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Future Section (H3) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Future</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lifeExpectancy">If medical evidence indicates plaintiff&apos;s life expectancy has been reduced to this injury, provide details.*</Label>
              <Textarea id="lifeExpectancy" name="lifeExpectancy" required rows={4} />
            </div>
            
            <div>
              <Label htmlFor="futureExpenses">Detail future medical expenses including current cost and number of years they will be incurred. Consider nursing home care, in-home nursing care, physician care, drugs, medical appliances, physical therapy, psychiatric therapy, and surgery. If a Life Care Planner is preparing a report, please reference that here, and attach it below when available.*</Label>
              <Textarea id="futureExpenses" name="futureExpenses" required rows={6} />
            </div>
            
            <div>
              <Label className="text-base font-medium mb-2 block">Upload life care plan, if available.</Label>
              <FileUploadArea
                category="life-care-plan"
                label="Life Care Plan"
                acceptedTypes=".pdf,.doc,.docx"
                multiple={false}
                uploadedFiles={uploadedFiles}
                onFilesUpload={handleFileUpload}
                onRemoveFile={removeFile}
                uploading={uploading}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}