'use server'

import { supabase } from './supabase'

function extractFormData(formData: FormData) {
  const data: Record<string, unknown> = {}
  
  // Iterate through all form entries
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      data[key] = value || null
    }
  }
  
  return data
}

export async function submitPersonalInjuryForm(formData: FormData) {
  try {
    const formDataObject = extractFormData(formData)
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('User not authenticated')
    }

    // Get user profile to get firm_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('firm_id')
      .eq('user_id', session.user.id)
      .single()
    
    // Validate required fields (basic validation for now)
    if (!formDataObject.firstName || !formDataObject.lastName || !formDataObject.email) {
      throw new Error('Missing required fields')
    }
    
    // Insert into Supabase as submitted form
    const { data, error } = await supabase
      .from('personal_injury_forms')
      .insert([
        {
          form_data: formDataObject,
          submitted_by: session.user.id,
          firm_id: profile?.firm_id,
          status: 'submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to submit form. Please try again.')
    }

    console.log('Form submitted successfully!')
    return { success: true, id: data?.[0]?.id }
  } catch (error) {
    console.error('Error submitting form:', error)
    throw error
  }
}

export async function saveDraftPersonalInjuryForm(formData: FormData) {
  try {
    const formDataObject = extractFormData(formData)
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('User not authenticated')
    }

    // Get user profile to get firm_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('firm_id')
      .eq('user_id', session.user.id)
      .single()
    
    // Save as draft without validation requirements
    const { data, error } = await supabase
      .from('personal_injury_drafts')
      .insert([
        {
          form_data: formDataObject,
          submitted_by: session.user.id,
          firm_id: profile?.firm_id,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error saving draft:', error)
      throw new Error('Failed to save draft. Please try again.')
    }

    return { success: true, draftId: data?.[0]?.id }
  } catch (error) {
    console.error('Error saving draft:', error)
    throw new Error('Failed to save draft. Please try again.')
  }
}

export async function updateDraftPersonalInjuryForm(draftId: string, formData: FormData) {
  try {
    const formDataObject = extractFormData(formData)
    
    const { error } = await supabase
      .from('personal_injury_drafts')
      .update({
        form_data: formDataObject,
        updated_at: new Date().toISOString(),
      })
      .eq('id', draftId)

    if (error) {
      console.error('Supabase error updating draft:', error)
      throw new Error('Failed to update draft. Please try again.')
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating draft:', error)
    throw new Error('Failed to update draft. Please try again.')
  }
}

export async function getDraftPersonalInjuryForm(userId: string) {
  try {
    const { data, error } = await supabase
      .from('personal_injury_drafts')
      .select('*')
      .eq('submitted_by', userId)
      .eq('status', 'draft')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Supabase error getting draft:', error)
      throw new Error('Failed to load draft.')
    }

    return data || null
  } catch (error) {
    console.error('Error getting draft:', error)
    return null
  }
}