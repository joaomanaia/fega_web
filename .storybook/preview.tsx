import "../app/styles/tokens.css"
import "../app/styles/globals.css"
import { Inter as FontSans } from "next/font/google"
import { DocsRenderer } from "@storybook/addon-docs"
import { withThemeByClassName } from "@storybook/addon-themes"
import type { Preview } from "@storybook/nextjs"
import { DocsContextProps, Parameters, Renderer } from "storybook/internal/types"
import { Toaster } from "../components/ui/sonner"
import { cn } from "../lib/utils"
import { ThemeProvider } from "../src/providers/theme-provider"
import nextIntl from "./next-intl"
import { dark, light } from "./themes"

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
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: light,
      renderer: () => {
        const renderer = new DocsRenderer()
        const oldRender = renderer.render

        renderer.render = async (
          context: DocsContextProps<Renderer>,
          docsParameter: Parameters,
          element: HTMLElement
        ) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const theme = (context as any).store.userGlobals.globals.theme

          docsParameter.theme = theme === "dark" ? dark : light

          const result = await oldRender.call(renderer, context, docsParameter, element)

          return result
        }

        return renderer
      },
    },
    nextIntl,
  },
  decorators: [
    (Story) => (
      <main className={cn("font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
          <Story />
          <Toaster richColors />
        </ThemeProvider>
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
