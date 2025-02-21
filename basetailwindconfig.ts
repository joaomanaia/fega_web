// Note: This is a base Tailwind CSS configuration file
// It is stored in this file to allow the use of Tailwind CSS config in other files
// without having problems with compatibility with other tailwind plugins

import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./core/theme/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.tsx",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--outline))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--on-primary))",
          inverse: "hsl(var(--inverse-primary))",
        },
        primaryContainer: {
          DEFAULT: "hsl(var(--primary-container))",
          foreground: "hsl(var(--on-primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--on-secondary))",
        },
        secondaryContainer: {
          DEFAULT: "hsl(var(--secondary-container))",
          foreground: "hsl(var(--on-secondary-container))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--on-tertiary))",
        },
        tertiaryContainer: {
          DEFAULT: "hsl(var(--tertiary-container))",
          foreground: "hsl(var(--on-tertiary-container))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--on-error))",
        },
        errorContainer: {
          DEFAULT: "hsl(var(--error-container))",
          foreground: "hsl(var(--on-error-container))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--on-background))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--on-surface))",
          inverse: "hsl(var(--inverse-surface))",
          inverseForeground: "hsl(var(--inverse-on-surface))",
          tint: "hsl(var(--surface-tint))",
        },
        surfaceVariant: {
          DEFAULT: "hsl(var(--surface-variant))",
          foreground: "hsl(var(--on-surface-variant))",
        },
        outline: {
          DEFAULT: "hsl(var(--outline))",
          variant: "hsl(var(--outline-variant))",
        },
        shadow: "hsl(var(--shadow))",
        scrim: "hsl(var(--scrim))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config

export default config
