import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'

export async function POST(request: NextRequest) {
  try {
    const { email, firmId, userId } = await request.json()

    if (!email || !firmId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firmId, userId' },
        { status: 400 }
      )
    }

    // Create admin client with service role to bypass RLS
    const supabase = createAdminClient()

    // Update the invitation to mark as accepted
    const { data, error } = await supabase
      .from('user_invitations')
      .update({ 
        accepted_at: new Date().toISOString(),
        user_id: userId 
      })
      .eq('email', email.toLowerCase())
      .eq('firm_id', firmId)
      .select()

    if (error) {
      console.error('Error accepting invitation:', error)
      return NextResponse.json(
        { error: `Failed to accept invitation: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No matching invitation found to accept' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Invitation accepted successfully',
      invitation: data[0]
    })

  } catch (error) {
    console.error('Exception in accept-invitation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}