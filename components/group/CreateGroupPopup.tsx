import { collection, doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { firestore } from "../../firebase"
import { defaultImgUrl } from "../../utils/common"
import GroupType from "./GroupType"

type CreateGroupPopupItemType = {
    authUid: string,
    onGroupCreated: () => void
}

const CreateGroupPopup: React.FC<CreateGroupPopupItemType> = ({authUid, onGroupCreated}) => {
    
    const [groupName, setGroupName] = useState("")

    const [groupImage, setGroupImage] = useState("")

    const createGroup = async () => {
        const groupDoc = doc(collection(firestore, 'groups'))

        const group: GroupType = {
            id: groupDoc.id,
            groupName: groupName,
            groupImage: groupImage || defaultImgUrl,
            participants: [authUid]
        }

        setGroupName("")
        setGroupImage("")

        await setDoc(groupDoc, group)
    }
    
    return (
        <div className="z-50 absolute shadow-lg p-3 space-y-8 rounded-2xl bg-white dark:bg-gray-800 w-72">
            <form className="flex flex-col">
                <input 
                    className="w-full py-2 px-4 rounded-2xl bg-gray-100 dark:bg-gray-700 outline-none text-black dark:text-white text-lg"
                    type="text"
                    placeholder="Group Name"
                    maxLength={32}
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName} />
                <input 
                    className="w-full py-2 px-4 mt-2 rounded-2xl bg-gray-100 dark:bg-gray-700 outline-none text-black dark:text-white text-lg"
                    type="link"
                    placeholder="Image Link (Optional)"
                    onChange={(e) => setGroupImage(e.target.value)}
                    value={groupImage} />
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        createGroup()
                    }}
                    disabled={(!groupName && groupName.length > 32)}
                    className="rounded-full bg-red-700 mt-6 hover:bg-red-600 disabled:bg-gray-100 dark:disabled:bg-gray-700 
                        text-white disabled:text-gray-400 text-lg p-1 disabled:cursor-not-allowed">
                        Create
                </button>
            </form>
        </div>
    )
}

export default CreateGroupPopup