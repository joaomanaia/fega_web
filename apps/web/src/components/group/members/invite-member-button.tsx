"use client"

import { Button } from "@workspace/ui/components/button"
import { UserRoundPlusIcon } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"
import { GroupViewType } from "@/types/group/GroupType"

interface InviteMemberButtonProps {
  group: GroupViewType
}

export const InviteMemberButton = ({ group }: InviteMemberButtonProps) => {
  const { onOpen } = useModal()

  return (
    <Button
      onClick={() => onOpen("group-invite", { group })}
      size="icon"
      variant="ghost"
      className="ml-auto text-inherit"
    >
      <UserRoundPlusIcon />
    </Button>
  )
}
