"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { deleteGroup } from "@/app/actions/groupActions"
import { SubmitButton } from "@/components/submit-button"
import { toast } from "sonner"

export const DeleteGroupModal: React.FC = () => {
  const { isOpen, onClose, data } = useModal("delete-group")

  const { group } = data

  if (!group || !group.id) return null

  const deleteGroupWithId = deleteGroup.bind(null, group.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Group</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the group <strong>{group.name}</strong>? This action
          cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <form
            action={async () => {
              try {
                await deleteGroupWithId()
              } catch (error) {
                toast.error("Failed to delete group")
              } finally {
                onClose()
                toast.success("Group deleted")
              }
            }}
          >
            <SubmitButton variant="destructive">Delete</SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
