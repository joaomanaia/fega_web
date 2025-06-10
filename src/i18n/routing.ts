import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "pt",
  localePrefix: "as-needed",
})
