"use client"

import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"
import { GroupViewType } from "@/types/group/GroupType"
import { UserRoundPlusIcon } from "lucide-react"

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
      className="text-inherit ml-auto"
    >
      <UserRoundPlusIcon />
    </Button>
  )
}
