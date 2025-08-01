import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { debugEmailConfiguration } from '@/lib/email-debug'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log(`Testing email delivery to: ${email}`)

    // First, debug the configuration
    await debugEmailConfiguration()

    const adminClient = createAdminClient()

    // Test Supabase email delivery
    const { error: emailError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/complete-profile?test=true`,
      data: {
        test: true,
        purpose: 'SMTP configuration test'
      }
    })

    if (emailError) {
      console.error('Supabase email test failed:', emailError)
      return NextResponse.json({ 
        success: false, 
        error: emailError.message,
        details: emailError
      }, { status: 400 })
    }

    console.log('Supabase email test succeeded')
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully via Supabase SMTP',
      recipient: email
    })

  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}