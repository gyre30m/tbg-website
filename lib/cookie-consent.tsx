'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type CookieConsent = 'accepted' | 'rejected' | null

interface CookieConsentContextType {
  consent: CookieConsent
  setConsent: (consent: CookieConsent) => void
  hasAnalytics: boolean
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<CookieConsent>(null)
  const [hasAnalytics, setHasAnalytics] = useState(false)

  useEffect(() => {
    // Check if user has previously set consent
    const savedConsent = localStorage.getItem('cookie-consent') as CookieConsent
    if (savedConsent) {
      setConsentState(savedConsent)
      setHasAnalytics(savedConsent === 'accepted')
    }
  }, [])

  const setConsent = (newConsent: CookieConsent) => {
    setConsentState(newConsent)
    setHasAnalytics(newConsent === 'accepted')
    
    if (newConsent) {
      localStorage.setItem('cookie-consent', newConsent)
    } else {
      localStorage.removeItem('cookie-consent')
    }

    // Update Google Analytics consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: newConsent === 'accepted' ? 'granted' : 'denied',
        ad_storage: 'denied', // We don't use ads
      })
    }
  }

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent, hasAnalytics }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}