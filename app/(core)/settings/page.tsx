import { Metadata } from "next"
import ThemeSettings from "./components/ThemeSettings"
import UserSettings from "./components/UserSettings"
import { isUserAuthenticated } from "@/utils/user-utils"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const userAuthenticated = await isUserAuthenticated()

  return (
    <div className="flex flex-col w-full space-y-4">
      {userAuthenticated && <UserSettings />}
      <ThemeSettings />
    </div>
  )
}
