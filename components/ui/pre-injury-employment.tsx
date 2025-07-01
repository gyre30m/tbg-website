"use client";

import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WageEntry {
  id: string;
  year: string;
  income: string;
  percentEmployed: string;
}

export function PreInjuryEmployment() {
  const [wageEntries, setWageEntries] = useState<WageEntry[]>([
    { id: "1", year: "", income: "", percentEmployed: "" },
  ]);

  const handleWageInputChange = (
    id: string,
    field: keyof WageEntry,
    value: string
  ) => {
    setWageEntries((prev) => {
      const updated = prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      );

      // Count empty rows
      const emptyRows = updated.filter(
        (entry) => !entry.year && !entry.income && !entry.percentEmployed
      );

      // Add new row if we have no empty rows
      if (emptyRows.length === 0) {
        updated.push({
          id: Date.now().toString(),
          year: "",
          income: "",
          percentEmployed: "",
        });
      }

      // Remove excess empty rows if we have more than 1
      if (emptyRows.length > 1) {
        const lastEmptyIndex = updated.length - 1;
        if (
          !updated[lastEmptyIndex].year &&
          !updated[lastEmptyIndex].income &&
          !updated[lastEmptyIndex].percentEmployed
        ) {
          updated.splice(lastEmptyIndex, 1);
        }
      }

      return updated;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Pre-injury Employment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="employmentStatus">
            Employment status at the time of the incident *
          </Label>
          <Select name="employmentStatus" required>
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time Employee</SelectItem>
              <SelectItem value="part-time">Part-time Employee</SelectItem>
              <SelectItem value="self-employed">Self-employed</SelectItem>
              <SelectItem value="contractor">
                Independent Contractor
              </SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="homemaker">Homemaker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job title or position</Label>
          <Input
            type="text"
            id="jobTitle"
            name="jobTitle"
            placeholder="e.g., Manager, Sales Associate, Teacher"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employer">Employer name</Label>
          <Input
            type="text"
            id="employer"
            name="employer"
            placeholder="Company or organization name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input type="date" id="startDate" name="startDate" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyWage">Hourly wage or annual salary</Label>
            <Input
              type="text"
              id="hourlyWage"
              name="hourlyWage"
              placeholder="e.g., $15/hour or $50,000/year"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workDescription">
            Brief description of work duties and responsibilities at date of
            injury
          </Label>
          <Input
            type="text"
            id="workDescription"
            name="workDescription"
            placeholder="Describe main job responsibilities and physical requirements"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="careerAdvancements">
            List all advancements within the company, including promotions and
            raises (include title changes, raise amounts, and dates)
          </Label>
          <Input
            type="text"
            id="careerAdvancements"
            name="careerAdvancements"
            placeholder="e.g., Promoted to Manager in March 2022 with $5,000 raise, $2/hour raise in January 2023"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overtimeWork">
            Please describe any overtime work, including wages and frequency
          </Label>
          <Input
            type="text"
            id="overtimeWork"
            name="overtimeWork"
            placeholder="e.g., Worked 10-15 hours overtime weekly at time-and-a-half ($22.50/hour), mostly weekends"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workSteady">Was work steady?</Label>
          <Input
            type="text"
            id="workSteady"
            name="workSteady"
            placeholder="e.g., Yes, full-time year-round or No, seasonal work with layoffs during winter"
          />
        </div>

        <div className="space-y-2">
          <Label>Annual wages and salary received</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>% of Year Employed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wageEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Input
                      type="text"
                      value={entry.year}
                      onChange={(e) =>
                        handleWageInputChange(
                          entry.id,
                          "year",
                          e.target.value
                        )
                      }
                      placeholder="e.g., 2023"
                      name={`wageYear_${entry.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={entry.income}
                      onChange={(e) =>
                        handleWageInputChange(
                          entry.id,
                          "income",
                          e.target.value
                        )
                      }
                      placeholder="e.g., $50,000"
                      name={`wageIncome_${entry.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={entry.percentEmployed}
                      onChange={(e) =>
                        handleWageInputChange(
                          entry.id,
                          "percentEmployed",
                          e.target.value
                        )
                      }
                      placeholder="e.g., 100%"
                      name={`wagePercent_${entry.id}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wageDocuments">
            Upload documentation supporting wages and salary received
          </Label>
          <div className="text-sm text-muted-foreground mb-2">
            Such as forms W-2, tax returns, pay stubs, etc.
          </div>
          <Input
            type="file"
            id="wageDocuments"
            name="wageDocuments"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
      </CardContent>
    </Card>
  );
}