import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

const largeButtonVariants = cva("rounded-lg border border-border/30 bg-surface/30 transition", {
  variants: {
    variant: {
      default: "hover:border-border/40 hover:bg-surfaceVariant/10",
      error:
        "border-errorContainer-foreground/20 hover:border-errorContainer-foreground/30 bg-errorContainer/10 hover:bg-errorContainer/20 text-errorContainer-foreground/90 hover:text-errorContainer-foreground disabled:bg-surface/30 disabled:hover:bg-surface/30 disabled:border-foreground/[0.12] disabled:text-foreground/[0.38]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type LargeButtonVariants = VariantProps<typeof largeButtonVariants>

interface LargeButtonProps extends LargeButtonVariants {
  title: string
  description: string
  disabled?: boolean
  className?: string
  onClick?: () => void
}

export const LargeButton: React.FC<LargeButtonProps> = ({
  title,
  description,
  variant,
  className,
  disabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col w-full text-start space-y-1 items-start justify-center px-6 py-4 disabled:hover:bg-surface/30 disabled:border-foreground/[0.12] disabled:text-foreground/[0.38]",
        largeButtonVariants({ variant }),
        className
      )}
      disabled={disabled}
    >
      <h4 className="w-full text-lg font-medium truncate">{title}</h4>
      <p className="w-full text-sm text-muted-foreground line-clamp-2 ">{description}</p>
    </button>
  )
}

interface LargeButtonCollapsible extends LargeButtonVariants {
  title: string
  description: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export const LargeButtonCollapsible: React.FC<LargeButtonCollapsible> = ({
  title,
  description,
  variant,
  className,
  disabled,
  children,
}) => {
  return (
    <Collapsible
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "gap-y-2 rounded-lg transition aria-disabled:hover:bg-surface/30 aria-disabled:border-foreground/[0.12] aria-disabled:text-foreground/[0.38]",
        largeButtonVariants({ variant }),
        className
      )}
    >
      <CollapsibleTrigger
        disabled={disabled}
        className="px-6 py-4 flex w-full items-center justify-between gap-4 group"
      >
        <div className="space-y-1 text-start h-full">
          <h4 className="w-full text-lg font-medium truncate">{title}</h4>
          <p className="w-full text-sm text-muted-foreground truncate">{description}</p>
        </div>
        <ChevronDownIcon className="h-5 w-5 text-muted-foreground transform group-data-[state=open]:-rotate-180 transition-transform" />
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "w-full px-6 py-4 border-t-2 border-border/30 bg-surface/70 text-surface-foreground rounded-b-lg",
          variant === "error" && "border-errorContainer-foreground/20"
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
