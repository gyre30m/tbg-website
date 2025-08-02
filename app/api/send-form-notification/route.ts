import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface FormNotificationRequest {
  formType: 'personal_injury' | 'wrongful_death' | 'wrongful_termination'
  formId: string
  submitterName: string
  submitterEmail: string
  firmName?: string
  formData: Record<string, unknown>
  userFullName: string
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const body: FormNotificationRequest = await request.json()
    const { formType, formId, submitterName, submitterEmail, firmName, formData, userFullName } = body

    // Validate required fields
    if (!formType || !formId || !submitterName || !submitterEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create human-readable form type
    const formTypeDisplay = formType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    // Get plaintiff name from form data
    const plaintiffFirstName = formData.first_name || 'Unknown'
    const plaintiffLastName = formData.last_name || 'Plaintiff'
    const plaintiffFullName = `${plaintiffFirstName} ${plaintiffLastName}`

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
    const emailBody = `${userFullName} from ${firmName || 'Unknown Firm'} submitted a ${formTypeDisplay} regarding ${plaintiffFullName} at ${timestamp}`

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'The Bradley Group <noreply@the-bradley-group.com>',
      to: ['forms@the-bradley-group.com'],
      subject: `New ${formTypeDisplay} Form Submission`,
      text: emailBody,
    })

    if (error) {
      console.error('Failed to send notification email:', error)
      return NextResponse.json(
        { error: 'Failed to send notification email', details: error },
        { status: 500 }
      )
    }

    console.log('Form notification email sent successfully:', data?.id)
    return NextResponse.json({ 
      success: true, 
      emailId: data?.id,
      message: 'Notification email sent successfully'
    })

  } catch (error) {
    console.error('Error sending form notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}