import { Metadata } from "next"
import ThemeSettings from "./components/ThemeSettings"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col w-full">
      <ThemeSettings />
    </div>
  )
}
