'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function PiDemographics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Demographics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">Gender*</Label>
            <Select name="gender" required>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="maritalStatus">Marital Status*</Label>
            <Select name="maritalStatus" required>
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
                <SelectItem value="domestic-partnership">Domestic Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ethnicity">Ethnicity*</Label>
            <Select name="ethnicity" required>
              <SelectTrigger>
                <SelectValue placeholder="Select ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="american-indian-alaska-native">American Indian or Alaska Native</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="black-african-american">Black or African American</SelectItem>
                <SelectItem value="hispanic-latino">Hispanic or Latino</SelectItem>
                <SelectItem value="native-hawaiian-pacific-islander">Native Hawaiian or Other Pacific Islander</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="two-or-more-races">Two or More Races</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth*</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}