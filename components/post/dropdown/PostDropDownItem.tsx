import Surface from "../../material/surface/Surface"

type PostDropDownItemType = {
    onClick: () => void,
    title: string,
    Icon?: any,
}

const PostDropDownItem: React.FC<PostDropDownItemType> = ({onClick, title, Icon}) => {
    return(
        <Surface
            shadowDisabled
            elevation={3}
            onClick={onClick}
            className="h-12 flex items-center rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            <Surface 
                elevation={1}
                shadowDisabled
                className="flex w-12 h-12 items-center rounded-full bg-gray-200 dark:bg-gray-700 p-3 ">
                <Icon/>
            </Surface> 
            <p className="text-lg ml-4">{title}</p>
        </Surface>
    )
}

export default PostDropDownItem