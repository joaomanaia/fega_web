"use client"

import { GroupViewType } from "@/types/group/GroupType"
import { ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import Link from "next/link"
import Avatar from "../../components/m3/avatar"
import { useParams } from "next/navigation"
import { InfoGroupButtton } from "./EditGroupButton"

type GroupItemType = {
  group: GroupViewType
}

const GroupItem: React.FC<GroupItemType> = ({ group }) => {
  const params = useParams()
  const selected = params.id === group.id

  const groupHref = `/groups/${group.id}`

  return (
    <Link href={groupHref} className="next-link">
      <ListItemButton selected={selected}>
        <ListItemAvatar>
          <Avatar photoUrl={group.icon_url ?? undefined} name={group.name} />
        </ListItemAvatar>

        <ListItemText primary={group.name} />

        {selected && <InfoGroupButtton groupHref={groupHref} isOwner={group.is_owner ?? false} />}
      </ListItemButton>
    </Link>
  )
}

export default GroupItem
