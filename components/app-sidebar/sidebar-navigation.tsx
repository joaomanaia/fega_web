"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import {
  CalendarDaysIcon,
  CameraIcon,
  HomeIcon,
  MessageCircleIcon,
  NewspaperIcon,
  SettingsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"
import type { Route } from "next"
import { useTranslations } from "next-intl"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "@/components/link"

export interface NavDrawerItem {
  id: string
  Icon: LucideIcon
  pathName: Route
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
        Icon: HomeIcon,
        pathName: "/",
      },
      {
        id: "news",
        Icon: NewspaperIcon,
        pathName: "/news",
      },
      {
        id: "events",
        Icon: CalendarDaysIcon,
        pathName: "/events",
      },
      {
        id: "cameras",
        Icon: CameraIcon,
        pathName: "/cameras",
      },
    ],
  },
  {
    id: "messages",
    children: [
      {
        id: "privateMessages",
        Icon: UsersIcon,
        pathName: "/messages",
        requireAuth: true,
        disabled: true,
      },
      {
        id: "groups",
        Icon: MessageCircleIcon,
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
        Icon: SettingsIcon,
        pathName: "/settings",
      },
    ],
  },
]

export function SidebarNavigation() {
  const t = useTranslations("General")
  const layoutSegments = useSelectedLayoutSegments()
  const firstSegment = `/${layoutSegments.at(0) ?? ""}`

  return (
    <>
      {categories.map(({ id, children, hideTitle }) => (
        <SidebarGroup key={id}>
          {!hideTitle && (
            <SidebarGroupLabel>{t("navdrawerTitle", { title: id })}</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {children.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    size="lg"
                    isActive={firstSegment === item.pathName}
                    disabled={item.disabled}
                    aria-disabled={item.disabled}
                    className="rounded-full px-4"
                    asChild
                  >
                    <Link href={item.pathName}>
                      <item.Icon />
                      <span className="">{t("navdrawerTitle", { title: item.id })}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
