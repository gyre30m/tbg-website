'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function WdHouseholdServices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Household Services</CardTitle>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            For each category of tasks below, please indicate the decedent&apos;s ability to complete the listed tasks using a scale of 0-5, as described below:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>0 - Death has no impact on ability to complete task, or did not complete task prior to death.</li>
            <li>1 - Death has a minor impact on ability to complete task.</li>
            <li>2 - Death has a moderate impact on ability to complete task.</li>
            <li>3 - Death has a major impact on ability to complete task.</li>
            <li>4 - Death has a severe impact on ability to complete task.</li>
            <li>5 - Death completely prevents completion of these tasks.</li>
          </ul>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="dependentCare" className="text-base font-medium">Care of Dependent Family Members</Label>
          <p className="text-sm text-muted-foreground mb-2">
            dressing, bathing, feeding, supervising, or transporting to and from events (includes children and adults)
          </p>
          <Select name="dependentCare" required>
            <SelectTrigger>
              <SelectValue placeholder="Select impact level (0-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - No impact</SelectItem>
              <SelectItem value="1">1 - Minor impact</SelectItem>
              <SelectItem value="2">2 - Moderate impact</SelectItem>
              <SelectItem value="3">3 - Major impact</SelectItem>
              <SelectItem value="4">4 - Severe impact</SelectItem>
              <SelectItem value="5">5 - Completely prevents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="petCare" className="text-base font-medium">Pet Care</Label>
          <p className="text-sm text-muted-foreground mb-2">
            feeding, grooming, walking, picking up after, or otherwise caring for household pets
          </p>
          <Select name="petCare" required>
            <SelectTrigger>
              <SelectValue placeholder="Select impact level (0-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - No impact</SelectItem>
              <SelectItem value="1">1 - Minor impact</SelectItem>
              <SelectItem value="2">2 - Moderate impact</SelectItem>
              <SelectItem value="3">3 - Major impact</SelectItem>
              <SelectItem value="4">4 - Severe impact</SelectItem>
              <SelectItem value="5">5 - Completely prevents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="indoorHousework" className="text-base font-medium">Indoor Housework</Label>
          <p className="text-sm text-muted-foreground mb-2">
            vacuuming, sweeping, mopping, dusting, making beds, emptying trash, washing clothes, ironing, folding and putting laundry away, putting groceries away
          </p>
          <Select name="indoorHousework" required>
            <SelectTrigger>
              <SelectValue placeholder="Select impact level (0-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - No impact</SelectItem>
              <SelectItem value="1">1 - Minor impact</SelectItem>
              <SelectItem value="2">2 - Moderate impact</SelectItem>
              <SelectItem value="3">3 - Major impact</SelectItem>
              <SelectItem value="4">4 - Severe impact</SelectItem>
              <SelectItem value="5">5 - Completely prevents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mealPrep" className="text-base font-medium">Meal Preparation and Cleanup</Label>
          <p className="text-sm text-muted-foreground mb-2">
            food preparation, cooking, serving, setting & clearing a table, washing dishes, loading & unloading a dishwasher, cleaning the kitchen
          </p>
          <Select name="mealPrep" required>
            <SelectTrigger>
              <SelectValue placeholder="Select impact level (0-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - No impact</SelectItem>
              <SelectItem value="1">1 - Minor impact</SelectItem>
              <SelectItem value="2">2 - Moderate impact</SelectItem>
              <SelectItem value="3">3 - Major impact</SelectItem>
              <SelectItem value="4">4 - Severe impact</SelectItem>
              <SelectItem value="5">5 - Completely prevents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="homeMaintenance" className="text-base font-medium">Home/Yard Maintenance</Label>
          <p className="text-sm text-muted-foreground mb-2">
            painting, house repairs, gardening, mowing, trimming, edging, weeding
          </p>
          <Select name="homeMaintenance" required>
            <SelectTrigger>
              <SelectValue placeholder="Select impact level (0-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - No impact</SelectItem>
              <SelectItem value="1">1 - Minor impact</SelectItem>
              <SelectItem value="2">2 - Moderate impact</SelectItem>
              <SelectItem value="3">3 - Major impact</SelectItem>
              <SelectItem value="4">4 - Severe impact</SelectItem>
              <SelectItem value="5">5 - Completely prevents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="vehicleMaintenance" className="text-base font-medium">Vehicle Maintenance</Label>
          <p className="text-sm text-muted-foreground mb-2">
            car washing, vacuuming, arranging appointments for maintenance & repair, taking vehicles to appointments
          </p>
          <Select name="vehicleMaintenance" required>
            <SelectTrigger>
              <SelectValue placeholder="Select impact level (0-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - No impact</SelectItem>
              <SelectItem value="1">1 - Minor impact</SelectItem>
              <SelectItem value="2">2 - Moderate impact</SelectItem>
              <SelectItem value="3">3 - Major impact</SelectItem>
              <SelectItem value="4">4 - Severe impact</SelectItem>
              <SelectItem value="5">5 - Completely prevents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="errands" className="text-base font-medium">Errands</Label>
          <p className="text-sm text-muted-foreground mb-2">
            shopping for groceries and other household items, disposing of trash, yard waste, etc. and other travel to complete tasks not included in other categories
          </p>
          <Select name="errands" required>
            <SelectTrigger>
              <SelectValue placeholder="Select impact level (0-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - No impact</SelectItem>
              <SelectItem value="1">1 - Minor impact</SelectItem>
              <SelectItem value="2">2 - Moderate impact</SelectItem>
              <SelectItem value="3">3 - Major impact</SelectItem>
              <SelectItem value="4">4 - Severe impact</SelectItem>
              <SelectItem value="5">5 - Completely prevents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}