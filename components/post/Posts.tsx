import { useCollectionOnce } from "react-firebase-hooks/firestore"
import { firestore } from "../../firebase"
import Post from "./Post"

function Posts() {

    const [posts, loading, error] = useCollectionOnce(
        firestore.collection("publications").orderBy("timestamp", "desc")
    )
    
    return (
        <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl px-4">
            {posts?.docs.map(post => (
                <Post
                    key={post.id}
                    id={post.id}
                    uid={post.data().uid}
                    description={post.data().data.description}
                    images={post.data().data.images}
                    timestamp={post.data().timestamp?.toDate()}/>
            ))}
        </div>
    )
}

export default Posts
