"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import Link from "next/link"
import { DrawerItem } from "./drawer-item"
import React, { useMemo } from "react"
import { cn } from "@/lib/utils"
import {
  CalendarDays,
  Camera,
  Home,
  LucideIcon,
  MessageCircle,
  Newspaper,
  Settings,
  Users,
} from "lucide-react"
import { type Dictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"

export interface MainDrawerProps {
  usingSheet?: boolean
  className?: string
  dictionary: Dictionary
  lang: Locale
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

const getCategories = (dictionary: Dictionary): NavDrawerItemGroup[] => [
  {
    id: dictionary.navdrawer.home,
    hideTitle: true,
    children: [
      {
        title: dictionary.navdrawer.home,
        Icon: Home,
        pathName: "/",
      },
      {
        title: dictionary.navdrawer.news,
        Icon: Newspaper,
        pathName: "/news",
      },
      {
        title: dictionary.navdrawer.events,
        Icon: CalendarDays,
        pathName: "/events",
      },
      {
        title: dictionary.navdrawer.cameras,
        Icon: Camera,
        pathName: "/cameras",
      },
    ],
  },
  {
    id: dictionary.navdrawer.messages,
    children: [
      {
        title: dictionary.navdrawer.privateMessages,
        Icon: Users,
        pathName: "/messages",
        requireAuth: true,
        disabled: true,
      },
      {
        title: dictionary.navdrawer.groups,
        Icon: MessageCircle,
        pathName: "/groups",
        requireAuth: true,
      },
    ],
  },
  {
    id: dictionary.navdrawer.other,
    children: [
      {
        title: dictionary.navdrawer.settings,
        Icon: Settings,
        pathName: "/settings",
      },
    ],
  },
]

export const MainDrawer: React.FC<MainDrawerProps> = ({
  usingSheet,
  className,
  dictionary,
  lang,
}) => {
  const layoutSegments = useSelectedLayoutSegments()
  const firstSegment = `/${layoutSegments.at(0) ?? ""}`

  const categories = useMemo(() => getCategories(dictionary), [dictionary])

  return (
    <nav className={cn("flex flex-col px-4 py-4 space-y-7 justify-start", className)}>
      <Link
        href="/"
        className="next-link px-2 py-2 w-fit rounded-2xl hover:bg-accent/[0.38] transition-colors font-medium tracking-[0.5]"
        style={{ fontSize: 20 }}
      >
        Fega
      </Link>
      <ul
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
        className="flex flex-col ml-0 py-0 px-0"
      >
        {categories.map(({ id, children, hideTitle }) => (
          <React.Fragment key={id}>
            {!hideTitle && <p className="py-2 px-3 text-sm self-start">{id}</p>}
            {children.map((navDrawerItem) => (
              <li itemProp="name" key={navDrawerItem.title} className="list-none">
                <DrawerItem
                  item={navDrawerItem}
                  selected={firstSegment == navDrawerItem.pathName}
                  usingSheet={usingSheet}
                  lang={lang}
                />
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}
