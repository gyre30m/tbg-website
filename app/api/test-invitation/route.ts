import { NextRequest, NextResponse } from 'next/server'
import { inviteUserToFirmAction } from '@/lib/actions'

export async function POST(request: NextRequest) {
  try {
    const { email, firmId, firmDomain } = await request.json()
    
    if (!email || !firmId || !firmDomain) {
      return NextResponse.json({ 
        error: 'Email, firmId, and firmDomain are required' 
      }, { status: 400 })
    }

    console.log(`Testing invitation for: ${email} to firm: ${firmId} (${firmDomain})`)

    // Test the actual invitation function
    const result = await inviteUserToFirmAction(email, firmId, firmDomain)

    // If user exists, show password reset option
    if (result.userExists) {
      return NextResponse.json({
        ...result,
        suggestion: 'Use the password reset function to send login instructions to this existing user'
      })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Invitation test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to test invitation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}