import Image from "next/image"
import Surface from "../../material/surface/Surface"

type DropDownItemType = {
    onClick?: any,
    title: string,
    Icon?: any, //OverridableComponent<SvgIconTypeMap>,
    imageSrc?: string
}

const DropdownItem: React.FC<DropDownItemType> = ({onClick, title, Icon, imageSrc}) => {
    return (
        <Surface
            onClick={onClick}
            shadowDisabled
            className="h-12 flex items-center rounded-2xl cursor-pointer">
            {Icon ? 
                <Surface 
                    shadowDisabled
                    elevation={1}
                    className="flex w-12 h-12 items-center rounded-full p-3">
                    <Icon/>
                </Surface> 
                : 
                <Surface 
                    shadowDisabled
                    elevation={1}
                    className="relative h-12 w-12 flex items-center justify-center rounded-full">
                   <div className="relative w-9 h-9">
                    <Image 
                        layout="fill"
                        className="rounded-full"
                        src={imageSrc || "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb"} 
                        alt=""/>
                   </div>
                </Surface>
            }
            <p className="text-gray-500 dark:text-white text-lg ml-4">{title}</p>
        </Surface>
    )
}

export default DropdownItem