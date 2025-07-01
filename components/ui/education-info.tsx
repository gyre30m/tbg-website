import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EducationInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Education</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-3">
          <h3 className="text-md font-semibold text-gray-500">Pre-injury</h3>
        </div>
        <Separator className="mb-2 mt-0" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="highestEducation">
              Highest level of education completed prior to injury *
            </Label>
            <Select name="highestEducation" required>
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less-than-high-school">
                  Less than High School
                </SelectItem>
                <SelectItem value="high-school-diploma">
                  High School Diploma/GED
                </SelectItem>
                <SelectItem value="some-college">
                  Some College (No Degree)
                </SelectItem>
                <SelectItem value="associate-degree">
                  Associate Degree
                </SelectItem>
                <SelectItem value="bachelor-degree">
                  Bachelor&apos;s Degree
                </SelectItem>
                <SelectItem value="master-degree">Master&apos;s Degree</SelectItem>
                <SelectItem value="doctoral-degree">
                  Doctoral Degree (PhD, MD, JD, etc.)
                </SelectItem>
                <SelectItem value="professional-degree">
                  Professional Degree
                </SelectItem>
                <SelectItem value="trade-certificate">
                  Trade/Technical Certificate
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licensesAndSkills">
              List any licenses, training, or special skills held by the injured
              party at the time of the incident
            </Label>
            <Input
              type="text"
              id="licensesAndSkills"
              name="licensesAndSkills"
              placeholder="e.g., CDL, Professional licenses, Certifications, Special training"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="futurePlans">
              Detail any plans the injured party had to attain further
              educational degrees, licenses, or training at the time of the
              incident
            </Label>
            <Input
              type="text"
              id="futurePlans"
              name="futurePlans"
              placeholder="e.g., Planned to pursue MBA, Working toward certification, Enrolled in training program"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentsEducation">
              If the plaintiff was a minor or had yet to finish formal education at the time of the injury, list the education levels and occupations of the plaintiff&apos;s parents.
            </Label>
            <Textarea
              id="parentsEducation"
              name="parentsEducation"
              rows={4}
              placeholder="e.g., Mother: Bachelor's degree in Nursing, works as RN at General Hospital. Father: High school diploma, works as electrician..."
            />
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-md font-semibold text-gray-500">Post-injury</h3>
        </div>
        <Separator className="mb-2 mt-0" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="postInjuryEducation">
              Detail any education, training, or special skills the plaintiff has acquired since the date of the injury, including the length and costs of all programs.
            </Label>
            <Textarea
              id="postInjuryEducation"
              name="postInjuryEducation"
              rows={4}
              placeholder="e.g., Completed 6-month online certification program ($2,500), Obtained new license (3 months, $800), Pursued alternative training..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
