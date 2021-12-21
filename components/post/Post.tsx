import { doc, getDoc } from "firebase/firestore"
import { firestore } from "../../firebase"
import { useState, useEffect } from 'react'
import useSWR from 'swr'

type PostParams = {
    id: string,
    uid: string,
    description: string,
    images: string[] | undefined,
    timestamp: string
}

type User = {
    name: string,
    photoUrl: string,
    uid: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function Post({uid, description, images, timestamp}: PostParams) {

    const { data } = useSWR(`/api/user/getUserByUid?uid=${uid}`, fetcher)

    const user: User = data !== undefined ? JSON.parse(data.user) : {}

    return (
        <article
            itemScope
            itemType="https://schema.org/Article"
            className="flex flex-col">

            <meta itemProp="datePublished" content={timestamp} />
            <meta itemProp="publisher" content={user?.name} />

            <div className="p-5 bg-white dark:bg-gray-800 mt-5 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                    <img
                        className="rounded-full w-10"
                        alt={user?.name}
                        src={user?.photoUrl}/>
            
                    <div>
                        <a 
                            itemProp="author"
                            href={`/${user?.uid}`}
                            className="font-medium dark:text-white">
                            {user.name}
                        </a>
                        <p 
                            itemProp="dateCreated"
                            className="text-xs text-gray-400 dark:text-white">
                            {timestamp}
                        </p>
                    </div>
                </div>

                <p 
                    itemProp="description"
                    className="pt-4 dark:text-white">
                    {description}
                </p>

                <div className={`flex gap-2`}>
                    {images?.map(image => (
                        <img
                            className={`rounded-2xl mt-4 ${images.length == 1 ? "aspect-video w-full" : "aspect-square w-1/2"}`}
                            key={image}
                            src={image} 
                            alt="Publication Image"/>
                    ))}
                </div>
            </div>
        </article>
    )
}

export default Post
