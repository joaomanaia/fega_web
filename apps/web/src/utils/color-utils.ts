function getCssVarValue(cssVar: string, section: Element) {
  return window.getComputedStyle(section).getPropertyValue(cssVar)
}

export function getHexFromCssVar(cssVar: string, section: Element) {
  const hsl = getCssVarValue(cssVar, section)

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
}
