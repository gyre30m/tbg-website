import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-client'

export async function GET() {
  try {
    console.log('Testing admin client...')
    
    // Check environment variables
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    
    console.log('Environment check:', { hasServiceKey, hasUrl })
    
    if (!hasServiceKey) {
      return NextResponse.json({ 
        error: 'SUPABASE_SERVICE_ROLE_KEY not found in environment variables' 
      }, { status: 500 })
    }
    
    if (!hasUrl) {
      return NextResponse.json({ 
        error: 'NEXT_PUBLIC_SUPABASE_URL not found in environment variables' 
      }, { status: 500 })
    }

    const adminClient = createAdminClient()
    console.log('Admin client created')

    // Test basic admin function
    const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 })
    
    console.log('Admin test result:', { 
      success: !error, 
      userCount: data?.users?.length || 0, 
      error: error?.message 
    })

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code || 'unknown'
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin client working correctly',
      userCount: data?.users?.length || 0
    })

  } catch (error) {
    console.error('Admin client test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Admin client test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}