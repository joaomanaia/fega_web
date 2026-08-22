"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronsUpDown } from "lucide-react"
import { useLocale, useTranslations, type Locale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

export function LocaleSwitcher({ className }: { className?: string }) {
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
        { locale: value as Locale },
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className={cn(buttonVariants({ variant: "outline" }), "w-fit rounded-2xl", className)}
      >
        <ChevronsUpDown className="mr-auto" />
        <span className="mr-auto">{t("locale", { locale: locale })}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={locale} onValueChange={onSelectChange}>
          <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
          {routing.locales.map((lang) => (
            <DropdownMenuRadioItem key={lang} value={lang} disabled={isPending}>
              {t("locale", { locale: lang })}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
