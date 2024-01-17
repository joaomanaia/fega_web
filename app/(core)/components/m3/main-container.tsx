import { cn } from "@/lib/utils"

interface MainContainerProps {
  className?: string
  children?: React.ReactNode
}

export const MainContainer2: React.FC<MainContainerProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-[30px] py-6 px-4 md:px-6 mx-4 md:ml-0 bg-[#fbf8fd] text-[#1b1b1f] dark:bg-[#131316] dark:text-[#e4e2e6]",
        className
      )}
    >
      {children}
    </div>
  )
}
