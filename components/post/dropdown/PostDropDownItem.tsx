type PostDropDownItemType = {
    onClick: () => void,
    title: string,
    Icon?: any,
}

const PostDropDownItem: React.FC<PostDropDownItemType> = ({onClick, title, Icon}) => {
    return(
        <div
            onClick={onClick}
            className="h-12 flex items-center rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            <div className="flex w-12 h-12 items-center rounded-full bg-gray-200 dark:bg-gray-700 p-3 text-gray-500 dark:text-white">
                <Icon/>
            </div> 
            <p className="text-gray-500 dark:text-white text-lg ml-4">{title}</p>
        </div>
    )
}

export default PostDropDownItem