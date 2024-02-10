"use client"

import { removeParticipant } from "@/app/actions/groupActions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface RemoveMemberButtonProps {
  uid: string
  userName: string
  groupId: string
}

export const RemoveMemberButton: React.FC<RemoveMemberButtonProps> = ({
  uid,
  userName,
  groupId,
}) => {
  const removeParticipantWithUid = removeParticipant.bind(null, uid, groupId)

  return (
    <DropdownMenuItem
      onClick={async () => {
        try {
          await removeParticipantWithUid()
        } catch (error) {
          toast.error("Failed to invite user")
        } finally {
          toast.success(`Removed ${userName} from the group`)
        }
      }}
      className="text-error"
    >
      Remove
    </DropdownMenuItem>
  )
}
