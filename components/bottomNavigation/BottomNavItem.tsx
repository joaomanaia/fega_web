import { SvgIconTypeMap } from "@material-ui/core"
import { OverridableComponent } from "@material-ui/core/OverridableComponent"

type BottomNavItemType = {
    onClick?: any,
    Icon: OverridableComponent<SvgIconTypeMap>,
}

const BottomNavItem: React.FC<BottomNavItemType> = ({onClick, Icon}) => {
    return (
        <div className="flex cursor-pointer hover:bg-red-500 dark:hover:bg-red-700 rounded-2xl h-full w-full items-center justify-center">
            <Icon
                className="text-white"/>
        </div>
    )
}

export default BottomNavItem