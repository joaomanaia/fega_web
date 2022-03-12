import { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectAppThemeLight, setAppThemeLight, setAppThemeNight } from "../app/appSlice"
import BottomNav from "../components/bottomNavigation/BottomNav"
import Header from "../components/header/Header"
import LeftSidebarMenu from "../components/leftSidebar/LeftSidebarMenu"
import PrivateMessageContent from "../components/private_message/PrivateMessageContent"
import PrivateMessageUser from "../components/private_message/PrivateMessageUser"
import UserType from "../components/user/UserType"
import { collection, onSnapshot, query, where, limit } from "firebase/firestore"
import { firestore, auth } from "../firebase"
import PrivateMessageSearchUsers from "../components/private_message/PrivateMessageSearchUsers"
import React from "react"

type ChatsType = {
    uid: string,
    lastMessage: string | null
}

const PrivateMessageList: NextPage = () => {

    const authUid = auth.currentUser?.uid

    const appThemeLight = useSelector(selectAppThemeLight)
    const dispatch = useDispatch()

    useEffect(() => {
        localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
    }, [dispatch])

    const [selectedChat, setSelectedChat] = useState<UserType | null>(null)

    const [windowMobile, setWindowMobile] = useState(false)

    const [chats, setChats] = useState<ChatsType[]>([])

    useEffect(() => {
        const onResize = () => {
            setWindowMobile(window.innerWidth < 1024)
        }

        window.addEventListener('resize', onResize)
        onResize()

        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [])

    useEffect(() => {
        const privateChatsRef = collection(firestore, "privateChats")
        const q = query(privateChatsRef, where("uids", "array-contains", authUid), limit(10))

        const unsub = onSnapshot(q, (queryDoc) => {
            const newChats: ChatsType[] = queryDoc.docs.map(doc => {
                const uids: string[] = doc.data().uids
                return {
                    uid: uids.find((uid) => uid !== authUid) || "",
                    lastMessage: null
                }
            })
            setChats(newChats)
        })

        return unsub
    }, [authUid])

    const [createChatPopupVisible, setCreateChatPopupVisible] = useState(false)

    return (
        <div className={`w-screen h-screen overflow-hidden ${appThemeLight ? '' : 'dark'}`}>
            <Head>
                <title>{selectedChat === null ? "Private Messages" : selectedChat?.name}</title>
            </Head>

            <Header />

            <main className="flex bg-gray-200 dark:bg-gray-900">
                <div className="flex-grow h-screen lg:flex overflow-y-hidden scrollbar-hide">
                    {(selectedChat === null || !windowMobile) && (
                        <div className={`mx-auto ${selectedChat ? "max-w-md md:max-w-lg lg:max-w-2xl" : "w-full"} p-5 space-y-3`}>
                            <button
                                onClick={() => setCreateChatPopupVisible(!createChatPopupVisible)}
                                className="py-2 px-4 rounded-full bg-red-700 cursor-pointer hover:bg-red-600 w-full">
                                <p className="text-lg text-white">
                                    Create new chat
                                </p>
                            </button>

                            {createChatPopupVisible && <PrivateMessageSearchUsers authUid={authUid || ""} onChatCreated={() => setCreateChatPopupVisible(false)} />}

                            {chats.map(chat => (
                                <PrivateMessageUser
                                    key={chat.uid}
                                    uid={chat.uid}
                                    lastMessage={chat.lastMessage}
                                    selected={selectedChat?.uid === chat.uid}
                                    onClick={(user) => setSelectedChat(user)} />
                            ))}
                        </div>
                    )}
                    {selectedChat && (
                        <div className={`flex-grow ${windowMobile ? "pt-0 pb-32" : "pt-5"} pb-24 h-full`}>
                            <PrivateMessageContent
                                windowMobile={windowMobile}
                                user={selectedChat}
                                onBackClick={() => setSelectedChat(null)} />
                        </div>
                    )}
                    {!windowMobile && (
                        <div className="invisible lg:visible lg:h-screen lg:w-2/12 lg:px-5 lg:mt-5">
                            <LeftSidebarMenu />
                        </div>
                    )}
                </div>
            </main>

            {/** Bottom navigation (mobile) */}
            <BottomNav />
        </div>
    )
}

export default PrivateMessageList