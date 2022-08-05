import { Box, Container, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"
import NavDrawer from "../m3/drawer/nav-drawer"
import Header from "../m3/header/header"

interface RootLayoutProps {
  children: React.ReactNode
}

const drawerWidth = 256

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up("md"))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: 'cal(100vh-3px)' }}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {isSmUp ? null : (
          <NavDrawer
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        )}
        <NavDrawer
          PaperProps={{ style: { width: drawerWidth } }}
          sx={{ display: { md: "block", sm: "none", xs: "none" } }}
        />
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default RootLayout
