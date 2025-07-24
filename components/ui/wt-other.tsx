'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function WtOther() {
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
            placeholder="Please provide any additional relevant information about the economic impact of the termination, job search efforts, career limitations, etc."
            className="min-h-[120px]"
            required 
          />
        </div>
      </CardContent>
    </Card>
  )
}