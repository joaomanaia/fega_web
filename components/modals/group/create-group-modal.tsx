"use client"

import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal-store"

export const CreateGroupModal: React.FC = () => {
  const { isOpen, onClose } = useModal("create-group")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Create Group</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a new group and invite your friends to start chatting.
        </DialogDescription>
        <DialogFooter>
          <form action={async () => {}}>
            <SubmitButton variant="ghost">Create</SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
