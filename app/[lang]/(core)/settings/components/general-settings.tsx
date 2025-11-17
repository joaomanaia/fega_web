"use client"

import { useTranslations } from "next-intl"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { BaseSettingsContainer } from "@/app/[lang]/(core)/settings/components/base-settings-container"
import { LocaleSwitcher } from "@/app/[lang]/(core)/settings/components/locale-switcher"

export const GeneralSettings: React.FC = () => {
  const t = useTranslations("SettingsPage.general")

  return (
    <BaseSettingsContainer header={t("header")}>
      <ModeToggle type="select" className="w-full min-w-48 lg:w-fit" />
      <LocaleSwitcher className="w-full min-w-48 lg:w-fit" />
    </BaseSettingsContainer>
  )
}
