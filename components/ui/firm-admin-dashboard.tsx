'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getFirmUsers, removeUserFromFirm, inviteUserToFirmAction } from '@/lib/actions'
import { supabase } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, Trash2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

interface FirmUser {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  email: string
  role: string
  saved_forms_count: number
  submitted_forms_count: number
}

interface Firm {
  id: string
  name: string
  domain: string
}

interface FirmAdminDashboardProps {
  targetFirm?: Firm
}

export function FirmAdminDashboard({ targetFirm }: FirmAdminDashboardProps) {
  const { userProfile, userFirm } = useAuth()
  const [users, setUsers] = useState<FirmUser[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviting, setInviting] = useState(false)

  // Use target firm if provided, otherwise use user's firm
  const activeFirm = targetFirm || userFirm
  const activeFirmId = targetFirm?.id || userProfile?.firm_id

  const fetchFirmUsers = async () => {
    if (!activeFirmId) return

    try {
      const result = await getFirmUsers(activeFirmId)
      
      if (result.success && result.users) {
        setUsers(result.users)
      } else {
        toast.error(result.error || 'Failed to load firm users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load firm users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFirmUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFirmId])

  const handleInviteUser = async () => {
    if (!inviteEmail || !activeFirm?.domain || !activeFirmId) return

    setInviting(true)
    try {
      const result = await inviteUserToFirmAction(inviteEmail, activeFirmId, activeFirm.domain)
      
      if (result.success) {
        toast.success(`Invitation sent to ${inviteEmail}`)
        setInviteEmail('')
        setInviteDialogOpen(false)
        await fetchFirmUsers()
      } else {
        toast.error(result.error || 'Failed to invite user')
      }
    } catch (error) {
      console.error('Error inviting user:', error)
      toast.error('Failed to invite user')
    } finally {
      setInviting(false)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${userEmail} from the firm?`)) return

    try {
      const result = await removeUserFromFirm(userId)
      
      if (result.success) {
        toast.success('User removed from firm')
        await fetchFirmUsers()
      } else {
        toast.error(result.error || 'Failed to remove user')
      }
    } catch (error) {
      console.error('Error removing user:', error)
      toast.error('Failed to remove user')
    }
  }

  const handleResetPassword = async (userEmail: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      toast.success(`Password reset email sent to ${userEmail}`)
    } catch (error) {
      console.error('Error sending password reset:', error)
      toast.error('Failed to send password reset email')
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Firm Administration</h1>
        <p className="text-muted-foreground">
          {activeFirm?.name} - Manage users and forms
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Firm Users</CardTitle>
                  <CardDescription>
                    Manage users in your firm
                  </CardDescription>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite User</DialogTitle>
                      <DialogDescription>
                        Invite a new user to join {activeFirm?.name}. Email must use @{activeFirm?.domain} domain.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={`user@${activeFirm?.domain}`}
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        onClick={handleInviteUser}
                        disabled={inviting || !inviteEmail}
                      >
                        {inviting ? 'Sending...' : 'Send Invitation'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Saved</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : 'Name not set'
                        }
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'firm_admin' ? 'default' : 'secondary'}>
                          {user.role === 'firm_admin' ? 'Firm Admin' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.saved_forms_count}</TableCell>
                      <TableCell>{user.submitted_forms_count}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetPassword(user.email)}
                          >
                            <RotateCcw className="h-4 w-4" />
                            Reset PW
                          </Button>
                          {user.role !== 'firm_admin' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.user_id, user.email)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No users found in this firm
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Forms Management</CardTitle>
              <CardDescription>
                View and manage forms submitted by firm users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Forms management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}