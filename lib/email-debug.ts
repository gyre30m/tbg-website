/**
 * Email debugging utilities for testing invitation functionality
 */

import { createAdminClient } from './supabase/admin-client'
import { sendInvitationEmail, generateInviteUrl } from './email-service'

export async function testSupabaseEmail(email: string) {
  console.log('Testing Supabase email delivery...')
  
  const adminClient = createAdminClient()
  
  try {
    const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/signup?test=true`,
      data: {
        test: true
      }
    })

    if (error) {
      console.error('Supabase email test failed:', error)
      return { success: false, error: error.message }
    }

    console.log('Supabase email test succeeded')
    return { success: true }
  } catch (error) {
    console.error('Supabase email test error:', error)
    return { success: false, error: 'Test failed' }
  }
}

export async function testFallbackEmail(email: string) {
  console.log('Testing fallback email delivery...')
  
  const inviteUrl = generateInviteUrl(email, 'test-firm-id')
  
  const result = await sendInvitationEmail({
    to: email,
    firmName: 'Test Firm',
    inviteUrl
  })

  if (result.success) {
    console.log('Fallback email test succeeded:', result.messageId)
  } else {
    console.error('Fallback email test failed:', result.error)
  }

  return result
}

export async function debugEmailConfiguration() {
  console.log('=== Email Configuration Debug ===')
  
  // Check environment variables
  console.log('Environment Variables:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Missing')
  console.log('- FROM_EMAIL:', process.env.FROM_EMAIL || 'Not set (will use default)')
  console.log('- NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || 'Not set (will use localhost)')
  
  // Check if we can create admin client
  try {
    const adminClient = createAdminClient()
    console.log('✓ Admin client creation successful')
    
    // Test basic auth
    await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 })
    console.log('✓ Admin client authentication successful')
  } catch (error) {
    console.error('✗ Admin client error:', error)
  }
}