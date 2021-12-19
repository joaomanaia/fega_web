import { HomeRounded, NewReleasesRounded } from '@material-ui/icons'
import EventRoundedIcon from '@material-ui/icons/EventRounded'
import LeftSidebarItem from './LeftSidebarItem'

function LeftSidebarMenu() {
    return (
        <div className="flex-col space-y-3">
            <LeftSidebarItem
                onClick={() => {alert("Comming Soon")}}
                title="Home"
                selected={true}
                Icon={HomeRounded}/>

            <LeftSidebarItem
                onClick={() => {alert("Comming Soon")}}
                title="Events"
                selected={false}
                Icon={EventRoundedIcon}/>

            <LeftSidebarItem
                onClick={() => {alert("Comming Soon")}}
                title="News"
                selected={false}
                Icon={NewReleasesRounded}/>
        </div>
    )
}

export default LeftSidebarMenu
