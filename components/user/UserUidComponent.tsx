import Image from "next/image"
import useSWR from "swr"
import { fetcher } from "../../utils/data"
import UserComponent from "./UserComponent"
import UserType from "./UserType"

type UserUidComponentType = {
    uid: string
    onClick: () => void
}

const UserUidComponent: React.FC<UserUidComponentType> = ({uid, onClick}) => {

    const { data } = useSWR(`/api/user/getUserByUid?uid=${uid}`, fetcher)

    const user: UserType = data !== undefined ? JSON.parse(data.user) : {}

    return (
        <UserComponent
            user={user}
            onClick={() => onClick()}/>
    )
}

export default UserUidComponent