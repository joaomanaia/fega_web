import { type Locale } from "@/i18n-config"
import { default as NextLink, type LinkProps as NextLinkProps } from "next/link"
import React from "react"

interface LinkProps extends NextLinkProps {
  lang?: Locale
  children: React.ReactNode
  className?: string
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, lang, ...props }, ref) => {
    const path = lang ? `/${lang}${href}` : href

    return <NextLink href={path} ref={ref} {...props} />
  }
)

Link.displayName = "Link"
