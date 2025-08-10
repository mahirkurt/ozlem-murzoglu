import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Figtree, DM_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import '@/styles/globals.css'

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
    default: 'Dr. Özlem Murzoğlu Pediatri Kliniği - Sağlık Peteğim',
  },
  description: 'Dr. Özlem Murzoğlu ile çocuğunuzun sağlıklı büyümesi için güvenilir pediatri hizmetleri. 0-18 yaş arası kapsamlı çocuk sağlığı ve hastalıkları uzman bakımı.',
  keywords: 'pediatri, çocuk doktoru, çocuk sağlığı, aşı, gelişim takibi, Dr. Özlem Murzoğlu, İstanbul',
  authors: [{ name: 'Dr. Özlem Murzoğlu' }],
  creator: 'Sağlık Peteğim',
  publisher: 'Dr. Özlem Murzoğlu Pediatri Kliniği',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Sağlık Peteğim',
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
    site: '@saglikpetegim',
    creator: '@saglikpetegim',
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
  params: { locale: string }
}

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
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

        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            font-family: var(--font-dm-sans), system-ui, -apple-system, sans-serif;
            background-color: var(--md-sys-color-background);
            color: var(--md-sys-color-on-background);
          }

          .app-layout {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .main-content {
            flex: 1;
            padding-top: 120px;
            min-height: calc(100vh - 120px);
          }

          .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--md-sys-color-primary);
            color: var(--md-sys-color-on-primary);
            padding: 8px 16px;
            text-decoration: none;
            z-index: 100;
            border-radius: 0 0 8px 0;
          }

          .skip-link:focus {
            top: 0;
          }
        `}</style>
      </body>
    </html>
  )
}