'use client'

import Script from 'next/script'
import { useCookieConsent } from '@/lib/cookie-consent'

export default function GoogleAnalytics() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
  const { hasAnalytics } = useCookieConsent()

  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Set default consent to denied
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500,
          });
          
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=Strict;Secure',
          });
        `}
      </Script>
      {hasAnalytics && (
        <Script id="google-analytics-granted" strategy="afterInteractive">
          {`
            gtag('consent', 'update', {
              analytics_storage: 'granted'
            });
          `}
        </Script>
      )}
    </>
  )
}