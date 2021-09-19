import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore"
import { useEffect, useState } from "react"
import { firestore } from "../../firebase"
import Post from "./Post"

type PostsPropsTypes = {
    posts: PostType[]
}

export type PostType = {
    id: string
    uid: string
    timestamp: string,
    data: PostDataType
}

type PostDataType = {
    description: string
    images: string[]
}

function Posts({posts}: PostsPropsTypes) {

    const [postsPaging, setPostsPaging] = useState(Array<PostType>())
    const [lastPostVisible, setLastPostVisible] = useState<any>(null)

    async function getNextPostsPaging() {
        if (!lastPostVisible) return

        const postsRef = collection(firestore, "publications")
        const postsNextQuery = query(
            postsRef, 
            orderBy("timestamp", "desc"),
            startAfter(lastPostVisible),
            limit(10)
        )

        const postsSnap = await getDocs(postsNextQuery)

        const newList = postsPaging
        postsSnap.docs.forEach(doc => {
            const dbPost = doc.data()
            const newPost: PostType = {
                id: dbPost.id,
                uid: dbPost.uid,
                timestamp: dbPost.timestamp.toDate().toLocaleString(),
                data: {
                  description: dbPost.data.description,
                  images: dbPost.data.images,
                }
              }
            newList.push(newPost)
        })
        setPostsPaging(newList)

        if(!postsSnap.empty) {
            setLastPostVisible(postsSnap.docs[postsSnap.docs.length - 1])
        }
    }

    useEffect(() => {
        //getPostsPaging()
        setPostsPaging(posts)
    }, [])
    
    return (
        <div className="flex flex-col mx-auto max-w-md md:max-w-lg lg:max-w-2xl px-4 scrollbar-hide">
            {postsPaging?.map(post => (
                <Post
                    key={post.id}
                    id={post.id}
                    uid={post.uid}
                    description={post.data.description}
                    images={post.data.images}
                    timestamp={post.timestamp}/>
            ))}

            <button 
                onClick={getNextPostsPaging}
                className="bg-white dark:bg-gray-800 mt-4 rounded-2xl p-2 hover:bg-gray-50 dark:hover:bg-gray-700
                    dark:text-white text-lg">
                Load More
            </button>
        </div>
    )
}

export default Posts

/*
return (
        <div className="h-screen mx-auto max-w-md md:max-w-lg lg:max-w-2xl px-4 scrollbar-hide">
            <InfiniteScroll
                className="scrollbar-hide"
                dataLength={postsPaging.length}
                next={getNextPostsPaging}
                hasMore={true}
                height={1000}
                loader={<p>Loading...</p>}>
                    {postsPaging?.map(post => (
                        <Post
                            key={post.id}
                            id={post.id}
                            uid={post.data().uid}
                            description={post.data().data.description}
                            images={post.data().data.images}
                            timestamp={post.data().timestamp?.toDate()}/>
                    ))}
            </InfiniteScroll>
        </div>
    )
    */