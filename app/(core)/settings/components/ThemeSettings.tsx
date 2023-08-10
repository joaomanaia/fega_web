"use client"

import { ThemeModeContext } from "@/core/theme/providers/ThemeModeProvider"
import { useContext } from "react"
import DarkIcon from "@mui/icons-material/DarkModeOutlined"
import LightIcon from "@mui/icons-material/LightModeOutlined"
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from "@mui/material"
import BaseSettingsContainer from "./BaseSettingsContainer"
import ColorsComponent from "./theme/ColorsComponent"

const ThemeSettings: React.FC = () => {
  const { toggleTheme, themeMode, setThemeMode } = useContext(ThemeModeContext)

  const resetTheme = () => {
    // generateScheme("#6750a4")
    setThemeMode("light")
  }

  return (
    <BaseSettingsContainer header="Theme">
      <ListItem>
        <ColorsComponent />
      </ListItem>
      <ListItem sx={{ marginTop: "20px !important" }}>
          <ListItemIcon>
            {themeMode === "dark" ? <DarkIcon /> : <LightIcon />}
          </ListItemIcon>
          <ListItemText id="switch-list-label-theme" primary="Night mode" />
          <Switch
            edge="end"
            onChange={() => toggleTheme()}
            checked={themeMode === "dark"}
            inputProps={{
              "aria-labelledby": "switch-list-label-theme"
            }} />
        </ListItem>
        <ListItemButton onClick={resetTheme}>
          <ListItemText primary="Reset theme" />
        </ListItemButton>
    </BaseSettingsContainer>
  )
}

export default ThemeSettings
