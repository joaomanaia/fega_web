"use client"

import { AppBar, Avatar, Grid, IconButton, Toolbar, Tooltip, useScrollTrigger } from "@mui/material"
import MenuIcon from "@mui/icons-material/MenuTwoTone"
import type { User } from "@supabase/supabase-js"
import { use, useMemo } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/ui/mode-toggle"

interface HeaderProps {
  authUser: User | null
  onDrawerToggle?: () => void
  window?: () => Window
}

type AppBarUser = {
  name: string | null
  avatar: string | null
  actionLink: string
}

const MainAppBar: React.FC<HeaderProps> = ({ authUser, onDrawerToggle, window }) => {
  const userData = useMemo<AppBarUser>(() => {
    return {
      name: authUser?.user_metadata.full_name ?? authUser?.email ?? null,
      avatar: authUser?.user_metadata.avatar_url ?? null,
      actionLink: authUser ? `/${authUser.id}` : "/auth",
    }
  }, [authUser])

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })

  return (
    <>
      <AppBar className="sticky" position="sticky" elevation={trigger ? 2 : 0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item sx={{ display: { md: "none", sm: "block" } }}>
              <IconButton color="inherit" edge="start" onClick={onDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Grid>

            <Grid item xs></Grid>

            <Grid item>
              <ModeToggle />
            </Grid>

            <Grid item>
              <Tooltip title={userData.name ?? "Make login"}>
                <Link href={userData.actionLink}>
                  <IconButton id="avatar-button" color="inherit" sx={{ p: 0.5 }}>
                    <Avatar
                      alt={userData.name ?? "Fega User"}
                      src={userData.avatar ?? undefined}
                      sx={{
                        bgcolor: "primary.main",
                        color: "onPrimary.main",
                      }}
                    >
                      {userData.name ?? "Fega User"}
                    </Avatar>
                  </IconButton>
                </Link>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default MainAppBar
