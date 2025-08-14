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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

type DialogVariants = "default" | "error"

/**
 * @param hasInputTextConfirm - If true, an input field will be shown to confirm the action.
 */
interface ConfirmationDialogProps {
  title: React.ReactNode
  message: React.ReactNode
  inputTextToConfirm?: string
  confirmButtonContent?: React.ReactNode
  cancelButtonContent?: React.ReactNode
  hideCancelButton?: boolean
  variant?: DialogVariants
  className?: string
  icon?: LucideIcon
}

export const useConfirm = (): [React.FC<ConfirmationDialogProps>, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

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
    inputTextToConfirm,
    confirmButtonContent,
    cancelButtonContent,
    variant,
    hideCancelButton,
    className,
    icon: Icon,
  }: ConfirmationDialogProps) => {
    const [inputValue, setInputValue] = useState("")
    const t = useTranslations("General")

    return (
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
          {inputTextToConfirm && (
            <>
              <Label htmlFor="confirm-input">
                {t.rich("confirmDialogInputLabel", {
                  inputTextToConfirm: inputTextToConfirm,
                  b: (chunks) => (
                    <strong key="inputTextToConfirm" className="select-none">
                      {chunks}
                    </strong>
                  ),
                })}
              </Label>
              <Input
                id="confirm-input"
                type="text"
                placeholder="Type here"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={clsx(
                  "border-transparent",
                  variant === "error" &&
                    "bg-error-container/30 text-surface placeholder-error-container-foreground!"
                )}
              />
            </>
          )}
          <DialogFooter>
            {!hideCancelButton && (
              <Button
                onClick={handleCancel}
                variant={variant === "error" ? "destructive" : "ghost"}
                className={variant === "error" ? "hover:bg-error-container/10" : ""}
              >
                {cancelButtonContent || t("cancel")}
              </Button>
            )}
            <Button
              disabled={!!inputTextToConfirm && inputValue !== inputTextToConfirm}
              onClick={handleConfirm}
              variant={variant === "error" ? "destructiveContainer" : "ghost"}
              className={
                variant === "error"
                  ? "disabled:bg-transparent disabled:text-error-foreground/40!"
                  : ""
              }
            >
              {confirmButtonContent || t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return [ConfirmationDialog, confirm]
}
