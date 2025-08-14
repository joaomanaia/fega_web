import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ExtendedFABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const ExtendedFAB = React.forwardRef<HTMLButtonElement, ExtendedFABProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "h-16 text-xl px-6 rounded-[25px] bg-primary-container disabled:bg-surface-variant/[0.28] hover:bg-primary-container/80 text-primary-container-foreground disabled:text-surface-variant inline-flex border-none cursor-pointer items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
ExtendedFAB.displayName = "Extended FAB"
