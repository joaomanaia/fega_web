import { arrayUnion, collection, doc, FieldValue, getDoc, getDocs, limit, query, runTransaction, where } from "firebase/firestore"
import { useState } from "react"
import { auth, firestore } from "../../../firebase"
import UserComponent from "../../user/UserComponent"
import UserType from "../../user/UserType"
import GroupType from "../GroupType"

type AddUserGroupPopupType = {
    groupId: string
    onUserAdded: () => void
}

const AddUserGroupPopup: React.FC<AddUserGroupPopupType> = ({groupId, onUserAdded}) => {    
    
    const [userName, setUserName] = useState("")

    const [users, setUsers] = useState<UserType[]>([])

    const addUser = async (user: UserType) => {

        try {
            await runTransaction(firestore, async (transaction) => {
                const groupRef = doc(firestore, "groups", groupId)
                const groupDoc = await transaction.get(groupRef)

                if (!groupDoc.exists()) throw "Document not found"

                const group: GroupType = {
                    id: groupDoc.id,
                    groupName: groupDoc?.data()?.groupName,
                    groupImage: groupDoc?.data()?.groupImage,
                    participants: groupDoc?.data()?.participants
                }

                if (group.participants.length < 20) {
                    transaction.update(
                        groupRef,
                        {
                            participants: arrayUnion(user.uid)
                        }
                    )
                } else {
                    alert("You have reached the maximum number of user in the group")
                }
            })
        } catch (error) {
            console.log("Translate error", error)
        }

        onUserAdded()
    }
    
    const searchUser = async () => {
        const usersRef = collection(firestore, "users")
        const q = query(usersRef, where("name", "==", userName), limit(10))

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

        setUserName("")
    }
    
    return (
        <div className="z-50 absolute shadow-lg p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 w-72 ml-4 mt-16">
            <form className="flex flex-col">
                <input 
                    className="w-full py-2 px-4 rounded-2xl bg-gray-100 dark:bg-gray-700 outline-none text-black dark:text-white text-lg"
                    type="text"
                    placeholder="User Name"
                    maxLength={128}
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName} />
                    {users.map(user => (
                        <UserComponent
                            key={user.uid}
                            user={user}
                            onClick={() => addUser(user)}/>
                    ))}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        searchUser()
                    }}
                    disabled={!userName}
                    className="rounded-full bg-red-700 mt-6 hover:bg-red-600 disabled:bg-gray-200 dark:disabled:bg-gray-600 
                        text-white disabled:text-gray-400 text-lg p-1 disabled:cursor-not-allowed">
                        Search User
                </button>
            </form>
        </div>
    )
}

export default AddUserGroupPopup