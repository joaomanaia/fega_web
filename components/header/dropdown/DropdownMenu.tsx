import DropdownItem from "./DropdownItem"
/*
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import NightsStayRoundedIcon from '@material-ui/icons/NightsStayRounded'
import Brightness7RoundedIcon from '@material-ui/icons/Brightness7Rounded'
*/
import { LogoutIcon, MoonIcon, SunIcon } from "@heroicons/react/solid"
import { auth } from "../../../firebase"
import { useDispatch, useSelector } from "react-redux"
import { changeAppTheme, selectAppThemeLight } from "../../../app/appSlice"
import { useRouter } from "next/router"
import en from "../../../locales/en"
import pt from "../../../locales/pt"

type DropdownMenuType = {
    isOpen: boolean
}

const DropdownMenu: React.FC<DropdownMenuType> = ({isOpen}) => {

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    const appThemeLight = useSelector(selectAppThemeLight)
    const dispatch = useDispatch()

    const changeTheme = () => {
        localStorage.setItem("theme", !appThemeLight ? 'light' : 'night')
        dispatch(changeAppTheme())
    }
    
    return (
        <div className="absolute space-y-2 mt-2 mr-8 w-64 p-3 z-50 rounded-2xl shadow-md bg-white dark:bg-gray-800 overflow-hidden">
            <DropdownItem
                onClick={() => router.push(`/${auth.currentUser?.uid}`)}
                title={auth.currentUser?.displayName || ""}
                imageSrc={auth.currentUser?.photoURL || ""}/>
            <DropdownItem 
                onClick={changeTheme} 
                title={appThemeLight ? t.nightMode : t.lightMode} 
                Icon={appThemeLight ? MoonIcon : SunIcon}/>
            <DropdownItem onClick={() => auth.signOut()} title={t.signOut} Icon={LogoutIcon}/>
        </div>
    )
}

export default DropdownMenu
