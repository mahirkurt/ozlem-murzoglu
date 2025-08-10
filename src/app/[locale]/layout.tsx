import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n'

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

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {children}
    </div>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}