'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface PiOtherProps {
  initialData?: Record<string, unknown>
}

export function PiOther({ initialData }: PiOtherProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Other</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="additionalInfo">Please provide any additional pertinent information which may have some bearing on past or future income or expenses.*</Label>
          <Textarea 
            id="additionalInfo" 
            name="additionalInfo" 
            defaultValue={String(initialData?.additional_info || '')}
            required 
            rows={4} 
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  )
}