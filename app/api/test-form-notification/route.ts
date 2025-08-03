import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    console.log('Test email endpoint called')
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Test data that mimics a form submission
    const plaintiffFirstName = 'John'
    const plaintiffLastName = 'Doe'
    const userFullName = 'Test User Attorney'
    const firmName = 'Test Law Firm'
    
    // Format timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })

    // Create simple email body as requested
    const emailBody = `${userFullName} from ${firmName} submitted a Personal Injury regarding ${plaintiffFirstName} ${plaintiffLastName} at ${timestamp}`

    console.log('Sending test email with body:', emailBody)

    // Send email directly using Resend
    const { data, error } = await resend.emails.send({
      from: 'The Bradley Group <noreply@the-bradley-group.com>',
      to: ['forms@the-bradley-group.com'],
      subject: 'New Personal Injury Form Submission',
      text: emailBody,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { success: false, error: 'Email sending failed', details: error },
        { status: 500 }
      )
    }

    console.log('Test email sent successfully:', data?.id)
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: data?.id,
      body: emailBody
    })

  } catch (error) {
    console.error('Error testing email notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send test email', details: String(error) },
      { status: 500 }
    )
  }
}