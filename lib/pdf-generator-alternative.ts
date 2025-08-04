// Alternative PDF generation using HTML/CSS to PDF conversion
// This approach doesn't require Chromium and works better in serverless environments

import { createClient } from './supabase/server-client'

export interface PDFGenerationResult {
  success: boolean
  buffer?: Buffer
  error?: string
}

// Helper function to generate PDF filenames
export function getFormPDFFileName(
  formType: 'personal-injury' | 'wrongful-death' | 'wrongful-termination',
  formId: string,
  lastName?: string
): string {
  const typeMap = {
    'personal-injury': 'Personal-Injury',
    'wrongful-death': 'Wrongful-Death',
    'wrongful-termination': 'Wrongful-Termination'
  }
  
  const formTypeName = typeMap[formType]
  const dateStr = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const lastNamePart = lastName ? `-${lastName.replace(/[^a-zA-Z0-9]/g, '')}` : ''
  
  return `${formTypeName}-Form${lastNamePart}-${dateStr}-${formId.substring(0, 8)}.pdf`
}

// For now, this will be a placeholder that returns success: false
// We can implement this with a different PDF library or external service later
export async function generateFormPDFFromData(
  formType: 'personal-injury' | 'wrongful-death' | 'wrongful-termination',
  formId: string
): Promise<PDFGenerationResult> {
  try {
    // Fetch form data from database to validate the form exists
    const supabase = await createClient()
    const tableName = `${formType.replace(/-/g, '_')}_forms`
    
    const { data: formData, error: dbError } = await supabase
      .from(tableName)
      .select('id, first_name, last_name, created_at')
      .eq('id', formId)
      .single()
    
    if (dbError || !formData) {
      throw new Error(`Form not found: ${formId}`)
    }

    console.log(`PDF generation requested for ${formType} form ${formId} (${formData.first_name} ${formData.last_name})`)

    // For now, return failure but log that we would generate a PDF
    // This allows the email to be sent without PDF attachment
    return {
      success: false,
      error: 'PDF generation temporarily unavailable - exploring alternative solutions'
    }

    // TODO: Implement alternative PDF generation
    // Options to explore:
    // 1. Use @react-pdf/renderer for server-side PDF generation
    // 2. Use an external PDF generation service (like HTMLtoPDF API)
    // 3. Use a different browser automation library
    // 4. Generate PDF on the client side and upload to server

  } catch (error) {
    console.error('Error in PDF generation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}