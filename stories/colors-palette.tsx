"use client"

import { cn } from "@/lib/utils"
import { getHexFromCssVar } from "@/utils/color-utils"
import { ColorPalette, ColorItem } from "@storybook/blocks"
import { ThemeProvider, ensure, themes } from "@storybook/theming"
import { useEffect, useMemo, useState } from "react"
import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "../basetailwindconfig"

const fullConfig = resolveConfig(tailwindConfig)
const twColors = fullConfig.theme.colors
type TwColorsKeys = keyof typeof twColors

interface ColorsPaletteProps {
  theme: "light" | "dark"
  className?: string
}

export const ColorsPalette: React.FC<ColorsPaletteProps> = ({ theme, className }) => {
  if (theme === "dark") {
    return (
      <section className="dark bg-background text-foreground rounded-3xl p-5">
        <ThemeProvider theme={ensure(themes.dark)}>
          <ColorPaletteItems theme="dark" />
        </ThemeProvider>
      </section>
    )
  }

  return (
    <section className={cn("bg-background text-foreground rounded-3xl p-5", className)}>
      <ColorPaletteItems theme="light" />
    </section>
  )
}

export const BaseColorsPalette: React.FC<ColorsPaletteProps> = () => {
  const colors: ColorPaletteItem[] = useMemo(() => {
    return baseColors.map((item) => {
      const colors: Colors = mapObject(item.colors, (value, key) => {
        const hex = getHexFromCssVar(value, document.documentElement)
        return hex || value
      })

      return { ...item, colors }
    })
  }, [])

  return (
    <ColorPalette>
      {colors.map((item, index) => {
        return (
          <ColorItem key={index} title={item.title} subtitle={item.subtitle} colors={item.colors} />
        )
      })}
    </ColorPalette>
  )
}

type ColorPaletteItem = {
  title: string
  subtitle: string
  colors: Colors
}

type Colors = {
  [key: string]: string
}

const getBaseColorsByKeys = (keys: TwColorsKeys[]): ColorPaletteItem[] => {
  return Object.entries(twColors)
    .filter(([key]) => keys.includes(key as TwColorsKeys))
    .map(([key, value]) => {
      if (typeof value === "string") {
        return {
          title: key,
          subtitle: key,
          colors: {
            [key]: value,
          },
        }
      }

      return {
        title: key,
        subtitle: key,
        colors: value as Colors,
      }
    })
}

const extendedColors = getBaseColorsByKeys([
  "primary",
  "primaryContainer",
  "secondary",
  "secondaryContainer",
  "tertiary",
  "tertiaryContainer",
  "error",
  "errorContainer",
  "background",
  "foreground",
  "surface",
  "surfaceVariant",
  "outline",
])

const baseColors = getBaseColorsByKeys([
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
])

interface ColorPaletteItemsProps {
  theme: "light" | "dark"
}

const ColorPaletteItems: React.FC<ColorPaletteItemsProps> = ({ theme }) => {
  const [section, setSection] = useState<Element | null>(null)

  useEffect(() => {
    setSection(
      theme === "dark" ? document.querySelector("section.dark") : document.querySelector("section")
    )
  }, [theme])

  const colors: ColorPaletteItem[] = useMemo(() => {
    return extendedColors.map((item) => {
      const colors: Colors = mapObject(item.colors, (value, key) => {
        // Extract the CSS variable name from the HSL value
        // So we can get the hex value to display in the color palette, instead
        // of showing the variable name
        const cssVar = value.replace("hsl(var(", "").replace("))", "")
        const hex = getHexFromCssVar(cssVar, section || document.documentElement)
        return hex || value
      })

      return { ...item, colors }
    })
  }, [section])

  return (
    <ColorPalette>
      {colors.map((item, index) => {
        return (
          <ColorItem key={index} title={item.title} subtitle={item.subtitle} colors={item.colors} />
        )
      })}
    </ColorPalette>
  )
}

const mapObject = (
  obj: { [key: string]: string },
  computeValue: (value: string, key: string) => string
): { [key: string]: string } => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, computeValue(value, key)])
  )
}
