'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function WtContact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Contact</CardTitle>
        <p className="text-sm text-muted-foreground">Please provide the plaintiff&apos;s contact information.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name*</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name*</Label>
            <Input id="lastName" name="lastName" required />
          </div>
        </div>

        <div>
          <Label htmlFor="address1">Address 1*</Label>
          <Input id="address1" name="address1" required />
        </div>

        <div>
          <Label htmlFor="address2">Address 2</Label>
          <Input id="address2" name="address2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City*</Label>
            <Input id="city" name="city" required />
          </div>
          <div>
            <Label htmlFor="state">State*</Label>
            <Input id="state" name="state" required />
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code*</Label>
            <Input id="zipCode" name="zipCode" required />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address*</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number*</Label>
            <Input id="phoneNumber" name="phoneNumber" type="tel" required />
          </div>
          <div>
            <Label htmlFor="phoneType">Phone Type*</Label>
            <Select name="phoneType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select phone type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}