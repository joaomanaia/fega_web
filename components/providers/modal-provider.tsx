"use client"

import { useEffect, useState } from "react"
import { InviteMemberModal } from "../modals/group/invite-member-modal"

export const ModalProvider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <InviteMemberModal />
    </>
  )
}
