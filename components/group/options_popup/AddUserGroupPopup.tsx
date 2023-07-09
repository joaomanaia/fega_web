import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  TextField,
} from "@mui/material"
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  runTransaction,
  where,
} from "firebase/firestore"
import { useState } from "react"
import { firestore } from "../../../firebase"
import UserComponent from "../../user/UserComponent"
import UserType from "../../../types/UserType"
import GroupType from "../GroupType"

type AddUserGroupPopupType = {
  groupId: string
  onUserAdded: () => void
  onCloseDialog: () => void
}

const AddUserGroupPopup: React.FC<AddUserGroupPopupType> = ({
  groupId,
  onUserAdded,
  onCloseDialog,
}) => {
  const [users, setUsers] = useState<UserType[]>([])

  const [searchText, setSearchText] = useState("")

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

  const addUser = async () => {
    if (selectedUser === null) return

    try {
      await runTransaction(firestore, async (transaction) => {
        const groupRef = doc(firestore, "groups", groupId)
        const groupDoc = await transaction.get(groupRef)

        if (!groupDoc.exists()) throw "Document not found"

        const group: GroupType = {
          id: groupDoc.id,
          groupName: groupDoc?.data()?.groupName,
          groupImage: groupDoc?.data()?.groupImage,
          participants: groupDoc?.data()?.participants,
        }

        if (group.participants.length < 20) {
          transaction.update(groupRef, {
            participants: arrayUnion(selectedUser.uid),
          })
        } else {
          alert("You have reached the maximum number of user in the group")
        }
      })
    } catch (error) {
      console.log("Transaction error", error)
    }

    onUserAdded()
  }

  const searchUser = async () => {
    const usersRef = collection(firestore, "users")
    const q = query(usersRef, where("name", "==", searchText), limit(10))

    const querySnapshot = await getDocs(q)

    const newUsers: UserType[] = []
    querySnapshot.forEach((doc) => {
      newUsers.push({
        name: doc.data().name,
        photoUrl: doc.data().photoUrl,
        uid: doc.data().uid,
        banned: doc.data().banned,
      })
    })

    setUsers(newUsers)

    setSearchText("")
  }

  return (
    <>
      <DialogTitle>Add user</DialogTitle>
      <DialogContent>
        <DialogContentText paddingBottom="16px">Adicione pessoas para o grupo</DialogContentText>

        <TextField
          onChange={(e) => setSearchText(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label="Person name"
          type="text"
          fullWidth
          variant="outlined"
        />

        <Button sx={{ marginY: 2, marginRight: 1 }} variant="filled" onClick={searchUser}>
          Seach user
        </Button>

        <List>
          {users.map((user) => (
            <UserComponent
              key={user.uid}
              user={user}
              selected={selectedUser === user}
              onClick={() => setSelectedUser(user)}
            />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onCloseDialog}>
          Close
        </Button>
        <Button disabled={selectedUser === null} variant="text" onClick={addUser}>
          Add
        </Button>
      </DialogActions>
    </>
  )
}

export default AddUserGroupPopup
