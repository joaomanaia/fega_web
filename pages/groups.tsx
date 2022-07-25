import { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import BottomNav from "../components/bottomNavigation/BottomNav"
import LeftSidebarMenu from "../components/leftSidebar/LeftSidebarMenu"
import React from "react"
import CreateGroupPopup from "../components/group/CreateGroupPopup"
import { auth, firestore } from "../firebase"
import GroupType from "../components/group/GroupType"
import { collection, getDocs, limit, query, where } from "firebase/firestore"
import GroupItem from "../components/group/GroupItem"
import GroupMessageContent from "../components/group/GroupMessageContent"
import RootLayout from "../components/layout/root-layout"
import { Dialog, Fab, List, Snackbar } from "@mui/material"
import { AddRounded } from "@mui/icons-material"

type GroupsType = {}

const Groups: NextPage = () => {
  const authUid = auth.currentUser?.uid

  const [groups, setGroups] = useState<GroupType[]>([])

  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null)

  const [createGroupPopupVisible, setCreateGroupPopupVisible] = useState(false)

  const [windowMobile, setWindowMobile] = useState(false)

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false)

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false)
  }

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
    const getGroups = async () => {
      const groupsQuery = query(
        collection(firestore, "groups"),
        where("participants", "array-contains", authUid),
        limit(10)
      )
      const groupsQuerySnapshot = await getDocs(groupsQuery)

      const groups: GroupType[] = groupsQuerySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          groupName: doc.data().groupName,
          groupImage: doc.data().groupImage,
          participants: doc.data().participants,
        }
      })

      setGroups(groups)
    }

    getGroups()
  }, [authUid])

  return (
    <RootLayout>
      <Head>
        <title>{selectedGroup ? selectedGroup.groupName : "Groups"}</title>
      </Head>

      <main>
        <div className="flex-grow h-screen lg:flex overflow-y-hidden scrollbar-hide">
          {(selectedGroup === null || !windowMobile) && (
            <div
              className={`mx-auto ${
                selectedGroup ? "max-w-md md:max-w-lg lg:max-w-2xl" : "w-full"
              } p-5 space-y-3`}
            >
              <Fab
                variant="extended"
                color="primary"
                sx={{ width: "100%" }}
                onClick={() => setCreateGroupPopupVisible(!createGroupPopupVisible)}
              >
                <AddRounded sx={{ mr: 1 }} />
                Create new group
              </Fab>

              <Dialog
                open={createGroupPopupVisible}
                onClose={() => setCreateGroupPopupVisible(false)}
              >
                <CreateGroupPopup
                  authUid={authUid || ""}
                  onGroupCreated={() => {
                    setSuccessSnackbarOpen(true)
                    setCreateGroupPopupVisible(false)
                  }}
                  onCloseDialog={() => setCreateGroupPopupVisible(false)}
                />
              </Dialog>

              <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleSuccessSnackbarClose}
                message="Group created"
              />

              <List>
                {groups.map((group) => (
                  <GroupItem
                    key={group.id}
                    group={group}
                    selected={selectedGroup === group}
                    onClick={() => setSelectedGroup(group)}
                  />
                ))}
              </List>
            </div>
          )}
          {selectedGroup && (
            <div className={`flex-grow ${windowMobile ? "pt-0 pb-32" : "pt-5"} pb-24 h-full`}>
              <GroupMessageContent
                windowMobile={windowMobile}
                group={selectedGroup}
                onBackClick={() => setSelectedGroup(null)}
              />
            </div>
          )}
        </div>
      </main>
    </RootLayout>
  )
}

export default Groups
