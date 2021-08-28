import { SvgIconTypeMap } from "@material-ui/core"
import { OverridableComponent } from "@material-ui/core/OverridableComponent"

type DropDownItemType = {
    onClick?: any,
    title: string,
    Icon: OverridableComponent<SvgIconTypeMap>
}

const DropdownItem: React.FC<DropDownItemType> = ({onClick, title, Icon}) => {
    return (
        <div
            onClick={onClick}
            className="h-12 flex items-center rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            <div className="flex items-center rounded-full bg-gray-200 dark:bg-gray-700 p-3 text-gray-500 dark:text-white">
                <Icon/>
            </div>
            <p className="text-gray-500 dark:text-white text-lg ml-4">{title}</p>
        </div>
    )
}

export default DropdownItem
