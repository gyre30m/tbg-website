import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-client'
import { createAdminClient } from '@/lib/supabase/admin-client'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log(`Checking user: ${email}`)

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check auth users
    const { data: usersList } = await adminClient.auth.admin.listUsers()
    const authUser = usersList?.users?.find(user => user.email === email.toLowerCase())

    // Check user_profiles by user_id if auth user exists
    let profileData = null
    if (authUser) {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single()
      profileData = data
    }

    // Check user_invitations
    const { data: invitationData } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('email', email.toLowerCase())

    const result = {
      email: email,
      authUser: authUser ? {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        user_metadata: authUser.user_metadata
      } : null,
      userProfile: profileData || null,
      invitations: invitationData || [],
      summary: {
        existsInAuth: !!authUser,
        existsInProfiles: !!profileData,
        hasInvitations: (invitationData?.length || 0) > 0
      }
    }

    console.log('User check result:', result)

    return NextResponse.json(result)

  } catch (error) {
    console.error('User check error:', error)
    return NextResponse.json({ 
      error: 'Failed to check user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}