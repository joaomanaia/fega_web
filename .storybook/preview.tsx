import "../app/styles/tokens.css"
import "../app/styles/globals.css"
import React from "react"
import type { Preview } from "@storybook/react"
import { Inter as FontSans } from "next/font/google"
import { cn } from "../lib/utils"
import { withThemeByClassName } from "@storybook/addon-themes"
import { Toaster } from "sonner"
import fegaTheme from "./themes"

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
