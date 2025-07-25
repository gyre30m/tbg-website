'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Shield, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCookieConsent } from '@/lib/cookie-consent'

export default function CookieConsent() {
  const { consent, setConsent, isLoading } = useCookieConsent()
  const [showDialog, setShowDialog] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Show dialog if no consent has been given and we're done loading
    if (!isLoading && consent === null) {
      setShowDialog(true)
    }
  }, [consent, isLoading])

  const handleAccept = () => {
    setConsent('accepted')
    setShowDialog(false)
  }

  const handleReject = () => {
    setConsent('rejected')
    setShowDialog(false)
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  if (!showDialog) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md">
        <Card className="shadow-lg border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Cookie Consent</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              We use cookies to improve your experience and analyze site usage.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {!showDetails ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This website uses cookies for analytics to help us understand how visitors use our site. 
                  You can choose to accept or reject non-essential cookies.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button onClick={handleAccept} className="flex-1">
                    Accept All
                  </Button>
                  <Button onClick={handleReject} variant="outline" className="flex-1">
                    Reject All
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  className="w-full text-xs"
                >
                  View Details
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Essential Cookies</p>
                      <p className="text-muted-foreground text-xs">
                        Required for the website to function properly. Always enabled.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Analytics Cookies</p>
                      <p className="text-muted-foreground text-xs">
                        Google Analytics helps us understand visitor behavior and improve our services.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button onClick={handleAccept} className="flex-1">
                    Accept All
                  </Button>
                  <Button onClick={handleReject} variant="outline" className="flex-1">
                    Reject Analytics
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="w-full text-xs"
                >
                  Back
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}