/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material"
import { collection, doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { firestore } from "../../firebase"
import { defaultImgUrl } from "../../core/common"
import Avatar from "../m3/avatar"
import GroupType from "./GroupType"

type CreateGroupPopupItemType = {
  authUid: string
  onGroupCreated: () => void
  onCloseDialog: () => void
}

const CreateGroupPopup: React.FC<CreateGroupPopupItemType> = ({
  authUid,
  onGroupCreated,
  onCloseDialog,
}) => {
  const [groupName, setGroupName] = useState("")
  const [groupNameError, setGroupNameError] = useState<string | null>("")

  const [groupImage, setGroupImage] = useState("")

  const createGroup = async () => {
    setGroupNameError(null)

    if (groupName === "") {
        setGroupNameError("Group name is null")
        return
    }

    const groupDoc = doc(collection(firestore, "groups"))

    const group: GroupType = {
      id: groupDoc.id,
      groupName: groupName,
      groupImage: groupImage || defaultImgUrl,
      participants: [authUid],
    }

    setGroupName("")
    setGroupImage("")

    await setDoc(groupDoc, group)

    onGroupCreated()
  }

  // Function to solve problem with security
  // Extracting text from a DOM node and interpreting it as HTML can lead to a cross-site scripting vulnerability.
  const setGroupImageFormatted = (value: string) => {
    const newValue = value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")

    setGroupImage(newValue)
  }

  return (
    <>
      <DialogTitle>Create group</DialogTitle>

      <DialogContent>
        <DialogContentText paddingBottom="16px">
          Crie um grupo para falar com varias pessoas.
        </DialogContentText>

        <Box component="form">
          <TextField
            onChange={(e) => setGroupName(e.target.value)}
            error={groupName === ""}
            helperText={groupNameError}
            autoFocus
            required
            margin="dense"
            id="group-name"
            label="Group name"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 1 }}
          />

          <Box className="flex items-center space-x-2">
            <Avatar photoUrl={groupImage} name={groupName} />

            <TextField
              onChange={(e) => setGroupImageFormatted(e.target.value)}
              margin="dense"
              id="group-image-url"
              label="Group image url (optional)"
              type="url"
              fullWidth
              variant="outlined"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={onCloseDialog}>
          Close
        </Button>
        <Button disabled={groupName === null} variant="text" onClick={createGroup}>
          Create
        </Button>
      </DialogActions>
    </>
  )
}

export default CreateGroupPopup