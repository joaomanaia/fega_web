import Surface from "../material/surface/Surface"

type LeftSidebarItemType = {
    onClick: () => void,
    title: string,
    selected: boolean,
    Icon: any //OverridableComponent<SvgIconTypeMap>
}

const LeftSidebarItem: React.FC<LeftSidebarItemType> = ({onClick, title, selected, Icon}) => {
    return (
        <div
            onClick={() => onClick()}
            className={`flex items-center h-12 w-full 
                ${selected ? "bg-primary-light hover:bg-primary-light/60 dark:bg-primary-dark dark:hover:bg-primary-dark/70" : "bg-surface-light hover:bg-primary-light/10 dark:bg-surface-dark dark:hover:bg-primary-dark/20"}
                rounded-2xl cursor-pointer`}>
               <div className={`h-12 w-12 flex items-center rounded-full p-3 ${selected ? "text-onPrimary-light dark:text-onPrimary-dark" : "text-onSurface-light dark:text-onSurface-dark"}`}>
                    <Icon/>
                </div> 
                <p className={`${selected ? "text-onPrimary-light dark:text-onPrimary-dark" : "text-onSurface-light dark:text-onSurface-dark"} text-lg ml-2 truncate`}>
                    {title}
                </p>
        </div>
    )
}

export default LeftSidebarItem