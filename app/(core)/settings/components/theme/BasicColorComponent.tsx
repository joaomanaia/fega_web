import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { BasicColor } from "./ColorsComponent"

interface BasicColorComponentProps {
  color: BasicColor
  selected?: boolean
  className?: string
  onClick?: () => void
}

export const BasicColorComponent: React.FC<BasicColorComponentProps> = ({
  color,
  selected,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="h-14 md:h-16 aspect-square rounded-2xl bg-accent p-2 flex items-center justify-center cursor-pointer group hover:opacity-60 transition"
    >
      <div
        style={{ backgroundColor: color }}
        className={cn(
          "flex items-center justify-center w-full h-full rounded-full",
          className
        )}
      >
        {selected && (
          <div className="flex items-center justify-center w-4/6 h-4/6 bg-black/20 group-hover:bg-transparent transition rounded-full">
            <Check />
          </div>
        )}
      </div>
    </div>
  )
}
