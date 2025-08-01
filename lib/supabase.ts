// Re-export supabase client for backward compatibility
import { createClient } from './supabase/browser-client'

export const supabase = createClient()
export { createClient }