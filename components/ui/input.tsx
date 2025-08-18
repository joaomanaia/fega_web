import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  startAdornment?: React.JSX.Element
  endAdornment?: React.JSX.Element
}

function Input({ className, type, startAdornment, endAdornment, ...props }: InputProps) {
  const hasAdornment = Boolean(startAdornment) || Boolean(endAdornment)

  return (
    <>
      {hasAdornment ? (
        <div
          className={cn(
            "border-input bg-surface-variant/38 ring-offset-surface placeholder:text-foreground/60 focus-within:ring-surface-variant flex h-10 items-center justify-center gap-2 rounded-md border px-3 py-2 transition focus-within:ring-2 focus-within:ring-offset-2 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
            className
          )}
          data-disabled={props.disabled}
        >
          {startAdornment && <div className="text-foreground/60">{startAdornment}</div>}
          <input
            type={type}
            className={
              "placeholder:text-foreground/60 flex h-full w-full border-none bg-transparent text-sm shadow-none outline-hidden file:bg-transparent file:text-sm file:font-medium focus-visible:border-none focus-visible:shadow-none focus-visible:outline-hidden"
            }
            {...props}
          />
          {endAdornment && <div className="text-foreground/60">{endAdornment}</div>}
        </div>
      ) : (
        <input
          type={type}
          className={cn(
            "border-input file:text-foreground selection:bg-primary selection:text-primary-foreground bg-surface-variant/38 ring-offset-surface placeholder:text-foreground/60 focus-visible:ring-surface-variant flex h-10 w-full rounded-md border px-3 py-2 text-sm transition file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            startAdornment && "pl-10",
            endAdornment && "pr-10",
            className
          )}
          {...props}
        />
      )}
    </>
  )
}

export { Input }
