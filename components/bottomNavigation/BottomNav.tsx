import BottomNavItem from "./BottomNavItem"
import { HomeIcon, CalendarIcon, NewspaperIcon, ChatIcon } from "@heroicons/react/solid"
import { useRouter } from "next/router"
import en from "../../locales/en"
import pt from "../../locales/pt"

type BottomNavType = {}

const BottomNav: React.FC<BottomNavType> = () => {

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    return (
        <div className="fixed z-50 bottom-0 flex h-16 w-screen items-center bg-white dark:bg-gray-800 justify-between visible lg:invisible">
            <BottomNavItem
                onClick={() => router.push("/")}
                Icon={HomeIcon} 
                selected={router.pathname === "/"}
                text={t.home}/>
            <BottomNavItem 
                onClick={() => router.push("/news")}
                Icon={NewspaperIcon} 
                selected={router.pathname.startsWith("/news")}
                text={t.news}/>
            <BottomNavItem 
                onClick={() => alert("Comming Soon")}
                Icon={CalendarIcon} 
                selected={router.pathname.startsWith("/events")}
                text={t.events}/>
            <BottomNavItem 
                onClick={() => router.push("/messages")}
                Icon={ChatIcon} 
                selected={router.pathname.startsWith("/messages")}
                text={t.messages}/>
        </div>
    )
}

export default BottomNav