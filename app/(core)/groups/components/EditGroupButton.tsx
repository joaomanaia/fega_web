import { EditRounded, InfoRounded } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import Link from "next/link"

interface EditGroupButtonProps {
  groupHref: string
  isOwner?: boolean
}

export const InfoGroupButtton: React.FC<EditGroupButtonProps> = ({ groupHref, isOwner }) => {
  return (
    <Link href={`${groupHref}/info`} className="next-link">
      <IconButton color="inherit">{isOwner ? <EditRounded /> : <InfoRounded />}</IconButton>
    </Link>
  )
}
