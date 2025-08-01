import { NextRequest, NextResponse } from 'next/server'
import { inviteUserToFirmAction } from '@/lib/actions'
import { createClient } from '@/lib/supabase/server-client'
import { createAdminClient } from '@/lib/supabase/admin-client'

export async function POST(request: NextRequest) {
  try {
    const { email, firmId, firmDomain } = await request.json()
    
    if (!email || !firmId || !firmDomain) {
      return NextResponse.json({ 
        error: 'Email, firmId, and firmDomain are required',
        received: { email, firmId, firmDomain }
      }, { status: 400 })
    }

    console.log('=== DEBUGGING INVITATION ===')
    console.log('Input:', { email, firmId, firmDomain })

    // Test database connection
    try {
      const supabase = await createClient()
      const { data: testQuery, error: testError } = await supabase
        .from('user_invitations')
        .select('*')
        .limit(1)
      
      console.log('Database connection test:', { data: testQuery, error: testError })
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }

    // Test admin client
    try {
      const adminClient = createAdminClient()
      const { data: adminTest } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 })
      console.log('Admin client test:', adminTest ? 'Success' : 'Failed')
    } catch (adminError) {
      console.error('Admin client failed:', adminError)
      return NextResponse.json({ 
        error: 'Admin client failed',
        details: adminError instanceof Error ? adminError.message : 'Unknown admin error'
      }, { status: 500 })
    }

    // Test the actual invitation function
    console.log('Calling inviteUserToFirmAction...')
    const result = await inviteUserToFirmAction(email, firmId, firmDomain)
    console.log('Invitation result:', result)

    // Check if invitation was actually created
    const supabase = await createClient()
    const { data: invitationCheck, error: checkError } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('firm_id', firmId)
      .order('invited_at', { ascending: false })
      .limit(1)

    console.log('Database check after invitation:', { data: invitationCheck, error: checkError })

    return NextResponse.json({
      success: true,
      invitationResult: result,
      databaseCheck: {
        data: invitationCheck,
        error: checkError
      },
      debug: 'Check server logs for detailed information'
    })

  } catch (error) {
    console.error('Debug invitation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}