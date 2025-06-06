"use client"

import { CreateLocationModal } from "@/components/modals/create-location-modal"
import { CreateGroupModal } from "@/components/modals/group/create-group-modal"
import { DeleteGroupModal } from "@/components/modals/group/delete-group-modal"
import { EditGroupModal } from "@/components/modals/group/edit-group-modal"
import { ExitGroupModal } from "@/components/modals/group/exit-group-modal"
import { InviteMemberModal } from "@/components/modals/group/invite-member-modal"
import { EditProfileModal } from "@/features/user/edit-profile-modal"
import { ShareDialogProvider } from "@/src/providers/share-dialog-provider"
import { useMountedState } from "react-use"

export const ModalProvider: React.FC = () => {
  const isMounted = useMountedState()
  if (!isMounted) return null

  return (
    <>
      <InviteMemberModal />
      <EditGroupModal />
      <CreateGroupModal />
      <DeleteGroupModal />
      <ExitGroupModal />

      <CreateLocationModal />

      <EditProfileModal />

      <ShareDialogProvider />
    </>
  )
}
