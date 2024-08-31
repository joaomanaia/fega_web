import "../app/styles/tokens.css"
import "../app/styles/globals.css"
import React from "react"
import type { Preview } from "@storybook/react"
import { Inter as FontSans } from "next/font/google"
import { cn } from "../lib/utils"
import { withThemeByClassName } from "@storybook/addon-themes"
import { Toaster } from "sonner"
import fegaTheme from "./themes"
import { getDictionary } from "../get-dictionary"
import DictionaryProvider from "../hooks/use-get-dictionary"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const preview: Preview = {
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
  },
  globalTypes: {
    theme: { type: "string" },
    locale: {
      name: "Locale",
      description: "Internationalization locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", right: "🇺🇸", title: "English" },
          { value: "pt", right: "🇵🇹", title: "Português" },
        ],
      },
    },
  },
  loaders: [
    async ({ globals }) => ({
      dictionary: await getDictionary(globals.locale),
    }),
  ],
  decorators: [
    (Story, { loaded: { dictionary } }) => (
      <main className={cn("font-sans antialiased", fontSans.variable)}>
        <DictionaryProvider dictionary={dictionary}>
          <Story />
          <Toaster />
        </DictionaryProvider>
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
