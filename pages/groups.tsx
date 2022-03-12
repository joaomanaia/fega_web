import { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectAppThemeLight, setAppThemeLight, setAppThemeNight } from "../app/appSlice"
import BottomNav from "../components/bottomNavigation/BottomNav"
import Header from "../components/header/Header"
import LeftSidebarMenu from "../components/leftSidebar/LeftSidebarMenu"
import React from "react"
import CreateGroupPopup from "../components/group/CreateGroupPopup"
import { auth, firestore } from "../firebase"
import GroupType from "../components/group/GroupType"
import { collection, getDocs, limit, query, where } from "firebase/firestore"
import GroupItem from "../components/group/GroupItem"
import GroupMessageContent from "../components/group/GroupMessageContent"

type GroupsType = {}

const Groups: NextPage = () => {

    const authUid = auth.currentUser?.uid

    const appThemeLight = useSelector(selectAppThemeLight)
    const dispatch = useDispatch()

    const [groups, setGroups] = useState<GroupType[]>([])

    const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null)

    const [createGroupPopupVisible, setCreateGroupPopupVisible] = useState(false)

    useEffect(() => {
        localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
    }, [dispatch])

    const [windowMobile, setWindowMobile] = useState(false)

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
        const getGroups = async () => {
            const groupsQuery = query(collection(firestore, "groups"), where("participants", "array-contains", authUid), limit(10))
            const groupsQuerySnapshot = await getDocs(groupsQuery)

            const groups: GroupType[] = groupsQuerySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    groupName: doc.data().groupName,
                    groupImage: doc.data().groupImage,
                    participants: doc.data().participants
                }
            })

            setGroups(groups)
        }

        getGroups()
    }, [authUid])

    return (
        <div className={`w-screen h-screen overflow-hidden ${appThemeLight ? '' : 'dark'}`}>
            <Head>
                <title>{selectedGroup ? selectedGroup.groupName : "Groups"}</title>
            </Head>

            <Header />

            <main className="flex bg-gray-200 dark:bg-gray-900">
                <div className="flex-grow h-screen lg:flex overflow-y-hidden scrollbar-hide">
                    {(selectedGroup === null || !windowMobile) && (
                        <div className={`mx-auto ${selectedGroup ? "max-w-md md:max-w-lg lg:max-w-2xl" : "w-full"} p-5 space-y-3`}>
                            <button
                                onClick={() => setCreateGroupPopupVisible(!createGroupPopupVisible)}
                                className="py-2 px-4 rounded-full bg-red-700 cursor-pointer hover:bg-red-600 w-full">
                                <p className="text-lg text-white">
                                    Create new group
                                </p>
                            </button>

                            {createGroupPopupVisible && <CreateGroupPopup authUid={authUid || ""} onGroupCreated={() => setCreateGroupPopupVisible(false)} />}

                            {groups.map(group => (
                                <GroupItem
                                    key={group.id}
                                    group={group}
                                    selected={selectedGroup === group}
                                    onClick={() => setSelectedGroup(group)} />
                            ))}
                        </div>
                    )}
                    {selectedGroup && (
                        <div className={`flex-grow ${windowMobile ? "pt-0 pb-32" : "pt-5"} pb-24 h-full`}>
                            <GroupMessageContent
                                windowMobile={windowMobile}
                                group={selectedGroup}
                                onBackClick={() => setSelectedGroup(null)} />
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

export default Groups