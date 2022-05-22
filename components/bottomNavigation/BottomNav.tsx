import BottomNavItem from "./BottomNavItem"
import { HomeIcon, CalendarIcon, NewspaperIcon, ChatIcon , UserGroupIcon} from "@heroicons/react/solid"
import { useRouter } from "next/router"
import en from "../../locales/en"
import pt from "../../locales/pt"
import { auth } from "../../firebase"
import Surface from "../material/surface/Surface"

type BottomNavType = {}

const BottomNav: React.FC<BottomNavType> = () => {

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    const isLoggedIn = auth.currentUser !== null

    return (
        <Surface 
            shadowDisabled
            elevation={1}
            className="fixed z-50 bottom-0 flex h-16 w-screen items-center justify-between visible lg:invisible">
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
                onClick={() => router.push(isLoggedIn ? "/groups" : "/auth")}
                Icon={UserGroupIcon} 
                selected={router.pathname.startsWith("/groups")}
                text={t.groups}/>
            <BottomNavItem 
                onClick={() => router.push(isLoggedIn ? "/messages" : "/auth")}
                Icon={ChatIcon} 
                selected={router.pathname.startsWith("/messages")}
                text={t.messages}/>
        </Surface>
    )
}

export default BottomNav