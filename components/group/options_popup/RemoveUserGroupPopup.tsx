import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
} from "@mui/material"
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, firestore } from "../../../firebase"
import UserUidComponent from "../../user/UserUidComponent"
import GroupType from "../GroupType"

type RemoveUserGroupPopupType = {
  groupId: string
  onUserRemoved: () => void
  onCloseDialog: () => void
}

const RemoveUserGroupPopup: React.FC<RemoveUserGroupPopupType> = ({
  groupId,
  onUserRemoved,
  onCloseDialog,
}) => {
  const [users, setUsers] = useState<string[]>([])

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  console.log(Date.now())

  useEffect(() => {
    const searchUsers = async () => {
      const groupRef = doc(firestore, "groups", groupId)
      const groupDoc = await getDoc(groupRef)

      const group: GroupType = {
        id: groupDoc.id,
        groupName: groupDoc?.data()?.groupName,
        groupImage: groupDoc?.data()?.groupImage,
        participants: groupDoc?.data()?.participants,
      }

      setUsers(group.participants)
    }

    searchUsers()
  }, [groupId])

  const selectUser = (uid: string) => {
    if (auth.currentUser?.uid === uid) return

    if (selectedUsers.includes(uid)) {
      unselectUser(uid)
      return
    }
    const newUsers = selectedUsers.concat(uid)

    setSelectedUsers(newUsers)
  }

  const unselectUser = (uid: string) => {
    const newUsers = selectedUsers.filter(user => user !== uid)
    setSelectedUsers(newUsers)
  }

  const removeUser = async () => {
    if (auth.currentUser?.uid === undefined) return

    if (selectedUsers.includes(auth.currentUser?.uid)) {
      alert("You can't remove yourself!")
      return
    }

    const groupRef = doc(firestore, "groups", groupId)

    await updateDoc(groupRef, {
      participants: arrayRemove(...selectedUsers),
    })

    onUserRemoved()
  }

  return (
    <>
      <DialogTitle>Remove user</DialogTitle>
      <DialogContent>
        <DialogContentText paddingBottom="16px">
          Selecione as pessoas para remover do grupo.
        </DialogContentText>

        <List>
          {users.map((uid) => (
            <UserUidComponent
              key={uid}
              uid={uid}
              selected={selectedUsers.includes(uid)}
              onClick={() => selectUser(uid)}
            />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onCloseDialog}>
          Close
        </Button>
        <Button disabled={selectedUsers === []} variant="text" onClick={() => removeUser()}>
          Remove
        </Button>
      </DialogActions>
    </>
  )
}

export default RemoveUserGroupPopup
