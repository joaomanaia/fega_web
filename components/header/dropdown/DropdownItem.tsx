import Image from "next/image"

type DropDownItemType = {
    onClick?: any,
    title: string,
    Icon?: any, //OverridableComponent<SvgIconTypeMap>,
    imageSrc?: string
}

const DropdownItem: React.FC<DropDownItemType> = ({onClick, title, Icon, imageSrc}) => {
    return (
        <div
            onClick={onClick}
            className="h-12 flex items-center rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            {Icon ? 
                <div className="flex w-12 h-12 items-center rounded-full bg-gray-200 dark:bg-gray-700 p-3 text-gray-500 dark:text-white">
                    <Icon/>
                </div> 
                : 
                <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-white">
                   <div className="relative w-9 h-9">
                    <Image 
                        layout="fill"
                        className="rounded-full"
                        src={imageSrc || "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb"} 
                        alt=""/>
                   </div>
                </div>
            }
            <p className="text-gray-500 dark:text-white text-lg ml-4">{title}</p>
        </div>
    )
}

export default DropdownItem