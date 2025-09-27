import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Supported locales
export const locales = ['en', 'zh'] as const
export type Locale = typeof locales[number]

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) notFound()

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  }
})