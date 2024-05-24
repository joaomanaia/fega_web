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
import { exitGroup } from "@/app/actions/groupActions"
import { SubmitButton } from "@/components/submit-button"
import { toast } from "sonner"

export const ExitGroupModal: React.FC = () => {
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === "exit-group"
  const { group } = data

  if (!group || !group.id) return null

  const exitGroupWithId = exitGroup.bind(null, group.id)

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Exit Group</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to exit the group <strong>{group.name}</strong>? This action cannot
          be undone.
        </DialogDescription>
        <DialogFooter>
          <form
            action={async () => {
              try {
                await exitGroupWithId()
              } catch (error) {
                toast.error("Failed to delete group")
              } finally {
                onClose()
                toast.success("Group deleted")
              }
            }}
          >
            <SubmitButton variant="destructive">Exit</SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
