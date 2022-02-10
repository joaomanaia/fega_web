/* eslint-disable @next/next/no-img-element */
import { defaultImgUrl } from "../../utils/common"
import GroupType from "./GroupType"

type GroupItemType = {
    group: GroupType,
    selected: boolean,
    onClick: () => void
}

const GroupItem: React.FC<GroupItemType> = ({group, selected, onClick}) => {
    return (
        <div 
            onClick={() => onClick()}
            className={`flex items-center space-x-4 rounded-2xl p-4 cursor-pointer ${selected ? "bg-red-700 hover:bg-red-600" : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
            <img
                className="rounded-full h-12 w-12"
                src={group?.groupImage || defaultImgUrl}
                alt={group?.groupName} />
            <p className={`${selected ? "text-white" : "text-black dark:text-white"} text-lg font-bold truncate`}>
                {group?.groupName}
            </p>
        </div>
    )
}

export default GroupItem