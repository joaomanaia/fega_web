import CreateGroupPopupOption from "./CreateGroupPopupOption"

type GroupOptionsPopupType = {
    onAddUserClick: () => void
    onDeleteUserClick: () => void
}

const GroupOptionsPopup: React.FC<GroupOptionsPopupType> = ({onAddUserClick, onDeleteUserClick}) => {    
    return (
        <div className="z-50 absolute shadow-lg p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 w-72 ml-4 mt-16">
            <CreateGroupPopupOption
                text="Add User"
                onClick={() => onAddUserClick()}/>
            <CreateGroupPopupOption
                text="Remove User"
                onClick={() => onDeleteUserClick()}/>
        </div>
    )
}

export default GroupOptionsPopup