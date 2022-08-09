import { NextApiRequest, NextApiResponse } from "next"
import { firestoreAdmin } from "../../../firebase-admin"

export interface VerifyUserDBResponse {
  userCreated?: Boolean
  errorMessage?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyUserDBResponse>
) {
  const uid = req.query.uid?.toString()
  const displayName = req.query.displayName?.toString()
  const photoURL = req.query.photoURL?.toString()

  if (uid === undefined) {
    return res.status(404).json({ errorMessage: "User identification is not found"})
  }
  
  const user = await fetch(`/api/user/getUserByUid?uid=${uid}`)

  if (user.status == 404) {
    const userDoc = firestoreAdmin.collection("users").doc(uid)

    await userDoc.set({
      banned: false,
      name: displayName || "Fega User",
      photoUrl: photoURL,
      uid: uid,
    })

    return res.status(200).json({
      userCreated: true,
    })
  }

  return res.status(200).json({
    userCreated: false,
  })
}
