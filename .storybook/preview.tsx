import "../app/styles/tokens.css"
import "../app/styles/globals.css"
import type { Preview } from "@storybook/nextjs"
import { Inter as FontSans } from "next/font/google"
import { cn } from "../lib/utils"
import { withThemeByClassName } from "@storybook/addon-themes"
import { Toaster } from "sonner"
import fegaTheme from "./themes"
import nextIntl from "./next-intl"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const preview: Preview = {
  initialGlobals: {
    locale: "en",
    locales: {
      en: { icon: "🇺🇸", title: "English", right: "EN" },
      fr: { icon: "🇵🇹", title: "Português", right: "PT" },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: fegaTheme,
    },
    nextIntl,
  },
  decorators: [
    (Story) => (
      <main className={cn("font-sans antialiased", fontSans.variable)}>
        <Story />
        <Toaster />
      </main>
    ),
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
}

export default preview
