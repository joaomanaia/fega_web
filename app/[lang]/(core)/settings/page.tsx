import { Suspense, use } from "react"
import { type Metadata } from "next"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import {
  UserSettings,
  UserSettingsSkeleton,
} from "@/app/[lang]/(core)/settings/components/user-settings"
import { getSession } from "@/lib/dal"
import { GeneralSettings } from "./components/general-settings"

export const metadata: Metadata = {
  title: "Settings",
  robots: "noindex, nofollow",
}

interface SettingsPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default function SettingsPage(props: SettingsPageProps) {
  const params = use(props.params)
  // Enable static rendering
  setRequestLocale(params.lang)

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 overflow-y-auto">
      <GeneralSettings />
      <Suspense fallback={<UserSettingsSkeleton />}>
        <UserSettingsContent />
      </Suspense>
    </main>
  )
}

async function UserSettingsContent() {
  const data = await getSession()
  if (!data) {
    return null
  }

  return <UserSettings user={data.user} />
}
