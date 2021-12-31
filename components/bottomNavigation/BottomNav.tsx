import BottomNavItem from "./BottomNavItem"
import { HomeIcon, CalendarIcon, NewspaperIcon } from "@heroicons/react/solid"
import { useRouter } from "next/router"

type BottomNavType = {}

const BottomNav: React.FC<BottomNavType> = () => {
    const router = useRouter()

    return (
        <div className="fixed z-50 bottom-0 flex h-14 w-screen items-center bg-white dark:bg-gray-800 justify-between visible lg:invisible">
            <BottomNavItem
                onClick={() => router.push("/")}
                Icon={HomeIcon} 
                selected={router.pathname === "/"}/>
            <BottomNavItem 
                onClick={() => router.push("/news")}
                Icon={NewspaperIcon} 
                selected={router.pathname.startsWith("/news")}/>
            <BottomNavItem 
                onClick={() => alert("Comming Soon")}
                Icon={CalendarIcon} 
                selected={router.pathname.startsWith("/events")}/>
        </div>
    )
}

export default BottomNav