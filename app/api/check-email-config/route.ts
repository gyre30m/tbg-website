import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  const config = {
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    resendApiKeyLength: process.env.RESEND_API_KEY?.length || 0,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
    nodeEnv: process.env.NODE_ENV
  }

  // Test Resend connection if API key exists
  let resendTest: { status: string; error: unknown; emailId?: string } = { status: 'Not tested', error: null }
  
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      // Try to verify the API key by attempting to send a test email
      const { data, error } = await resend.emails.send({
        from: 'The Bradley Group <noreply@the-bradley-group.com>',
        to: ['forms@the-bradley-group.com'],
        subject: 'Email Configuration Test',
        text: 'This is a test email to verify the Resend configuration is working correctly.',
      })
      
      if (error) {
        resendTest = { status: 'Failed', error }
      } else {
        resendTest = { status: 'Success', error: null, emailId: data?.id }
      }
    } catch (error) {
      resendTest = { status: 'Error', error: String(error) }
    }
  }

  return NextResponse.json({
    configuration: config,
    resendTest,
    timestamp: new Date().toISOString()
  })
}