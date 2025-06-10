"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { useRouter } from "@/src/i18n/navigation"
import { ArrowLeftIcon } from "lucide-react"
import React from "react"

interface BackIconButtonProps extends ButtonProps {}

export const BackIconButton = React.forwardRef<ButtonProps, BackIconButtonProps>(
  ({ className, variant = "ghost", size = "icon", ...props }, ref) => {
    const router = useRouter()

    return (
      <Button
        className={className}
        onClick={() => router.back()}
        variant={variant}
        size={size}
        {...props}
      >
        <ArrowLeftIcon />
      </Button>
    )
  }
)

BackIconButton.displayName = "BackIconButton"
