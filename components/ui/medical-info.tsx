import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function MedicalInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Medical</CardTitle>
        <CardDescription>
          Please provide medical information related to the injury.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-3">
          <h3 className="text-md font-semibold text-gray-500">Current</h3>
        </div>
        <Separator className="mb-2 mt-0" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="incidentDate">Date of Incident *</Label>
            <Input type="date" id="incidentDate" name="incidentDate" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="injuryDescription">
              Describe the nature of the injury and all ensuing limitations.
            </Label>
            <Textarea
              id="injuryDescription"
              name="injuryDescription"
              rows={4}
              placeholder="Please describe the injury and any limitations it has caused..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="careFacilityCost">
              Provide annualized cost of care facility, or any in-home nursing care or assistance required by the plaintiff as a result of the injury.
            </Label>
            <Textarea
              id="careFacilityCost"
              name="careFacilityCost"
              rows={4}
              placeholder="Please provide details about care facility costs or in-home nursing care..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalExpenses">
              List medical expenses incurred to date for which a loss claim is being made.
            </Label>
            <Textarea
              id="medicalExpenses"
              name="medicalExpenses"
              rows={4}
              placeholder="Please list all medical expenses including doctor visits, hospital stays, medications, therapy, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caregiverLostEarnings">
              If another party is making a claim for lost earnings due to time spent caring for the plaintiff, please provide details
            </Label>
            <Textarea
              id="caregiverLostEarnings"
              name="caregiverLostEarnings"
              rows={4}
              placeholder="Please provide details about lost earnings claims from caregivers..."
            />
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-md font-semibold text-gray-500">Future</h3>
        </div>
        <Separator className="mb-2 mt-0" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="lifeExpectancyReduction">
              If medical evidence indicates plaintiff's life expectancy has been reduced to this injury, provide details.
            </Label>
            <Textarea
              id="lifeExpectancyReduction"
              name="lifeExpectancyReduction"
              rows={4}
              placeholder="Please provide details about any reduction in life expectancy..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="futureMedicalExpenses">
              Detail future medical expenses including current cost and number of years they will be incurred. If you're completing a Life Care Planner's report, please reference that here, instead.
            </Label>
            <Textarea
              id="futureMedicalExpenses"
              name="futureMedicalExpenses"
              rows={4}
              placeholder="Please detail future medical expenses or reference Life Care Planner's report..."
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
