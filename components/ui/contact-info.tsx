import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Contact</CardTitle>
        <CardDescription>
          Please provide the plaintiff's contact information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input type="text" id="firstName" name="firstName" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input type="text" id="lastName" name="lastName" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address1">Address 1 *</Label>
          <Input type="text" id="address1" name="address1" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address2">Address 2</Label>
          <Input type="text" id="address2" name="address2" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input type="text" id="city" name="city" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input type="text" id="state" name="state" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code *</Label>
            <Input type="text" id="zipCode" name="zipCode" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input type="email" id="email" name="email" required />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input type="tel" id="phone" name="phone" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneType">Phone Type *</Label>
            <Select name="phoneType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select phone type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>
            The Bradley Group may contact the injured party directly: *
          </Label>
          <RadioGroup name="directContactConsent" className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="directContactConsentYes" />
              <Label htmlFor="directContactConsentYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="directContactConsentNo" />
              <Label htmlFor="directContactConsentNo">No</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
