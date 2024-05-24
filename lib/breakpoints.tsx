"use client"

import { useMediaQuery } from "react-responsive"
import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "../basetailwindconfig"

const fullConfig = resolveConfig(tailwindConfig)
const breakpoints = fullConfig.theme.screens

type BreakpointKey = keyof typeof breakpoints

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
  const isMinWidth = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  })

  const isMaxWidth = useMediaQuery({
    query: `(max-width: ${breakpoints[breakpointKey]})`,
  })

  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1)

  type MinKey = `isMin${Capitalize<K>}`
  type MaxKey = `isMax${Capitalize<K>}`

  return {
    [`isMin${capitalizedKey}`]: isMinWidth,
    [`isMax${capitalizedKey}`]: isMaxWidth,
  } as Record<MinKey | MaxKey, boolean>
}
