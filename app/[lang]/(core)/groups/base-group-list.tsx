"use client"

import { useBreakpoint } from "@/lib/breakpoints"
import { useEffect, useState } from "react"

interface BaseGroupListProps {
  isLayout?: boolean
  children: React.ReactNode
}

/**
 * Only renders the children if the breakpoint is xl
 */
export const BaseGroupList: React.FC<BaseGroupListProps> = ({ isLayout, children }) => {
  const [isClient, setIsClient] = useState(false)
  const { isMinXl, isMaxXl } = useBreakpoint("xl")

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

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
