import { routing } from "@/src/i18n/routing"
import { formats } from "@/src/i18n/request"
import messages from "./messages/en.json"

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
    Formats: typeof formats
  }
}
