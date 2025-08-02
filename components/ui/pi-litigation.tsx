'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PiLitigationProps {
  initialData?: Record<string, unknown>
}

export function PiLitigation({ initialData }: PiLitigationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Litigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="matterNo">Matter No. (for law firm internal use only)</Label>
          <Input id="matterNo" name="matterNo" defaultValue={String(initialData?.matter_no || '')} />
        </div>

        <div>
          <Label htmlFor="settlementDate">Date of Next Settlement Negotiation*</Label>
          <Input id="settlementDate" name="settlementDate" type="date" defaultValue={initialData?.settlement_date ? new Date(String(initialData.settlement_date)).toISOString().split('T')[0] : ''} required />
        </div>

        <div>
          <Label htmlFor="trialDate">Date of Trial*</Label>
          <Input id="trialDate" name="trialDate" type="date" defaultValue={initialData?.trial_date ? new Date(String(initialData.trial_date)).toISOString().split('T')[0] : ''} required />
        </div>

        <div>
          <Label htmlFor="trialLocation">Location of Trial*</Label>
          <Input id="trialLocation" name="trialLocation" defaultValue={String(initialData?.trial_location || '')} required />
        </div>

        <div>
          <Label htmlFor="defendant">Defendant</Label>
          <Input id="defendant" name="defendant" defaultValue={String(initialData?.defendant || '')} />
        </div>

        <div>
          <Label htmlFor="opposingCounselFirm">Name of firm of opposing counsel*</Label>
          <Input id="opposingCounselFirm" name="opposingCounselFirm" defaultValue={String(initialData?.opposing_counsel_firm || '')} required />
        </div>

        <div>
          <Label htmlFor="opposingEconomist">Name and firm of opposing counsel&apos;s economist*</Label>
          <Input id="opposingEconomist" name="opposingEconomist" defaultValue={String(initialData?.opposing_economist || '')} required />
        </div>
      </CardContent>
    </Card>
  )
}