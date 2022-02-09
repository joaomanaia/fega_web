import Image from "next/image"
import { defaultImgUrl } from "../../utils/common"
import UserType from "./UserType"

type UserComponentType = {
    user: UserType,
    onClick: () => void
}

const UserComponent: React.FC<UserComponentType> = ({user, onClick}) => {

    return (
        <div 
            onClick={() => onClick()}
            className="flex items-center space-x-3 cursor-pointer p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="relative w-10 h-10">
                <Image
                    className="rounded-full"
                    layout="fill"
                    src={user.photoUrl || defaultImgUrl}
                    alt={user.name}/>
            </div>
            <p className="text-lg md:text-xl text-black dark:text-white">
                {user.name}
            </p>
        </div>
    )
}

export default UserComponent