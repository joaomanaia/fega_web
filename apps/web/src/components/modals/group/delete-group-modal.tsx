"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { toast } from "@workspace/ui/components/toast"
import { deleteGroup } from "@/app/actions/groupActions"
import { SubmitButton } from "@/components/submit-button"
import { useModal } from "@/hooks/use-modal-store"

export const DeleteGroupModal: React.FC = () => {
  const { isOpen, onClose, data } = useModal("delete-group")

  const { group } = data

  if (!group || !group.id) return null

  const deleteGroupWithId = deleteGroup.bind(null, group.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Delete Group</DialogTitle>
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
              } catch {
                toast.add({ type: "error", description: "Failed to delete group" })
              } finally {
                onClose()
                toast.add({ type: "success", description: "Group deleted" })
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
