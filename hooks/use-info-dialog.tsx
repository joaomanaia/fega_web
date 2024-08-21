"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface InfoDialogProps {
  title: React.ReactNode
  message: React.ReactNode
}

export const useInfoDialog = (): [React.FC<InfoDialogProps>, () => void] => {
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  const openDialog = () => setOpen(true)

  const InfoDialog = ({ title, message }: InfoDialogProps) => (
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
