import PostDropDownItem from "./PostDropDownItem"
import { TrashIcon, ShareIcon } from "@heroicons/react/solid"
import { PostType } from "../Posts"

type PostDropDownMenuTypes = {
    isUserAdmin: boolean,
    post: PostType,
    onDeleteClick: () => void
}

const PostDropDownMenu: React.FC<PostDropDownMenuTypes> = ({isUserAdmin, post, onDeleteClick}) => {
    function sharePost() {
        const shareLink = `http://localhost:3000/post/${post.id}`
        navigator.clipboard.writeText(shareLink)
    }
    
    return(
        <div className={"relative border-t-2 border-gray-200 dark:border-gray-700 space-y-2 mr-8 w-64 p-3 rounded-b-2xl shadow-md bg-white dark:bg-gray-800 overflow-hidden"}>
            <PostDropDownItem
                onClick={sharePost}
                title="Share Post"
                Icon={ShareIcon}/>
            {isUserAdmin && <PostDropDownItem
                onClick={onDeleteClick}
                title="Delete Post"
                Icon={TrashIcon}/>}
        </div>
    )
}

export default PostDropDownMenu