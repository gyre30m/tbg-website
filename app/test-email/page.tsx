'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; details?: string } | null>(null)

  const handleTest = async () => {
    if (!email) return

    setTesting(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to test email delivery',
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
          <CardTitle>Email Delivery Test</CardTitle>
          <CardDescription>
            Test if the Supabase SMTP configuration is working properly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Test Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleTest} 
            disabled={!email || testing}
            className="w-full"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Test Email...
              </>
            ) : (
              'Send Test Email'
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
                    <strong>{result.success ? 'Success!' : 'Failed:'}</strong> {result.message}
                    {result.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm">Show details</summary>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {result.details}
                        </pre>
                      </details>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">What this test does:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Checks if the Supabase service role key is configured correctly</li>
              <li>• Tests the SMTP settings you configured in Supabase</li>
              <li>• Sends a test invitation email using Supabase Auth</li>
              <li>• Shows detailed error information if something fails</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">After sending:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Check your email inbox (and spam folder)</li>
              <li>• Look for an invitation email from your configured sender</li>
              <li>• The email should have a signup link with test parameters</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}