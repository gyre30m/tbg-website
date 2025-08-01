import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log(`Attempting to clean up auth user: ${email}`)

    const adminClient = createAdminClient()

    // Find the auth user
    const { data: usersList } = await adminClient.auth.admin.listUsers()
    const authUser = usersList?.users?.find(user => user.email === email.toLowerCase())

    if (!authUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'No auth user found with that email' 
      })
    }

    // Delete the auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(authUser.id)

    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete auth user',
        details: deleteError.message 
      }, { status: 400 })
    }

    console.log('Auth user deleted successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'Auth user deleted successfully',
      deletedUser: {
        id: authUser.id,
        email: authUser.email
      }
    })

  } catch (error) {
    console.error('User cleanup error:', error)
    return NextResponse.json({ 
      error: 'Failed to cleanup user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}