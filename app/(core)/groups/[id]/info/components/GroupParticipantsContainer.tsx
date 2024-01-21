"use client"

import { Button } from "@/components/ui/button"
import { UserRoundPlus, UserRoundXIcon } from "lucide-react"
import { useState } from "react"

type Mode = "add" | "view"

interface GroupParticipantsContainerProps {
  initialMode: Mode
  isGroupOwner?: boolean
  addParticipantChildren: React.ReactNode
  children: React.ReactNode
}

export const GroupParticipantsContainer: React.FC<GroupParticipantsContainerProps> = ({
  initialMode,
  isGroupOwner,
  addParticipantChildren,
  children,
}) => {
  const [mode, setMode] = useState<Mode>(initialMode)

  const switchMode = () => {
    if (!isGroupOwner) return

    setMode(mode === "view" ? "add" : "view")
  }

  return (
    <div className="flex flex-col mt-8 px-4 bg-accent/[0.38]">
      <div className="flex items-center justify-between">
        <label>{mode === "view" ? "Participants" : "Add Participants"}</label>
        {isGroupOwner && (
          <Button variant="ghost" size="icon" onClick={switchMode}>
            {mode === "view" ? <UserRoundPlus /> : <UserRoundXIcon />}
          </Button>
        )}
      </div>
      {mode === "add" && isGroupOwner ? addParticipantChildren : children}
    </div>
  )
}
