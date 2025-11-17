"use client"

import * as React from "react"
import { ChevronsUpDownIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ModeToggle({
  type = "icon",
  className,
}: {
  type?: "icon" | "select"
  className?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const t = useTranslations("SettingsPage.general.modeToggle")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {type === "icon" ? (
          <Button variant="ghost" size="icon" className={cn("text-foreground", className)}>
            <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">{t("title")}</span>
          </Button>
        ) : (
          <Button variant="outline" className={cn("w-fit rounded-2xl", className)}>
            <ChevronsUpDownIcon className="mr-auto" />
            <div className="mr-auto flex items-center justify-center gap-2">
              <SunIcon className="block dark:hidden" />
              <MoonIcon className="hidden dark:block" />
              {t(`options.${resolvedTheme as "light" | "dark" | "system"}`)}
            </div>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={resolvedTheme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">{t("options.light")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">{t("options.dark")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">{t("options.system")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
