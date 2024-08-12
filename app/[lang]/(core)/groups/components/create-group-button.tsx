"use client"

import { ExtendedFAB } from "@/components/ui/floating-action-button"
import { type Dictionary } from "@/get-dictionary"
import { useModal } from "@/hooks/use-modal-store"
import { cn } from "@/lib/utils"

interface CreateGroupButtonProps {
  className?: string
  dictionary: Dictionary
}

export const CreateGroupButton: React.FC<CreateGroupButtonProps> = ({ className, dictionary }) => {
  const { onOpen } = useModal()

  return (
    <ExtendedFAB onClick={() => onOpen("create-group")} className={cn("w-full", className)}>
      {dictionary.createGroup.button}
    </ExtendedFAB>
  )
}
