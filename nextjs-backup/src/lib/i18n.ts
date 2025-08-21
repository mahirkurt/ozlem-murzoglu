import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale = 'tr' as const

// Configuration for next-intl
export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../content/locales/${locale}.json`)).default,
  timeZone: 'Europe/Istanbul',
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      long: {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    },
    number: {
      currency: {
        style: 'currency',
        currency: 'TRY'
      }
    }
  }
}))

// Shared navigation utilities
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales })

// Locale configuration
export const localeConfig = {
  tr: {
    name: 'Türkçe',
    code: 'tr',
    flag: '🇹🇷',
    dir: 'ltr',
    locale: 'tr-TR'
  },
  en: {
    name: 'English',
    code: 'en',
    flag: '🇺🇸',
    dir: 'ltr',
    locale: 'en-US'
  }
} as const