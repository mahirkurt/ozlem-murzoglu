/**
 * Custom render utilities for testing
 * Provides a custom render method that includes providers and default props
 */

import React from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { NextIntlProvider } from 'next-intl'

// Mock messages for testing
const mockMessages = {
  // Navigation
  'nav.home': 'Ana Sayfa',
  'nav.services': 'Hizmetler',
  'nav.about': 'Hakkımızda',
  'nav.contact': 'İletişim',

  // Common
  'common.loading': 'Yükleniyor...',
  'common.error': 'Bir hata oluştu',
  'common.retry': 'Tekrar Dene',
  'common.submit': 'Gönder',
  'common.cancel': 'İptal',
  'common.save': 'Kaydet',
  'common.edit': 'Düzenle',
  'common.delete': 'Sil',

  // Hero section
  'hero.title': 'Dr. Özlem Murzoğlu',
  'hero.subtitle': 'Çocuk Doktoru',
  'hero.description': 'Çocuklarınızın sağlığı için güvenilir adres',
  'hero.cta': 'Randevu Al',

  // Services
  'services.title': 'Hizmetlerimiz',
  'services.general-checkup': 'Genel Muayene',
  'services.vaccination': 'Aşılama',
  'services.growth-monitoring': 'Büyüme Takibi',

  // Contact
  'contact.title': 'İletişim',
  'contact.phone': 'Telefon',
  'contact.email': 'E-posta',
  'contact.address': 'Adres',
  'contact.form.name': 'Adınız',
  'contact.form.email': 'E-posta',
  'contact.form.message': 'Mesajınız',
  'contact.form.send': 'Mesaj Gönder',
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: string
  messages?: Record<string, string>
}

// Custom render function that includes providers
function customRender(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    locale = 'tr',
    messages = mockMessages,
    ...renderOptions
  } = options

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NextIntlProvider locale={locale} messages={messages}>
        {children}
      </NextIntlProvider>
    )
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }