type CreateGroupPopupOptionType = {
    text: string
    onClick: () => void
}

const CreateGroupPopupOption: React.FC<CreateGroupPopupOptionType> = ({text, onClick}) => {    
    return (
        <div 
            onClick={() => onClick()}
            className="py-3 px-4 cursor-pointer rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-800 text-lg text-black dark:text-white">
            <p>{text}</p>
        </div>
    )
}

export default CreateGroupPopupOption