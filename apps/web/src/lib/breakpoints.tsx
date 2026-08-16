"use client"

import { useMediaQuery } from "react-responsive"

const breakpoints = {
  sm: "40rem", // 640px
  md: "48rem", // 768px
  lg: "64rem", // 1024px
  xl: "80rem", // 1280px
  "2xl": "96rem", // 1536px
} as const

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
