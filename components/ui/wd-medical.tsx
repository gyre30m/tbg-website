'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function WdMedical() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Medical</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="healthIssues">Describe decedent&apos;s health and any issues prior to death.*</Label>
          <Textarea id="healthIssues" name="healthIssues" required rows={4} />
        </div>
        
        <div>
          <Label htmlFor="workMissed">Describe any work missed due to health issues prior to death.*</Label>
          <Textarea id="workMissed" name="workMissed" required rows={4} />
        </div>
      </CardContent>
    </Card>
  )
}