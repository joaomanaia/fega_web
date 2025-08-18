"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import { ChevronsUpDown } from "lucide-react"
import { useLocale, useTranslations, type Locale } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "@/src/i18n/navigation"
import { routing } from "@/src/i18n/routing"

export const LocaleSwitcher: React.FC = () => {
  const t = useTranslations("SettingsPage.LocaleSwitcher")
  const locale = useLocale()

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  function onSelectChange(value: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: value as Locale }
      )
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isPending} variant="outline" className="w-fit rounded-2xl">
            <ChevronsUpDown />
            {t("locale", { locale: locale })}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={locale} onValueChange={onSelectChange}>
            {routing.locales.map((lang) => (
              <DropdownMenuRadioItem key={lang} value={lang} disabled={isPending}>
                {t("locale", { locale: lang })}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
