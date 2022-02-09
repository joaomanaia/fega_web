import { arrayRemove, collection, doc, getDoc, getDocs, limit, query, runTransaction, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, firestore } from "../../../firebase"
import UserUidComponent from "../../user/UserUidComponent"
import GroupType from "../GroupType"

type RemoveUserGroupPopupType = {
    groupId: string
    onUserRemoved: () => void
}

const RemoveUserGroupPopup: React.FC<RemoveUserGroupPopupType> = ({groupId, onUserRemoved}) => {    

    const groupRef = doc(firestore, "groups", groupId)

    const [users, setUsers] = useState<string[]>([])
    
    useEffect(() => {
        const searchUsers = async () => {
            const groupDoc = await getDoc(groupRef)
    
            const group: GroupType = {
                id: groupDoc.id,
                groupName: groupDoc?.data()?.groupName,
                groupImage: groupDoc?.data()?.groupImage,
                participants: groupDoc?.data()?.participants
            }
    
            setUsers(group.participants)
        }

        searchUsers()
    }, [groupRef])

    const removeUser = async (uid: string) => {

        if (uid === auth.currentUser?.uid) {
            alert("You can't remove yourself!")
            return
        }

        await updateDoc(
            groupRef,
            {
                participants: arrayRemove(uid)
            }
        )

        onUserRemoved()
    }
    
    return (
        <div className="z-50 absolute shadow-lg p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 w-72 ml-4 mt-16">
            <p className="text-xl text-black dark:text-white mb-4">
                Remove User
            </p>

            {users.map((uid) => (
                <UserUidComponent
                    key={uid}
                    uid={uid}
                    onClick={() => removeUser(uid)}/>
            ))}
        </div>
    )
}

export default RemoveUserGroupPopup