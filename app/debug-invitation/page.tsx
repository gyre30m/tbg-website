'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function DebugInvitationPage() {
  const [formData, setFormData] = useState({
    email: '',
    firmId: '',
    firmDomain: ''
  })
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
    invitationResult?: unknown;
    databaseCheck?: unknown;
    details?: unknown;
  } | null>(null)

  const handleTest = async () => {
    if (!formData.email || !formData.firmId || !formData.firmDomain) return

    setTesting(true)
    setResult(null)

    try {
      const response = await fetch('/api/debug-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to test invitation',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Debug Invitation System</CardTitle>
          <CardDescription>
            Test the invitation system to diagnose issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="firmId">Firm ID</Label>
              <Input
                id="firmId"
                type="text"
                placeholder="firm-uuid-here"
                value={formData.firmId}
                onChange={(e) => setFormData(prev => ({ ...prev, firmId: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="firmDomain">Firm Domain</Label>
              <Input
                id="firmDomain"
                type="text"
                placeholder="example.com"
                value={formData.firmDomain}
                onChange={(e) => setFormData(prev => ({ ...prev, firmDomain: e.target.value }))}
              />
            </div>
          </div>

          <Button 
            onClick={handleTest} 
            disabled={!formData.email || !formData.firmId || !formData.firmDomain || testing}
            className="w-full"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Invitation...
              </>
            ) : (
              'Test Invitation System'
            )}
          </Button>

          {result && (
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-start space-x-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                    <div className="space-y-2">
                      <div><strong>Status:</strong> {result.success ? 'Success' : 'Failed'}</div>
                      {result.error && <div><strong>Error:</strong> {result.error}</div>}
                      <div>
                        <strong>Full Result:</strong>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">What this test does:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tests database connection</li>
              <li>• Tests admin client authentication</li>
              <li>• Runs the invitation function</li>
              <li>• Checks if invitation was saved to database</li>
              <li>• Shows detailed error information</li>
              <li>• Check browser console and server logs for more details</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">To get firm info:</h3>
            <p className="text-sm text-yellow-800">
              Go to your Supabase dashboard → SQL Editor → Run: 
              <code className="bg-yellow-200 px-1 rounded">SELECT id, name, domain FROM firms;</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}