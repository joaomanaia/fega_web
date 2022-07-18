import useSWR from "swr"
import Image from "next/image"
import { DotsVerticalIcon } from "@heroicons/react/solid"
import { useState } from "react"
import PostDropDownMenu from "./dropdown/PostDropDownMenu"
import { auth, firestore } from "../../firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { PostType } from "./Posts"
import Link from "next/link"
import { fetcher } from "../../utils/data"
import { defaultImgUrl } from "../../utils/common"
import { Avatar, Card, Typography, useTheme  } from "@mui/material"


type PostParams = {
  post: PostType
  userIsAdmin: boolean
  onPostDeleted: (post: PostType) => void
}

type User = {
  name: string
  photoUrl: string
  uid: string
}

function Post({ post, userIsAdmin, onPostDeleted }: PostParams) {
  const { data } = useSWR(`/api/user/getUserByUid?uid=${post.uid}`, fetcher)

  const user: User = data !== undefined ? JSON.parse(data.user) : {}

  const [menuOpen, setMenuOpen] = useState(false)

  const { palette } = useTheme()

  async function deletePost() {
    await deleteDoc(doc(firestore, "publications", post.id))
    onPostDeleted(post)
  }

  return (
    <article
      itemScope
      itemType="https://schema.org/SocialMediaPosting"
      itemID={`https://www.fega.ml/post/${post.id}`}
      className="flex flex-col"
    >
      <meta itemProp="datePublished" content={post.timestamp} />

      <Card
        variant="elevation"
        className={`p-5 mt-5 ${menuOpen ? "rounded-t-2xl rounded-r-2xl" : "rounded-2xl"} shadow-sm`}
      >
        <div
          itemProp="author"
          itemScope
          itemType="https://schema.org/Person"
          className="flex items-center"
        >
          <meta itemProp="image" content={user?.photoUrl || defaultImgUrl} />
          <meta itemProp="url" content={`https://www.fega.ml/${user?.uid}`} />
          <meta itemProp="name" content={user?.name} />

          <Avatar
            src={user?.photoUrl}
            alt={user?.name}
            sx={{
              background: palette.secondary.main,
              color: palette.onSecondary.main,
            }}
          >
            {user?.name}
          </Avatar>

          <div className="flex-1 ml-4">
            <Link href={`/${user?.uid}`}>
              <Typography variant="subtitle1" itemProp="name" gutterBottom>
                {user.name}aaaaaa
              </Typography>
            </Link>

            <Typography variant="body2">{post.timestamp}</Typography>
          </div>

          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <DotsVerticalIcon className="m-2 dark:text-white " />
          </div>
        </div>

        <h1 itemProp="headline" className="pt-4 dark:text-white">
          {post.data.description}
        </h1>

        <div className={`flex gap-2`}>
          {post.data.images?.map((image) => (
            <div
              key={image}
              className={`relative mt-4 ${
                post.data.images.length == 1 ? "aspect-video w-full" : "aspect-square w-1/2"
              }`}
            >
              <meta itemProp="image" content={image} />
              <Image
                itemProp="image"
                src={image}
                layout="fill"
                className="rounded-2xl"
                alt="Publication Image"
              />
            </div>
          ))}
        </div>
      </Card>

      {menuOpen && (
        <PostDropDownMenu
          isUserAdmin={auth.currentUser?.uid === post.uid || userIsAdmin}
          post={post}
          onDeleteClick={deletePost}
        />
      )}
    </article>
  )
}

export default Post
