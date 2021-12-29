//import { SvgIconTypeMap } from "@material-ui/core"
//import { OverridableComponent } from "@material-ui/core/OverridableComponent"

type BottomNavItemType = {
    onClick?: any,
    selected: boolean,
    Icon: any //OverridableComponent<SvgIconTypeMap>,
}

const BottomNavItem: React.FC<BottomNavItemType> = ({onClick, selected, Icon}) => {
    return (
        <div className={`group flex cursor-pointer ${selected ? "text-white bg-red-700 hover:bg-red-800" : "text-red-700 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"} rounded-2xl h-full w-full items-center justify-center`}>
            <Icon className={`h-6 w-6  ${selected ? "text-white" : "text-red-700 dark:text-red-500 dark:group-hover:text-white"}`}/>
        </div>
    )
}

export default BottomNavItem