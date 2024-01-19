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
          "bg-primary text-primary-foreground disabled:bg-foreground/[0.12] disabled:text-foreground/[0.38] hover:bg-primary/90 border-none",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:bg-foreground/[0.12] disabled:text-foreground/[0.38] border-none",
        outline:
          "border border-border disabled:border-foreground/[0.12] bg-inherit text-primary disabled:text-foreground/[0.38] hover:bg-primary/[0.08]",
        secondary:
          "bg-secondary text-secondary-foreground disabled:bg-foreground/[0.12] disabled:text-foreground/[0.38] hover:bg-secondary/80 border-none",
        accent:
          "bg-accent text-accent-foreground disabled:bg-foreground/[0.12] disabled:text-foreground/[0.38] hover:bg-accent/80 border-none",
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
      <Comp
        className={cn(" ", buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
