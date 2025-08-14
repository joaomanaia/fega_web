"use client"

import React from "react"
import { useSelectedLayoutSegments } from "next/navigation"
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
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"
import { DrawerItem } from "./drawer-item"

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
    <nav className={cn("flex flex-col justify-start gap-y-2 px-4 py-2", className)}>
      <Link
        href="/"
        className="next-link hover:bg-accent/[0.38] w-fit rounded-2xl px-2 py-2 font-medium tracking-[0.5] transition-colors"
        style={{ fontSize: 20 }}
      >
        Fega
      </Link>
      <ul
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
        className="ml-0 flex flex-col px-0 py-0"
      >
        {categories.map(({ id, children, hideTitle }) => (
          <React.Fragment key={id}>
            {!hideTitle && (
              <p className="self-start px-3 py-2 text-sm">{t("navdrawerTitle", { title: id })}</p>
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
