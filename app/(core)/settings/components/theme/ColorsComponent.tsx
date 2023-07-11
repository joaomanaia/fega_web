"use client"

import { useContext } from "react"
import BasicColorComponent from "./BasicColorComponent"
import CustomColorComponent from "./CustomColorComponent"
import { Divider, useTheme } from "@mui/material"
import { ThemeSchemeContext } from "@/core/theme/providers/ThemeSchemeProvider"

const basicColors = [
  "#0066ff",
  "#00cc00",
  "#6750a4",
  "#ff0000",
  "#ff9900",
  "#ffcc00",
  "#ff00ff",
  "#00ffff",
]

const ColorsComponent: React.FC = () => {
  const { generateScheme } = useContext(ThemeSchemeContext)

  const { palette } = useTheme()

  return (
    <div className="flex flex-wrap items-center gap-4">
      <CustomColorComponent currentColor={palette.primary.main} onChange={generateScheme} />
      <Divider orientation="vertical" flexItem className="my-2 rounded-full" />
      {basicColors.map((color, index) => (
        <BasicColorComponent
          key={index}
          color={color}
          onClick={() => generateScheme(color)}
        />
      ))}
    </div>
  )
}

export default ColorsComponent
