"use client"

import { cn } from "@workspace/ui/lib/utils"
import { Dialog, DialogContent } from "@workspace/ui/components/dialog"
import { useRouter } from "@/i18n/navigation"

interface ModalProps {
  className?: string
  children: React.ReactNode
}

export function ScreenModal({ className, children }: ModalProps) {
  const router = useRouter()

  const handleOpenChange = () => router.back()

  return (
    <Dialog defaultOpen open onOpenChange={handleOpenChange}>
      <DialogContent className={cn("overflow-y-hidden", className)}>{children}</DialogContent>
    </Dialog>
  )
}
