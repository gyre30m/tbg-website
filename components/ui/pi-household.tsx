'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Plus } from 'lucide-react'

interface HouseholdMember {
  id: string
  fullName: string
  dateOfBirth: string
  relationship: string
}

interface PiHouseholdProps {
  householdMembers: HouseholdMember[]
  setHouseholdMembers: (members: HouseholdMember[]) => void
}

export function PiHousehold({ householdMembers, setHouseholdMembers }: PiHouseholdProps) {
  const addHouseholdMember = () => {
    setHouseholdMembers([...householdMembers, {
      id: Date.now().toString(),
      fullName: '',
      dateOfBirth: '',
      relationship: ''
    }])
  }

  const removeHouseholdMember = (id: string) => {
    setHouseholdMembers(householdMembers.filter(member => member.id !== id))
  }

  const updateHouseholdMember = (id: string, field: keyof HouseholdMember, value: string) => {
    setHouseholdMembers(householdMembers.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Household</CardTitle>
        <p className="text-sm text-muted-foreground">
          For each person living in the plaintiff&apos;s household, please list the name, date of birth, and relationship to the plaintiff.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {householdMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Input
                      value={member.fullName}
                      onChange={(e) => updateHouseholdMember(member.id, 'fullName', e.target.value)}
                      placeholder="Full Name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={member.dateOfBirth}
                      onChange={(e) => updateHouseholdMember(member.id, 'dateOfBirth', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={member.relationship}
                      onChange={(e) => updateHouseholdMember(member.id, 'relationship', e.target.value)}
                      placeholder="Relationship"
                    />
                  </TableCell>
                  <TableCell>
                    {householdMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHouseholdMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button type="button" variant="outline" onClick={addHouseholdMember}>
            <Plus className="h-4 w-4 mr-2" />
            Add Household Member
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}