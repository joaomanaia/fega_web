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
            <div className={`flex items-center justify-center w-1/2 rounded-full py-1 transition ease-in-out delay-150 
                ${selected 
                    ? 
                    "bg-secondaryContainer-light dark:bg-secondaryContainer-dark text-onSecondaryContainer-light dark:text-onSecondaryContainer-dark"
                    : 
                    "text-onSurfaceVariant-light dark:text-onSurfaceVariant-dark"
                }`}>
                <Icon className={`h-6 w-6`}/>
            </div>
            <p>{text}</p>
        </div>
    )
}

export default BottomNavItem