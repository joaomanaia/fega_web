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
import Surface from '../material/surface/Surface'

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

            <Surface 
                elevation={1}
                className={`p-5 mt-5 ${menuOpen ? "rounded-t-2xl rounded-r-2xl" : "rounded-2xl"} shadow-sm`}>
                <div 
                    itemProp="author"
                    itemScope 
                    itemType="https://schema.org/Person"
                    className="flex items-center space-x-4">
                    <meta itemProp="image" content={user?.photoUrl || defaultImgUrl} />
                    <meta itemProp="url" content={`https://www.fega.ml/${user?.uid}`} />
                    <meta itemProp="name" content={user?.name} />

                    <div className="relative w-10 h-10">
                        <Image
                            itemProp='image'
                            className="rounded-full"
                            layout="fill"
                            alt={user?.name}
                            src={user?.photoUrl || defaultImgUrl}/>
                    </div>
            
                    <div className="flex-1">
                        <a itemProp="name" className="font-medium text-onSurface-light dark:text-onSurface-dark">
                            <Link href={`/${user?.uid}`}>
                                <a>{user.name}</a>
                            </Link>
                        </a>
                        <p className="text-xs text-onSurface-light dark:text-onSurface-dark">
                            {post.timestamp}
                        </p>
                    </div>

                    <div
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className="rounded-full h-9 w-9 hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 text-onSurface-light dark:text-onSurface-dark">
                        <DotsVerticalIcon className="m-2 text-onSurface-light dark:text-onSurface-dark"/>
                    </div>
                </div>

                <h1 
                    itemProp="headline"
                    className="pt-4 text-onSurface-light dark:text-onSurface-dark">
                    {post.data.description}
                </h1>

                <div className={`flex gap-2`}>
                    {post.data.images?.map(image => (
                        <div 
                            key={image}
                            className={`relative mt-4 ${post.data.images.length == 1 ? "aspect-video w-full" : "aspect-square w-1/2"}`}>
                            <meta itemProp="image" content={image} />
                            <Image
                                itemProp='image'
                                src={image} 
                                layout="fill"
                                className="rounded-2xl"
                                alt="Publication Image"/>
                        </div>
                    ))}
                </div>
            </Surface>

            {menuOpen && <PostDropDownMenu
                isUserAdmin={auth.currentUser?.uid === post.uid || userIsAdmin}
                post={post}
                onDeleteClick={deletePost}/>}
        </article>
    )
}

export default Post
