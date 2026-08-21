"use client"

import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import { MoreVerticalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useModal } from "@/hooks/use-modal-store"
import { Link } from "@/i18n/navigation"
import type { GroupViewType } from "@/types/group/GroupType"

interface BaseGroupOptions {
  group: GroupViewType
  isOwner: boolean
}

export const GroupOptionsDropdown: React.FC<BaseGroupOptions> = ({ group, isOwner }) => {
  const t = useTranslations("GroupsPage.list.options")
  const { onOpen } = useModal()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "hover:bg-primary-foreground/5 bg-transparent text-inherit transition",
        )}
      >
        <MoreVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuItem
          className="cursor-pointer px-3 py-2"
          render={<Link href={`/groups/${group.id}/info`} />}
        >
          {t("groupInfo")}
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
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-56">
        {/* TODO: Enable when fix the routing*/}
        <ContextMenuItem disabled render={<Link href={`/groups/${group.id}/info`} />}>
          {t("groupInfo")}
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
