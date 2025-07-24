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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function IncidentInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident</CardTitle>
        <CardDescription>
          Please provide details about the incident that led to the injury.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="incidentDate">Date of Incident *</Label>
          <Input type="date" id="incidentDate" name="incidentDate" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="injuryType">Type of Injury *</Label>
          <Select name="injuryType" required>
            <SelectTrigger>
              <SelectValue placeholder="Select injury type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car-accident">Car Accident</SelectItem>
              <SelectItem value="slip-fall">Slip and Fall</SelectItem>
              <SelectItem value="workplace">Workplace Injury</SelectItem>
              <SelectItem value="medical-malpractice">
                Medical Malpractice
              </SelectItem>
              <SelectItem value="product-liability">
                Product Liability
              </SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="incidentDescription">Description of Incident *</Label>
          <Textarea
            id="incidentDescription"
            name="incidentDescription"
            rows={4}
            required
            placeholder="Please provide a detailed description of what happened..."
          />
        </div>

        <div className="space-y-3">
          <Label>Did you receive medical treatment? *</Label>
          <RadioGroup name="medicalTreatment" className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="medicalTreatmentYes" />
              <Label htmlFor="medicalTreatmentYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="medicalTreatmentNo" />
              <Label htmlFor="medicalTreatmentNo">No</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
