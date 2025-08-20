"use client"

import React from "react"
import { ArrowLeftIcon } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useRouter } from "@/src/i18n/navigation"

export function BackIconButton({
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: ButtonProps) {
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
