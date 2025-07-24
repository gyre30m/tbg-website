'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function WtEducation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pre-Termination Education */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pre-Termination</h3>
          
          <div>
            <Label htmlFor="preTerminationEducation">Highest level of education completed prior to termination*</Label>
            <Select name="preTerminationEducation" required>
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="some-college">Some College</SelectItem>
                <SelectItem value="associates">Associate&apos;s Degree</SelectItem>
                <SelectItem value="bachelors">Bachelor&apos;s Degree</SelectItem>
                <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                <SelectItem value="doctorate">Doctorate</SelectItem>
                <SelectItem value="professional">Professional Degree</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="preTerminationSkills">List any licenses, training, or special skills held by the plaintiff at the time of the termination (enter &quot;N/A&quot; if not applicable)*</Label>
            <Textarea 
              id="preTerminationSkills" 
              name="preTerminationSkills" 
              placeholder="List licenses, certifications, training programs, special skills, etc."
              required 
            />
          </div>

          <div>
            <Label htmlFor="preTerminationEducationPlans">Detail any plans the plaintiff had to attain further educational degrees, licenses, or training at the time of the termination (enter &quot;N/A&quot; if not applicable)*</Label>
            <Textarea 
              id="preTerminationEducationPlans" 
              name="preTerminationEducationPlans" 
              placeholder="Describe planned education, training programs, certifications, etc."
              required 
            />
          </div>
        </div>

        {/* Post-Termination Education */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Post-Termination</h3>
          
          <div>
            <Label htmlFor="postTerminationEducation">Detail any education, training, or special skills the plaintiff has acquired since the date of termination, including the length and costs of all programs (enter &quot;N/A&quot; if not applicable)*</Label>
            <Textarea 
              id="postTerminationEducation" 
              name="postTerminationEducation" 
              placeholder="Describe education/training completed since termination, including duration and costs"
              required 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}