"use client"

import React from "react"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronsUpDownIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

export function ModeToggle({
  type = "icon",
  className,
}: {
  type?: "icon" | "select"
  className?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const t = useTranslations("SettingsPage.general.modeToggle")

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  if (!mounted) {
    return <Skeleton className={cn("w-full", type === "select" && "h-10", className)} />
  }

  const resolvedThemeWithFallback = resolvedTheme as "light" | "dark" | "system"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({
            variant: type === "icon" ? "ghost" : "outline",
            size: type === "icon" ? "icon" : "default",
          }),
          type === "icon" ? "text-foreground" : "w-fit rounded-2xl",
          className,
        )}
      >
        {type === "icon" ? (
          <>
            <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">{t("title")}</span>
          </>
        ) : (
          <>
            <ChevronsUpDownIcon className="mr-auto" />
            <div className="mr-auto flex items-center justify-center gap-2">
              <SunIcon className="block dark:hidden" />
              <MoonIcon className="hidden dark:block" />
              {t(`options.${resolvedThemeWithFallback}`)}
            </div>
          </>
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
