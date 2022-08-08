import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  TextField,
} from "@mui/material"
import { collection, doc, getDocs, limit, query, setDoc, where } from "firebase/firestore"
import { useState } from "react"
import { firestore } from "../../firebase"
import { getPairUid } from "../../utils/user-utils"
import UserComponent from "../user/UserComponent"
import UserType from "../../types/UserType"
import PrivateChatType from "./PrivateChatType"

type PrivateMessageSearchUsersItemType = {
  authUid: string
  onChatCreated: () => void
  onCloseDialog: () => void
}

const PrivateMessageSearchUsers: React.FC<PrivateMessageSearchUsersItemType> = ({
  authUid,
  onChatCreated,
  onCloseDialog,
}) => {
  const [users, setUsers] = useState<UserType[]>([])

  const [searchText, setSearchText] = useState("")

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

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

  const createPrivateChat = async () => {
    if (selectedUser === null) return

    const pairUid = getPairUid(authUid, selectedUser.uid)

    const privateChatsDoc = doc(firestore, "privateChats", pairUid)

    const privateChat: PrivateChatType = {
      pairUid: pairUid,
      uids: [authUid, selectedUser.uid],
    }

    await setDoc(privateChatsDoc, privateChat, {
      merge: true,
    })

    onChatCreated()
  }

  return (
    <>
      <DialogTitle>Create chat</DialogTitle>
      <DialogContent>
        <DialogContentText paddingBottom="16px">
          Para criar um chat com alguem insira o nome da pessoa.
        </DialogContentText>

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

        <Button sx={{ marginY: 2, marginRight: 1 }} variant="contained" onClick={searchUser}>
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
        <Button disabled={selectedUser === null} variant="text" onClick={createPrivateChat}>
          Create
        </Button>
      </DialogActions>
    </>
  )
}

export default PrivateMessageSearchUsers
