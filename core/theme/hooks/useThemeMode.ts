import { useLayoutEffect, useState } from "react"
import { ThemeMode } from "../types/ThemeMode"

export const THEME_MODE_KEY = "ThemeMode"

export const useThemeMode = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light")

  useLayoutEffect(() => {
    if (localStorage.getItem(THEME_MODE_KEY)) {
      const localMode = JSON.parse(localStorage.getItem(THEME_MODE_KEY) || "{}")
      setThemeMode(localMode)
    }
  }, [])

  const toggleTheme = () => {
    const value = themeMode == "light" ? "dark" : "light"
    setThemeMode(value)
    localStorage.setItem(THEME_MODE_KEY, JSON.stringify(value))
  }

  return [themeMode, toggleTheme, setThemeMode] as const
}
