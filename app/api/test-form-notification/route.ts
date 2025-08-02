import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test data that mimics a form submission
    const testFormData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@testfirm.com',
      phone: '555-123-4567',
      address1: '123 Test Street',
      address2: 'Suite 100',
      city: 'Test City',
      state: 'CA',
      zip_code: '90210',
      incident_date: '2024-01-15',
      injury_description: 'Test injury for email notification',
      trial_date: '2024-12-01',
      trial_location: 'Superior Court of Test County',
      defendant: 'Test Defendant Corp'
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-form-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType: 'personal_injury',
        formId: 'test-123',
        submitterName: 'John Doe',
        submitterEmail: 'john.doe@testfirm.com',
        firmName: 'Test Law Firm',
        formData: testFormData,
        userFullName: 'Test User Attorney'
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { success: false, error: 'Email API failed', details: errorData },
        { status: 500 }
      )
    }

    const result = await response.json()
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: result.emailId
    })

  } catch (error) {
    console.error('Error testing email notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send test email', details: error },
      { status: 500 }
    )
  }
}