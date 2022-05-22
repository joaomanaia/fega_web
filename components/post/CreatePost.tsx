import { auth, firestore } from "../../firebase"
import React, { MouseEvent, useState } from "react"
import { useRef } from "react"
import { collection, doc, getDocs, limitToLast, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore"
import { useRouter } from "next/router"
import en from "../../locales/en"
import pt from "../../locales/pt"
import FilledButton from "../material/button/FilledButton"
import Surface from "../material/surface/Surface"

type CreatePostTypes = {}

const CreatePost: React.FC<CreatePostTypes> = () => {

    const descriptionRef = useRef(null)

    const [description, setDescription] = useState("")

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    const isLoggedIn = auth.currentUser !== null

    async function createPost(e: MouseEvent) {
        e.preventDefault()

        if (isLoggedIn) {
            const now = Timestamp.now()

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
        } else {
            router.push("/auth")
        }

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
        <Surface 
            elevation={1}
            className="flex flex-col p-5 mt-5 rounded-2xl">
            <p className="text-lg font-bold">
                {t.create_post}
            </p>

            <form className="flex flex-col flex-1 mt-4">
                <Surface 
                    shadowDisabled
                    elevation={1}
                    className="rounded-2xl mb-4 h-12 flex-grow px-5">
                    <input 
                        onChange={(e) => setDescription(e.target.value)}
                        ref={descriptionRef}
                        value={description}
                        className="outline-none bg-transparent w-full h-full text-lg placeholder-onSurface-light dark:placeholder-onSurface-dark"
                        type="text"
                        placeholder={t.description}/>
                </Surface>

                <FilledButton
                    text={t.publish}
                    disabled={!description}
                    onClick={() => {}}/>
            </form>
        </Surface>
    )
}

export default CreatePost