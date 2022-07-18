import React, { FC, useContext, useMemo } from "react"

import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles"
import { getDesignTokens, getThemedComponents } from "./M3Theme"
import { deepmerge } from "@mui/utils"
import { ThemeModeContext } from "../context/ThemeModeContext"
import { ThemeSchemeContext } from "../context/ThemeSchemeContext"
import { CssBaseline, responsiveFontSizes } from "@mui/material"

interface M3ThemeProps {
  children: React.ReactNode
}

const M3ThemeProvider: FC<M3ThemeProps> = ({ children }) => {
  const { themeMode } = useContext(ThemeModeContext)
  const { themeScheme } = useContext(ThemeSchemeContext)

  const m3Theme = useMemo(() => {
    const designTokens = getDesignTokens(themeMode, themeScheme[themeMode], themeScheme.tones)
    const newM3Theme = createTheme(designTokens)
    const newM3ThemeReponsiveFontSizes = responsiveFontSizes(newM3Theme)
    const newM3ThemeThemedComponents = deepmerge(newM3ThemeReponsiveFontSizes, getThemedComponents(newM3ThemeReponsiveFontSizes))

    if (typeof window !== "undefined") {
      window
        ?.document
        ?.querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", themeScheme[themeMode].surface)
    }

    return newM3ThemeThemedComponents
  }, [themeMode, themeScheme])

  return (
    <ThemeProvider theme={m3Theme}>
      <CssBaseline enableColorScheme />
      {children}.
    </ThemeProvider>
  )
}

export default M3ThemeProvider
