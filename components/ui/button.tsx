import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground disabled:bg-surface-foreground/[0.12] disabled:text-surface-foreground/[0.38] hover:bg-primary/90 border-none shadow-shadow",
        destructive:
          "bg-error text-error-foreground hover:bg-error/90 disabled:bg-surface-foreground/[0.12] disabled:text-surface-foreground/[0.38] border-none ring-error outline-error",
        destructiveContainer:
          "bg-errorContainer text-errorContainer-foreground border-none hover:bg-errorContainer/90 disabled:bg-surface-foreground/[0.12] disabled:text-surface-foreground/[0.38]",
        outline:
          "border border-surfaceVariant disabled:border-foreground/[0.12] bg-inherit text-primary disabled:text-foreground/[0.38] hover:bg-primary/[0.08]",
        secondary:
          "bg-secondary text-secondary-foreground disabled:bg-surface-foreground/[0.12] disabled:text-surface-foreground/[0.38] hover:bg-secondary/80 border-none",
        tonal:
          "bg-secondaryContainer text-secondaryContainer-foreground disabled:bg-surface-foreground/[0.12] disabled:text-surface-foreground/[0.38] hover:bg-secondaryContainer/80 border-none",
        surfaceVariant:
          "bg-surfaceVariant text-surfaceVariant-foreground disabled:bg-surface-foreground/[0.12] disabled:text-surface-foreground/[0.38] hover:bg-surfaceVariant/80 border-none",
        ghost:
          "bg-inherit text-primary disabled:text-foreground/[0.38] hover:bg-primary/[0.08] border-none",
        link: "bg-inherit text-primary disabled:text-foreground/[0.38] underline-offset-4 hover:underline border-none",
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
