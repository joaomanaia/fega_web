"use client"

import { Box, SxProps, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"
import MainAppBar from "./MainAppBar"
import MainDrawer from "./MainDrawer"

const drawerWidth = 260

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up("md"))

  const [mobileOpen, setMobileOpen] = useState(false)

  const rootStyles: SxProps = {
    display: "flex",
    minHeight: "100vh",
  }
  const navStyles: SxProps = {
    width: { md: drawerWidth },
    flexShrink: { md: 0 },
  }

  const mainStyles: SxProps = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    //bgcolor: '#f3f3f3'
  }
  const containerStyles: SxProps = {
    p: 0,
    flex: 1,
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={rootStyles}>
      <Box component="nav" sx={navStyles}>
        {isSmUp ? null : (
          <MainDrawer
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        )}
        <MainDrawer
          variant="permanent"
          PaperProps={{ style: { width: drawerWidth } }}
          sx={{ display: { md: "block", sm: "none", xs: "none" } }}
        />
      </Box>
      <Box sx={mainStyles}>
        <MainAppBar onDrawerToggle={handleDrawerToggle} />
        <Box sx={containerStyles}>{children}</Box>
      </Box>
    </Box>
  )
}

export default MainLayout
