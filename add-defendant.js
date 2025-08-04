const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addDefendantColumn() {
  try {
    console.log('Adding defendant column to all form tables...')
    
    // We'll use a test insert to trigger any missing column errors
    // then handle them appropriately
    
    const tables = [
      'personal_injury_forms',
      'personal_injury_drafts', 
      'wrongful_death_forms',
      'wrongful_death_drafts',
      'wrongful_termination_forms',
      'wrongful_termination_drafts'
    ]
    
    for (const table of tables) {
      console.log(`Checking ${table} for defendant column...`)
      
      try {
        // Try to select defendant column to see if it exists
        const { error } = await supabase
          .from(table)
          .select('defendant')
          .limit(1)
        
        if (error && error.message.includes("defendant")) {
          console.log(`defendant column missing from ${table}`)
          // Column doesn't exist, we need to add it via Supabase dashboard/SQL editor
        } else {
          console.log(`defendant column exists in ${table}`)
        }
      } catch (err) {
        console.log(`Error checking ${table}:`, err.message)
      }
    }
    
    console.log('\nNote: To add the defendant column, you need to run this SQL in your Supabase SQL editor:')
    console.log(`
ALTER TABLE public.personal_injury_forms ADD COLUMN IF NOT EXISTS defendant TEXT;
ALTER TABLE public.personal_injury_drafts ADD COLUMN IF NOT EXISTS defendant TEXT;
ALTER TABLE public.wrongful_death_forms ADD COLUMN IF NOT EXISTS defendant TEXT;
ALTER TABLE public.wrongful_death_drafts ADD COLUMN IF NOT EXISTS defendant TEXT;
ALTER TABLE public.wrongful_termination_forms ADD COLUMN IF NOT EXISTS defendant TEXT;
ALTER TABLE public.wrongful_termination_drafts ADD COLUMN IF NOT EXISTS defendant TEXT;
    `)
    
  } catch (error) {
    console.error('Failed to add defendant column:', error)
  }
}

addDefendantColumn()