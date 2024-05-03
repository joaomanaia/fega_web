export const i18n = {
  defaultLocale: "en",
  locales: ["en", "pt"],
} as const

export type Locale = (typeof i18n.locales)[number]

export type Language = {
  locale: Locale
  name: string
}

export const languages: Language[] = [
  { locale: "en", name: "English" },
  { locale: "pt", name: "Português" },
] as const
