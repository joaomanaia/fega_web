"use client"

import { useBreakpoint } from "@/lib/breakpoints"

interface BaseGroupListProps {
  isLayout?: boolean
  children: React.ReactNode
}

/**
 * Only renders the children if the breakpoint is xl
 */
export const BaseGroupList: React.FC<BaseGroupListProps> = ({ isLayout, children }) => {
  const { isMinXl, isMaxXl } = useBreakpoint("xl")

  // If isLayout is true, only render the children if the breakpoint is xl
  if (isLayout && isMinXl) {
    return <>{children}</>
  }

  // If isLayout is false, only render the children if the breakpoint is not xl
  if (!isLayout && isMaxXl) {
    return <>{children}</>
  }

  return null
}
