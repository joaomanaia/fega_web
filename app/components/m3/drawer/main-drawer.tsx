"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import { DrawerItem } from "./drawer-item"
import React from "react"
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
import { Link } from "@/src/i18n/navigation"
import { useTranslations } from "next-intl"

export interface MainDrawerProps {
  usingSheet?: boolean
  className?: string
}

export interface NavDrawerItem {
  id: string
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
    id: "home",
    hideTitle: true,
    children: [
      {
        id: "home",
        Icon: Home,
        pathName: "/",
      },
      {
        id: "news",
        Icon: Newspaper,
        pathName: "/news",
      },
      {
        id: "events",
        Icon: CalendarDays,
        pathName: "/events",
      },
      {
        id: "cameras",
        Icon: Camera,
        pathName: "/cameras",
      },
    ],
  },
  {
    id: "messages",
    children: [
      {
        id: "privateMessages",
        Icon: Users,
        pathName: "/messages",
        requireAuth: true,
        disabled: true,
      },
      {
        id: "groups",
        Icon: MessageCircle,
        pathName: "/groups",
        requireAuth: true,
      },
    ],
  },
  {
    id: "otherItems",
    children: [
      {
        id: "settings",
        Icon: Settings,
        pathName: "/settings",
      },
    ],
  },
]

export const MainDrawer: React.FC<MainDrawerProps> = ({ usingSheet, className }) => {
  const t = useTranslations("General")
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
      <ul
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
        className="flex flex-col ml-0 py-0 px-0"
      >
        {categories.map(({ id, children, hideTitle }) => (
          <React.Fragment key={id}>
            {!hideTitle && (
              <p className="py-2 px-3 text-sm self-start">{t("navdrawerTitle", { title: id })}</p>
            )}
            {children.map((navDrawerItem) => (
              <li itemProp="name" key={navDrawerItem.id} className="list-none">
                <DrawerItem
                  title={t("navdrawerTitle", { title: navDrawerItem.id })}
                  Icon={navDrawerItem.Icon}
                  pathName={navDrawerItem.pathName}
                  disabled={navDrawerItem.disabled}
                  selected={firstSegment == navDrawerItem.pathName}
                  usingSheet={usingSheet}
                />
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}
