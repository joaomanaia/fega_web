"use client"

import BaseSettingsContainer from "./BaseSettingsContainer"
import { type Dictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"
import { LocaleSwitcher } from "./locale-switcher"

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
