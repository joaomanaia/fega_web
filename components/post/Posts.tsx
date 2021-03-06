import { collection, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { auth, firestore } from "../../firebase"
import en from "../../locales/en"
import pt from "../../locales/pt"
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

    const [postsPaging, setPostsPaging] = useState<Array<PostType>>(posts)
    const [lastPostVisible, setLastPostVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)

    async function getLastPostSnap() {
        const nextPost = doc(
            firestore,
            "publications", 
            postsPaging[postsPaging.length - 1].id
        )
        return await getDoc(nextPost)
    }

    async function getNextPostsPaging() {
        const nextPostSnap = lastPostVisible === null ? await getLastPostSnap() : lastPostVisible

        const postsNextQuery = query(
            collection(firestore, "publications"), 
            orderBy("timestamp", "desc"),
            startAfter(nextPostSnap),
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

    function removePostFromList(removePost: PostType) {
        setPostsPaging(postsPaging.filter((post) => post != removePost))
    }

    const [userIsAdmin, setUserIsAmin] = useState(false)

    async function getAuthUserAdmin(uid: string) {
        const adminRef = doc(firestore, "admins", uid)
        const adminSnap = await getDoc(adminRef)
        setUserIsAmin(adminSnap.exists() && adminSnap.data().admin === true)
    }

    useEffect(() => {
        const uid = auth.currentUser?.uid
        if (uid !== undefined) {
            getAuthUserAdmin(uid)
        }
    }, [])

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    console.log(postsPaging)
    
    return (
        <div className="flex flex-col mx-auto max-w-md md:max-w-lg lg:max-w-2xl px-4 scrollbar-hide">
            {postsPaging?.map(post => (
                <Post
                    key={post.id}
                    post={post}
                    userIsAdmin={userIsAdmin}
                    onPostDeleted={removePostFromList}/>
            ))}

            <button 
                onClick={getNextPostsPaging}
                className="bg-white dark:bg-gray-800 mt-4 rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700
                    dark:text-white text-lg">
                {t.load_more}
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