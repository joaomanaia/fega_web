import { CheckRounded } from "@mui/icons-material"
import { Card } from "@mui/material"
import { twMerge } from "tailwind-merge"

interface BasicColorComponentProps {
  color: "#6750a4" | string
  selected?: boolean
  className?: string
  onClick?: () => void
}

const BasicColorComponent: React.FC<BasicColorComponentProps> = ({
  color,
  selected,
  className,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      variant="filled"
      className="w-16 h-16 p-2 flex items-center justify-center cursor-pointer"
    >
      <div
        style={{ backgroundColor: color }}
        className={twMerge(
          `flex items-center justify-center w-full h-full rounded-full hover:bg-opacity-80 transition group`,
          className
        )}
      >
        {selected && (
          <div className="flex items-center justify-center w-4/6 h-4/6 bg-black/20 group-hover:bg-transparent transition rounded-full">
            <CheckRounded />
          </div>
        )}
      </div>
    </Card>
  )
}

export default BasicColorComponent
