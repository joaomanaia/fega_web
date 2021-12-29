import { HomeIcon, CalendarIcon, NewspaperIcon } from "@heroicons/react/solid"
import LeftSidebarItem from './LeftSidebarItem'

function LeftSidebarMenu() {
    return (
        <div className="flex-col space-y-3">
            <LeftSidebarItem
                onClick={() => {alert("Comming Soon")}}
                title="Home"
                selected={true}
                Icon={HomeIcon}/>

            <LeftSidebarItem
                onClick={() => {alert("Comming Soon")}}
                title="Events"
                selected={false}
                Icon={CalendarIcon}/>

            <LeftSidebarItem
                onClick={() => {alert("Comming Soon")}}
                title="News"
                selected={false}
                Icon={NewspaperIcon}/>
        </div>
    )
}

export default LeftSidebarMenu
