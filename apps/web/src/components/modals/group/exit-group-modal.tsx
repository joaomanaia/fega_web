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
import { useAction } from "next-safe-action/hooks"
import { exitGroup } from "@/app/actions/groupActions"
import { SubmitButton } from "@/components/submit-button"
import { useModal } from "@/hooks/use-modal-store"

export const ExitGroupModal: React.FC = () => {
  const { isOpen, onClose, data } = useModal("exit-group")

  const { group } = data

  const { execute, isPending } = useAction(exitGroup, {
    onError: ({ error }) => {
      toast.add({ type: "error", description: error.serverError?.message ?? "Failed to exit group" })
    },
    onSuccess: () => {
      onClose()
      toast.add({ type: "success", description: "Left group successfully" })
    },
  })

  if (!group || !group.id) return null
  const groupId = group.id

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
            onSubmit={(e) => {
              e.preventDefault()
              execute({ groupId })
            }}
          >
            <SubmitButton disabled={isPending} variant="destructive">Exit</SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
