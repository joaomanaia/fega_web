//import { SvgIconTypeMap } from "@material-ui/core"
//import { OverridableComponent } from "@material-ui/core/OverridableComponent"

type BottomNavItemType = {
    onClick: () => void,
    selected: boolean,
    Icon: any, //OverridableComponent<SvgIconTypeMap>,
    text: string
}

const BottomNavItem: React.FC<BottomNavItemType> = ({onClick, selected, Icon, text}) => {
    return (
        <div 
            onClick={() => onClick()}
            className={`group flex flex-col cursor-pointer h-full w-full items-center justify-center`}>
            <div className={`flex items-center justify-center w-1/2 rounded-full py-1 transition ease-in-out delay-150 ${selected ? "text-white bg-red-700 group-hover:bg-red-800" : "text-red-700 group-hover:bg-gray-100 dark:bg-gray-800 dark:group-hover:bg-gray-700"}`}>
                <Icon className={`h-6 w-6  ${selected ? "text-white" : "text-red-700 dark:text-red-500 dark:group-hover:text-white"}`}/>
            </div>
            <p className="text-black dark:text-white">{text}</p>
        </div>
    )
}

export default BottomNavItem