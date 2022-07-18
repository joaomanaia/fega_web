import { auth, firestore } from "../../firebase"
import React, { MouseEvent, useState } from "react"
import { useRef } from "react"
import {
  collection,
  doc,
  getDocs,
  limitToLast,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore"
import { useRouter } from "next/router"
import en from "../../locales/en"
import pt from "../../locales/pt"
import { Box, Button, Card, CardActions, CardContent, TextField, Typography, useTheme } from "@mui/material"

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

  return (
    <Card variant="elevation">
      <CardContent>
        <Typography gutterBottom variant="h5">
          {t.create_post}
        </Typography>
      </CardContent>

      <CardActions>
        <Box component="form" noValidate autoComplete="off" sx={{ width: "100%" }}>
          <TextField
            variant="filled"
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionRef}
            value={description}
            type="text"
            fullWidth
            label={t.description}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={!description}
            onClick={createPost}
            sx={{ mt: 3 }}
            color="primary"
          >
            {t.publish}
          </Button>
        </Box>
      </CardActions>
    </Card>
  )
}

export default CreatePost
