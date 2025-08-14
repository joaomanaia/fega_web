import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-primary/90 shadow-xs",
        destructive:
          "bg-error text-error-foreground hover:bg-error/90 focus-visible:ring-error disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 shadow-xs",
        destructiveContainer:
          "bg-error-container text-error-container-foreground hover:bg-error-container/90 focus-visible:ring-error-container disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 shadow-xs",
        outline:
          "border-surface-variant disabled:border-foreground/12 text-primary disabled:text-foreground/38 hover:bg-primary/8 border bg-inherit shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 shadow-xs",
        tonal:
          "bg-secondary-container text-secondary-container-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-secondary-container/80 border-none",
        surfaceVariant:
          "bg-surface-variant text-surface-variant-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-surface-variant/80 border-none",
        ghost: "text-primary disabled:text-foreground/38 hover:bg-primary/8",
        link: "text-primary disabled:text-foreground/38 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 px-6 has-[>svg]:px-4",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
