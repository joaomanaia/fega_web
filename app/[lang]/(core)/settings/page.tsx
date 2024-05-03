import { Metadata } from "next"
import UserSettings from "./components/UserSettings"
import { isUserAuthenticated } from "@/utils/user-utils"
import { Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"

export const metadata: Metadata = {
  title: "Settings",
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
      {userAuthenticated && <UserSettings dictionary={dictionary} />}
    </main>
  )
}
