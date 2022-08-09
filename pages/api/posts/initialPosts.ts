import type { NextApiRequest, NextApiResponse } from "next"
import { PostType } from "../../../components/post/Posts"
import { firestoreAdmin } from "../../../firebase-admin"

export interface InitialPostsData {
  posts: string
}

const testPosts: PostType[] = [
  {
    id: "a",
    uid: "b",
    timestamp: "21:32",
    data: {
      description: "Era uma vez um post",
      images: ["https://www.notebookcheck.info/fileadmin/Notebooks/News/_nc3/unnamed85.png"],
    },
  },
  {
    id: "b",
    uid: "b",
    timestamp: "21:32",
    data: {
      description: "Era uma vez um post",
      images: [
        "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/news%2Fhappy-new-year-2022-banner-template-vector.webp?alt=media&token=ccaa2187-7fe6-44cc-9ebd-8626871325e6",
        "https://www.notebookcheck.info/fileadmin/Notebooks/News/_nc3/unnamed85.png",
      ],
    },
  },
  {
    id: "c",
    uid: "b",
    timestamp: "21:32",
    data: {
      description: "Era uma vez um post",
      images: [],
    },
  },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse<InitialPostsData>) {
  const dev = process.env.NODE_ENV !== "production"

  if (dev) {
    return res.status(200).json({ posts: JSON.stringify(testPosts) })
  }

  const posts = await firestoreAdmin
    .collection("publications")
    .orderBy("timestamp", "desc")
    .limit(10)
    .get()

  const postsFormatted = posts.docs.map((post) => ({
    id: post.id,
    uid: post.data().uid,
    timestamp: post.data().timestamp.toDate().toLocaleString(),
    data: {
      description: post.data().data.description,
      images: post.data().data.images,
    },
  }))

  res.status(200).json({
    posts: JSON.stringify(postsFormatted),
  })
}
