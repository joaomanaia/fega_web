const locales = ["en", "pt"] as const

export type Locale = (typeof locales)[number]

export const i18n: {
  defaultLocale: Locale
  locales: typeof locales
} = {
  defaultLocale: "en",
  locales: locales,
} as const

export type Language = {
  locale: Locale
  name: string
}

export const languages: Language[] = [
  { locale: "en", name: "English" },
  { locale: "pt", name: "Português" },
] as const
