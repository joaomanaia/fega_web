import { create } from "storybook/theming/create"
// import "../app/styles/tokens.css"
// import "../app/styles/globals.css"

export default create({
  base: "light",
  brandTitle: "Fega",
  brandUrl: "https://fega.vercel.app",
  // brandImage: "/fega_round-192x192.png",
  brandTarget: "_self",
})

// TODO: Change to custom theme when the following issue is resolved:
// NOTE: The following code is a workaround to get the CSS variables from the CSS file
// because some colors are not parsing correctly when using the CSS variables directly
/* export default create({
  base: "light",
  brandTitle: "Fega",
  brandUrl: "https://fega.vercel.app",
  // brandImage: "/fega_round-192x192.png",
  brandTarget: "_self",
  // Colors
  colorPrimary: "hsl(var(--primary))",
  colorSecondary: getHexFromCssVar("--secondary"),
  appBg: "hsl(var(--background))",
  appContentBg: "hsl(var(--background))",
  appPreviewBg: "hsl(var(--background))",
  appBorderColor: getHexFromCssVar("--outline"),
  // Text colors
  textColor: "hsl(var(--on-background))",
  textInverseColor: "hsl(var(--inverse-on-surface))",
  // Toolbar default and active colors
  barTextColor: getHexFromCssVar("--on-background"),
  barSelectedColor: getHexFromCssVar("--primary"),
  barHoverColor: getHexFromCssVar("--primary"),
  barBg: getHexFromCssVar("--background"),
  // Form colors
  inputBg: getHexFromCssVar("--surface"),
  inputBorder: getHexFromCssVar("--outline"),
})

function getCssVarValue(cssVar: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar)
}

function getHexFromCssVar(cssVar: string) {
  const hsl = getCssVarValue(cssVar)

  return parseHSL(hsl) || undefined
}

function hslToHex(h: number, s: number, l: number): string {
  // Convert HSL to RGB
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function parseHSL(hsl: string): string | null {
  const matches = hsl.match(/\d+(\.\d+)?/g)

  if (matches && matches.length === 3) {
    const [h, s, l] = matches.map(Number)
    return hslToHex(h, s, l)
  }

  return null // Return null if the input format is incorrect
} */
