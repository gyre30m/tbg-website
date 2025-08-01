import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { storagePath } = await request.json()
    
    if (!storagePath) {
      return NextResponse.json(
        { error: 'Storage path required' },
        { status: 400 }
      )
    }
    
    // Check if user has access to this file
    // Extract firm_id from path
    const pathParts = storagePath.split('/')
    const fileFirmId = pathParts[0]
    
    // Get user's firm_id and role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('firm_id, role')
      .eq('user_id', user.id)
      .single()
    
    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      )
    }
    
    // Check access: site admin can access all, others need matching firm_id
    if (profile.role !== 'site_admin' && profile.firm_id !== fileFirmId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    // Generate signed URL valid for 1 hour
    const { data, error } = await supabase.storage
      .from('form-documents')
      .createSignedUrl(storagePath, 3600)
    
    if (error || !data) {
      console.error('Error creating signed URL:', error)
      return NextResponse.json(
        { error: 'Failed to generate document URL' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl
    })
    
  } catch (error) {
    console.error('Get document URL error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}