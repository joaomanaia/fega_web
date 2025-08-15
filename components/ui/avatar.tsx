"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface AvatarVariant
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  size?: "default" | "large"
}

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      default: "size-10",
      large: "size-20 text-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Avatar({ className, size, ...props }: AvatarVariant) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, className }))}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      {...props}
    />
  )
}

function AvatarSkeleton({
  className,
  size,
}: { className?: string } & VariantProps<typeof avatarVariants>) {
  return (
    <div className={cn(avatarVariants({ size, className }), "bg-surface-variant animate-pulse")} />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarSkeleton }
