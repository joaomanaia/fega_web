import { FC, useContext, useState } from "react"
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
import ColorIcon from "@mui/icons-material/ColorLensOutlined"
import DarkIcon from "@mui/icons-material/DarkModeOutlined"
import LightIcon from "@mui/icons-material/LightModeOutlined"
import RestartIcon from "@mui/icons-material/RefreshOutlined"
import { useRouter } from "next/router"
import { ThemeModeContext } from "../../../core/theme/context/ThemeModeContext"
import { ThemeSchemeContext } from "../../../core/theme/context/ThemeSchemeContext"
import { auth } from "../../../firebase"
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

const Header: FC<HeaderProps> = ({ onDrawerToggle, window }) => {
  const { palette } = useTheme()
  const router = useRouter()

  const headerAuthUser: HeaderAuthUserProps = {
    avatar: auth?.currentUser?.photoURL || undefined,
    name: auth?.currentUser?.displayName || undefined,
    loggedIn: auth?.currentUser !== null
  }

  const { toggleThemeMode, resetThemeMode } = useContext(ThemeModeContext)
  const { generateThemeScheme, resetThemeScheme } = useContext(ThemeSchemeContext)

  const [avatarMenuAnchorEl, setAvatarMenuAnchorEl] = useState<null | HTMLElement>(null)
  const avatarMenuOpen = Boolean(avatarMenuAnchorEl)

  const handleAvatarMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarMenuAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAvatarMenuAnchorEl(null)
  }

  const changeThemeMode = () => toggleThemeMode()

  const changeThemeScheme = async () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    generateThemeScheme(randomColor)
  }

  const reset = () => {
    resetThemeMode()
    resetThemeScheme()
  }

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })

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

  return (
    <>
      <AppBar color={trigger ? "primary" : "default"} position="sticky" elevation={trigger ? 2 : 0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item sx={{ display: { md: "none", sm: "block" } }}>
              <Tooltip title="Menu">
                <IconButton color="inherit" edge="start" onClick={onDrawerToggle}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography
                color="inherit"
                sx={{ fontWeight: 500, letterSpacing: 0.5, fontSize: 20 }}
              >
                Fega
              </Typography>
            </Grid>

            <Grid item xs></Grid>

            <Grid item>
              <Tooltip title="Change Color">
                <IconButton size="large" color="inherit" onClick={changeThemeScheme}>
                  <ColorIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title="Switch Theme">
                <IconButton size="large" color="inherit" onClick={changeThemeMode}>
                  {palette.mode == "light" ? <DarkIcon /> : <LightIcon />}
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title="Reset">
                <IconButton size="large" color="inherit" onClick={reset}>
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
                      background: palette.secondary.main,
                      color: palette.onSecondary.main,
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

export default Header
