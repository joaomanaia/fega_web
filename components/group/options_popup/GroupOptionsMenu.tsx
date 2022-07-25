import { AddRounded, DeleteRounded } from "@mui/icons-material"
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material"

type GroupOptionsMenuType = {
  onAddUserClick: () => void
  onDeleteUserClick: () => void
}

const GroupOptionsMenu: React.FC<GroupOptionsMenuType> = ({
  onAddUserClick,
  onDeleteUserClick,
}) => {
  return (
    <>
      <MenuItem onClick={onAddUserClick}>
        <ListItemIcon>
          <AddRounded fontSize="small" />
        </ListItemIcon>

        <ListItemText>Add user</ListItemText>
      </MenuItem>

      <MenuItem onClick={onDeleteUserClick}>
        <ListItemIcon>
          <DeleteRounded fontSize="small" />
        </ListItemIcon>

        <ListItemText>Remove user</ListItemText>
      </MenuItem>
    </>
  )
}

export default GroupOptionsMenu
