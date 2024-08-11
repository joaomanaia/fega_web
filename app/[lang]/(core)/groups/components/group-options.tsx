"use client"

import { Link } from "@/components/link"
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
import type { Dictionary } from "@/get-dictionary"
import { useModal } from "@/hooks/use-modal-store"
import type { Locale } from "@/i18n-config"
import type { GroupViewType } from "@/types/group/GroupType"
import { MoreVerticalIcon } from "lucide-react"

type GroupOptionsDictionary = Dictionary["groups"]["list"]["options"]

interface BaseGroupOptions {
  group: GroupViewType
  isOwner: boolean
  lang: Locale
  dictionary: GroupOptionsDictionary
}

interface GroupOptionsDropdownProps extends BaseGroupOptions {}

export const GroupOptionsDropdown: React.FC<GroupOptionsDropdownProps> = ({
  group,
  isOwner,
  lang,
  dictionary,
}) => {
  const { onOpen } = useModal()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-inherit bg-transparent hover:bg-primary-foreground/5 transition"
        >
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuItem className="px-3 py-2 cursor-pointer" asChild>
          <Link lang={lang} href={`/groups/${group.id}/info`}>
            {dictionary.groupInfo}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isOwner && (
          <>
            <DropdownMenuItem
              onClick={() => onOpen("edit-group", { group })}
              className="px-3 py-2 cursor-pointer"
            >
              {dictionary.editGroup}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("group-invite", { group })}
              className="px-3 py-2 cursor-pointer"
            >
              {dictionary.addMembers}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("delete-group", { group })}
              variant="error"
              className="px-3 py-2 cursor-pointer"
            >
              {dictionary.deleteGroup}
            </DropdownMenuItem>
          </>
        )}
        {!isOwner && (
          <DropdownMenuItem
            onClick={() => onOpen("exit-group", { group })}
            variant="error"
            className="px-3 py-2 cursor-pointer"
          >
            {dictionary.leaveGroup}
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
  lang,
  dictionary,
}) => {
  const { onOpen } = useModal()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-56">
        <ContextMenuItem asChild>
          <Link lang={lang} href={`/groups/${group.id}/info`}>
            {dictionary.groupInfo}
          </Link>
        </ContextMenuItem>
        <ContextMenuSeparator />
        {isOwner && (
          <>
            <ContextMenuItem onClick={() => onOpen("edit-group", { group })}>
              {dictionary.editGroup}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onOpen("group-invite", { group })}>
              {dictionary.addMembers}
            </ContextMenuItem>
            <ContextMenuItem variant="error" onClick={() => onOpen("delete-group", { group })}>
              {dictionary.deleteGroup}
            </ContextMenuItem>
          </>
        )}
        {!isOwner && (
          <ContextMenuItem variant="error" onClick={() => onOpen("exit-group", { group })}>
            {dictionary.leaveGroup}
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
