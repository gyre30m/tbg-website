"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HouseholdMember {
  id: string;
  fullName: string;
  dateOfBirth: string;
  relationship: string;
}

export function HouseholdInfo() {
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([
    { id: "1", fullName: "", dateOfBirth: "", relationship: "" },
  ]);

  const handleInputChange = (
    id: string,
    field: keyof HouseholdMember,
    value: string
  ) => {
    setHouseholdMembers((prev) => {
      const updated = prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      );

      // Check if we need to add a new empty row
      const lastMember = updated[updated.length - 1];
      if (
        lastMember &&
        (lastMember.fullName ||
          lastMember.dateOfBirth ||
          lastMember.relationship) &&
        !updated.some(
          (member) =>
            !member.fullName && !member.dateOfBirth && !member.relationship
        )
      ) {
        // Add a new empty row
        updated.push({
          id: Date.now().toString(),
          fullName: "",
          dateOfBirth: "",
          relationship: "",
        });
      }

      return updated;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Household</CardTitle>
        <CardDescription>
          For each person living in the plaintiff&apos;s household, please list the
          name, date of birth, and relationship to the plaintiff.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Full Name</TableHead>
                <TableHead className="w-1/3">Date of Birth</TableHead>
                <TableHead className="w-1/3">Relationship</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {householdMembers.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell className="p-2">
                    <Input
                      type="text"
                      name={`householdMember[${index}][fullName]`}
                      value={member.fullName}
                      onChange={(e) =>
                        handleInputChange(member.id, "fullName", e.target.value)
                      }
                      placeholder="Enter full name"
                      className="border-0 shadow-none focus-visible:ring-0"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="date"
                      name={`householdMember[${index}][dateOfBirth]`}
                      value={member.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange(
                          member.id,
                          "dateOfBirth",
                          e.target.value
                        )
                      }
                      className="border-0 shadow-none focus-visible:ring-0"
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Input
                      type="text"
                      name={`householdMember[${index}][relationship]`}
                      value={member.relationship}
                      onChange={(e) =>
                        handleInputChange(
                          member.id,
                          "relationship",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Spouse, Child, Parent"
                      className="border-0 shadow-none focus-visible:ring-0"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
