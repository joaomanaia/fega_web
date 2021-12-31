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
            className={`flex items-center h-12 w-full shadow-sm ${selected ? "bg-red-700 hover:bg-red-800" : "bg-white hover:bg-gray-50"}
                ${selected ? "dark:bg-red-700 dark:hover:bg-red-800" : "dark:bg-gray-800 dark:hover:bg-gray-700"} 
                rounded-2xl cursor-pointer`}>
               <div className={`h-12 w-12 flex items-center rounded-full p-3 ${selected ? "text-white" : "text-gray-500"} dark:text-white`}>
                    <Icon/>
                </div> 
                <p className={`${selected ? "text-white" : "text-gray-500"} dark:text-white text-lg ml-2`}>
                    {title}
                </p>
        </div>
    )
}

export default LeftSidebarItem