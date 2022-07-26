import { Typography } from "@mui/material"
import { doc, getDoc } from "firebase/firestore"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import RootLayout from "../../components/layout/root-layout"
import Post from "../../components/post/Post"
import { PostType } from "../../components/post/Posts"
import { firestore, auth } from "../../firebase"
import { firestoreAdmin } from "../../firebase-admin"

const PostPage: NextPage = ({ post }: any) => {
  const mPost = JSON.parse(post)

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

  return (
    <RootLayout>
      <Head>
        <title>{post ? mPost.data.description : "Post Not Found"}</title>
        <meta name="description" content="Fega web" />
        <link rel="icon" href="/fega_round_1.ico" />
      </Head>

      <div className="h-screen w-screen flex flex-col">
        {post ? (
          <div className="w-screen mx-auto max-w-md md:max-w-lg lg:max-w-2xl items-center justify-center">
            <Post key={mPost.id} post={mPost} userIsAdmin={userIsAdmin} onPostDeleted={() => {}} />
          </div>
        ) : (
          <Typography variant="h1">Post Not Found</Typography>
        )}
      </div>
    </RootLayout>
  )
}

export default PostPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id
  if (typeof id !== "string") {
    return {
      props: {
        post: null,
      },
    }
  }

  const post = await firestoreAdmin.collection("publications").doc(id).get()

  if (!post.exists) {
    return {
      props: {
        post: null,
      },
    }
  }

  const postFormatted: PostType = {
    id: post.id,
    uid: post.data()?.uid,
    timestamp: post.data()?.timestamp.toDate(),
    data: {
      description: post.data()?.data.description,
      images: post.data()?.data.images,
    },
  }

  return {
    props: {
      post: JSON.stringify(postFormatted),
    },
  }
}
