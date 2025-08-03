'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestFormEmailPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: unknown
  } | null>(null)

  const testEmail = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-form-notification')
      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: `Test email sent successfully! Email ID: ${data.emailId}`,
          details: data
        })
      } else {
        setResult({
          success: false,
          message: 'Failed to send test email',
          details: data
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Error sending test email',
        details: error
      })
    } finally {
      setLoading(false)
    }
  }

  const checkConfig = () => {
    const hasResendKey = process.env.NEXT_PUBLIC_RESEND_API_KEY ? 'Yes (public)' : 'No'
    const hasSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'Not set'
    
    return {
      resendKey: hasResendKey,
      siteUrl: hasSiteUrl
    }
  }

  const config = checkConfig()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Test Form Email Notifications</CardTitle>
          <CardDescription>
            Test the email notification system for form submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Configuration Status</h3>
            <div className="space-y-1 text-sm">
              <p>• RESEND_API_KEY (public check): {config.resendKey}</p>
              <p>• NEXT_PUBLIC_SITE_URL: {config.siteUrl}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Note: The actual RESEND_API_KEY should be set as a server-side environment variable, not NEXT_PUBLIC_
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Test Email Details</h3>
            <div className="space-y-1 text-sm">
              <p>• To: forms@the-bradley-group.com</p>
              <p>• From: The Bradley Group &lt;noreply@the-bradley-group.com&gt;</p>
              <p>• Subject: New Personal Injury Form Submission</p>
              <p>• Body: Test User Attorney from Test Law Firm submitted a Personal Injury regarding John Doe at [current timestamp]</p>
            </div>
          </div>

          <Button
            onClick={testEmail}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Test Email...
              </>
            ) : (
              'Send Test Email'
            )}
          </Button>

          {result && (
            <Alert className={result.success ? 'border-green-200' : 'border-red-200'}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                <div>
                  <p className="font-semibold">{result.message}</p>
                  {result.details ? (
                    <pre className="mt-2 text-xs overflow-auto">
                      {typeof result.details === 'object' 
                        ? JSON.stringify(result.details, null, 2)
                        : String(result.details)}
                    </pre>
                  ) : null}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Troubleshooting</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Check the server logs for any error messages</p>
              <p>• Verify RESEND_API_KEY is set in your .env.local file (not NEXT_PUBLIC_)</p>
              <p>• Ensure the from domain is verified in Resend</p>
              <p>• Check spam folder for test emails</p>
              <p>• Verify forms@the-bradley-group.com is a valid recipient</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}