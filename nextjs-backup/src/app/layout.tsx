import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, unstable_setRequestLocale } from 'next-intl/server'
import { Figtree, DM_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import '@/styles/globals.css'
import '@/styles/layout.css'

const figtree = Figtree({ 
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap'
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    template: '%s | Dr. Özlem Murzoğlu Pediatri Kliniği',
    default: 'Dr. Özlem Murzoğlu Pediatri Kliniği',
  },
  description: 'Dr. Özlem Murzoğlu ile çocuğunuzun sağlıklı büyümesi için güvenilir pediatri hizmetleri. 0-18 yaş arası kapsamlı çocuk sağlığı ve hastalıkları uzman bakımı.',
  keywords: 'pediatri, çocuk doktoru, çocuk sağlığı, aşı, gelişim takibi, Dr. Özlem Murzoğlu, İstanbul',
  authors: [{ name: 'Dr. Özlem Murzoğlu' }],
  creator: 'Dr. Özlem Murzoğlu',
  publisher: 'Dr. Özlem Murzoğlu Pediatri Kliniği',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Dr. Özlem Murzoğlu Pediatri Kliniği',
    title: 'Dr. Özlem Murzoğlu Pediatri Kliniği',
    description: 'Çocuğunuzun sağlıklı büyümesi için güvenilir pediatri hizmetleri',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dr. Özlem Murzoğlu Pediatri Kliniği',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@drOzlemMurzoglu',
    creator: '@drOzlemMurzoglu',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    'msapplication-TileColor': '#005F73',
    'theme-color': '#FAFCFD',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Generate static params for all locales
export function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }]
}

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  const { locale = 'tr' } = await params
  
  // Enable static rendering
  unstable_setRequestLocale(locale)
  
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FAFCFD" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${figtree.variable} ${dmSans.variable}`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {/* Skip to main content link for accessibility */}
            <a href="#main-content" className="skip-link">
              Ana İçeriğe Geç
            </a>
            
            <div className="app-layout">
              <Header locale={locale} />
              
              <main id="main-content" className="main-content">
                {children}
              </main>
              
              <Footer locale={locale} />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}