"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import Link from "next/link"
import { DrawerItem } from "./drawer-item"
import React from "react"
import { cn } from "@/lib/utils"
import { CalendarDays, Camera, Home, LucideIcon, MessageCircle, Newspaper, Settings, Users } from "lucide-react"

export interface MainDrawerProps {
  className?: string
}

export interface NavDrawerItem {
  title: string
  Icon: LucideIcon
  pathName: string
  requireAuth?: boolean
  disabled?: boolean
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
        Icon: Home,
        pathName: "/",
      },
      {
        title: "News",
        Icon: Newspaper,
        pathName: "/news",
      },
      {
        title: "Events",
        Icon: CalendarDays,
        pathName: "/events",
        disabled: true,
      },
      {
        title: "Cameras",
        Icon: Camera,
        pathName: "/cameras",
      },
    ],
  },
  {
    id: "Messages",
    children: [
      {
        title: "Private Messages",
        Icon: Users,
        pathName: "/messages",
        requireAuth: true,
        disabled: true,
      },
      {
        title: "Groups",
        Icon: MessageCircle,
        pathName: "/groups",
        requireAuth: true,
      },
    ],
  },
  {
    id: "Other",
    children: [
      {
        title: "Settings",
        Icon: Settings,
        pathName: "/settings",
      },
    ],
  },
]

export const MainDrawer: React.FC<MainDrawerProps> = ({ className }) => {
  const layoutSegments = useSelectedLayoutSegments()
  const firstSegment = `/${layoutSegments.at(0) ?? ""}`

  return (
    <nav className={cn("flex flex-col px-4 py-4 space-y-7 justify-start", className)}>
      <Link
        href="/"
        className="next-link px-2 py-2 w-fit rounded-2xl hover:bg-accent/[0.38] transition-colors font-medium tracking-[0.5]"
        style={{ fontSize: 20 }}
      >
        Fega
      </Link>
      <ul className="flex flex-col ml-0 py-0 px-0">
        {categories.map(({ id, children, hideTitle }) => (
          <React.Fragment key={id}>
            {!hideTitle && <p className="py-2 px-3 text-sm self-start">{id}</p>}
            {children.map((navDrawerItem) => (
              <li key={navDrawerItem.title} className="list-none">
                <DrawerItem
                  item={navDrawerItem}
                  selected={firstSegment == navDrawerItem.pathName}
                />
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}
