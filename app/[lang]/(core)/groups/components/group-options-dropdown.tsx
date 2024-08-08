"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GroupViewType } from "@/types/group/GroupType"
import { useModal } from "@/hooks/use-modal-store"
import { Link } from "@/components/link"
import { type Locale } from "@/i18n-config"

interface GroupOptionsDropdownProps {
  group: GroupViewType
  isOwner: boolean
  lang: Locale
}

export const GroupOptionsDropdown: React.FC<GroupOptionsDropdownProps> = ({
  group,
  isOwner,
  lang,
}) => {
  const { onOpen } = useModal()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-inherit bg-transparent hover:bg-primary-foreground/5 transition">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="px-3 py-2 cursor-pointer" asChild>
          <Link lang={lang} href={`/groups/${group.id}/info`}>Group Info</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isOwner && (
          <>
            <DropdownMenuItem
              onClick={() => onOpen("edit-group", { group })}
              className="px-3 py-2 cursor-pointer"
            >
              Edit Group
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("group-invite", { group })}
              className="px-3 py-2 cursor-pointer"
            >
              Add Members
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("delete-group", { group })}
              className="px-3 py-2 cursor-pointer text-error"
            >
              Delete Group
            </DropdownMenuItem>
          </>
        )}
        {!isOwner && (
          <DropdownMenuItem
            onClick={() => onOpen("exit-group", { group })}
            className="px-3 py-2 cursor-pointer text-error hover:text-error/90"
          >
            Leave Group
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
