/* eslint-disable @next/next/no-img-element */
import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import Avatar from "../m3/avatar"
import GroupType from "./GroupType"

type GroupItemType = {
  group: GroupType
  selected: boolean
  onClick: () => void
}

const GroupItem: React.FC<GroupItemType> = ({ group, selected, onClick }) => {
  return (
    <ListItem disablePadding onClick={() => onClick()}>
      <ListItemButton selected={selected} onClick={() => onClick()}>
        <ListItemAvatar>
          <Avatar photoUrl={group.groupImage} name={group.groupName} />
        </ListItemAvatar>

        <ListItemText primary={group.groupName} />
      </ListItemButton>
    </ListItem>
  )
}

export default GroupItem
