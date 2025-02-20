import { type Metadata } from "next"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { GeneralSettings } from "./components/general-settings"
import { UserSettings } from "@/app/[lang]/(core)/settings/components/user-settings"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Settings",
  robots: "noindex, nofollow",
}

interface SettingsPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function SettingsPage(props: SettingsPageProps) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className=" mx-auto max-w-3xl flex flex-col w-full gap-y-4 overflow-y-auto">
      <GeneralSettings dictionary={dictionary} currentLocale={params.lang} />
      {user !== null && <UserSettings user={user} dictionary={dictionary.settings.user} />}
    </main>
  )
}
