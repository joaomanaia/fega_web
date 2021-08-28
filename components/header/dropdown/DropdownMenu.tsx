import DropdownItem from "./DropdownItem"
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import NightsStayRoundedIcon from '@material-ui/icons/NightsStayRounded'
import Brightness7RoundedIcon from '@material-ui/icons/Brightness7Rounded'
import { auth } from "../../../firebase"
import { useDispatch, useSelector } from "react-redux"
import { changeAppTheme, selectAppThemeLight } from "../../../app/appSlice"

type DropdownMenuType = {
    isOpen: boolean
}

function DropdownMenu({isOpen}: DropdownMenuType) {

    const appThemeLight = useSelector(selectAppThemeLight)
    const dispatch = useDispatch()

    const changeTheme = () => {
        localStorage.setItem("theme", !appThemeLight ? 'light' : 'night')
        dispatch(changeAppTheme())
    }
    
    return (
        <div className="absolute space-y-2 mt-2 mr-8 w-64 p-3 rounded-2xl shadow-md bg-white dark:bg-gray-800 overflow-hidden">
            <DropdownItem 
                onClick={changeTheme} 
                title={`${appThemeLight ? "Night Mode" : "Light Mode"}`} 
                Icon={appThemeLight ? NightsStayRoundedIcon : Brightness7RoundedIcon}/>
            <DropdownItem onClick={() => auth.signOut()} title="Sign Out" Icon={ExitToAppRoundedIcon}/>
        </div>
    )
}

export default DropdownMenu
