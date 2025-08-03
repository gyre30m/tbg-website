import puppeteer from 'puppeteer'

export interface PDFGenerationResult {
  success: boolean
  buffer?: Buffer
  error?: string
}

export async function generateFormPDF(
  formUrl: string,
  formType: 'personal-injury' | 'wrongful-death' | 'wrongful-termination',
  formId: string
): Promise<PDFGenerationResult> {
  let browser = null
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()
    
    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2
    })

    // Navigate to the form URL
    console.log(`Generating PDF for: ${formUrl}`)
    await page.goto(formUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    })

    // Wait for the form to be fully loaded
    await page.waitForSelector('form, .container', { timeout: 10000 })

    // Hide any buttons or interactive elements that shouldn't be in PDF
    await page.addStyleTag({
      content: `
        button, 
        .header button,
        [role="button"],
        .cursor-pointer,
        .hover\\:bg-gray-50,
        .hover\\:text-blue-600 {
          display: none !important;
        }
        
        /* Ensure good print formatting */
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Hide any navigation or header elements */
        header nav,
        .sticky {
          display: none !important;
        }
        
        /* Optimize spacing for PDF */
        .container {
          max-width: none !important;
          padding: 20px !important;
        }
      `
    })

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