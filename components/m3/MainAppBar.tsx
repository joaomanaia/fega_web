"use client"

import { useContext, useState } from "react"
import {
  AppBar,
  Avatar,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
  useTheme,
} from "@mui/material"

import MenuIcon from "@mui/icons-material/MenuTwoTone"
import ColorIcon from "@mui/icons-material/Shuffle"
import DarkIcon from "@mui/icons-material/DarkModeOutlined"
import LightIcon from "@mui/icons-material/LightModeOutlined"
import RestartIcon from "@mui/icons-material/RefreshOutlined"
import { ThemeModeContext } from "@/core/theme/providers/ThemeModeProvider"
import { ThemeSchemeContext } from "@/core/theme/providers/ThemeSchemeProvider"
import { usePathname, useRouter } from "next/navigation"
import { auth } from "@/firebase"
import { ExitToAppRounded, PersonRounded } from "@mui/icons-material"

interface HeaderProps {
  onDrawerToggle?: () => void
  window?: () => Window
}

interface HeaderAuthUserProps {
  avatar?: string
  name?: string
  loggedIn: boolean
}

const MainAppBar: React.FC<HeaderProps> = ({ onDrawerToggle, window }) => {
  const { toggleTheme, themeMode, setThemeMode } = useContext(ThemeModeContext)
  const { generateScheme, themeScheme } = useContext(ThemeSchemeContext)

  const router = useRouter()
  const pathname = usePathname()

  // Profile Avatar
  const headerAuthUser: HeaderAuthUserProps = {
    avatar: auth?.currentUser?.photoURL || undefined,
    name: auth?.currentUser?.displayName || undefined,
    loggedIn: auth?.currentUser !== null
  }

  const [avatarMenuAnchorEl, setAvatarMenuAnchorEl] = useState<null | HTMLElement>(null)
  const avatarMenuOpen = Boolean(avatarMenuAnchorEl)

  const handleAvatarMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarMenuAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAvatarMenuAnchorEl(null)
  }

  const onAvatarClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isLoggedIn = auth.currentUser !== null

    if (isLoggedIn) {
      handleAvatarMenuClick(event)
    } else {
      router.push("/auth")
    }
  }

  const navigateToAuthUserProfile = () => {
    router.push(`/${auth.currentUser?.uid}`)
  }

  const signOut = () => {
    auth.signOut()
  }

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })

  const DIGITS: string = "0123456789ABCDEF"

  const randomColor = (): string => {
    let result = ""
    for (let i = 0; i < 6; ++i) {
      const index = Math.floor(16 * Math.random())
      result += DIGITS[index]
    }
    return "#" + result
  }

  const onGenerate = () => generateScheme(randomColor())

  const onReset = () => {
    generateScheme("#6750a4") //#6750a4 #005fb0
    setThemeMode("light")
  }

  return (
    <>
      <AppBar position="sticky" elevation={trigger ? 2 : 0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item sx={{ display: { md: "none", sm: "block" } }}>
              <IconButton color="inherit" edge="start" onClick={onDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Grid>

            <Grid item sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography
                color="inherit"
                sx={{ fontWeight: 500, letterSpacing: 0.5, fontSize: 20 }}
              >
                {pathname?.replace("/", "")}
              </Typography>
            </Grid>

            <Grid item xs></Grid>

            <Grid item>
              <Tooltip title="Switch Theme">
                <IconButton size="large" color="inherit" onClick={toggleTheme}>
                  {themeMode == "light" ? <DarkIcon /> : <LightIcon />}
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title="Shuffle Color">
                <IconButton size="large" color="inherit" onClick={onGenerate}>
                  <ColorIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title="Reset">
                <IconButton size="large" color="inherit" onClick={onReset}>
                  <RestartIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title={headerAuthUser.name || "Make login"}>
                <IconButton
                  id="avatar-button"
                  aria-controls={avatarMenuOpen ? "avatar-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={avatarMenuOpen ? "true" : undefined}
                  aria-label="avatar"
                  color="inherit" 
                  sx={{ p: 0.5 }}
                  onClick={onAvatarClicked}>
                  <Avatar
                    alt={headerAuthUser.name}
                    src={headerAuthUser.avatar}
                    sx={{
                      bgcolor: 'primary.main', 
                      color: 'onPrimary.main'
                    }}
                  >
                    {headerAuthUser.name}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Grid>

            <Menu
              id="avatar-menu"
              anchorEl={avatarMenuAnchorEl}
              open={avatarMenuOpen}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "settings-button",
              }}>
              <MenuItem onClick={navigateToAuthUserProfile}>
                <ListItemIcon>
                  <PersonRounded fontSize="small" />
                </ListItemIcon>
                <ListItemText>View profile</ListItemText>
              </MenuItem>

              <MenuItem onClick={signOut}>
                <ListItemIcon>
                  <ExitToAppRounded fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign out</ListItemText>
              </MenuItem>
            </Menu>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default MainAppBar
