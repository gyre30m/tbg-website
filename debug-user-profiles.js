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

async function debugUserProfiles() {
  try {
    console.log('Debugging user profile lookups...')
    
    // Get a few recent form submissions with their submitted_by values
    const { data: forms, error: formsError } = await supabase
      .from('personal_injury_forms')
      .select('id, submitted_by, first_name, last_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (formsError) {
      console.error('Error fetching forms:', formsError)
      return
    }
    
    console.log('\nRecent form submissions:')
    forms.forEach(form => {
      console.log(`- Form ${form.id}: submitted_by=${form.submitted_by}, plaintiff=${form.first_name} ${form.last_name}`)
    })
    
    // Get unique user IDs from forms
    const userIds = [...new Set(forms.map(f => f.submitted_by).filter(Boolean))]
    console.log('\nUnique user IDs from forms:', userIds)
    
    if (userIds.length > 0) {
      // Try to look up user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, user_id, first_name, last_name, role, firm_id')
        .in('id', userIds) // This should match submitted_by
      
      console.log('\nProfile lookup (by id field):', profiles, 'error:', profileError)
      
      // Also try by user_id field in case there's confusion
      const { data: profilesByUserId, error: profilesByUserIdError } = await supabase
        .from('user_profiles')
        .select('id, user_id, first_name, last_name, role, firm_id')
        .in('user_id', userIds)
      
      console.log('\nProfile lookup (by user_id field):', profilesByUserId, 'error:', profilesByUserIdError)
      
      // Show the mapping that the forms page would create
      console.log('\nProfile mapping analysis:')
      if (profiles && profiles.length > 0) {
        const profileMap = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile
          return acc
        }, {})
        
        forms.forEach(form => {
          const submitterName = profileMap[form.submitted_by] 
            ? `${profileMap[form.submitted_by].last_name}, ${profileMap[form.submitted_by].first_name}` 
            : 'Unknown User'
          console.log(`Form ${form.id} -> submitted_by: ${form.submitted_by} -> ${submitterName}`)
        })
      }
    }
    
  } catch (error) {
    console.error('Debug failed:', error)
  }
}

debugUserProfiles()