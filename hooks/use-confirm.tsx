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
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"
import { useState } from "react"

type DialogVariants = "default" | "error"

interface ConfirmationDialogProps {
  title: React.ReactNode
  message: React.ReactNode
  confirmText?: React.ReactNode
  cancelText?: React.ReactNode
  hideCancel?: boolean
  variant?: DialogVariants
  className?: string
  icon?: LucideIcon
}

export const useConfirm = (): [React.FC<ConfirmationDialogProps>, () => Promise<boolean>] => {
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

  const ConfirmationDialog = ({
    title,
    message,
    confirmText,
    cancelText,
    variant,
    hideCancel,
    className,
    icon: Icon,
  }: ConfirmationDialogProps) => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent
        className={cn(
          variant === "error" && "bg-error text-error-foreground border-none",
          className
        )}
      >
        <DialogHeader>
          {Icon && <Icon className="self-center size-10 mb-2" />}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {!hideCancel && (
            <Button onClick={handleCancel} variant={variant === "error" ? "destructive" : "ghost"}>
              {cancelText || dictionary.cancel}
            </Button>
          )}
          <Button onClick={handleConfirm} variant={variant === "error" ? "destructive" : "ghost"}>
            {confirmText || dictionary.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmationDialog, confirm]
}
