import { notFound } from "next/navigation"
import * as rootParams from "next/root-params"
import deepmerge from "deepmerge"
import { hasLocale, type Formats } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ locale }) => {
  // Typically corresponds to the `[locale]` segment
  if (!locale) {
    const paramValue = await rootParams.lang()
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue
    } else {
      notFound()
    }
  }

  const userMessages = (await import(`../messages/${locale}.json`)).default
  const defaultMessages = (await import(`../messages/en.json`)).default
  const messages = deepmerge(defaultMessages, userMessages)

  return {
    locale,
    messages,
    formats,
  }
})

export const formats = {
  dateTime: {
    short: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  number: {
    precise: {
      maximumFractionDigits: 5,
    },
  },
  list: {
    enumeration: {
      style: "long",
      type: "conjunction",
    },
  },
} satisfies Formats
