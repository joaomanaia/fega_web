import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cn } from "@workspace/ui/lib/utils"

export type ExtendedFABProps = ButtonPrimitive.Props

function ExtendedFAB({ className, ...props }: ExtendedFABProps) {
  return (
    <ButtonPrimitive
      data-slot="extended-fab"
      className={cn(
        "bg-primary-container disabled:bg-surface-variant/[0.28] hover:bg-primary-container/80 text-primary-container-foreground disabled:text-surface-variant ring-offset-background focus-visible:ring-ring inline-flex h-16 cursor-pointer items-center justify-center gap-2 rounded-[25px] border-none px-6 text-xl font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none",
        className,
      )}
      {...props}
    />
  )
}

export { ExtendedFAB }
