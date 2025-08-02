import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'

export async function POST(request: NextRequest) {
  try {
    const { email, firmId, role } = await request.json()

    if (!email || !firmId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firmId, role' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['firm_admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be firm_admin or user' },
        { status: 400 }
      )
    }

    // Create admin client with service role
    const supabase = createAdminClient()

    // Send invitation email using admin client
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(
      email.toLowerCase(),
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/signup?firmId=${firmId}&role=${role}&email=${encodeURIComponent(email)}`,
        data: {
          firm_id: firmId,
          role: role,
          invited_by: 'site_admin'
        }
      }
    )

    if (error) {
      console.error('Error sending invitation email:', error)
      return NextResponse.json(
        { error: `Failed to send invitation: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Invitation email sent successfully',
      invitationId: data.user?.id 
    })

  } catch (error) {
    console.error('Exception in invite-user API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}