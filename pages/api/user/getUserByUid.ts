import type { NextApiRequest, NextApiResponse } from 'next'
import { firestoreAdmin } from '../../../firebase-admin'

type User = {
    name: string,
    photoUrl: string,
    uid: string
}

type UserData = {
  status: number,
  user: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserData>
) {
    const uid = req.query["uid"]?.toString()

    if (uid !== null) {
        const user = await firestoreAdmin.collection("users")
        .doc(uid)
        .get()

        const userData = user.data()
    
        const userFormatted: User = {
            name: userData?.name || "Fega User",
            photoUrl: userData?.photoUrl || "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb",
            uid: userData?.uid
        }
    
        res.status(200).json({
            status: 200,
            user: JSON.stringify(userFormatted)
        })
    } else {
        res.status(200).json({
            status: 200,
            user: JSON.stringify({})
        })
    }
}
  