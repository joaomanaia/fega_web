import GroupType from "@/types/group/GroupType"
import { ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import Link from "next/link"
import Avatar from "../../components/m3/avatar"

type GroupItemType = {
  group: GroupType
  selected: boolean
}

const GroupItem: React.FC<GroupItemType> = ({ group, selected }) => {
  const groupHref = `/groups/${group.id}`

  return (
    <Link href={groupHref} className="next-link">
      <ListItemButton selected={selected}>
        <ListItemAvatar>
          <Avatar name={group.name} />
        </ListItemAvatar>

        <ListItemText primary={group.name} />
      </ListItemButton>
    </Link>
  )
}

export default GroupItem
