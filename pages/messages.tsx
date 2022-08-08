import { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import PrivateMessageContent from "../components/private_message/PrivateMessageContent"
import PrivateMessageUser from "../components/private_message/PrivateMessageUser"
import UserType from "../types/UserType"
import { collection, onSnapshot, query, where, limit } from "firebase/firestore"
import { firestore, auth } from "../firebase"
import PrivateMessageSearchUsers from "../components/private_message/PrivateMessageSearchUsers"
import React from "react"
import RootLayout from "../components/layout/root-layout"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  List,
  TextField,
} from "@mui/material"
import { AddRounded } from "@mui/icons-material"

type ChatsType = {
  uid: string
  lastMessage: string | null
}

const PrivateMessageList: NextPage = () => {
  const authUid = auth.currentUser?.uid

  const [selectedChat, setSelectedChat] = useState<UserType | null>(null)

  const [windowMobile, setWindowMobile] = useState(false)

  const [chats, setChats] = useState<ChatsType[]>([])

  useEffect(() => {
    const onResize = () => {
      setWindowMobile(window.innerWidth < 1024)
    }

    window.addEventListener("resize", onResize)
    onResize()

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  useEffect(() => {
    try {
      const privateChatsRef = collection(firestore, "privateChats")
      const q = query(privateChatsRef, where("uids", "array-contains", authUid), limit(10))

      const unsub = onSnapshot(q, (queryDoc) => {
        const newChats: ChatsType[] = queryDoc.docs.map((doc) => {
          const uids: string[] = doc.data().uids
          return {
            uid: uids.find((uid) => uid !== authUid) || "",
            lastMessage: null,
          }
        })
        setChats(newChats)
      })

      return unsub
    } catch {}
  }, [authUid])

  const [createChatPopupVisible, setCreateChatPopupVisible] = useState(false)

  return (
    <RootLayout>
      <Head>
        <title>{selectedChat === null ? "Private Messages" : selectedChat?.name}</title>
      </Head>

      <main className="flex-grow h-screen lg:flex overflow-y-hidden scrollbar-hide">
        {(selectedChat === null || !windowMobile) && (
          <div
            className={`mx-auto ${
              selectedChat ? "max-w-md md:max-w-lg lg:max-w-2xl" : "w-full"
            } p-5 space-y-3`}
          >
            <Fab
              variant="extended"
              color="primary"
              sx={{ width: "100%" }}
              onClick={() => setCreateChatPopupVisible(!createChatPopupVisible)}
            >
              <AddRounded sx={{ mr: 1 }} />
              Create chat
            </Fab>

            <Dialog open={createChatPopupVisible} onClose={() => setCreateChatPopupVisible(false)}>
              <PrivateMessageSearchUsers
                authUid={authUid || ""}
                onChatCreated={() => setCreateChatPopupVisible(false)}
                onCloseDialog={() => setCreateChatPopupVisible(false)}
              />
            </Dialog>

            <List>
              {chats.map((chat) => (
                <PrivateMessageUser
                  key={chat.uid}
                  uid={chat.uid}
                  lastMessage={chat.lastMessage}
                  selected={selectedChat?.uid === chat.uid}
                  onClick={(user) => setSelectedChat(user)}
                />
              ))}
            </List>
          </div>
        )}
        {selectedChat && (
          <div className={`flex-grow ${windowMobile ? "pt-0 pb-32" : "pt-5"} pb-24 h-full`}>
            <PrivateMessageContent
              windowMobile={windowMobile}
              user={selectedChat}
              onBackClick={() => setSelectedChat(null)}
            />
          </div>
        )}
      </main>
    </RootLayout>
  )
}

export default PrivateMessageList
