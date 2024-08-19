"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

export const useInfoDialog = (
  title: React.ReactNode,
  message: React.ReactNode,
): [() => JSX.Element, () => void] => {
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  const openDialog = () => setOpen(true)

  const InfoDialog = () => (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )

  return [InfoDialog, openDialog]
}
