import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-primary/90 border-none shadow-shadow",
        destructive:
          "bg-error text-error-foreground hover:bg-error/90 disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 border-none ring-error outline-error",
        destructiveContainer:
          "bg-error-container text-error-container-foreground border-none hover:bg-error-container/90 disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38",
        outline:
          "border border-surface-variant disabled:border-foreground/12 bg-inherit text-primary disabled:text-foreground/38 hover:bg-primary/8",
        secondary:
          "bg-secondary text-secondary-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-secondary/80 border-none",
        tonal:
          "bg-secondary-container text-secondary-container-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-secondary-container/80 border-none",
        surfaceVariant:
          "bg-surface-variant text-surface-variant-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-surface-variant/80 border-none",
        ghost:
          "bg-inherit text-primary disabled:text-foreground/38 hover:bg-primary/8 border-none",
        link: "bg-inherit text-primary disabled:text-foreground/38 underline-offset-4 hover:underline border-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
