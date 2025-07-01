import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Litigation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Litigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="settlementDate">Date of Next Settlement Negotiation</Label>
          <Input
            type="date"
            id="settlementDate"
            name="settlementDate"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trialDate">Date of Trial</Label>
          <Input
            type="date"
            id="trialDate"
            name="trialDate"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trialLocation">Location of Trial</Label>
          <Input
            type="text"
            id="trialLocation"
            name="trialLocation"
            placeholder="e.g., Superior Court of California, Los Angeles County"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="opposingCounsel">Name and firm of opposing counsel</Label>
          <Input
            type="text"
            id="opposingCounsel"
            name="opposingCounsel"
            placeholder="e.g., John Smith, Smith & Associates"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="opposingEconomist">Name and firm of opposing counsel's economist</Label>
          <Input
            type="text"
            id="opposingEconomist"
            name="opposingEconomist"
            placeholder="e.g., Jane Doe, Economic Analysis Group"
          />
        </div>
      </CardContent>
    </Card>
  );
}