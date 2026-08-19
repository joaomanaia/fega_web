import "@workspace/ui/styles/tokens.css"
import "@workspace/ui/styles/globals.css"
import type { Preview } from "@storybook/nextjs-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

import messages from "../../web/src/messages/en.json"
import { NextIntlClientProvider } from "next-intl"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </NextIntlClientProvider>
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
