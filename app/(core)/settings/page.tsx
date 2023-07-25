import { Metadata } from "next"
import ThemeSettings from "./components/ThemeSettings"
import UserSettings from "./components/UserSettings"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col w-full">
      <UserSettings />
      <ThemeSettings />
    </div>
  )
}
