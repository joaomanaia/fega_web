import { BackspaceIcon, PaperAirplaneIcon } from "@heroicons/react/solid"
import Image from "next/image"
import { useEffect, useState } from "react"
import { auth, database } from "../../firebase"
import PrivateMessageItem from "./PrivateMessageItem"
import { onValue, ref, push, set, child } from "firebase/database"
import { getPairUid } from "../../utils/user-utils"
import ScrollableFeed from "react-scrollable-feed"
import UserType from "../user/UserType"

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
    <div
      className={`w-full h-full bg-white flex flex-col ${
        windowMobile ? "dark:bg-gray-900" : "dark:bg-gray-800 rounded-2xl"
      }`}
    >
      <div
        className={`w-full flex bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 ${
          windowMobile ? "rounded-none" : "rounded-t-2xl"
        } items-center space-x-2 p-2`}
      >
        {windowMobile && (
          <div
            onClick={() => onBackClick()}
            className="rounded-full cursor-pointer w-10 h-10 p-2 hover:bg-gray-300 dark:hover:bg-gray-700 text-dark dark:text-white"
          >
            <BackspaceIcon />
          </div>
        )}
        <div className="relative h-11 w-11">
          <Image className="rounded-full" layout="fill" src={user.photoUrl} alt={user.name} />
        </div>
        <p className="text-dark dark:text-white text-lg">{user.name}</p>
      </div>
      <ScrollableFeed>
        <div className="w-full space-y-3 p-4 grow scrollbar-hide">
          {messages.map((message) => (
            <PrivateMessageItem
              key={message.id}
              text={message.text}
              byLocalUser={message.sender === localUserUid}
            />
          ))}
        </div>
      </ScrollableFeed>
      <div className="flex items-center m-2 space-x-2 mb-12 lg:mb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="rounded-2xl bg-gray-300 dark:bg-gray-700 flex-grow"
        >
          <input
            className="bg-transparent p-2 border-0 outline-none text-dark dark:text-white text-lg w-full"
            type="text"
            value={textMessage}
            maxLength={512}
            placeholder={`Message to ${user.name}`}
            onChange={(e) => setTextMessage(e.target.value)}
          />
        </form>
        {textMessage.length > 0 && textMessage.length < 512 && (
          <div
            onClick={() => sendMessage()}
            className="w-11 h-11 p-2 rounded-2xl bg-gray-300 dark:bg-gray-700 cursor-pointer text-black dark:text-white"
          >
            <PaperAirplaneIcon />
          </div>
        )}
      </div>
    </div>
  )
}

export default PrivateMessageContent
