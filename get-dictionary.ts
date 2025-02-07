import "server-only"
import type { Locale } from "./i18n-config"

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  pt: () => import("./dictionaries/pt.json").then((module) => module.default),
} as const

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.en()

/* export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  try {
    console.time("deepMerge")
    const [defaultDictionary, localeDictionary] = await Promise.all([
      dictionaries.en(),
      locale !== "en" ? dictionaries[locale]() : null,
    ])

    if (locale === "en" || !localeDictionary) {
      return defaultDictionary
    }

    return deepMerge(defaultDictionary, localeDictionary)
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error)
    return dictionaries.en() // Fallback to English on error
  } finally {
    console.timeEnd("deepMerge")
  }
}

const deepMerge = (target: any, source: any) => {
  const result = { ...target }
  for (const key in source) {
    if (source[key] && typeof source[key] === "object") {
      result[key] = deepMerge(target[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
} */

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>
