"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDictionary } from "@/hooks/use-get-dictionary"
import { useState } from "react"

type ConfirmProps = [() => JSX.Element, () => Promise<boolean>]

export const useConfirm = (
  title: string,
  message: string,
  confirmText?: string,
  cancelText?: string
): ConfirmProps => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)
  const dictionary = useDictionary()

  const confirm = (): Promise<boolean> =>
    new Promise((resolve) => {
      setPromise({ resolve })
    })

  const handleClose = () => setPromise(null)

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleCancel} variant="ghost">
            {cancelText || dictionary.cancel}
          </Button>
          <Button onClick={handleConfirm} variant="ghost">
            {confirmText || dictionary.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmationDialog, confirm]
}
