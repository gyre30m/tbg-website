import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { createClient } from '@/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  try {
    const { email, firmId, firmDomain } = await request.json()
    
    console.log('=== INVITATION DEBUG V2 ===')
    console.log('Input:', { email, firmId, firmDomain })
    
    // Step 1: Check environment variables
    console.log('Environment check:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING')
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING')
    
    // Step 2: Test admin client creation
    let adminClient
    try {
      adminClient = createAdminClient()
      console.log('✓ Admin client created successfully')
    } catch (error) {
      console.error('✗ Failed to create admin client:', error)
      return NextResponse.json({ error: 'Failed to create admin client', details: error })
    }
    
    // Step 3: Test server client creation
    let supabase
    try {
      supabase = await createClient()
      console.log('✓ Server client created successfully')
    } catch (error) {
      console.error('✗ Failed to create server client:', error)
      return NextResponse.json({ error: 'Failed to create server client', details: error })
    }
    
    // Step 4: Test domain validation
    const emailDomain = email.split('@')[1]
    if (emailDomain !== firmDomain) {
      console.log('✗ Domain validation failed:', emailDomain, '!==', firmDomain)
      return NextResponse.json({ error: `Email must use ${firmDomain} domain` })
    }
    console.log('✓ Domain validation passed')
    
    // Step 5: Test admin.listUsers()
    let usersList
    try {
      const result = await adminClient.auth.admin.listUsers()
      usersList = result.data
      console.log('✓ Successfully fetched users list, count:', usersList?.users?.length || 0)
    } catch (error) {
      console.error('✗ Failed to list users:', error)
      return NextResponse.json({ error: 'Failed to list users', details: error })
    }
    
    // Step 6: Check for existing user
    const existingAuthUser = usersList?.users?.find(user => user.email === email.toLowerCase())
    if (existingAuthUser) {
      console.log('✓ User already exists, blocking invitation')
      return NextResponse.json({ 
        userExists: true, 
        message: 'User already exists in the system',
        userId: existingAuthUser.id
      })
    }
    console.log('✓ User does not exist, proceeding with invitation')
    
    // Step 7: Test invitation record creation
    try {
      const { error: inviteError } = await supabase
        .from('user_invitations')
        .insert([{
          email: email.toLowerCase(),
          firm_id: firmId,
          role: 'user',
          invited_at: new Date().toISOString(),
        }])
      
      if (inviteError) {
        console.error('✗ Failed to create invitation record:', inviteError)
        return NextResponse.json({ error: 'Failed to create invitation record', details: inviteError })
      }
      console.log('✓ Invitation record created successfully')
    } catch (error) {
      console.error('✗ Exception creating invitation record:', error)
      return NextResponse.json({ error: 'Exception creating invitation record', details: error })
    }
    
    // Step 8: Test email sending
    try {
      const { error: emailError } = await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/complete-profile`,
        data: {
          firm_id: firmId,
          role: 'user'
        }
      })
      
      if (emailError) {
        console.error('✗ Failed to send invitation email:', emailError)
        return NextResponse.json({ 
          success: true, 
          warning: 'Invitation created but email delivery failed',
          emailError: emailError 
        })
      }
      console.log('✓ Invitation email sent successfully')
    } catch (error) {
      console.error('✗ Exception sending invitation email:', error)
      return NextResponse.json({ 
        success: true, 
        warning: 'Invitation created but email delivery failed',
        emailException: error 
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Invitation sent successfully',
      debug: 'All steps completed successfully'
    })
    
  } catch (error) {
    console.error('=== INVITATION DEBUG ERROR ===', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error during invitation process',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}