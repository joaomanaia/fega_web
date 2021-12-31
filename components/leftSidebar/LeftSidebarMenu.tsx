import { HomeIcon, CalendarIcon, NewspaperIcon } from "@heroicons/react/solid"
import { useRouter } from "next/router"
import en from "../../locales/en"
import pt from "../../locales/pt"
import LeftSidebarItem from './LeftSidebarItem'

type LeftSidebarMenuType = {}

const LeftSidebarMenu: React.FC<LeftSidebarMenuType> = () => {

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    return (
        <div className="flex-col space-y-3">
            <LeftSidebarItem
                onClick={() => router.push("/")}
                title={t.home}
                selected={router.pathname === "/"}
                Icon={HomeIcon}/>

            <LeftSidebarItem
                onClick={() => router.push("/news")}
                title={t.news}
                selected={router.pathname.startsWith("/news")}
                Icon={NewspaperIcon}/>

        <LeftSidebarItem
                onClick={() => {alert("Comming Soon")}}
                title={t.events}
                selected={router.pathname.startsWith("/events")}
                Icon={CalendarIcon}/>
        </div>
    )
}

export default LeftSidebarMenu
