"use client"

import { MoreVerticalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModal } from "@/hooks/use-modal-store"
import { Link } from "@/src/i18n/navigation"
import type { GroupViewType } from "@/types/group/GroupType"

interface BaseGroupOptions {
  group: GroupViewType
  isOwner: boolean
}

interface GroupOptionsDropdownProps extends BaseGroupOptions {}

export const GroupOptionsDropdown: React.FC<GroupOptionsDropdownProps> = ({ group, isOwner }) => {
  const t = useTranslations("GroupsPage.list.options")
  const { onOpen } = useModal()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary-foreground/5 bg-transparent text-inherit transition"
        >
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuItem className="cursor-pointer px-3 py-2" asChild>
          <Link href={`/groups/${group.id}/info`}>{t("groupInfo")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isOwner && (
          <>
            <DropdownMenuItem
              onClick={() => onOpen("edit-group", { group })}
              className="cursor-pointer px-3 py-2"
            >
              {t("editGroup")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("group-invite", { group })}
              className="cursor-pointer px-3 py-2"
            >
              {t("addMembers")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("delete-group", { group })}
              variant="destructive"
              className="cursor-pointer px-3 py-2"
            >
              {t("deleteGroup")}
            </DropdownMenuItem>
          </>
        )}
        {!isOwner && (
          <DropdownMenuItem
            onClick={() => onOpen("exit-group", { group })}
            variant="destructive"
            className="cursor-pointer px-3 py-2"
          >
            {t("leaveGroup")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface GroupOptionsContextMenu extends BaseGroupOptions {
  children: React.ReactNode
}

export const GroupOptionsContextMenu: React.FC<GroupOptionsContextMenu> = ({
  children,
  group,
  isOwner,
}) => {
  const t = useTranslations("GroupsPage.list.options")
  const { onOpen } = useModal()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-56">
        {/* TODO: Enable when fix the routing*/}
        <ContextMenuItem disabled asChild>
          <Link href={`/groups/${group.id}/info`}>{t("groupInfo")}</Link>
        </ContextMenuItem>
        <ContextMenuSeparator />
        {isOwner && (
          <>
            <ContextMenuItem onClick={() => onOpen("edit-group", { group })}>
              {t("editGroup")}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onOpen("group-invite", { group })}>
              {t("addMembers")}
            </ContextMenuItem>
            <ContextMenuItem
              variant="destructive"
              onClick={() => onOpen("delete-group", { group })}
            >
              {t("deleteGroup")}
            </ContextMenuItem>
          </>
        )}
        {!isOwner && (
          <ContextMenuItem variant="destructive" onClick={() => onOpen("exit-group", { group })}>
            {t("leaveGroup")}
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
