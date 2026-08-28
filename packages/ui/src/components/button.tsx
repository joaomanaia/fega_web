import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cn } from "@workspace/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
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
          "disabled:border-foreground/12 text-primary disabled:text-foreground/38 hover:bg-primary/8 border border-border bg-inherit shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 shadow-xs",
        tonal:
          "bg-secondary-container text-secondary-container-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-secondary-container/80 border-none",
        surfaceVariant:
          "bg-surface-variant text-surface-variant-foreground disabled:bg-surface-foreground/12 disabled:text-surface-foreground/38 hover:bg-surface-variant/80 border-none",
        ghost:
          "text-foregound disabled:text-foreground/38 aria-disabled:text-foreground/38 hover:bg-primary/8",
        link: "text-primary disabled:text-foreground/38 underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-11 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
