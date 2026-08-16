"use client"

import { ExtendedFAB } from "@workspace/ui/components/floating-action-button"
import { useModal } from "@/hooks/use-modal-store"

interface CreateGroupButtonProps {
  className?: string
  children?: React.ReactNode
}

export const CreateGroupButton: React.FC<CreateGroupButtonProps> = ({ className, children }) => {
  const { onOpen } = useModal()

  return (
    <ExtendedFAB onClick={() => onOpen("create-group")} className={className}>
      {children}
    </ExtendedFAB>
  )
}
