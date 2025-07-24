'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Plus } from 'lucide-react'

interface Dependent {
  id: string
  fullName: string
  dateOfBirth: string
  relationship: string
}

interface WdDependentsProps {
  householdDependents: Dependent[]
  setHouseholdDependents: (dependents: Dependent[]) => void
  otherDependents: Dependent[]
  setOtherDependents: (dependents: Dependent[]) => void
}

export function WdDependents({ 
  householdDependents, 
  setHouseholdDependents, 
  otherDependents, 
  setOtherDependents 
}: WdDependentsProps) {
  const addDependent = (type: 'household' | 'other') => {
    const newDependent = {
      id: Date.now().toString(),
      fullName: '',
      dateOfBirth: '',
      relationship: ''
    }
    
    if (type === 'household') {
      setHouseholdDependents([...householdDependents, newDependent])
    } else {
      setOtherDependents([...otherDependents, newDependent])
    }
  }

  const removeDependent = (id: string, type: 'household' | 'other') => {
    if (type === 'household') {
      setHouseholdDependents(householdDependents.filter(dep => dep.id !== id))
    } else {
      setOtherDependents(otherDependents.filter(dep => dep.id !== id))
    }
  }

  const updateDependent = (id: string, field: keyof Dependent, value: string, type: 'household' | 'other') => {
    if (type === 'household') {
      setHouseholdDependents(householdDependents.map(dep => dep.id === id ? { ...dep, [field]: value } : dep))
    } else {
      setOtherDependents(otherDependents.map(dep => dep.id === id ? { ...dep, [field]: value } : dep))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Dependents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Household Section (H3) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Household</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For each person living in the decedent&apos;s household at the time of death, please list the name, date of birth, and relationship to the decedent.
          </p>
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
                {householdDependents.map((dependent) => (
                  <TableRow key={dependent.id}>
                    <TableCell>
                      <Input
                        value={dependent.fullName}
                        onChange={(e) => updateDependent(dependent.id, 'fullName', e.target.value, 'household')}
                        placeholder="Full Name"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={dependent.dateOfBirth}
                        onChange={(e) => updateDependent(dependent.id, 'dateOfBirth', e.target.value, 'household')}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={dependent.relationship}
                        onChange={(e) => updateDependent(dependent.id, 'relationship', e.target.value, 'household')}
                        placeholder="Relationship"
                      />
                    </TableCell>
                    <TableCell>
                      {householdDependents.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDependent(dependent.id, 'household')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" variant="outline" onClick={() => addDependent('household')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Household Dependent
            </Button>
          </div>
        </div>

        <Separator />

        {/* Other Dependents Section (H3) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Other Dependents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For each person receiving assistance from the deceased but not living in the same household at the time of death, please list the name, date of birth, and relationship to the decedent.
          </p>
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
                {otherDependents.map((dependent) => (
                  <TableRow key={dependent.id}>
                    <TableCell>
                      <Input
                        value={dependent.fullName}
                        onChange={(e) => updateDependent(dependent.id, 'fullName', e.target.value, 'other')}
                        placeholder="Full Name"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={dependent.dateOfBirth}
                        onChange={(e) => updateDependent(dependent.id, 'dateOfBirth', e.target.value, 'other')}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={dependent.relationship}
                        onChange={(e) => updateDependent(dependent.id, 'relationship', e.target.value, 'other')}
                        placeholder="Relationship"
                      />
                    </TableCell>
                    <TableCell>
                      {otherDependents.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDependent(dependent.id, 'other')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" variant="outline" onClick={() => addDependent('other')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Other Dependent
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}