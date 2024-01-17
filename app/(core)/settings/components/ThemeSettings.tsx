"use client"

import { ThemeModeContext } from "@/core/theme/providers/ThemeModeProvider"
import { useContext } from "react"
import DarkIcon from "@mui/icons-material/DarkModeOutlined"
import LightIcon from "@mui/icons-material/LightModeOutlined"
import BaseSettingsContainer from "./BaseSettingsContainer"
import ColorsComponent from "./theme/ColorsComponent"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

const ThemeSettings: React.FC = () => {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext)
  const { setTheme } = useTheme()

  const resetTheme = () => {
    // generateScheme("#6750a4")
    setThemeMode("light")
  }

  const toggleGlobalTheme = () => {
    if (themeMode === "light") {
      setThemeMode("dark")
      setTheme("dark")
    } else {
      setThemeMode("light")
      setTheme("light")
    }
  }

  return (
    <BaseSettingsContainer header="Theme">
      <ColorsComponent />
      <div onClick={toggleGlobalTheme} className="flex w-fit mt-4 px-4 rounded-2xl cursor-pointer space-x-4 items-center hover:bg-foreground/[0.08]">
        {themeMode === "dark" ? <DarkIcon /> : <LightIcon />}
        <p>Night mode</p>
        <Switch className="ml-8" onClick={toggleGlobalTheme} checked={themeMode === "dark"} />
      </div>
      <Button variant="ghost" onClick={resetTheme} className="w-fit">
        Reset theme
      </Button>
    </BaseSettingsContainer>
  )
}

export default ThemeSettings
