"use client"

import * as React from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import ThemeModeProvider from "./providers/ThemeModeProvider"
import ThemeSchemeProvider from "./providers/ThemeSchemeProvider"
import M3Theme from "./wrapper/M3Theme"

export type MuiProviderProps = {
  children?: React.ReactNode
}

export function MuiProvider({ children }: MuiProviderProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeModeProvider>
        <ThemeSchemeProvider>
          <M3Theme>{children}</M3Theme>
        </ThemeSchemeProvider>
      </ThemeModeProvider>
    </AppRouterCacheProvider>
  )
}
