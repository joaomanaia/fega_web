import { FC, useContext, useEffect, useState } from "react"
import {
  AppBar,
  Avatar,
  Fade,
  Grid,
  IconButton,
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
import ArrowIcon from "@mui/icons-material/ArrowForwardIosOutlined"
import { useRouter } from "next/router"
import { ThemeModeContext } from "../../../app/theme/context/ThemeModeContext"
import { ThemeSchemeContext } from "../../../app/theme/context/ThemeSchemeContext"
import { auth } from "../../../firebase"

interface HeaderProps {
  onDrawerToggle?: () => void
  window?: () => Window
}

interface HeaderAuthUserProps {
  avatar?: string
  name?: string
}

const Header: FC<HeaderProps> = ({ onDrawerToggle, window }) => {
  const { palette } = useTheme()
  const router = useRouter()

  const [routerName, setRouterName] = useState("")

  const headerAuthUser: HeaderAuthUserProps = {
    avatar: auth?.currentUser?.photoURL || undefined,
    name: auth?.currentUser?.displayName || undefined
  }

  useEffect(() => {
    const name = router.asPath.replace("/", "")
    setRouterName(name == "" ? "Home" : name)
  }, [router.asPath])

  const { toggleThemeMode, resetThemeMode } = useContext(ThemeModeContext)
  const { generateThemeScheme, resetThemeScheme } = useContext(ThemeSchemeContext)

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

  const onAvatarClicked = () => {
    const isLoggedIn = auth.currentUser !== null

    router.push(isLoggedIn ? `/${auth.currentUser?.uid}` : "/auth")
  }

  return (
    <>
      <AppBar color={trigger ? "primary" : "default"} position="sticky" elevation={trigger ? 2 : 0}>
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
                <IconButton color="inherit" sx={{ p: 0.5 }} onClick={onAvatarClicked}>
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
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
