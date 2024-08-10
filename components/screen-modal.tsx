"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

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
