import type { NextApiRequest, NextApiResponse } from "next"
import { firestoreAdmin } from "../../../firebase-admin"
import UserType from "../../../types/UserType"

type UserData = {
  user: string
  errorMessage?: string
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<UserData>
) {
  const uid = req.query["uid"]?.toString()

  if (!uid) {
    return res.status(404).json({
      user: JSON.stringify({}),
      errorMessage: "User id not found"
    })
  }

  const user = await firestoreAdmin.collection("users").doc(uid).get()

  if (!user.exists) {
    return res.status(404).json({
      user: JSON.stringify({}),
      errorMessage: "User does not exist"
    })
  }

  const userData = user.data()

  const userFormatted: UserType = {
    name: userData?.name || "Fega User",
    photoUrl:
      userData?.photoUrl ||
      "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb",
    uid: userData?.uid,
    banned: userData?.banned
  }

  res.status(200).json({
    user: JSON.stringify(userFormatted),
  })
}
