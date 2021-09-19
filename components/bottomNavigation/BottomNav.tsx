import { HomeRounded, NewReleasesRounded } from '@material-ui/icons'
import EventRoundedIcon from '@material-ui/icons/EventRounded'
import BottomNavItem from "./BottomNavItem"

type BottomNavType = {}

const BottomNav: React.FC<BottomNavType> = () => {
    return (
        <div className="sticky z-50 bottom-0 flex h-14 w-screen items-center bg-red-700 dark:bg-gray-800
            justify-between visible lg:invisible">
            <BottomNavItem Icon={HomeRounded}/>
            <BottomNavItem Icon={EventRoundedIcon}/>
            <BottomNavItem Icon={NewReleasesRounded}/>
        </div>
    )
}

export default BottomNav