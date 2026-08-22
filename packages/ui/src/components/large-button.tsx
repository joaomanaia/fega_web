import { Button as ButtonPrimitive } from "@base-ui/react/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { cn } from "@workspace/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

const largeButtonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition outline-none focus-visible:ring-[3px] disabled:pointer-events-none aria-disabled:pointer-events-none",
  {
    variants: {
      variant: {
        outline:
          "aria-disabled:border-foreground/12 disabled:border-foreground/12 [&>p]:text-muted-foreground text-primary aria-disabled:text-foreground/38 disabled:text-foreground/38 aria-disabled:[&>p]:text-foreground/38 disabled:[&>p]:text-foreground/38 hover:bg-primary/8 border bg-inherit shadow-xs",
        destructive:
          "border-error-container-foreground/20 aria-disabled:border-foreground/12 disabled:border-foreground/12 aria-disabled:text-foreground/38 disabled:text-foreground/38 disabled:[&>p]:text-foreground/38 hover:border-error-container-foreground/30 bg-error-container/90 dark:bg-error-container/10 hover:bg-error-container/70 dark:hover:bg-error-container/20 text-error-container-foreground/90 hover:text-error-container-foreground focus-visible:ring-error aria-disabled:bg-surface-foreground/12 disabled:bg-surface-foreground/12 dark:aria-disabled:bg-surface-foreground/12 dark:disabled:bg-surface-foreground/12 [&>p]:text-error-container-foreground/80 shadow-xs",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
)

export type LargeButtonProps = Omit<ButtonPrimitive.Props, "children"> &
  VariantProps<typeof largeButtonVariants> & {
    title: string
    description: string
  }

export function LargeButton({
  title,
  description,
  variant = "outline",
  className,
  ...props
}: LargeButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(
        largeButtonVariants({ variant }),
        "flex w-full flex-col items-start justify-center space-y-1 px-6 py-4 text-start",
        className,
      )}
      {...props}
    >
      <h4 className="w-full truncate text-lg font-medium">{title}</h4>
      <p className="line-clamp-2 w-full text-sm">{description}</p>
    </ButtonPrimitive>
  )
}

export type LargeButtonCollapsible = ButtonPrimitive.Props &
  VariantProps<typeof largeButtonVariants> & {
    title: string
    description: string
  }

export function LargeButtonCollapsible({
  title,
  description,
  variant,
  className,
  disabled,
  children,
}: LargeButtonCollapsible) {
  return (
    <Collapsible
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(largeButtonVariants({ variant, className }))}
    >
      <CollapsibleTrigger
        disabled={disabled}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-4"
      >
        <div className="h-full space-y-1 text-start">
          <h4 className="w-full truncate text-lg font-medium">{title}</h4>
          <p
            aria-disabled={disabled}
            className={cn(
              "text-muted-foreground aria-disabled:text-foreground/38 w-full truncate text-sm",
              variant === "destructive" && "text-error-container-foreground/80",
            )}
          >
            {description}
          </p>
        </div>
        <ChevronDownIcon
          aria-disabled={disabled}
          className={cn(
            "aria-disabled:text-foreground/38 size-5 transform transition-transform group-data-[state=open]:-rotate-180",
            variant === "destructive" && "text-error-container-foreground/80",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "bg-surface/70 text-surface-foreground w-full rounded-b-lg border-t-2 px-6 py-4",
          variant === "destructive" && "border-error-container-foreground/20",
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
