'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { UserProfile, Firm } from './types'

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  userFirm: Firm | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
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
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(profile)

      // Fetch firm if user has one
      if (profile?.firm_id) {
        const { data: firm, error: firmError } = await supabase
          .from('firms')
          .select('*')
          .eq('id', profile.firm_id)
          .single()

        if (!firmError) {
          setUserFirm(firm)
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
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
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user?.id) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setUserFirm(null)
      }
      
      setLoading(false)
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