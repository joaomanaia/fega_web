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
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Locale, useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/src/i18n/navigation"
import { useTransition } from "react"
import { useParams } from "next/navigation"
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
            <ChevronsUpDown size={16} className="mr-2" />
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
