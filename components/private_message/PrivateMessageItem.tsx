type PrivateMessageItemType = {
    text: string,
    byLocalUser: boolean
}

const PrivateMessageItem: React.FC<PrivateMessageItemType> = ({text, byLocalUser}) => {
    return (
        <div className={`flex w-full ${byLocalUser ? "justify-end"  : "justify-start"}`}>
            <div className={`p-3 rounded-2xl ${byLocalUser ? "bg-red-700 dark:bg-red-800" : "bg-gray-100 dark:bg-gray-700"}`}>
                <p className={`max-w-prose ${byLocalUser ? "text-white text-right" : "text-black dark:text-white text-right"}`}>
                    {text}
                </p>
            </div>
        </div>
    )
}

export default PrivateMessageItem