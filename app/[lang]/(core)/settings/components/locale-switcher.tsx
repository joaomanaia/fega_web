"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Dictionary } from "@/get-dictionary"
import { type Locale, languages, i18n } from "@/i18n-config"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"

interface LocaleSwitcherProps {
  currentLocale: Locale
  dictionary: Dictionary
}

export const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({ currentLocale, dictionary }) => {
  const pathName = usePathname()

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/"

    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) => !pathName.startsWith(`/${locale}/`) && pathName !== `/${locale}`
    )

    if (pathnameIsMissingLocale) {
      if (locale === i18n.defaultLocale) return pathName
      return `/${locale}${pathName}`
    } else {
      if (locale === i18n.defaultLocale) {
        const segments = pathName.split("/")
        const isHome = segments.length === 2
        if (isHome) return "/"

        segments.splice(1, 1)
        return segments.join("/")
      }

      const segments = pathName.split("/")
      segments[1] = locale
      return segments.join("/")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            <ChevronsUpDown size={16} className="mr-2" />
            {languages.find((lang) => lang.locale === currentLocale)?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{dictionary.chooseLanguage}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={currentLocale}>
            {languages.map((lang) => (
              <DropdownMenuRadioItem key={lang.locale} value={lang.locale}>
                <Link
                  className="w-full h-full"
                  href={redirectedPathName(lang.locale)}
                  onClick={() => {
                    if (lang.locale === currentLocale) return
                    Cookies.set("NEXT_LOCALE", lang.locale)
                  }}
                >
                  {lang.name}
                </Link>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
