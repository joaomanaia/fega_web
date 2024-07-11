import { cn } from "@/lib/utils"
import { type DetailedHTMLProps, forwardRef, type HTMLAttributes } from "react"

interface MainContainerProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export const MainContainer = forwardRef<HTMLElement, MainContainerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <section
        className={cn(
          "rounded-[30px] py-4 md:py-6 px-4 md:px-6 bg-[#fbf8fd] text-[#1b1b1f] dark:bg-[#131316] dark:text-[#e4e2e6]",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </section>
    )
  }
)
