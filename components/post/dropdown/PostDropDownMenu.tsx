import PostDropDownItem from "./PostDropDownItem"
import { TrashIcon, ShareIcon } from "@heroicons/react/solid"
import { PostType } from "../Posts"
import pt from "../../../locales/pt"
import en from "../../../locales/en"
import { useRouter } from "next/router"

type PostDropDownMenuTypes = {
    isUserAdmin: boolean,
    post: PostType,
    onDeleteClick: () => void
}

const PostDropDownMenu: React.FC<PostDropDownMenuTypes> = ({isUserAdmin, post, onDeleteClick}) => {
    function sharePost() {
        const shareLink = `https://fega.ml/post/${post.id}`
        navigator.clipboard.writeText(shareLink)
    }

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt
    
    return(
        <div className={"relative border-t-2 border-gray-200 dark:border-gray-700 space-y-2 mr-8 w-64 p-3 rounded-b-2xl shadow-md bg-white dark:bg-gray-800 overflow-hidden"}>
            <PostDropDownItem
                onClick={sharePost}
                title={t.share}
                Icon={ShareIcon}/>
            {isUserAdmin && <PostDropDownItem
                onClick={onDeleteClick}
                title={t.delete}
                Icon={TrashIcon}/>}
        </div>
    )
}

export default PostDropDownMenu