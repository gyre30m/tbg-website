import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PostInjuryEmployment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Post-injury Employment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentEmploymentStatus">
            Current employment status
          </Label>
          <Select name="currentEmploymentStatus">
            <SelectTrigger>
              <SelectValue placeholder="Select current employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="same-job">
                Same job as before injury
              </SelectItem>
              <SelectItem value="modified-duties">
                Same employer, modified duties
              </SelectItem>
              <SelectItem value="new-job">New job/employer</SelectItem>
              <SelectItem value="reduced-hours">
                Reduced hours/part-time
              </SelectItem>
              <SelectItem value="unemployed-injury">
                Unemployed due to injury
              </SelectItem>
              <SelectItem value="unemployed-other">
                Unemployed for other reasons
              </SelectItem>
              <SelectItem value="retired-early">
                Early retirement due to injury
              </SelectItem>
              <SelectItem value="disabled">
                Disabled/Unable to work
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentJobTitle">
            Current job title or position
          </Label>
          <Input
            type="text"
            id="currentJobTitle"
            name="currentJobTitle"
            placeholder="Current job title if employed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentEmployer">Current employer name</Label>
          <Input
            type="text"
            id="currentEmployer"
            name="currentEmployer"
            placeholder="Current company or organization name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentWage">Current hourly wage or annual salary</Label>
          <Input
            type="text"
            id="currentWage"
            name="currentWage"
            placeholder="e.g., $12/hour or $45,000/year"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentChanges">
            Describe any changes in employment or work capacity since the
            injury
          </Label>
          <Input
            type="text"
            id="employmentChanges"
            name="employmentChanges"
            placeholder="e.g., Unable to lift heavy objects, reduced work hours, changed careers"
          />
        </div>
      </CardContent>
    </Card>
  );
}