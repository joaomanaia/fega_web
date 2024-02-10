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
import { GroupViewType } from "@/types/group/GroupType"
import Link from "next/link"
import { useModal } from "@/hooks/use-modal-store"

interface GroupOptionsDropdownProps {
  group: GroupViewType
  isOwner: boolean
  groupHref: string
}

export const GroupOptionsDropdown: React.FC<GroupOptionsDropdownProps> = ({ group, isOwner }) => {
  const { onOpen } = useModal()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-inherit">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="px-3 py-2 cursor-pointer" asChild>
          <Link href={`/groups/${group.id}/info`}>Group Info</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isOwner && (
          <>
            <DropdownMenuItem disabled className="px-3 py-2 cursor-pointer">
              Edit Group Info
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("group-invite", { group })}
              className="px-3 py-2 cursor-pointer"
            >
              Add Members
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="px-3 py-2 cursor-pointer text-error">
              Delete Group
            </DropdownMenuItem>
          </>
        )}
        {!isOwner && (
          <DropdownMenuItem disabled className="px-3 py-2 cursor-pointer text-error">
            Leave Group
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
