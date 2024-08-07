"use client"

import { InviteMemberModal } from "../modals/group/invite-member-modal"
import { EditGroupModal } from "../modals/group/edit-group-modal"
import { DeleteGroupModal } from "../modals/group/delete-group-modal"
import { ExitGroupModal } from "../modals/group/exit-group-modal"
import { CreateLocationModal } from "../modals/create-location-modal"
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
