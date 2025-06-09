import { type Metadata } from "next"
import { GeneralSettings } from "./components/general-settings"
import { UserSettings } from "@/app/[lang]/(core)/settings/components/user-settings"
import { createClient } from "@/lib/supabase/server"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "next-intl"

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
  // Enable static rendering
  setRequestLocale(params.lang)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className=" mx-auto max-w-3xl flex flex-col w-full gap-y-4 overflow-y-auto">
      <GeneralSettings />
      {user !== null && <UserSettings user={user} />}
    </main>
  )
}
