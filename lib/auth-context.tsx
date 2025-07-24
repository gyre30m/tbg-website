'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { UserProfile, Firm } from './types'

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  userFirm: Firm | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  isSiteAdmin: boolean
  isFirmAdmin: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userFirm, setUserFirm] = useState<Firm | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      // Check if we're in a password reset scenario by looking at the URL
      if (typeof window !== 'undefined' && window.location.pathname === '/auth/reset-password') {
        setUserProfile(null)
        setUserFirm(null)
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
            setUserProfile(null)
            setUserFirm(null)
            return
          } else {
            throw error
          }
        }
        
        console.log('Successfully fetched profile:', profile)
        setUserProfile(profile)
        
        // Fetch firm if user has one
        if (profile && profile.firm_id) {
          const { data: firm, error: firmError } = await supabase
            .from('firms')
            .select('*')
            .eq('id', profile.firm_id)
            .single()
            
          if (firmError) {
            console.error('Error fetching firm:', firmError)
            setUserFirm(null)
          } else {
            setUserFirm(firm)
          }
        } else {
          setUserFirm(null)
        }
        
      } catch (queryError) {
        console.warn('Profile query failed, using fallback profile:', queryError)
        
        // Fallback to basic profile if query fails
        const basicProfile: UserProfile = {
          id: 'temp-id',
          user_id: userId,
          role: 'user',
          first_name: undefined,
          last_name: undefined,
          firm_id: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setUserProfile(basicProfile)
        setUserFirm(null)
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setUserProfile(null)
      setUserFirm(null)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user?.id) {
        await fetchUserProfile(session.user.id)
      }
      
      setLoading(false)
    }).catch((error) => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user?.id) {
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
          setUserFirm(null)
        }
      } catch (error) {
        console.error('Error in auth state change:', error)
      } finally {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserProfile(null)
    setUserFirm(null)
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }

  const isSiteAdmin = userProfile?.role === 'site_admin'
  const isFirmAdmin = userProfile?.role === 'firm_admin'

  const value = {
    user,
    session,
    userProfile,
    userFirm,
    loading,
    signIn,
    signOut,
    resetPassword,
    isSiteAdmin,
    isFirmAdmin,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}