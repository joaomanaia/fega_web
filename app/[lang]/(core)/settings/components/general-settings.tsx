"use client"

import { type Dictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"
import { BaseSettingsContainer } from "@/app/[lang]/(core)/settings/components/base-settings-container"
import { LocaleSwitcher } from "@/app/[lang]/(core)/settings/components/locale-switcher"

interface GeneralSettingsProps {
  dictionary: Dictionary
  currentLocale: Locale
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ dictionary, currentLocale }) => {
  return (
    <BaseSettingsContainer header={dictionary.general}>
      <LocaleSwitcher currentLocale={currentLocale} dictionary={dictionary} />
    </BaseSettingsContainer>
  )
}
