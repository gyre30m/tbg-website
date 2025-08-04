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

async function checkSchema() {
  try {
    console.log('Checking database schema...')
    
    // Check the structure of personal_injury_forms table
    const { data, error } = await supabase
      .from('personal_injury_forms')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error querying table:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log('Current personal_injury_forms columns:')
      console.log(Object.keys(data[0]))
    } else {
      console.log('No data in personal_injury_forms table')
      
      // Try to get column information from information_schema
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_table_columns', { table_name: 'personal_injury_forms' })
        .single()
      
      if (schemaError) {
        console.log('Could not get schema info:', schemaError)
      } else {
        console.log('Schema info:', schemaData)
      }
    }
    
  } catch (error) {
    console.error('Failed to check schema:', error)
  }
}

checkSchema()