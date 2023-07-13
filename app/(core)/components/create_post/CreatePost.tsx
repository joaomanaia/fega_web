import { auth } from "@/firebase"
import MainContainer from "@/components/m3/MainContainer"
import CreatePostButton from "./CreatePostButton"
import CreatePostInput from "./CreatePostInput"
import PostType from "@/types/PostType"
import { randomUUID } from "crypto"
import { twMerge } from "tailwind-merge"
import { revalidateTag } from "next/cache"

type CreatePostTypes = {
  className?: string
}

const CreatePost: React.FC<CreatePostTypes> = ({ className }) => {
  const isLoggedIn = auth.currentUser !== null

  const addPostToDB = async (e: FormData) => {
    "use server"

    const description = e.get("description")?.toString()

    if (!description) return

    const newPost: PostType = {
      id: randomUUID(),
      uid: auth.currentUser?.uid ?? "",
      timestamp: new Date().toString(),
      description: description,
      images: [],
    }

    await fetch("https://64ae79e1c85640541d4d24a9.mockapi.io/posts", {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-Type": "application/json",
      },
    })

    revalidateTag("posts")
  }

  /*
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
      if (lastUserPostSnap.empty) {
        createPostDB(now)
      } else if (
        now.toMillis() >
        lastUserPostSnap.docs.at(0)?.data()?.timestamp.toMillis() + 1000000
      ) {
        createPostDB(now)
      } else {
        alert(
          `Await until ${new Date(
            lastUserPostSnap.docs.at(0)?.data()?.timestamp.toMillis() + 1000000
          ).toLocaleString()} to make new post!`
        )
      }
    } else {
      router.push("/auth")
    }

    setDescription("")
  }

  async function createPostDB(now: Timestamp) {
    const postDoc = doc(collection(firestore, "publications"))
    await setDoc(postDoc, {
      id: postDoc.id,
      uid: auth.currentUser?.uid,
      timestamp: now,
      data: {
        description: description,
      },
    })
  }
  */

  return (
    <MainContainer className={twMerge("h-fit", className)}>
      <p className="text-2xl">Create post</p>

      <form action={addPostToDB}>
        <CreatePostInput />
        <CreatePostButton />
      </form>
    </MainContainer>
  )
}

export default CreatePost

/*
        <TextField
          variant="filled"
          onChange={(e) => setDescription(e.target.value)}
          ref={descriptionRef}
          value={description}
          name="description"
          type="text"
          fullWidth
          label="Description"
        />
        <Button
          variant="filled"
          fullWidth
          disabled={!description}
          sx={{ mt: 3 }}
          color="primary"
          type="submit"
        >
          Publish
        </Button>
        */
