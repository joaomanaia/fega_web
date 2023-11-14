"use client"

import { addParticipant, removeParticipant } from "@/app/actions/groupActions"
import { GroupAddRounded, GroupRemoveRounded } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useFormStatus } from "react-dom"

interface AddRemoveParticipantButtonProps {
  uid: string
  type: "add" | "remove"
}

export const AddRemoveParticipantButton: React.FC<AddRemoveParticipantButtonProps> = ({
  uid,
  type,
}) => {
  const { pending } = useFormStatus()
  const removeParticipantWithUid = removeParticipant.bind(null, uid)
  const addParticipantWithUid = addParticipant.bind(null, uid)

  return (
    <button
      disabled={pending}
      formAction={type === "add" ? addParticipantWithUid : removeParticipantWithUid}
      className="ml-auto flex items-center p-0 outline-none bg-transparent border-0"
    >
      <IconButton aria-label={type} color={type === "add" ? "success" : "error"} disabled={pending}>
        {type === "add" ? <GroupAddRounded /> : <GroupRemoveRounded />}
      </IconButton>
    </button>
  )
}
