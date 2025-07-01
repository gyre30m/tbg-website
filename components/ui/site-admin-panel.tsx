'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Firm } from '@/lib/types'
import { createFirm } from '@/lib/auth-utils'

interface CreateFirmFormData {
  name: string
  domain: string
  adminEmail: string
}

export function SiteAdminPanel() {
  const [firms, setFirms] = useState<Firm[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreateFirmFormData>({
    name: '',
    domain: '',
    adminEmail: ''
  })

  useEffect(() => {
    fetchFirms()
  }, [])

  const fetchFirms = async () => {
    try {
      const { data, error } = await supabase
        .from('firms')
        .select(`
          *,
          user_profiles!firms_firm_admin_id_fkey(
            user_id,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching firms:', error)
        return
      }

      setFirms(data || [])
    } catch (error) {
      console.error('Error in fetchFirms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const firm = await createFirm(formData.name, formData.domain)
      
      if (firm) {
        // Reset form and refresh firms list
        setFormData({ name: '', domain: '', adminEmail: '' })
        setShowCreateForm(false)
        await fetchFirms()
      }
    } catch (error) {
      console.error('Error creating firm:', error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Administration</h1>
            <p className="text-gray-600 mt-2">Manage law firms and system settings</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
            Create New Firm
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Law Firm</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFirm} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firmName">Firm Name *</Label>
                    <Input
                      id="firmName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Smith & Associates"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Email Domain *</Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value.toLowerCase() })}
                      placeholder="e.g., smithlaw.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="adminEmail">Firm Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    placeholder="admin@smithlaw.com"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email domain must match the firm domain above
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Firm'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Law Firms ({firms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {firms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No law firms created yet.</p>
              ) : (
                <div className="space-y-4">
                  {firms.map((firm) => (
                    <div
                      key={firm.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{firm.name}</h3>
                        <p className="text-sm text-gray-600">Domain: {firm.domain}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(firm.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}