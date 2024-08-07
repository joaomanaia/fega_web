"use client"

import { CreateLocationModal } from "@/components/modals/create-location-modal"
import { DeleteGroupModal } from "@/components/modals/group/delete-group-modal"
import { EditGroupModal } from "@/components/modals/group/edit-group-modal"
import { ExitGroupModal } from "@/components/modals/group/exit-group-modal"
import { InviteMemberModal } from "@/components/modals/group/invite-member-modal"
import { useMountedState } from "react-use"

export const ModalProvider: React.FC = () => {
  const isMounted = useMountedState()
  if (!isMounted) return null

  return (
    <>
      <InviteMemberModal />
      <EditGroupModal />
      <DeleteGroupModal />
      <ExitGroupModal />

      <CreateLocationModal />
    </>
  )
}
