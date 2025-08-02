'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PiContactProps {
  initialData?: Record<string, unknown>
}

export function PiContact({ initialData }: PiContactProps) {
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
            <Input id="firstName" name="firstName" defaultValue={String(initialData?.first_name || '')} required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name*</Label>
            <Input id="lastName" name="lastName" defaultValue={String(initialData?.last_name || '')} required />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address1">Address 1*</Label>
          <Input id="address1" name="address1" defaultValue={String(initialData?.address1 || '')} required />
        </div>
        
        <div>
          <Label htmlFor="address2">Address 2</Label>
          <Input id="address2" name="address2" defaultValue={String(initialData?.address2 || '')} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City*</Label>
            <Input id="city" name="city" defaultValue={String(initialData?.city || '')} required />
          </div>
          <div>
            <Label htmlFor="state">State*</Label>
            <Input id="state" name="state" defaultValue={String(initialData?.state || '')} required />
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code*</Label>
            <Input id="zipCode" name="zipCode" defaultValue={String(initialData?.zip_code || '')} required />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email Address*</Label>
          <Input id="email" name="email" type="email" defaultValue={String(initialData?.email || '')} required />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number*</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={String(initialData?.phone || '')} required />
          </div>
          <div>
            <Label htmlFor="phoneType">Phone Type*</Label>
            <Select name="phoneType" defaultValue={String(initialData?.phone_type || '')} required>
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