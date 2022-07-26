import { useEffect, useState } from "react"
import { auth, database } from "../../firebase"
import { onValue, ref, push, set, child } from "firebase/database"
import ScrollableFeed from "react-scrollable-feed"
import GroupType from "./GroupType"
import GroupMessageItem from "./GroupMessageItem"
import GroupOptionsMenu from "./options_popup/GroupOptionsMenu"
import {
  Box,
  useTheme,
  alpha,
  IconButton,
  Typography,
  Grid,
  Menu,
  Tooltip,
  MenuItem,
  ListItemText,
  Dialog,
} from "@mui/material"
import { BackspaceRounded, MoreVertRounded, SendRounded } from "@mui/icons-material"
import Avatar from "../m3/avatar"
import AddUserGroupPopup from "./options_popup/AddUserGroupPopup"
import RemoveUserGroupPopup from "./options_popup/RemoveUserGroupPopup"

type GroupMessageContentType = {
  group: GroupType
  windowMobile: boolean
  onBackClick: () => void
}

type GroupMessageType = {
  id: string
  uid: string
  groupId: string
  text: string
}

const GroupMessageContent: React.FC<GroupMessageContentType> = ({
  group,
  windowMobile,
  onBackClick,
}) => {
  const [textMessage, setTextMessage] = useState("")

  const [canSendMessage, setCanSendMessage] = useState(true)
  const [sendMessageInterval, setSendMessageInterval] = useState<number>(-1)

  const [messages, setMessages] = useState<GroupMessageType[]>([])

  const { palette } = useTheme()

  const [addUserDialogVisible, setAddUserDialogVisible] = useState(false)
  const [removeUserDialogVisible, setRemoveUserDialogVisible] = useState(false)

  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null)
  const settingsOpen = Boolean(settingsAnchorEl)

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchorEl(event.currentTarget)
  }

  const handleClose = () => setSettingsAnchorEl(null)

  const localUserUid = auth.currentUser?.uid

  useEffect(() => {
    const messagesRef = ref(database, `group/${group.id}/messages`)

    onValue(messagesRef, (snapshot) => {
      const newMessages: GroupMessageType[] = []

      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val()
        const message: GroupMessageType = {
          id: childData.id,
          uid: childData.uid,
          groupId: childData.groupId,
          text: childData.text,
        }
        newMessages.push(message)
      })

      setMessages(newMessages)
    })
  }, [group.id])

  const delay = (delay: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2)
      }, delay)
    })
  }

  const sendMessage = async () => {
    if (!localUserUid) return
    setCanSendMessage(false)

    const messageRef = push(child(ref(database), `group/${group.id}/messages`))

    const message: GroupMessageType = {
      id: messageRef.key || "",
      uid: localUserUid,
      groupId: group.id,
      text: textMessage,
    }

    set(messageRef, message)

    setTextMessage("")

    setSendMessageInterval(3)
    await delay(1000)
    setSendMessageInterval(2)
    await delay(1000)
    setSendMessageInterval(1)
    await delay(1000)

    setCanSendMessage(true)
  }

  return (
    <>
      <Box
        bgcolor={alpha(palette.surfaceVariant.main, 0.25)}
        className="w-full h-full flex flex-col rounded-2xl"
      >
        <Box
          bgcolor={palette.surfaceVariant.main}
          color={palette.onSurfaceVariant.main}
          className="w-full flex rounded-2xl items-center space-x-2 p-3"
        >
          {windowMobile && (
            <IconButton onClick={() => onBackClick()}>
              <BackspaceRounded />
            </IconButton>
          )}

          <Avatar name={group.groupName} photoUrl={group.groupImage} />

          <Typography variant="subtitle1">{group.groupName}</Typography>

          <Grid item xs></Grid>

          <Tooltip title="Settings">
            <IconButton
              id="settings-button"
              aria-controls={settingsOpen ? "settings-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={settingsOpen ? "true" : undefined}
              onClick={handleSettingsClick}
              aria-label="settings"
            >
              <MoreVertRounded />
            </IconButton>
          </Tooltip>
        </Box>
        <ScrollableFeed>
          <div className="w-full space-y-3 p-4 grow scrollbar-hide">
            {messages.map((message, index) => (
              <GroupMessageItem
                key={message.id}
                text={message.text}
                uid={message.uid}
                byLocalUser={message.uid === localUserUid}
                hasMessageAbove={messages.at(index - 1)?.uid === message.uid}
                hasMessageBelow={messages.at(index + 1)?.uid === message.uid}
              />
            ))}
          </div>
        </ScrollableFeed>

        <Typography
          visibility={canSendMessage ? "hidden" : "visible"}
          variant="body1"
          className="ml-4"
        >
          Wait {sendMessageInterval} seconds
        </Typography>

        <div className="flex items-center m-2 space-x-2 mb-12 lg:mb-2">
          <Box
            className="rounded-2xl w-full"
            sx={{
              bgcolor: palette.surfaceVariant.main,
              color: palette.onSurfaceVariant.main,
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="rounded-2xl flex-grow"
            >
              <input
                className="bg-transparent p-2 border-0 outline-none text-dark text-lg w-full"
                type="text"
                value={textMessage}
                maxLength={512}
                placeholder={`Message to ${group.groupName}`}
                onChange={(e) => setTextMessage(e.target.value)}
              />
            </form>
          </Box>
          {textMessage.length > 0 && textMessage.length < 512 && canSendMessage && (
            <Box
              onClick={() => sendMessage()}
              sx={{
                bgcolor: palette.surfaceVariant.main,
                color: palette.onSurfaceVariant.main,
              }}
              className="w-11 h-11 p-2 flex items-center rounded-2xl cursor-pointer"
            >
              <SendRounded />
            </Box>
          )}
        </div>
      </Box>

      <Menu
        id="settings-menu"
        anchorEl={settingsAnchorEl}
        open={settingsOpen}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "settings-button" }}
      >
        <GroupOptionsMenu
          onAddUserClick={() => {
            handleClose()
            setAddUserDialogVisible(true)
          }}
          onDeleteUserClick={() => {
            handleClose()
            setRemoveUserDialogVisible(true)
          }}
        />
      </Menu>

      <Dialog open={addUserDialogVisible} onClose={() => setAddUserDialogVisible(false)}>
        <AddUserGroupPopup
          groupId={group.id}
          onCloseDialog={() => setAddUserDialogVisible(false)}
          onUserAdded={() => setAddUserDialogVisible(false)}
        />
      </Dialog>

      <Dialog open={removeUserDialogVisible} onClose={() => setRemoveUserDialogVisible(false)}>
        <RemoveUserGroupPopup
          groupId={group.id}
          onCloseDialog={() => setRemoveUserDialogVisible(false)}
          onUserRemoved={() => setRemoveUserDialogVisible(false)}
        />
      </Dialog>
    </>
  )
}

export default GroupMessageContent
