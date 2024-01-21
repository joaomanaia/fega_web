import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EditIcon, InfoIcon } from "lucide-react"
import Link from "next/link"

interface EditGroupButtonProps {
  groupHref: string
  isOwner?: boolean
  className?: string
}

export const InfoGroupButtton: React.FC<EditGroupButtonProps> = ({
  groupHref,
  isOwner,
  className,
}) => {
  return (
    <Link href={`${groupHref}/info`} className="next-link">
      <Button variant="ghost" size="icon" className={cn("text-inherit", className)}>
        {isOwner ? <EditIcon /> : <InfoIcon />}
      </Button>
    </Link>
  )
}
