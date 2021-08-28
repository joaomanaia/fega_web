import type { NextApiRequest, NextApiResponse } from 'next'
import { PostType } from '../../../components/post/Posts'
import { firestoreAdmin } from '../../../firebase-admin'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
    const posts = await firestoreAdmin.collection("publications")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get()

    const postsFormatted: PostType[] = posts.docs.map((post) => ({
        id: post.id,
        uid: post.data().uid,
        timestamp: post.data().timestamp.toDate(),
        data: {
            description: post.data().data.description,
            images: post.data().data.images,
        }
    }))

    res.status(200).json(JSON.stringify(postsFormatted))
}