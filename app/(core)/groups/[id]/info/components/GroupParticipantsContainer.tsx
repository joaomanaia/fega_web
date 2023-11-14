"use client"

import { GroupAddRounded, GroupRounded } from "@mui/icons-material"
import { Card, IconButton } from "@mui/material"
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
    <Card variant="filled" className="flex flex-col mt-8 px-4">
      <div className="flex items-center justify-between">
        <label>{mode === "view" ? "Participants" : "Add Participants"}</label>
        {isGroupOwner && (
          <IconButton color="inherit" onClick={switchMode}>
            {mode === "view" ? <GroupAddRounded /> : <GroupRounded />}
          </IconButton>
        )}
      </div>
      {mode === "add" && isGroupOwner ? addParticipantChildren : children}
    </Card>
  )
}
