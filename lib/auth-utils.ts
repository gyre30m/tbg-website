'use server'

import { supabase } from './supabase'
import type { Firm, UserProfile } from './types'

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      firm:firms(*)
    `)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function getUserFirm(userId: string): Promise<Firm | null> {
  const profile = await getUserProfile(userId)
  if (!profile?.firm_id) return null

  const { data, error } = await supabase
    .from('firms')
    .select('*')
    .eq('id', profile.firm_id)
    .single()

  if (error) {
    console.error('Error fetching firm:', error)
    return null
  }

  return data
}

export async function isSiteAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile?.role === 'site_admin'
}

export async function isFirmAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile?.role === 'firm_admin'
}

export async function createFirm(name: string, domain: string): Promise<Firm | null> {
  try {
    console.log('createFirm called with:', { name, domain })
    
    // First create the firm
    const { data: firm, error: firmError } = await supabase
      .from('firms')
      .insert([{
        name,
        domain: domain.toLowerCase(),
      }])
      .select()
      .single()

    console.log('Supabase insert result:', { firm, firmError })

    if (firmError) {
      console.error('Error creating firm:', firmError)
      throw new Error(`Database error: ${firmError.message}`)
    }

    console.log('Firm created successfully:', firm)
    return firm
  } catch (error) {
    console.error('Exception in createFirm:', error)
    throw error
  }
}

export async function inviteUserToFirm(
  email: string, 
  firmId: string, 
  role: 'firm_admin' | 'user' = 'user'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if domain matches firm domain
    const emailDomain = email.split('@')[1]
    const { data: firm } = await supabase
      .from('firms')
      .select('domain')
      .eq('id', firmId)
      .single()

    if (!firm || firm.domain !== emailDomain) {
      return { success: false, error: 'Email domain does not match firm domain' }
    }

    // Create user invitation (you'll need to implement Supabase auth invitation)
    // For now, we'll create a user profile that can be activated later
    const { error } = await supabase
      .from('user_invitations')
      .insert([{
        email: email.toLowerCase(),
        firm_id: firmId,
        role,
        invited_at: new Date().toISOString(),
      }])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to invite user' }
  }
}

export async function validateEmailDomain(email: string, firmId: string): Promise<boolean> {
  const emailDomain = email.split('@')[1]
  
  const { data: firm } = await supabase
    .from('firms')
    .select('domain')
    .eq('id', firmId)
    .single()

  return firm?.domain === emailDomain
}