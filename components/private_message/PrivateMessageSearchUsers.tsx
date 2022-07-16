import { collection, doc, getDocs, limit, query, setDoc, where } from "firebase/firestore"
import { useState } from "react"
import { firestore } from "../../firebase"
import { getPairUid } from "../../utils/user-utils"
import UserComponent from "../user/UserComponent"
import UserType from "../user/UserType"
import PrivateChatType from "./PrivateChatType"

type PrivateMessageSearchUsersItemType = {
    authUid: string,
    onChatCreated: () => void
}

const PrivateMessageSearchUsers: React.FC<PrivateMessageSearchUsersItemType> = ({authUid, onChatCreated}) => {

    const [users, setUsers] = useState<UserType[]>([])

    const [searchText, setSearchText] = useState("")

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

    const createPrivateChat = async (user: UserType) => {
        const pairUid = getPairUid(authUid, user.uid)

        const privateChatsDoc = doc(firestore, 'privateChats', pairUid)

        const privateChat: PrivateChatType = {
            pairUid: pairUid,
            uids: [authUid, user.uid]
        }

        await setDoc(
            privateChatsDoc,
            privateChat,
            {
                merge: true
            }
        )
        
        onChatCreated()
    }

    return (
        <div className="z-50 absolute shadow-lg p-3 space-y-2 rounded-2xl bg-white dark:bg-gray-800 w-72">
            <form className="flex flex-col space-y-2">
                <input 
                    className="w-full py-2 px-4 rounded-2xl bg-gray-100 dark:bg-gray-700 outline-none text-black dark:text-white text-lg"
                    type="text"
                    placeholder="Search name"
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText} />
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        searchUser()
                    }}
                    disabled={!searchText}
                    className="mt-4 rounded-full bg-red-700 hover:bg-red-600 disabled:bg-gray-100 dark:disabled:bg-gray-700 
                        text-white disabled:text-gray-400 text-lg p-1 disabled:cursor-not-allowed">
                        Search
                </button>
            </form>
            
            {users.map(user => (
                <UserComponent
                    key={user.uid}
                    user={user}
                    onClick={() => createPrivateChat(user)}/>
            ))}
        </div>
    )
}

export default PrivateMessageSearchUsers