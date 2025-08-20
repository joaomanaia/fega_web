"use client"

import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { exitGroup } from "@/app/actions/groupActions"
import { SubmitButton } from "@/components/submit-button"
import { useModal } from "@/hooks/use-modal-store"

export const ExitGroupModal: React.FC = () => {
  const { isOpen, onClose, data } = useModal("exit-group")

  const { group } = data

  if (!group || !group.id) return null

  const exitGroupWithId = exitGroup.bind(null, group.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Exit Group</DialogTitle>
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
              } catch {
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
