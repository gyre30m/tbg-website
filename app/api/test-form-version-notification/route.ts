import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Mock data for testing form version notification
    const mockFormData = {
      first_name: 'John',
      last_name: 'Doe',
    }

    const mockFieldChanges = [
      { field: 'Phone', oldValue: '555-1234', newValue: '555-5678' },
      { field: 'Email', oldValue: 'john.old@example.com', newValue: 'john.new@example.com' },
      { field: 'Address 1', oldValue: '123 Old St', newValue: '456 New Ave' }
    ]

    const userFullName = 'Test User'
    const firmName = 'Test Law Firm'
    const formType = 'Personal Injury'
    const version = 3
    const previousVersion = 2
    const formId = 'test-form-id-123'
    const plaintiffFullName = `${mockFormData.first_name} ${mockFormData.last_name}`

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

    // Construct the readonly form URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.the-bradley-group.com'
    const formUrl = `${baseUrl}/forms/personal-injury/${formId}`
    
    // Create email body with version information and changes
    const emailBody = `${userFullName} from ${firmName} updated a ${formType} regarding ${plaintiffFullName} at ${timestamp}

Version: ${version} (previous version: ${previousVersion})

Changes made:
${mockFieldChanges.map(change => `• ${change.field}: "${change.oldValue}" → "${change.newValue}"`).join('\n')}

View the updated form: ${formUrl}`

    // Create HTML version of the email
    const changesHtml = mockFieldChanges.map(change => 
      `<li><strong>${change.field}:</strong> "${change.oldValue}" → "${change.newValue}"</li>`
    ).join('')

    const emailHtml = `
      <p>${userFullName} from <strong>${firmName}</strong> updated a <strong>${formType}</strong> regarding <strong>${plaintiffFullName}</strong> at ${timestamp}</p>
      <p><strong>Version:</strong> ${version} (previous version: ${previousVersion})</p>
      <div>
        <strong>Changes made:</strong>
        <ul>${changesHtml}</ul>
      </div>
      <p><a href="${formUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Updated Form</a></p>
    `

    // Send test email
    const { data, error } = await resend.emails.send({
      from: 'The Bradley Group <noreply@forms.the-bradley-group.com>',
      to: ['forms@the-bradley-group.com'],
      subject: `${formType} Form Updated - Version ${version} (TEST)`,
      text: emailBody,
      html: emailHtml,
    })

    if (error) {
      console.error('Failed to send test version notification email:', error)
      return NextResponse.json(
        { error: 'Failed to send test email', details: error },
        { status: 500 }
      )
    }

    console.log('Test version notification email sent successfully:', data?.id)
    return NextResponse.json({ 
      success: true, 
      emailId: data?.id,
      message: 'Test version notification email sent successfully',
      mockData: {
        formType,
        version,
        previousVersion,
        changes: mockFieldChanges.length,
        plaintiff: plaintiffFullName
      }
    })

  } catch (error) {
    console.error('Error sending test version notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}