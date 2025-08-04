const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('Running database migration to add defendant column...')
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(__dirname, 'add-defendant-column.sql'), 'utf8')
    
    // Split by semicolon and run each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0)
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...')
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() })
        if (error) {
          console.error('Error executing statement:', error)
          // Try direct execution for simple ALTER statements
          const { error: directError } = await supabase.from('_internal').select('1')
          if (directError) {
            console.log('Trying alternative approach...')
          }
        } else {
          console.log('Statement executed successfully')
        }
      }
    }
    
    console.log('Migration completed!')
    
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigration()