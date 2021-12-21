import { auth, firestore } from "../../firebase"
import React, { MouseEvent, useState } from "react"
import { useRef } from "react"
import { collection, doc, getDocs, limitToLast, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore"

function CreatePost() {

    const descriptionRef = useRef(null)

    const [description, setDescription] = useState("")

    async function createPost(e: MouseEvent) {
        e.preventDefault()

        const now = Timestamp.now()

        createPostDB(now)

        /*
        const postsRef = collection(firestore, "publications")
        const lastUserPostQuery = query(
            postsRef,
            where("uid", "==", auth.currentUser?.uid),
            orderBy("timestamp", "asc"),
            limitToLast(1)
        )

        const lastUserPostSnap = await getDocs(lastUserPostQuery)
        if(lastUserPostSnap.empty) {
            createPostDB(now)
        } else if(now.toMillis() > lastUserPostSnap.docs.at(0)?.data()?.timestamp.toMillis() + 1000000) {
            createPostDB(now)
        } else {
            alert(`Await until ${new Date(lastUserPostSnap.docs.at(0)?.data()?.timestamp.toMillis() + 1000000).toLocaleString()} to make new post!`)
        }
        */

        setDescription("")
    }

    async function createPostDB(now: Timestamp) {
        const postDoc = doc(collection(firestore, 'publications'))
        await setDoc(postDoc, {
            id: postDoc.id,
            uid: auth.currentUser?.uid,
            timestamp: now,
            data: {
                description: description
            }
        })
    }
    
    return (
        <div className="flex flex-col p-5 bg-white dark:bg-gray-800 mt-5 rounded-2xl shadow-sm">
            <p className="text-lg font-bold text-gray-500 dark:text-gray-200">
                Create Post
            </p>

            <form className="flex flex-col flex-1 mt-4">
                <input 
                    onChange={(e) => setDescription(e.target.value)}
                    ref={descriptionRef}
                    value={description}
                    className="rounded-2xl h-12 bg-gray-100 dark:bg-gray-700 dark:text-white flex-grow px-5 outline-none"
                    type="text"
                    placeholder="Description"/>

            <button
                disabled={!description}
                onClick={createPost}
                className="mt-4 rounded-2xl bg-red-700 hover:bg-red-600 disabled:bg-gray-100 dark:disabled:bg-gray-700 
                    text-white disabled:text-gray-400 text-lg p-1 disabled:cursor-not-allowed">
                    Post
            </button>
            </form>
        </div>
    )
}

export default CreatePost