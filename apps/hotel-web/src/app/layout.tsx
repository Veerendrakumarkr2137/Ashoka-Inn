import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Alex_Brush } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AIChat } from '@/components/chat/AIChat'
import { GlobalErrorHandler } from '@/components/GlobalErrorHandler'
import './globals.css'

// ─── Fonts ────────────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const alexBrush = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
})

// ─── Metadata ─────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Ashok Inn — Luxury Redefined',
    template: '%s | Ashok Inn',
  },
  description:
    'Experience unparalleled luxury at Ashok Inn. Book your stay and discover world-class service, premium rooms, fine dining, and an AI-powered concierge service.',
  keywords: [
    'luxury hotel',
    'Ashok Inn',
    'premium accommodation',
    'hotel booking',
    'fine dining',
    'spa resort',
    'business hotel',
  ],
  authors: [{ name: 'Ashok Inn' }],
  creator: 'Ashok Inn',
  metadataBase: new URL('https://ashok-inn.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ashok-inn.com',
    siteName: 'Ashok Inn',
    title: 'Ashok Inn — Luxury Redefined',
    description: 'Experience unparalleled luxury. Book your stay at Ashok Inn.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ashok Inn — Luxury Hotel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashok Inn — Luxury Redefined',
    description: 'Experience unparalleled luxury. Book your stay at Ashok Inn.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F172A',
}

// ─── Root Layout ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${alexBrush.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} font-body antialiased`} suppressHydrationWarning>
        <GlobalErrorHandler />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <AIChat />
      </body>
    </html>
  )
}
