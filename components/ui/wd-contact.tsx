'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function WdContact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Contact</CardTitle>
        <p className="text-sm text-muted-foreground">Please provide the decedent&apos;s most recent contact information.</p>
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
      </CardContent>
    </Card>
  )
}