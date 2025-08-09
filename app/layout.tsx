import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { CookieConsentProvider } from "@/lib/cookie-consent";
import { Toaster } from "sonner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import SEO from "@/components/SEO";
import CookieConsent from "@/components/CookieConsent";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Bradley Group - Forensic Economists & Economic Damages Experts",
  description:
    "Expert economic analysis and litigation support for personal injury, wrongful death, employment, and commercial actions. Serving law firms nationwide with forensic economic consulting.",
  keywords:
    "forensic economist, economic damages expert, personal injury economist, wrongful death economist, business valuation, litigation support, expert witness, economic analysis, lost earnings calculation, employment discrimination economist, wrongful termination economist",
  authors: [{ name: "Bradley Gibbs" }],
  creator: "The Bradley Group LLC",
  publisher: "The Bradley Group LLC",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "The Bradley Group - Forensic Economists & Economic Damages Experts",
    description:
      "Expert economic analysis and litigation support for personal injury, wrongful death, and wrongful termination cases.",
    url: "https://the-bradley-group.com",
    siteName: "The Bradley Group",
    images: [
      {
        url: "https://the-bradley-group.com/cover-photo.jpg",
        width: 1200,
        height: 630,
        alt: "The Bradley Group - Forensic Economic Consulting",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Bradley Group - Forensic Economists",
    description:
      "Expert economic analysis and litigation support for legal cases",
    images: ["https://the-bradley-group.com/cover-photo.jpg"],
  },
  alternates: {
    canonical: "https://the-bradley-group.com",
  },
  metadataBase: new URL("https://the-bradley-group.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookieConsentProvider>
          <SpeedInsights />
          <GoogleAnalytics />
          <SEO />
          <AuthProvider>
            {children}
            <Analytics />

            <Toaster
              position="top-center"
              offset="25vh"
              expand={true}
              richColors={true}
            />
          </AuthProvider>
          <CookieConsent />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
