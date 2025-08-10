import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n'
import { unstable_setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ana Sayfa',
  description: 'Dr. Özlem Murzoğlu Pediatri Kliniği - Sosyal Pediatri ve Çocuk Gelişimi uzmanlıklarını bütünleştiren, çocuğunuza özel bütüncül bakım.',
  openGraph: {
    title: 'Dr. Özlem Murzoğlu Pediatri Kliniği',
    description: 'Çocuğunuzun sağlıklı büyümesi için güvenilir pediatri hizmetleri',
    images: ['/og-home.jpg'],
  },
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function LocaleLayout({
  children,
  params: { locale }
}: LocaleLayoutProps) {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  unstable_setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {children}
    </div>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}