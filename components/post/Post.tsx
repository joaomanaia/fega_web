import useSWR from 'swr'
import Image from "next/image"
import { DotsVerticalIcon } from "@heroicons/react/solid"
import { useState } from 'react'
import PostDropDownMenu from './dropdown/PostDropDownMenu'
import { auth, firestore } from '../../firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { PostType } from './Posts'
import Link from 'next/link'
import { fetcher } from '../../utils/data'
import { defaultImgUrl } from '../../utils/common'

type PostParams = {
    post: PostType,
    userIsAdmin: boolean,
    onPostDeleted: (post: PostType) => void
}

type User = {
    name: string,
    photoUrl: string,
    uid: string
}

function Post({post, userIsAdmin, onPostDeleted}: PostParams) {

    const { data } = useSWR(`/api/user/getUserByUid?uid=${post.uid}`, fetcher)

    const user: User = data !== undefined ? JSON.parse(data.user) : {}

    const [menuOpen, setMenuOpen] = useState(false)

    async function deletePost() {
        await deleteDoc(doc(firestore, "publications", post.id))
        onPostDeleted(post)
    }

    return (
        <article
            itemScope
            itemType="https://schema.org/SocialMediaPosting"
            itemID={`https://www.fega.ml/post/${post.id}`}
            className="flex flex-col">

            <meta itemProp="datePublished" content={post.timestamp} />
            <meta itemProp="author" content={user?.name} />

            <div className={`p-5 bg-white dark:bg-gray-800 mt-5 ${menuOpen ? "rounded-t-2xl rounded-r-2xl" : "rounded-2xl"} shadow-sm`}>
                <div 
                    itemProp="author"
                    itemScope 
                    itemType="https://schema.org/Person"
                    className="flex items-center space-x-4">
                    <div className="relative w-10 h-10">
                        <Image
                            itemProp='image'
                            className="rounded-full"
                            layout="fill"
                            alt={user?.name}
                            src={user?.photoUrl || defaultImgUrl}/>
                    </div>
            
                    <div className="flex-1">
                        <a 
                            itemProp="name"
                            className="font-medium dark:text-white">
                            <Link href={`/${user?.uid}`}>
                                <a itemProp="url">{user.name}</a>
                            </Link>
                        </a>
                        <p 
                            itemProp="datePublished"
                            className="text-xs text-gray-400 dark:text-white">
                            {post.timestamp}
                        </p>
                    </div>

                    <div
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className="rounded-full h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <DotsVerticalIcon className="m-2 dark:text-white "/>
                    </div>
                </div>

                <p 
                    itemProp="headline"
                    className="pt-4 dark:text-white">
                    {post.data.description}
                </p>

                <div className={`flex gap-2`}>
                    {post.data.images?.map(image => (
                        <div 
                            key={image}
                            className={`relative mt-4 ${post.data.images.length == 1 ? "aspect-video w-full" : "aspect-square w-1/2"}`}>
                            <Image
                                src={image} 
                                layout="fill"
                                className="rounded-2xl"
                                itemProp='image'
                                alt="Publication Image"/>
                        </div>
                    ))}
                </div>
            </div>

            {menuOpen && <PostDropDownMenu
                isUserAdmin={auth.currentUser?.uid === post.uid || userIsAdmin}
                post={post}
                onDeleteClick={deletePost}/>}
        </article>
    )
}

export default Post
