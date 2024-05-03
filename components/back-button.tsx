"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"

interface BackIconButtonProps extends ButtonProps {}

export const BackIconButton = React.forwardRef<ButtonProps, BackIconButtonProps>(
  ({ className, variant = "ghost", size = "icon", ...props }, ref) => {
    const router = useRouter()

    return (
      <Button className={cn(className)} onClick={() => router.back()} variant={variant} size={size} {...props}>
        <ArrowLeftIcon />
      </Button>
    )
  }
)

BackIconButton.displayName = "BackIconButton"
