import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { createClient } from './supabase/server-client'

// For local development
let puppeteerFull: typeof puppeteer | null = null
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  puppeteerFull = require('puppeteer')
} catch {
  // Regular puppeteer not available
}

export interface PDFGenerationResult {
  success: boolean
  buffer?: Buffer
  error?: string
}

// Template for generating HTML directly from form data
function generateFormHTML(
  formType: 'personal-injury' | 'wrongful-death' | 'wrongful-termination',
  formData: Record<string, unknown>
): string {
  const formTypeLabel = formType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  // Basic HTML template that matches the readonly form view styling
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formTypeLabel} Form</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #111;
        }
        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        .field-group {
          margin-bottom: 1.5rem;
        }
        .field-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        .field-value {
          padding: 0.75rem;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          min-height: 40px;
        }
        .field-value.empty {
          color: #9ca3af;
          font-style: italic;
        }
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .metadata {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }
        .metadata-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .metadata-item:last-child {
          margin-bottom: 0;
        }
        @media print {
          body {
            padding: 20px;
          }
          h2 {
            page-break-before: auto;
            page-break-after: avoid;
          }
        }
      </style>
    </head>
    <body>
      <h1>${formTypeLabel} Form</h1>
      
      <div class="metadata">
        <div class="metadata-item">
          <span><strong>Form ID:</strong></span>
          <span>${formData.id}</span>
        </div>
        <div class="metadata-item">
          <span><strong>Submitted:</strong></span>
          <span>${new Date(formData.created_at).toLocaleString()}</span>
        </div>
        <div class="metadata-item">
          <span><strong>Status:</strong></span>
          <span>${formData.status}</span>
        </div>
      </div>

      ${generateFormSections(formType, formData)}
    </body>
    </html>
  `
}

function generateFormSections(formType: string, formData: Record<string, unknown>): string {
  // Helper to format field value
  const getValue = (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return '<span class="empty">Not provided</span>'
    }
    return value
  }

  // Common sections across all forms
  let html = `
    <h2>Contact Information</h2>
    <div class="two-column">
      <div class="field-group">
        <div class="field-label">First Name</div>
        <div class="field-value">${getValue(formData.first_name)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Last Name</div>
        <div class="field-value">${getValue(formData.last_name)}</div>
      </div>
    </div>
    <div class="field-group">
      <div class="field-label">Address</div>
      <div class="field-value">${getValue(formData.address1)}</div>
    </div>
    ${formData.address2 ? `
    <div class="field-group">
      <div class="field-label">Address Line 2</div>
      <div class="field-value">${getValue(formData.address2)}</div>
    </div>
    ` : ''}
    <div class="two-column">
      <div class="field-group">
        <div class="field-label">City</div>
        <div class="field-value">${getValue(formData.city)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">State</div>
        <div class="field-value">${getValue(formData.state)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">ZIP Code</div>
        <div class="field-value">${getValue(formData.zip_code)}</div>
      </div>
    </div>
  `

  // Add litigation section
  html += `
    <h2>Litigation</h2>
    <div class="two-column">
      <div class="field-group">
        <div class="field-label">Matter No.</div>
        <div class="field-value">${getValue(formData.matter_no)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Defendant</div>
        <div class="field-value">${getValue(formData.defendant)}</div>
      </div>
    </div>
    <div class="two-column">
      <div class="field-group">
        <div class="field-label">Settlement Date</div>
        <div class="field-value">${formData.settlement_date ? new Date(formData.settlement_date).toLocaleDateString() : getValue(null)}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Trial Date</div>
        <div class="field-value">${formData.trial_date ? new Date(formData.trial_date).toLocaleDateString() : getValue(null)}</div>
      </div>
    </div>
    <div class="field-group">
      <div class="field-label">Trial Location</div>
      <div class="field-value">${getValue(formData.trial_location)}</div>
    </div>
    <div class="field-group">
      <div class="field-label">Opposing Counsel Firm</div>
      <div class="field-value">${getValue(formData.opposing_counsel_firm)}</div>
    </div>
    <div class="field-group">
      <div class="field-label">Opposing Economist</div>
      <div class="field-value">${getValue(formData.opposing_economist)}</div>
    </div>
  `

  // Add form-specific sections (simplified for brevity)
  if (formType === 'personal-injury') {
    html += `
      <h2>Demographics</h2>
      <div class="two-column">
        <div class="field-group">
          <div class="field-label">Date of Birth</div>
          <div class="field-value">${formData.date_of_birth ? new Date(formData.date_of_birth).toLocaleDateString() : getValue(null)}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Gender</div>
          <div class="field-value">${getValue(formData.gender)}</div>
        </div>
      </div>
    `
  }

  return html
}

export async function generateFormPDFFromData(
  formType: 'personal-injury' | 'wrongful-death' | 'wrongful-termination',
  formId: string
): Promise<PDFGenerationResult> {
  let browser = null
  
  try {
    // Fetch form data from database
    const supabase = await createClient()
    const tableName = `${formType.replace(/-/g, '_')}_forms`
    
    const { data: formData, error: dbError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', formId)
      .single()
    
    if (dbError || !formData) {
      throw new Error(`Form not found: ${formId}`)
    }

    // Generate HTML from form data
    const html = generateFormHTML(formType, formData)

    // Launch browser
    const isDev = process.env.NODE_ENV === 'development'
    
    if (isDev && puppeteerFull) {
      browser = await puppeteerFull.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    } else {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      })
    }

    const page = await browser.newPage()
    
    // Set content directly instead of navigating to URL
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      preferCSSPageSize: true
    })

    console.log(`PDF generated successfully for form ${formId}`)
    
    return {
      success: true,
      buffer: Buffer.from(pdfBuffer)
    }

  } catch (error) {
    console.error('Error generating PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}