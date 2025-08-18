import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ExtendedFABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

function ExtendedFAB({ className, asChild = false, children, ...props }: ExtendedFABProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "bg-primary-container disabled:bg-surface-variant/[0.28] hover:bg-primary-container/80 text-primary-container-foreground disabled:text-surface-variant ring-offset-background focus-visible:ring-ring inline-flex h-16 cursor-pointer items-center justify-center gap-2 rounded-[25px] border-none px-6 text-xl font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { ExtendedFAB }
