'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function WtLitigation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Litigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="matterNo">Matter No. (for law firm internal use only)</Label>
          <Input id="matterNo" name="matterNo" />
        </div>

        <div>
          <Label htmlFor="settlementDate">Date of Next Settlement Negotiation*</Label>
          <Input id="settlementDate" name="settlementDate" type="date" required />
        </div>

        <div>
          <Label htmlFor="trialDate">Date of Trial*</Label>
          <Input id="trialDate" name="trialDate" type="date" required />
        </div>

        <div>
          <Label htmlFor="trialLocation">Location of Trial*</Label>
          <Input id="trialLocation" name="trialLocation" required />
        </div>

        <div>
          <Label htmlFor="defendant">Defendant</Label>
          <Input id="defendant" name="defendant" />
        </div>

        <div>
          <Label htmlFor="opposingCounselFirm">Name of firm of opposing counsel*</Label>
          <Input id="opposingCounselFirm" name="opposingCounselFirm" required />
        </div>

        <div>
          <Label htmlFor="opposingEconomist">Name and firm of opposing counsel&apos;s economist*</Label>
          <Input id="opposingEconomist" name="opposingEconomist" required />
        </div>
      </CardContent>
    </Card>
  )
}