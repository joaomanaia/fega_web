import Image from "next/image"
import useSWR from "swr"
import { defaultImgUrl } from "../../utils/common"
import { fetcher } from "../../utils/data"
import UserType from "../user/UserType"

type GroupMessageItemType = {
    text: string
    byLocalUser: boolean
    uid: string
    hasMessageAbove: boolean
    hasMessageBelow: boolean
}

const GroupMessageItem: React.FC<GroupMessageItemType> = ({text, byLocalUser, uid, hasMessageAbove, hasMessageBelow}) => {

    const { data } = useSWR((!hasMessageAbove && !byLocalUser) ? `/api/user/getUserByUid?uid=${uid}` : null, fetcher)

    const user: UserType = data !== undefined ? JSON.parse(data.user) : {}

    const messageCorners = () => {
        if (hasMessageAbove && hasMessageBelow) {
            return `rounded-2xl ${byLocalUser ? "rounded-r-md" : "rounded-l-md"}`
        } else if (hasMessageAbove && !hasMessageBelow) {
            return `rounded-2xl ${byLocalUser ? "rounded-tr-md" : "rounded-tl-md"}`
        } else if (!hasMessageAbove && hasMessageBelow) {
            return `rounded-2xl ${byLocalUser ? "rounded-br-md" : "rounded-bl-md"}`
        } else {
            return "rounded-2xl"
        }
    }
    
    return (
        <div className="flex flex-col w-full space-y-2">
            {(!byLocalUser && !hasMessageAbove) && (
                <div className="flex space-x-1 items-center">
                    <div className="relative w-6 h-6">
                        <Image
                            className="rounded-full"
                            layout="fill"
                            src={user?.photoUrl || defaultImgUrl}
                            alt={user?.name || ""}/>
                    </div>
                    <p className="text-black dark:text-white">
                        {user?.name}
                    </p>
                </div>
            )}

            <div className={`flex w-min p-3 ${messageCorners()} ${byLocalUser ? "bg-red-700 dark:bg-red-800 self-end" : "bg-gray-100 dark:bg-gray-700 self-start"}`}>
                <p className={`max-w-prose ${byLocalUser ? "text-white text-right" : "text-black dark:text-white text-right"}`}>
                    {text}
                </p>
            </div>
        </div>
    )
}

export default GroupMessageItem