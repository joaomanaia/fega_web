import { Metadata } from "next"
import UserSettings from "./components/UserSettings"
import { isUserAuthenticated } from "@/utils/user-utils"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const userAuthenticated = await isUserAuthenticated()

  return (
    <main className="flex flex-col w-full space-y-4">
      {userAuthenticated && <UserSettings />}
    </main>
  )
}
