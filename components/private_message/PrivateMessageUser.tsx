import Image from "next/image"
import useSWR from "swr"
import { fetcher } from '../../utils/data'
import { defaultImgUrl } from '../../utils/common'
import UserType from "../user/UserType"

type PrivateMessageUserType = {
    uid: string,
    lastMessage: string | null,
    selected: boolean,
    onClick: (user: UserType) => void
}

const PrivateMessageUser: React.FC<PrivateMessageUserType> = ({uid, lastMessage, selected, onClick}) => {

    const { data } = useSWR(`/api/user/getUserByUid?uid=${uid}`, fetcher)

    const user: UserType = data !== undefined ? JSON.parse(data.user) : {}

    return (
        <div 
            onClick={() => onClick(user)}
            className={`flex items-center space-x-4 rounded-2xl p-4 cursor-pointer ${selected ? "bg-red-700 hover:bg-red-600" : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
            <div className="relative h-12 w-12">
                <Image
                    className="rounded-full"
                    layout="fill"
                    src={user?.photoUrl || defaultImgUrl}
                    alt={user?.name} />
            </div>
            <div className="flex flex-col space-y-1">
                <p className={`${selected ? "text-white" : "text-black dark:text-white"} text-lg font-bold truncate`}>
                    {user?.name}
                </p>
                <p className={`dark:text-gray-300 ${selected ? "text-gray-100" : "text-gray-600"} truncate text-ellipsis`}>
                    {lastMessage}
                </p>
            </div>
        </div>
    )
}

export default PrivateMessageUser