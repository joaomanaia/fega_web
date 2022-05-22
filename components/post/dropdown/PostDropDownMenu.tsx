import PostDropDownItem from "./PostDropDownItem"
import { TrashIcon, ShareIcon } from "@heroicons/react/solid"
import { PostType } from "../Posts"
import pt from "../../../locales/pt"
import en from "../../../locales/en"
import { useRouter } from "next/router"
import Surface from "../../material/surface/Surface"

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
        <Surface 
            elevation={1}
            className={"relative border-t-2 border-primary-light/5 dark:border-primary-dark/5 space-y-2 mr-8 w-64 p-3 rounded-b-2xl shadow-md overflow-hidden"}>
            <PostDropDownItem
                onClick={sharePost}
                title={t.share}
                Icon={ShareIcon}/>
            {isUserAdmin && <PostDropDownItem
                onClick={onDeleteClick}
                title={t.delete}
                Icon={TrashIcon}/>}
        </Surface>
    )
}

export default PostDropDownMenu