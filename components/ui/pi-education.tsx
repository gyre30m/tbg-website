'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function PiEducation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pre-Injury Section (H3) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Pre-Injury</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="preInjuryEducation">Highest level of education completed prior to injury*</Label>
              <Select name="preInjuryEducation" required>
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
              <Label htmlFor="preInjurySkills">List any licenses, training, or special skills held by the injured party at the time of the incident (enter &quot;N/A&quot; if not applicable)*</Label>
              <Input id="preInjurySkills" name="preInjurySkills" required />
            </div>
            
            <div>
              <Label htmlFor="educationPlans">Detail any plans the injured party had to attain further educational degrees, licenses, or training at the time of the incident (enter &quot;N/A&quot; if not applicable)*</Label>
              <Input id="educationPlans" name="educationPlans" required />
            </div>
            
            <div>
              <Label htmlFor="parentsEducation">If the plaintiff was a minor or had yet to finish formal education at the time of the injury, list the education levels and occupations of the plaintiff&apos;s parents.*</Label>
              <Textarea id="parentsEducation" name="parentsEducation" required rows={3} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Post-Injury Section (H3) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Post-Injury</h3>
          <div>
            <Label htmlFor="postInjuryEducation">Detail any education, training, or special skills the plaintiff has acquired since the date of the injury, including the length and costs of all programs (enter &quot;N/A&quot; if not applicable).*</Label>
            <Textarea id="postInjuryEducation" name="postInjuryEducation" required rows={4} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}