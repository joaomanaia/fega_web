import { Metadata } from "next"
import UserSettings from "./components/UserSettings"
import { isUserAuthenticated } from "@/utils/user-utils"
import { Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { GeneralSettings } from "./components/general-settings"

export const metadata: Metadata = {
  title: "Settings",
  robots: "noindex, nofollow",
}

interface SettingsPageProps {
  params: {
    lang: Locale
  }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const dictionary = await getDictionary(params.lang)
  const userAuthenticated = await isUserAuthenticated()

  return (
    <main className="flex flex-col w-full space-y-4">
      <GeneralSettings dictionary={dictionary} currentLocale={params.lang} />
      {userAuthenticated && <UserSettings dictionary={dictionary} />}
    </main>
  )
}
