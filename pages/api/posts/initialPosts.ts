import type { NextApiRequest, NextApiResponse } from 'next'
import { firestoreAdmin } from '../../../firebase-admin'

type InitialPostsData = {
  status: number,
  posts: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InitialPostsData>
) {
    const posts = await firestoreAdmin.collection("publications")
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
        }
    }))

    res.status(200).json({
        status: 200,
        posts: JSON.stringify(postsFormatted)
    })
}
