import BottomNavItem from "./BottomNavItem"
import { HomeIcon, CalendarIcon, NewspaperIcon } from "@heroicons/react/solid"

type BottomNavType = {}

const BottomNav: React.FC<BottomNavType> = () => {
    return (
        <div className="fixed z-50 bottom-0 flex h-14 w-screen items-center bg-white dark:bg-gray-800 justify-between visible lg:invisible">
            <BottomNavItem Icon={HomeIcon} selected={true}/>
            <BottomNavItem Icon={CalendarIcon} selected={false}/>
            <BottomNavItem Icon={NewspaperIcon} selected={false}/>
        </div>
    )
}

export default BottomNav