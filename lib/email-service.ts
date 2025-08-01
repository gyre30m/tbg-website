/**
 * Alternative email service for user invitations
 * Uses direct API calls when Supabase SMTP is not configured
 */

interface EmailInvitation {
  to: string
  firmName: string
  inviteUrl: string
}

/**
 * Send invitation email using Resend API as fallback
 * This can be used when Supabase SMTP is not properly configured
 */
export async function sendInvitationEmail({ to, firmName, inviteUrl }: EmailInvitation) {
  // Check if we have Resend API key configured
  const resendApiKey = process.env.RESEND_API_KEY
  
  if (!resendApiKey) {
    console.warn('No Resend API key configured. Email sending skipped.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'noreply@the-bradley-group.com',
        to: [to],
        subject: `You've been added to ${firmName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">${inviteUrl.includes('signin') ? 'You\'ve been added to ' + firmName : 'You\'ve been invited to join ' + firmName}</h2>
            
            <p>Hello,</p>
            
            ${inviteUrl.includes('signin') ? 
              `<p>Your account has been added to <strong>${firmName}</strong> on The Bradley Group platform. You can now access the firm's resources and forms.</p>
               
               <p>Click the link below to sign in with your existing credentials:</p>` :
              `<p>You've been invited to join <strong>${firmName}</strong> on The Bradley Group platform.</p>
               
               <p>Click the link below to accept your invitation and create your account:</p>`
            }
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${inviteUrl}" 
                 style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                ${inviteUrl.includes('signin') ? 'Sign In Now' : 'Accept Invitation'}
              </a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${inviteUrl}</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 12px;">
              This ${inviteUrl.includes('signin') ? 'notification' : 'invitation'} was sent by ${firmName}. If you didn't expect this email, you can ignore it.
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return { success: false, error: 'Failed to send email via Resend' }
    }

    const result = await response.json()
    console.log('Email sent successfully via Resend:', result.id)
    return { success: true, messageId: result.id }

  } catch (error) {
    console.error('Error sending email via Resend:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * Generate invitation URL for user signup
 */
export function generateInviteUrl(email: string, firmId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const encodedEmail = encodeURIComponent(email)
  return `${baseUrl}/auth/signup?email=${encodedEmail}&firm_id=${firmId}&type=invite`
}