const locales = ["en", "pt"] as const

export type Locale = (typeof locales)[number]

export const i18n: {
  readonly defaultLocale: Locale
  readonly locales: typeof locales
} = {
  defaultLocale: "pt",
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
