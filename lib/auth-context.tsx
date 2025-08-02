'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from './supabase/browser-client'
import { UserProfile, Firm } from './types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  firm: Firm | null
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  userProfile: UserProfile | null // Keep for backward compatibility
  userFirm: Firm | null // Keep for backward compatibility
  loading: boolean // Keep for backward compatibility
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  isSiteAdmin: boolean
  isFirmAdmin: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    firm: null,
    isLoading: true
  })
  
  // Create a single supabase client instance for this context
  const supabase = createClient()

  const fetchUserProfile = async (userId: string) => {
    try {
      // Check if we're in a password reset scenario by looking at the URL
      if (typeof window !== 'undefined' && window.location.pathname === '/auth/reset-password') {
        setAuthState(prev => ({ ...prev, profile: null, firm: null }))
        return
      }
      
      console.log('Attempting to fetch user profile for:', userId)
      
      // Try to fetch the real profile with a timeout
      const queryPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
        
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout after 3 seconds')), 3000)
      })
      
      try {
        const { data: profile, error } = await Promise.race([queryPromise, timeoutPromise]) as { data: UserProfile | null; error: { code?: string; message?: string } | null }
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No profile exists - user needs to create one
            console.log('No user profile found for user:', userId)
            setAuthState(prev => ({ ...prev, profile: null, firm: null }))
            return
          } else if (error.code === 'PGRST301') {
            // 406 Not Acceptable - RLS issue (should be rare now)
            console.warn('Profile access denied (RLS) for user:', userId, 'Error:', error.message)
            setAuthState(prev => ({ ...prev, profile: null, firm: null }))
            return
          } else {
            console.error('Profile query error:', error)
            throw error
          }
        }
        
        console.log('Successfully fetched profile:', profile)
        setAuthState(prev => ({ ...prev, profile }))
        
        // Fetch firm if user has one
        if (profile && profile.firm_id) {
          const { data: firm, error: firmError } = await supabase
            .from('firms')
            .select('*')
            .eq('id', profile.firm_id)
            .single()
            
          if (firmError) {
            console.error('Error fetching firm:', firmError)
            setAuthState(prev => ({ ...prev, firm: null }))
          } else {
            setAuthState(prev => ({ ...prev, firm }))
          }
        } else {
          setAuthState(prev => ({ ...prev, firm: null }))
        }
        
      } catch (queryError) {
        console.warn('Profile query failed:', queryError)
        setAuthState(prev => ({ ...prev, profile: null, firm: null }))
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setAuthState(prev => ({ ...prev, profile: null, firm: null }))
    }
  }

  const refreshProfile = useCallback(async () => {
    if (authState.user?.id) {
      await fetchUserProfile(authState.user.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.user?.id])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setAuthState(prev => ({ 
        ...prev, 
        session, 
        user: session?.user ?? null
      }))
      
      if (session?.user?.id) {
        await fetchUserProfile(session.user.id)
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }).catch((error) => {
      console.error('Error getting session:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setAuthState(prev => ({ 
          ...prev, 
          session, 
          user: session?.user ?? null 
        }))
        
        if (session?.user?.id) {
          await fetchUserProfile(session.user.id)
        } else {
          setAuthState(prev => ({ 
            ...prev, 
            profile: null, 
            firm: null 
          }))
        }
      } catch (error) {
        console.error('Error in auth state change:', error)
      } finally {
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setAuthState(prev => ({ 
      ...prev, 
      profile: null, 
      firm: null 
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isSiteAdmin = useMemo(() => authState.profile?.role === 'site_admin', [authState.profile])
  const isFirmAdmin = useMemo(() => authState.profile?.role === 'firm_admin', [authState.profile])

  const value = useMemo(() => ({
    // New consolidated state
    ...authState,
    // Backward compatibility aliases
    userProfile: authState.profile,
    userFirm: authState.firm,
    loading: authState.isLoading,
    // Methods
    signIn,
    signOut,
    resetPassword,
    isSiteAdmin,
    isFirmAdmin,
    refreshProfile,
  }), [authState, isSiteAdmin, isFirmAdmin, signIn, signOut, resetPassword, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}