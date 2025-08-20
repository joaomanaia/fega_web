import { type DetailedHTMLProps, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function MainContainer({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <section
      className={cn(
        "rounded-[30px] bg-[#fbf8fd] px-4 py-4 text-[#1b1b1f] md:px-6 md:py-6 dark:bg-[#131316] dark:text-[#e4e2e6]",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}
