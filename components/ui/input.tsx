import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.JSX.Element
  endAdornment?: React.JSX.Element
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    const hasAdornment = Boolean(startAdornment) || Boolean(endAdornment)

    return (
      <>
        {hasAdornment ? (
          <div
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-2 h-10 rounded-md border border-surfaceVariant bg-surfaceVariant/[0.38] ring-offset-surface placeholder:text-foreground/60 focus-within:ring-2 focus-within:ring-surfaceVariant focus-within:ring-offset-2 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 transition",
              className
            )}
            data-disabled={props.disabled}
          >
            {startAdornment && <div className={cn("text-foreground/60")}>{startAdornment}</div>}
            <input
              type={type}
              className={
                "flex h-full w-full bg-transparent text-sm file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/60 shadow-none outline-none border-none focus-visible:outline-none focus-visible:border-none focus-visible:shadow-none"
              }
              ref={ref}
              {...props}
            />
            {endAdornment && <div className={cn("text-foreground/60")}>{endAdornment}</div>}
          </div>
        ) : (
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-surfaceVariant bg-surfaceVariant/[0.38] px-3 py-2 text-sm ring-offset-surface file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surfaceVariant focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition",
              startAdornment && "pl-10",
              endAdornment && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
        )}
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }
