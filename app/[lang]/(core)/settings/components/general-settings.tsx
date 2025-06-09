"use client"

import { BaseSettingsContainer } from "@/app/[lang]/(core)/settings/components/base-settings-container"
import { LocaleSwitcher } from "@/app/[lang]/(core)/settings/components/locale-switcher"
import { useTranslations } from "next-intl"

export const GeneralSettings: React.FC = () => {
  const t = useTranslations("SettingsPage.general")

  return (
    <BaseSettingsContainer header={t("header")}>
      <LocaleSwitcher />
    </BaseSettingsContainer>
  )
}
