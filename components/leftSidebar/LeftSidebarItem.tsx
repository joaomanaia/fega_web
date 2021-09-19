import { SvgIconTypeMap } from "@material-ui/core"
import { OverridableComponent } from "@material-ui/core/OverridableComponent"

type LeftSidebarItemType = {
    onClick?: any,
    title: string,
    Icon: OverridableComponent<SvgIconTypeMap>
}

const LeftSidebarItem: React.FC<LeftSidebarItemType> = ({onClick, title, Icon}) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center h-12 w-full shadow-sm bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl cursor-pointer">
               <div className="h-12 w-12 flex items-center rounded-full p-3 text-gray-500 dark:text-white">
                    <Icon/>
                </div> 
                <p className="text-gray-500 dark:text-white text-lg ml-2">{title}</p>
        </div>
    )
}

export default LeftSidebarItem