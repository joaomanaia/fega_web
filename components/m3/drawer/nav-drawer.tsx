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
import { FC } from "react"
import { useRouter } from "next/router"
import {
  HomeRounded,
  NewspaperRounded,
  CalendarMonthRounded,
  MessageRounded,
  GroupRounded,
  CameraAltRounded
} from "@mui/icons-material"

export interface NavDrawerProps extends DrawerProps {}

interface NavDrawerItem {
  title: string
  icon: any
  pathName: string
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
      },
      {
        title: "Groups",
        icon: <MessageRounded />,
        pathName: "/groups",
      },
    ],
  },
]

const NavDrawer: FC<NavDrawerProps> = (props) => {
  const { ...others } = props

  const router = useRouter()

  const routerAsPath = router.asPath
  const routerPathSubString = routerAsPath.substring(0, routerAsPath.lastIndexOf("?"))
  const routerPath = routerPathSubString == "" ? routerAsPath : routerPathSubString

  const handleListItemClick = (path: string) => {
    router.push(path)
  }
  
  return (
    <Drawer variant="permanent" {...others}>
      <AppBar color="default" elevation={0} position="sticky">
        <Toolbar></Toolbar>
      </AppBar>
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
            {children.map(({ title, icon, pathName }) => (
              <ListItem key={title}>
                <ListItemButton
                  selected={routerPath == pathName}
                  onClick={() => handleListItemClick(pathName)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{title}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        ))}
      </List>
    </Drawer>
  )
}

export default NavDrawer
