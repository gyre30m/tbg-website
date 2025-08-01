'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function WdEducation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="educationLevel">Highest level of education completed*</Label>
          <Select name="educationLevel" required>
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
          <Label htmlFor="skillsLicenses">List any licenses, training, or special skills held by the decedent (enter &quot;N/A&quot; if not applicable)*</Label>
          <Input id="skillsLicenses" name="skillsLicenses" required />
        </div>
        
        <div>
          <Label htmlFor="educationPlans">Detail any plans the decedent had to attain further educational degrees, licenses, or training at the time of death (enter &quot;N/A&quot; if not applicable)*</Label>
          <Input id="educationPlans" name="educationPlans" required />
        </div>
        
        <div>
          <Label htmlFor="parentEducation">If the decedent was a minor or had yet to finish formal education at the time of the death, list the education levels and occupations of the decedent&apos;s parents.*</Label>
          <Textarea id="parentEducation" name="parentEducation" required rows={3} />
        </div>
      </CardContent>
    </Card>
  )
}