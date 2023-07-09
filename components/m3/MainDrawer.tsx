"use client"

import {
  AppBar,
  Box,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import {
  HomeRounded,
  NewspaperRounded,
  CalendarMonthRounded,
  MessageRounded,
  GroupRounded,
  CameraAltRounded,
} from "@mui/icons-material"
import { auth } from "@/firebase"

export interface MainDrawerProps extends DrawerProps {}

interface NavDrawerItem {
  title: string
  icon: any
  pathName: string
  requireAuth?: boolean
}

interface NavDrawerItemGroup {
  id: string
  hideTitle?: boolean
  children: NavDrawerItem[]
}

const categories: NavDrawerItemGroup[] = [
  {
    id: "Home",
    hideTitle: true,
    children: [
      {
        title: "Home",
        icon: <HomeRounded />,
        pathName: "/",
      },
      {
        title: "News",
        icon: <NewspaperRounded />,
        pathName: "/news",
      },
      {
        title: "Events",
        icon: <CalendarMonthRounded />,
        pathName: "/events",
      },
      {
        title: "Cameras",
        icon: <CameraAltRounded />,
        pathName: "/cameras",
      },
    ],
  },
  {
    id: "Messages",
    children: [
      {
        title: "Private Messages",
        icon: <GroupRounded />,
        pathName: "/messages",
        requireAuth: true,
      },
      {
        title: "Groups",
        icon: <MessageRounded />,
        pathName: "/groups",
        requireAuth: true,
      },
    ],
  },
]

const MainDrawer: React.FC<MainDrawerProps> = (props) => {
  const { ...others } = props

  const router = useRouter()
  const routerPath = usePathname()

  const isLoggedIn = auth.currentUser !== null

  const handleListItemClick = (navDrawerItem: NavDrawerItem) => {
    const goToAuth = navDrawerItem.requireAuth && !isLoggedIn

    router.push(goToAuth ? "/auth" : navDrawerItem.pathName)
  }

  return (
    <Drawer variant="permanent" {...others}>
      <Toolbar>
        <Typography color="inherit" sx={{ fontWeight: 500, letterSpacing: 0.5, fontSize: 20 }}>
          Fega
        </Typography>
      </Toolbar>
      <List>
        {categories.map(({ id, children, hideTitle }) => (
          <Box key={id}>
            {!hideTitle && (
              <ListItem sx={{ py: 2, px: 3 }}>
                <ListItemText sx={{ fontWeight: "bold" }}>
                  <Typography color="inherit" sx={{ ml: 1, fontSize: 15, fontWeight: 500 }}>
                    {id}
                  </Typography>
                </ListItemText>
              </ListItem>
            )}
            {children.map((navDrawerItem) => (
              <ListItem key={navDrawerItem.title}>
                <ListItemButton
                  selected={routerPath == navDrawerItem.pathName}
                  onClick={() => handleListItemClick(navDrawerItem)}
                >
                  <ListItemIcon>{navDrawerItem.icon}</ListItemIcon>
                  <ListItemText>{navDrawerItem.title}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        ))}
      </List>
    </Drawer>
  )
}

export default MainDrawer
