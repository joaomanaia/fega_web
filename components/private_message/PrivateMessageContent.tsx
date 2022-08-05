import { useEffect, useState } from "react"
import { auth, database } from "../../firebase"
import PrivateMessageItem from "./PrivateMessageItem"
import { onValue, ref, push, set, child } from "firebase/database"
import { getPairUid } from "../../utils/user-utils"
import ScrollableFeed from "react-scrollable-feed"
import UserType from "../user/UserType"
import { alpha, Box, IconButton, List, Typography, useTheme } from "@mui/material"
import { BackspaceRounded, SendRounded } from "@mui/icons-material"
import Avatar from "../m3/avatar"

type PrivateMessageContentType = {
  user: UserType
  windowMobile: boolean
  onBackClick: () => void
}

type PrivateMessageType = {
  id: string
  pairUid: string
  sender: string
  receiver: string
  text: string
}

const PrivateMessageContent: React.FC<PrivateMessageContentType> = ({
  user,
  windowMobile,
  onBackClick,
}) => {
  const [textMessage, setTextMessage] = useState("")

  const [messages, setMessages] = useState<PrivateMessageType[]>([])

  const localUserUid = auth.currentUser?.uid || ""
  const pairUid = getPairUid(localUserUid, user.uid)

  const { palette } = useTheme()

  useEffect(() => {
    const messagesRef = ref(database, `privateMessages/${pairUid}/messages`)

    onValue(messagesRef, (snapshot) => {
      const newMessages: PrivateMessageType[] = []

      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val()
        const message: PrivateMessageType = {
          id: childData.id,
          pairUid: childData.pairUid,
          sender: childData.sender,
          receiver: childData.receiver,
          text: childData.text,
        }
        newMessages.push(message)
      })

      setMessages(newMessages)
    })
  }, [pairUid])

  const sendMessage = () => {
    const messageRef = push(child(ref(database), `privateMessages/${pairUid}/messages`))

    const message: PrivateMessageType = {
      id: messageRef.key || "",
      pairUid: pairUid,
      sender: localUserUid || "",
      receiver: user.uid,
      text: textMessage,
    }

    set(messageRef, message)

    setTextMessage("")
  }

  return (
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

        <Avatar name={user.name} photoUrl={user.photoUrl} />

        <Typography variant="subtitle1">{user.name}</Typography>
      </Box>

      <ScrollableFeed>
        <List>
          <div className="w-full space-y-3 p-4 grow scrollbar-hide">
            {messages.map((message) => (
              <PrivateMessageItem
                key={message.id}
                text={message.text}
                byLocalUser={message.sender === localUserUid}
              />
            ))}
          </div>
        </List>
      </ScrollableFeed>

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
              placeholder={`Message to ${user.name}`}
              onChange={(e) => setTextMessage(e.target.value)}
            />
          </form>
        </Box>
        {textMessage.length > 0 && textMessage.length < 512 && (
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
  )
}

export default PrivateMessageContent
