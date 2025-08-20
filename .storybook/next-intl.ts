// @ts-expect-error Expected error for TypeScript
import en from "../messages/en.json"

const messagesByLocale: Record<string, unknown> = { en }

const nextIntl = {
  defaultLocale: "en",
  messagesByLocale,
}

export default nextIntl
